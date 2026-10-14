import { readFile } from 'node:fs/promises';
import { notifyPlan, NotificationError } from './notify.mjs';

try {
  if(process.argv.length!==2)throw new NotificationError('Notification accepts no arguments');
  let record;
  try {record=JSON.parse(await readFile('.work/watch/result.json','utf8'));}
  catch {throw new NotificationError('Watch result is unavailable or unreadable');}
  const result=await notifyPlan(record,process.env);
  console.log(result==='sent' ? 'Watch plan email accepted by Resend; receipt is not confirmed.' : 'Watch notification skipped.');
} catch(error) {
  // Do not echo input, assertion values, provider bodies or transport errors.
  const detail=error instanceof NotificationError ? error.message : 'Invalid Watch handoff or Actions invocation';
  console.error(`Watch notification failed: ${detail}`);
  process.exitCode=1;
}
