import { mkdtemp, mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { root, hash, assemble } from '../../package/package.mjs';
import { runtimeNames } from '../../build/config.mjs';
import { productionStages, browserCases } from '../../acceptance/contracts.mjs';

// Synthetic runtime/acceptance records exercise controls, never qualify a product.
export async function releaseFixture(t, { version = '0.1.0' } = {}) {
  const repository = await mkdtemp(join(tmpdir(),'release-test-'));
  t.after(()=>rm(repository,{recursive:true,force:true}));
  for (const file of ['inputs/sources.lock.json','tools/harness.sh','tools/build/config.mjs','tools/build/extra-init.c.in','tools/harness/package-lock.json','LICENSE','tools/package']) {
    await mkdir(join(repository,file,'..'),{recursive:true}); await cp(join(root,file),join(repository,file),{recursive:true});
  }
  const runtimeDirectory = join(repository,'runtime'); await mkdir(runtimeDirectory);
  const runtimeFiles = [];
  for (const name of runtimeNames) { const bytes = Buffer.from(`fixture ${name}`); await writeFile(join(runtimeDirectory,name),bytes); runtimeFiles.push({name,size:bytes.length,sha256:hash(bytes)}); }
  const lockBytes = await readFile(join(repository,'inputs/sources.lock.json')); const lock = JSON.parse(lockBytes);
  const inputs = {lockDigest:{algorithm:'sha256',value:hash(lockBytes)}};
  for (const key of ['sqlite','sqliteVec']) inputs[key]={version:lock[key].version,digest:lock[key].digest};
  const build = {tools:Object.fromEntries(['cc','make','emcc','wasm-strip','wasm-opt','node','npm'].map(key=>[key,`${key} fixture 4.0.23`])),platform:'fixture Linux x86_64',amalgamation:['make'],configure:['configure'],wasm:['make']};
  for (const [field,path] of [['harnessSha256','tools/harness.sh'],['configSha256','tools/build/config.mjs'],['templateSha256','tools/build/extra-init.c.in'],['dependencyLockSha256','tools/harness/package-lock.json']]) build[field]=hash(await readFile(join(repository,path)));
  const constructed = {schemaVersion:1,inputs,build,runtimeDirectory,runtimeFiles};
  const packaged = await assemble({handoff:constructed,repository,name:'sqlite-vector-wasm',version});
  const bundle = join(repository,'bundle'); await mkdir(bundle); await cp(packaged.archive.path,join(bundle,'payload.tgz'));
  const commit = 'a'.repeat(40);
  const report = {schemaVersion:1,verdict:'passed',package:packaged.package,source:{commit,dirty:false},archive:packaged.archive,
    sourceLock:lock,sourceLockSha256:hash(lockBytes),runtimeFiles,build,
    stages:Object.fromEntries(productionStages.map(name=>[name,{status:'passed'}])),
    browserResults:{schemaVersion:1,browser:'synthetic browser record',hosting:{secureContext:true,crossOriginIsolated:true},runtimeFiles,cases:Object.fromEntries(browserCases.map(name=>[name,{status:'passed'}]))}};
  for (const [name,value] of [['acceptance',report],['package',packaged],['build',constructed]]) await writeFile(join(bundle,`${name}.json`),JSON.stringify(value,null,2)+'\n');
  return {repository,bundle,report,packaged,constructed,context:{commit,repository:'a/b',selection:{sqlite:lock.sqlite.version,sqliteVec:lock.sqliteVec.version},comment:'reviewed rollback explanation'}};
}

export function syntheticAttestation(evidence) {
  return {verificationMaterial:{synthetic:true},dsseEnvelope:{signatures:[{sig:'synthetic'}],payload:Buffer.from(JSON.stringify({predicateType:'https://slsa.dev/provenance/v1',subject:[{name:'payload.tgz',digest:{sha256:evidence.archive.sha256}}],predicate:{buildDefinition:{resolvedDependencies:[{digest:{gitCommit:evidence.commit}}]}}})).toString('base64')}};
}
