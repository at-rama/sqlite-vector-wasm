import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { httpReader } from '../release/state.mjs';
import { invocation, runWatch, diagnostic } from './run.mjs';
import { renderFailure } from './plan.mjs';

const directory='.work/watch';
const token=process.env.GH_TOKEN || '';
const secrets=[token];
const writeSummary=async text=>{
  if(!process.env.GITHUB_STEP_SUMMARY)throw Error('Missing GitHub execution summary destination');
  await writeFile(process.env.GITHUB_STEP_SUMMARY,text);
};
const writeEvidence=async evidence=>{
  await mkdir(directory,{recursive:true});
  await writeFile(`${directory}/result.json`,JSON.stringify(evidence,null,2)+'\n');
};
try {
  if(process.argv.length!==2)throw Error('Watch accepts no selection or override arguments');
  const event=JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH,'utf8'));
  const context=invocation(event,process.env);
  const result=await runWatch({context,get:httpReader(token),writeSummary,writeEvidence,secrets});
  console.log(`Watch result: ${result.outcome}`);
  if(result.outcome==='failed')process.exitCode=1;
} catch(error) {
  const message=diagnostic(error,secrets);
  try{await writeSummary(renderFailure('invocation',message));}catch{}
  try{await writeEvidence({schemaVersion:1,outcome:'failed',stage:'invocation',diagnostic:message});}catch{}
  console.error(`Watch invocation failed: ${message}`);process.exitCode=1;
}
