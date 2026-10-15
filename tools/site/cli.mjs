import { build, install } from './build.mjs';
import { join } from 'node:path';
import { repository } from './build.mjs';

try {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'install' && args.length === 0) await install();
  else if (command === 'build' && (args.length === 0 || (args.length === 2 && args[0] === '--prepared'))) {
    const result = await build({ prepared: args[1] });
    console.log(`Site built: ${result.output}`);
  } else if (command === 'check' && (args.length === 0 || (args.length === 2 && args[0] === '--url'))) {
    const { checkBrowser } = await import('./browser.mjs');
    const { serveSite } = await import('./server.mjs');
    const server = args.length ? null : await serveSite(join(repository, '.work/site/dist'));
    try { console.log(JSON.stringify(await checkBrowser(args[1] ?? server.url))); }
    finally { await server?.close(); }
  } else if (command === 'exercise' && args.length === 0) {
    await (await import('./exercise.mjs')).exercise();
  } else throw Error('Usage: sh tools/site.sh install | build [--prepared DIRECTORY] | check [--url URL/] | exercise');
} catch (error) {
  console.error(`Site: ${error.message}`);
  process.exitCode = 1;
}
