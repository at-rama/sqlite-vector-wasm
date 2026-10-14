import { readFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const source = resolve(root, 'tools/openspec');
const installed = resolve(root, '.work/openspec');
const packageName = '@fission-ai/openspec';
const read = path => readFileSync(path, 'utf8');
const json = path => JSON.parse(read(path));
const manifest = json(resolve(source, 'package.json'));
const expected = manifest.dependencies[packageName];
const cli = resolve(installed, 'node_modules', packageName, 'bin/openspec.js');

function records() {
  if (!/^\d+\.\d+\.\d+$/.test(expected)) throw new Error('OpenSpec must use an exact release version.');
  const lock = json(resolve(source, 'package-lock.json'));
  if (lock.lockfileVersion !== 3 || lock.packages[''].dependencies[packageName] !== expected
      || lock.packages[`node_modules/${packageName}`].version !== expected) {
    throw new Error('OpenSpec manifest and lock disagree.');
  }
  for (const [path, entry] of Object.entries(lock.packages)) {
    if (path && (!entry.resolved?.startsWith('https://registry.npmjs.org/')
        || !entry.integrity?.startsWith('sha512-'))) throw new Error(`Missing registry integrity: ${path}`);
  }
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: resolve(root, '.42p'), stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status ?? result.signal}).`);
  return result;
}

function check(generated = true) {
  records();
  for (const name of ['package.json', 'package-lock.json']) {
    if (read(resolve(source, name)) !== read(resolve(installed, name))) {
      throw new Error(`Installed ${name} differs; run sh tools/openspec.sh install.`);
    }
  }
  if (json(resolve(installed, 'node_modules', packageName, 'package.json')).version !== expected) {
    throw new Error(`Installed OpenSpec must be ${expected}.`);
  }
  const version = run(process.execPath, [cli, '--version'], { encoding: 'utf8', stdio: 'pipe' }).stdout.trim();
  if (version !== expected) throw new Error(`OpenSpec CLI reports ${version}; expected ${expected}.`);
  const lock = json(resolve(source, 'package-lock.json'));
  for (const [path, entry] of Object.entries(lock.packages)) {
    if (path && json(resolve(installed, path, 'package.json')).version !== entry.version) {
      throw new Error(`Installed dependency differs from lock: ${path}`);
    }
  }
  if (!generated) return;
  const skills = resolve(root, '.42p/.agents/skills');
  const required = ['propose', 'explore', 'apply-change', 'update-change', 'sync-specs', 'archive-change', 'verify-change'].map(name => `openspec-${name}`);
  for (const name of new Set([...required, ...readdirSync(skills).filter(name => name.startsWith('openspec-'))])) {
    const content = read(resolve(skills, name, 'SKILL.md'));
    if (!content.split('---')[1]?.includes(`generatedBy: "${expected}"`)) {
      throw new Error(`Generated skill ${name} does not match OpenSpec ${expected}; refresh explicitly.`);
    }
  }
}

try {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 20 || (major === 20 && minor < 19)) throw new Error('Node.js >=20.19.0 is required.');
  const [action, ...args] = process.argv.slice(2);
  if (action === 'install' && args.length === 0) {
    records();
    mkdirSync(installed, { recursive: true });
    for (const name of ['package.json', 'package-lock.json']) copyFileSync(resolve(source, name), resolve(installed, name));
    run('npm', ['ci', '--engine-strict', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: installed });
    // Refresh is a separate explicit operation when changing generated skills.
    check(false);
    console.log(`OpenSpec ${expected} installed. Run check before use.`);
  } else if (action === 'refresh' && args.length === 0) {
    check(false);
    for (const args of [
      ['config', 'set', 'profile', 'custom'],
      ['config', 'set', 'workflows', '["propose","explore","apply","update","sync","archive","verify"]'],
      ['config', 'set', 'delivery', 'skills'],
      ['update', '--force'],
    ]) run(process.execPath, [cli, ...args]);
    check();
  } else if (action === 'check' && args.length === 0) {
    check();
    console.log(`OpenSpec ${expected}: installation, CLI and generated skills conform.`);
  } else if (action === 'exec' && args.length > 0) {
    check();
    run(process.execPath, [cli, ...args]);
  } else {
    throw new Error('Usage: sh tools/openspec.sh install | check | refresh | exec <OpenSpec arguments>');
  }
} catch (error) {
  console.error(`OpenSpec tooling: ${error.message}`);
  process.exitCode = 1;
}
