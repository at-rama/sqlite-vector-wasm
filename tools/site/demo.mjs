import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { prepareDemo, selectStable } from './demo-runtime.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const [command, ...args] = process.argv.slice(2);
if (command === 'refresh' && !args.length) {
  const selection = await selectStable();
  await writeFile(join(root, 'tools/site/demo-runtime.json'), JSON.stringify(selection, null, 2) + '\n');
  console.log(selection);
} else if (command === 'prepare' && args.length <= 1) {
  console.log(await prepareDemo(root, args[0] ?? join(root, '.work/demo-prepared')));
} else throw Error('Usage: node tools/site/demo.mjs refresh | prepare [WORK_DIRECTORY]');
