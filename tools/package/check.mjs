import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, copyFile, cp, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { engineIdentity, root, hash, regularBytes, fileInventory, inspectArchive, execute } from './package.mjs';
import { nativeProbeSql } from '../build/browser-probe.mjs';
import { runtimeNames } from '../build/config.mjs';
import { serveAssets } from '../harness/server.mjs';
import { launchBrowser } from '../harness/browser.mjs';

async function fixture(directory) {
  await writeFile(join(directory,'index.html'),'<!doctype html><meta charset="utf-8"><title>A-package resolution fixture</title>');
  await copyFile(join(root,'tools/build/browser-probe.mjs'),join(directory,'probe.mjs'));
  for(const [mode,loader] of [['vanilla','sqlite3.js'],['esm','sqlite3.mjs'],['bundler','sqlite3-bundler-friendly.mjs']]) {
    const init=mode==='vanilla' ? `importScripts('./runtime/${loader}'); const initialize=globalThis.sqlite3InitModule;` : `import initialize from './runtime/${loader}';`;
    await writeFile(join(directory,`probe-${mode}.${mode==='vanilla'?'js':'mjs'}`),
      `${mode==='vanilla'?'':"import {probe} from './probe.mjs';"}${init}\nonmessage=async ev=>{try{${mode==='vanilla'?"const {probe}=await import('./probe.mjs');":''} const s=await initialize(); postMessage({result:await probe(s,ev.data.vector,true)});}catch(e){postMessage({error:e.stack});}};`);
  }
}

export function assertNativeResult(result,version,vector,sqlDefinition=nativeProbeSql(vector)) {
  assert.equal(result.versions[0][0],version);
  if(vector) {
    assert.equal(result.versions[0][1],sqlDefinition.expectedVersion);
    assert.equal(result.versions[0][2],0,'Other engine must be absent');
    assert.equal(result.neighbors.length,2);
    assert.deepEqual(result.neighbors[0],[1,0]);
    assert.equal(result.neighbors[1][0],2);
    assert.ok(Math.abs(result.neighbors[1][1]-Math.SQRT2)<0.00001);
  }
}

export async function inspect(browser,directory,vector,version) {
  const sqlDefinition=nativeProbeSql(vector);
  const server=await serveAssets(directory);
  const context=await browser.newContext();
  const results={}; const requests=[];
  context.on('response', response=>{const url=new URL(response.url()); if(runtimeNames.includes(url.pathname.split('/').pop())) requests.push({origin:url.origin,path:url.pathname,status:response.status()});});
  try {
    for(const mode of ['vanilla','esm','bundler']) {
      console.error(`Packaged browser: ${mode} main/Worker/Worker1/promiser`);
      const page=await context.newPage(); await page.goto(server.origin);
      if(mode==='vanilla') await page.addScriptTag({url:`${server.origin}/runtime/sqlite3.js`});
      results[`${mode}-main`]=await page.evaluate(async ({mode,vector})=>{
        const init=mode==='vanilla'?globalThis.sqlite3InitModule:(await import(mode==='esm'?'./runtime/sqlite3.mjs':'./runtime/sqlite3-bundler-friendly.mjs')).default;
        const s=await init(); return (await import('./probe.mjs')).probe(s,vector,false);
      },{mode,vector});
      console.error(`  ${mode}: main passed`);
      results[`${mode}-worker`]=await page.evaluate(({mode,vector})=>new Promise((accept,reject)=>{
        const worker=new Worker(`./probe-${mode}.${mode==='vanilla'?'js':'mjs'}?sqlite3.dir=/runtime`,{type:mode==='vanilla'?'classic':'module'});
        const timer=setTimeout(()=>{worker.terminate();reject(Error('Worker probe timeout'));},30000);
        worker.onerror=ev=>{clearTimeout(timer);worker.terminate();reject(Error(ev.message));};
        worker.onmessage=ev=>{clearTimeout(timer);worker.terminate();ev.data.error?reject(Error(ev.data.error)):accept(ev.data.result);};
        worker.postMessage({vector});
      }),{mode,vector});
      console.error(`  ${mode}: Worker passed`);
      if(mode==='vanilla') await page.addScriptTag({url:`${server.origin}/runtime/sqlite3-worker1-promiser.js`});
      const workerResult=await page.evaluate(async ({mode,vector,sqlDefinition})=>{
        const file=mode==='vanilla'?'sqlite3-worker1.js':mode==='esm'?'sqlite3-worker1.mjs':'sqlite3-worker1-bundler-friendly.mjs';
        const worker=new Worker(`./runtime/${file}`,{type:mode==='vanilla'?'classic':'module'});
        const ready=new Promise((accept,reject)=>{
          const timer=setTimeout(()=>reject(Error('Worker1 ready timeout')),30000);
          worker.onerror=ev=>{clearTimeout(timer);reject(Error(ev.message));};
          worker.onmessage=ev=>{if(ev.data.result==='worker1-ready'){clearTimeout(timer);accept();}};
        });
        let serial=0;
        const request=(type,args,dbId)=>new Promise((accept,reject)=>{
          const messageId=`package-${++serial}`;
          const timer=setTimeout(()=>reject(Error(`Worker1 ${type} timeout`)),30000);
          worker.onmessage=ev=>{if(ev.data.messageId===messageId){clearTimeout(timer);ev.data.type==='error'?reject(Error(JSON.stringify(ev.data))):accept(ev.data);}};
          worker.postMessage({type,args,dbId,messageId});
        });
        try {
          await ready;
          const opened=await request('open',{filename:':memory:'});
          const sql=sqlDefinition.versionSql;
          const result=await request('exec',{sql,resultRows:[],rowMode:'array'},opened.dbId);
          let neighbors=[];
          if(vector) { await request('exec',{sql:sqlDefinition.setup},opened.dbId); neighbors=(await request('exec',{sql:sqlDefinition.query,resultRows:[],rowMode:'array'},opened.dbId)).result.resultRows; }
          await request('close',{},opened.dbId);
          return {versions:result.result.resultRows,neighbors};
        } finally {worker.terminate();}
      },{mode,vector,sqlDefinition});
      assertNativeResult(workerResult,version,vector,sqlDefinition);
      results[`${mode}-worker1`]={version:workerResult.versions[0][0],vecVersion:workerResult.versions[0][1],sqlRows:workerResult.versions,neighbors:workerResult.neighbors};
      console.error(`  ${mode}: Worker1 passed`);
      const promiseResult=await page.evaluate(async ({mode,vector,sqlDefinition})=>{
        const factory=mode==='vanilla'?globalThis.sqlite3Worker1Promiser.v2:(await import(mode==='esm'?'./runtime/sqlite3-worker1-promiser.mjs':'./runtime/sqlite3-worker1-promiser-bundler-friendly.mjs')).default;
        const Original=globalThis.Worker, workers=[];
        globalThis.Worker=class extends Original {constructor(...args){super(...args);workers.push(this);}};
        try {
          const p=await Promise.race([factory(),new Promise((_,reject)=>setTimeout(()=>reject(Error('Promiser init timeout')),30000))]);
          const opened=await p('open',{filename:':memory:'});
          const sql=sqlDefinition.versionSql;
          const result=await p({type:'exec',dbId:opened.dbId,args:{sql,resultRows:[],rowMode:'array'}});
          let neighbors=[];
          if(vector) { await p({type:'exec',dbId:opened.dbId,args:{sql:sqlDefinition.setup}}); neighbors=(await p({type:'exec',dbId:opened.dbId,args:{sql:sqlDefinition.query,resultRows:[],rowMode:'array'}})).result.resultRows; }
          await p({type:'close',dbId:opened.dbId});
          return {versions:result.result.resultRows,neighbors};
        } finally {globalThis.Worker=Original;for(const worker of workers)worker.terminate();}
      },{mode,vector,sqlDefinition});
      assertNativeResult(promiseResult,version,vector,sqlDefinition);
      results[`${mode}-promiser`]={version:promiseResult.versions[0][0],vecVersion:promiseResult.versions[0][1],sqlRows:promiseResult.versions,neighbors:promiseResult.neighbors};
      console.error(`  ${mode}: promiser passed`);
      await page.close();
    }
    for(const result of Object.values(results)) assert.equal(result.version,version);
    assert.ok(requests.some(r=>r.path==='/runtime/sqlite3-opfs-async-proxy.js' && r.status===200),'OPFS proxy was loaded');
    assert.ok(requests.every(r=>r.origin===server.origin && r.path.startsWith('/runtime/') && r.status===200),'Runtime requests must resolve packaged companions');
    return {results,requests};
  } finally { await context.close(); await server.close(); }
}

async function brokenCompanions(browser,canonical,workspace) {
  const results=[];
  for(const asset of ['sqlite3.wasm','sqlite3-worker1.mjs','sqlite3-opfs-async-proxy.js','corrupt-wasm']) {
    console.error(`Packaged negative: ${asset}`);
    const directory=join(workspace,asset); await cp(canonical,directory,{recursive:true});
    const name=asset==='corrupt-wasm'?'sqlite3.wasm':asset;
    await rm(join(directory,'runtime',name));
    if(asset==='corrupt-wasm') await writeFile(join(directory,'runtime',name),'invalid WASM bytes');
    if(asset==='sqlite3-opfs-async-proxy.js') await writeFile(join(directory,'unavailable.mjs'),`
      import init from './runtime/sqlite3.mjs';
      onmessage=async()=>{try{const s=await init();
        if(s.capi.sqlite3_vfs_find('opfs'))throw Error('Unexpected OPFS availability');
        try{const db=new s.oo1.DB('/requested.db','c','opfs');db.close();postMessage({failed:false});}
        catch(e){postMessage({failed:true,reason:e.message});}
      }catch(e){postMessage({setupError:e.message});}};
    `);
    const server=await serveAssets(directory),context=await browser.newContext();
    const responses=[];
    context.on('response',r=>{if(new URL(r.url()).pathname===`/runtime/${name}`)responses.push(r.status());});
    try {
      const page=await context.newPage();await page.goto(server.origin);
      const failure=await page.evaluate(async asset=>{
        if(asset==='sqlite3.wasm'||asset==='corrupt-wasm') {
          try{const init=(await import('./runtime/sqlite3.mjs')).default;
            return await Promise.race([init().then(()=>({failed:false}),e=>({failed:true,reason:e.message})),
              new Promise(accept=>setTimeout(()=>accept({failed:true,reason:'Initialization remained unavailable after 5 seconds'}),5000))]);
          }catch(e){return {failed:true,reason:e.message};}
        }
        return new Promise((accept,reject)=>{
          const worker=new Worker(asset==='sqlite3-worker1.mjs'?'./runtime/sqlite3-worker1.mjs':'./unavailable.mjs?sqlite3.dir=/runtime',{type:'module'});
          const timer=setTimeout(()=>{worker.terminate();reject(Error('Negative Worker timeout'));},30000);
          const finish=value=>{clearTimeout(timer);worker.terminate();accept(value);};
          worker.onerror=event=>asset==='sqlite3-worker1.mjs'?finish({failed:true,reason:event.message}):finish({failed:false,setupError:event.message});
          worker.onmessage=event=>finish(event.data);
          if(asset!=='sqlite3-worker1.mjs')worker.postMessage({});
        });
      },asset);
      assert.equal(failure.failed,true,`${asset}: required capability must fail explicitly: ${JSON.stringify(failure)}`);
      assert.ok(responses.includes(asset==='corrupt-wasm'?200:404),`${asset}: targeted companion must actually be requested`);
      results.push({asset,...failure,responses});
    } finally {await context.close();await server.close();}
  }
  return results;
}

async function localInstall(handoff,workspace) {
  const directory=join(workspace,'consumer');await mkdir(directory);
  await writeFile(join(directory,'package.json'),JSON.stringify({private:true}));
  await execute('npm',['install','--offline','--ignore-scripts','--no-audit','--no-fund','--package-lock=false',handoff.archive.path],{cwd:directory,logPath:join(workspace,'install.log')});
  const require=createRequire(join(directory,'package.json'));
  const resolved=[];
  for(const record of handoff.runtimeFiles) {
    const path=require.resolve(`${handoff.package.name}/${record.name}`);
    const bytes=await regularBytes(path);assert.equal(bytes.length,record.size);assert.equal(hash(bytes),record.sha256);
    resolved.push(record.name);
  }
  return {offline:true,ignoreScripts:true,resolved};
}

export async function checkPackage(handoff) {
  assert.equal(handoff.schemaVersion,1);assert.equal(handoff.runtimeFiles.length,runtimeNames.length);
  assert.deepEqual(handoff.runtimeFiles.map(r=>r.name).sort(),[...runtimeNames].sort());
  const bytes=await regularBytes(handoff.archive.path);assert.equal(bytes.length,handoff.archive.size);assert.equal(hash(bytes),handoff.archive.sha256);
  await mkdir(join(root,'.work/package-check'),{recursive:true});
  const workspace=await mkdtemp(join(root,'.work/package-check/run-'));
  const directory=join(workspace,'canonical');
  await inspectArchive(handoff.archive.path,handoff.files,join(directory,'runtime'));
  assert.deepEqual(await fileInventory(join(directory,'runtime'),handoff.runtimeFiles.map(r=>r.name)),handoff.runtimeFiles);
  await fixture(directory);
  const installed=await localInstall(handoff,workspace);
  const browser=await launchBrowser();
  try {
    const positive=await inspect(browser,directory,engineIdentity(handoff),handoff.inputs.sqlite.version);
    for(const name of runtimeNames)assert.ok(positive.requests.some(r=>r.path===`/runtime/${name}`),`No packaged request for ${name}`);
    const negative=await brokenCompanions(browser,directory,workspace);
    assert.deepEqual(await fileInventory(join(directory,'runtime'),handoff.files.map(r=>r.name)),handoff.files);
    assert.equal(hash(await regularBytes(handoff.archive.path)),handoff.archive.sha256);
    const report={schemaVersion:1,archive:handoff.archive,runtimeFiles:handoff.runtimeFiles,files:handoff.files,
      inputs:handoff.inputs,browser:await browser.version(),
      hosting:{scheme:'HTTP loopback',secureContext:true,coop:'same-origin',coep:'require-corp',runtimeMount:'/runtime/',probesOutsideRuntime:true},
      installed,positive,negative,postCheckHashesUnchanged:true,
      scope:'Packaging resolution and SQL/storage usability; no Hamming/restart-persistence/complete CI acceptance verdict'};
    const path=join(workspace,'checks.json');await writeFile(path,JSON.stringify(report,null,2)+'\n');
    return {checks:path,archive:handoff.archive,contexts:Object.keys(positive.results),negative:negative.map(r=>r.asset)};
  } finally {await browser.close();}
}

if(process.argv[1] && resolve(process.argv[1])===resolve(join(root,'tools/package/check.mjs')))try {
  assert.equal(process.argv.length,3,'Usage: harness exec node tools/package/check.mjs PACKAGE_HANDOFF_JSON');
  console.log(JSON.stringify(await checkPackage(JSON.parse(await readFile(process.argv[2],'utf8')))));
}catch(error){console.error(error);process.exitCode=1;}
