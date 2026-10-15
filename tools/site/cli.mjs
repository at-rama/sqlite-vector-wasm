import { build, install } from './build.mjs';
import { join } from 'node:path';
import { repository } from './build.mjs';
import { previewIdentity, previewBase } from './options.mjs';

try {
  const [command, ...args] = process.argv.slice(2);
  const options = {};
  if (command === 'build' || command === 'check') {
    while (args.length) {
      const flag = args.shift();
      if (flag === '--preview' && !options.preview) options.preview = previewIdentity(args.shift(), args.shift());
      else if (flag === '--prepared' && command === 'build' && !options.prepared) options.prepared = args.shift();
      else if (flag === '--url' && command === 'check' && !options.url) options.url = args.shift();
      else throw Error(`Invalid site option: ${flag}`);
      if ((flag === '--prepared' && !options.prepared) || (flag === '--url' && !options.url)) throw Error(`Missing value: ${flag}`);
    }
  }
  if (command === 'install' && args.length === 0) await install();
  else if (command === 'build') {
    const result = await build(options);
    console.log(`Site built: ${result.output}`);
  } else if (command === 'check') {
    const { checkBrowser } = await import('./browser.mjs');
    const { serveSite } = await import('./server.mjs');
    const server = options.url ? null : await serveSite(join(repository, '.work/site/dist'), options.preview ? previewBase : undefined);
    try { console.log(JSON.stringify(await checkBrowser(options.url ?? server.url, { ...options, requireDocs: true }))); }
    finally { await server?.close(); }
  } else if (command === 'example' && args.length === 0) {
    await (await import('./example.mjs')).example();
  } else if (command === 'exercise' && args.length === 0) {
    await (await import('./exercise.mjs')).exercise();
  } else throw Error('Usage: sh tools/site.sh install | build [--prepared DIRECTORY] [--preview BRANCH SHA] | check [--url URL/] [--preview BRANCH SHA] | exercise | example');
} catch (error) {
  console.error(`Site: ${error.message}`);
  process.exitCode = 1;
}
