import { build, install } from './build.mjs';
import { readFile, writeFile } from 'node:fs/promises';
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
    try {
      const url = options.url ?? server.url;
      const built = JSON.parse(await readFile(join(repository, '.work/site/build.json'), 'utf8'));
      const runningDemo = Boolean(built.runtime);
      console.log(JSON.stringify(await checkBrowser(url, { ...options, requireDocs: true, requirePlaceholder: !runningDemo, runningDemo })));
      if (runningDemo) {
        const result = await (await import('./demo-check.mjs')).checkDemo(url, {root:repository, expectedPreview:options.preview, runtimeInventory:built.runtime, screenshot:join(repository,'.work/site/demo-check-mobile.png')});
        await writeFile(join(repository,'.work/site/demo-check.json'),JSON.stringify(result,null,2)+'\n');
        console.log(JSON.stringify(result));
      }
    }
    finally { await server?.close(); }
  } else if (command === 'example') {
    let candidateBundle;
    if (args.length) { if (args.length !== 2 || args[0] !== '--candidate-bundle') throw Error('Usage: site.sh example [--candidate-bundle PATH]'); candidateBundle = args[1]; }
    await (await import('./example.mjs')).example(repository, { candidateBundle });
  } else if (command === 'exercise' && args.length === 0) {
    await (await import('./exercise.mjs')).exercise();
  } else throw Error('Usage: sh tools/site.sh install | build [--prepared DIRECTORY] [--preview BRANCH SHA] | check [--url URL/] [--preview BRANCH SHA] | exercise | example');
} catch (error) {
  console.error(`Site: ${error.message}`);
  process.exitCode = 1;
}
