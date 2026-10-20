import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepare, checkOutput } from './prepare.mjs';
import { prepareDemo } from './demo-runtime.mjs';

export const repository = fileURLToPath(new URL('../../', import.meta.url));

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw Error(`${command} failed (${result.status})`);
}

export async function install(root = repository) {
  const work = join(root, '.work/site');
  await mkdir(work, { recursive: true });
  for (const name of ['package.json', 'package-lock.json']) {
    await cp(join(root, 'tools/site', name), join(work, name));
  }
  run('npm', ['ci', '--include=dev', '--no-audit', '--no-fund'], work);
}

export async function build({ root = repository, prepared, preview, docs = true, allowDirtyDocumentation = false } = {}) {
  const work = join(root, '.work/site');
  const installed = JSON.parse(await readFile(join(work, 'node_modules/vitepress/package.json'), 'utf8'));
  if (installed.version !== '1.6.4') throw Error('Run sh tools/site.sh install for locked VitePress 1.6.4.');
  if (!prepared && docs) {
    let integrated = false;
    try { await readFile(join(root, 'tools/site/demo-runtime.json')); integrated = true; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (integrated) {
      prepared = join(root, '.work/demo-prepared');
      try { await prepareDemo(root, prepared); }
      catch (error) {
        for (const path of [join(work, 'src'), join(work, 'dist'), join(work, 'build.json')]) await rm(path, { recursive: true, force: true });
        throw error;
      }
    }
  }
  const result = await prepare(root, prepared, { preview, docs, allowDirtyDocumentation });
  try {
    run(process.execPath, [join(work, 'node_modules/vitepress/bin/vitepress.js'), 'build', result.source, '--outDir', result.output], root);
    return await checkOutput(result);
  } catch (error) {
    await rm(result.output, { recursive: true, force: true });
    throw error;
  }
}
