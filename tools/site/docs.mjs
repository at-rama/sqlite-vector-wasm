import { readFile, writeFile, mkdir, cp, stat, realpath } from 'node:fs/promises';
import { resolve, dirname, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const canonical = 'https://at-rama.github.io/sqlite-vector-wasm/';
const documents = { 'README.md': '', 'docs/usage.md': 'usage/' };
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const encodePath = path => path.split('/').map(encodeURIComponent).join('/');
function walk(tokens, action) {
  for (const token of tokens) { action(token); if (token.children && token.type !== 'image') walk(token.children, action); }
}

// Use the same pinned renderer as the site, with only URL rendering replaced.
export async function renderer(root) {
  const { createMarkdownRenderer } = await import(pathToFileURL(join(root, '.work/site/node_modules/vitepress/dist/node/index.js')));
  return createMarkdownRenderer(root, {}, '/');
}

export async function prepareDocs(root, source, base) {
  const md = await renderer(root);
  const parsed = {};
  for (const name of Object.keys(documents)) {
    const text = await readFile(join(root, name), 'utf8');
    const env = { path: join(root, name), relativePath: name };
    const tokens = md.parse(text, env);
    const ids = [];
    const headings = [];
    const code = [];
    const texts = [];
    walk(tokens, token => {
      if (token.type === 'heading_open') ids.push(token.attrGet('id'));
      if (token.type === 'text' && token.content.trim()) texts.push(token.content);
      if (token.type === 'fence') code.push(token.content.trimEnd());
    });
    for (let i = 0; i < tokens.length; i++) if (tokens[i].type === 'heading_open') headings.push(tokens[i + 1].content);
    parsed[name] = { text, tokens, env, ids, headings, code, texts, links: [], images: [] };
  }
  const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const target = documentationResolver({ root, source, base, parsed, md, revision });
  const manifest = { pages: [] };
  for (const [name, page] of Object.entries(parsed)) {
    const pending = [];
    walk(page.tokens, token => {
      const attr = token.type === 'link_open' ? 'href' : token.type === 'image' ? 'src' : null;
      if (attr && !token.meta?.isPermalink) pending.push((async () => {
        const value = await target(token.attrGet(attr), name, attr === 'src');
        token.attrSet(attr, value);
        page[attr === 'src' ? 'images' : 'links'].push(value);
      })());
    });
    await Promise.all(pending);
    const original = md.renderer.rules.link_open;
    md.renderer.rules.link_open = (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options);
    let html;
    try { html = md.renderer.render(page.tokens, md.options, page.env); }
    finally { md.renderer.rules.link_open = original; }
    const destination = join(source, documents[name], 'index.md');
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, `---\ntitle: ${name === 'README.md' ? 'Presentation' : 'Usage'}\n---\n\n<div v-pre>\n${html}\n</div>\n`);
    manifest.pages.push({ path: documents[name], source: name, sha256: sha(page.text), headings: page.headings,
      ids: page.ids, code: page.code, texts: page.texts, links: [...new Set(page.links)], images: [...new Set(page.images)] });
  }
  await mkdir(join(source, 'public'), { recursive: true });
  await writeFile(join(source, 'public/site-docs.json'), JSON.stringify(manifest, null, 2) + '\n');
  return manifest;
}

export function documentationResolver({ root, source, base, parsed, md, revision }) {
  async function localFile(name, origin, url) {
    const file = resolve(root, name);
    const actual = await realpath(file).catch(() => { throw Error(`${origin}: missing target ${url}`); });
    if (!actual.startsWith(resolve(root) + '/') || !(await stat(actual)).isFile()) throw Error(`${origin}: invalid file target ${url}`);
    return file;
  }
  return async function target(url, origin, image) {
    if (!url) throw Error(`${origin}: empty target`);
    let path, suffix = '';
    if (url.startsWith('#')) {
      if (!parsed[origin].ids.includes(decodeURIComponent(url.slice(1)))) throw Error(`${origin}: missing anchor ${url}`);
      return url;
    }
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(url)) {
      if (!url.startsWith(canonical)) return url;
      const own = new URL(url);
      const route = own.pathname.slice(new URL(canonical).pathname.length);
      path = Object.keys(documents).find(name => documents[name] === route || documents[name] + 'index.html' === route);
      suffix = own.search + own.hash;
      if (!path) {
        const decoded = decodeURIComponent(route);
        const entry = decoded.endsWith('/') ? decoded + 'index.md' : decoded.replace(/\.html$/, '.md');
        const candidates = [resolve(source, entry), resolve(source, 'public', decoded)];
        let found;
        for (const candidate of candidates) {
          if (!candidate.startsWith(resolve(source) + '/')) continue;
          const info = await stat(candidate).catch(() => null);
          if (info?.isFile()) { found = candidate; break; }
        }
        if (!found) throw Error(`${origin}: missing site target ${url}`);
        if (own.hash) {
          const ids = [];
          walk(md.parse(await readFile(found, 'utf8'), {}), token => { if (token.type === 'heading_open') ids.push(token.attrGet('id')); });
          if (!ids.includes(decodeURIComponent(own.hash.slice(1)))) throw Error(`${origin}: missing anchor ${url}`);
        }
        return base + route + suffix;
      }
    } else {
      const match = /^([^?#]*)(.*)$/.exec(url);
      path = relative(root, resolve(dirname(join(root, origin)), decodeURIComponent(match[1]))).split('\\').join('/');
      suffix = match[2];
    }
    const file = await localFile(path, origin, url);
    const fragment = suffix.includes('#') ? decodeURIComponent(suffix.split('#')[1]) : '';
    if (fragment && !image) {
      let ids = parsed[path]?.ids;
      if (!ids && path.endsWith('.md')) {
        ids = [];
        walk(md.parse(await readFile(file, 'utf8'), {}), token => { if (token.type === 'heading_open') ids.push(token.attrGet('id')); });
      }
      if (!ids?.includes(fragment)) throw Error(`${origin}: missing anchor ${url}`);
    }
    if (image) {
      const asset = 'docs-assets/' + encodePath(path);
      await mkdir(dirname(join(source, 'public', 'docs-assets', path)), { recursive: true });
      await cp(file, join(source, 'public', 'docs-assets', path));
      return base + asset + suffix;
    }
    if (Object.hasOwn(documents, path)) return base + documents[path] + suffix;
    return `https://github.com/at-rama/sqlite-vector-wasm/blob/${revision}/${encodePath(path)}${suffix}`;
  }
}
