import { defineConfig } from 'vitepress';
import { readFileSync } from 'node:fs';

const configuration = JSON.parse(readFileSync(new URL('./site-build.json', import.meta.url), 'utf8'));
const preview = configuration.preview;
const escape = (text: string) => text.replace(/[&<>"']/g, character =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));

export default defineConfig({
  title: 'sqlite-vector-wasm',
  lang: 'en',
  base: configuration.base,
  head: preview ? [['meta', { name: 'robots', content: 'noindex' }]] : [],
  transformPageData(pageData) {
    if (preview) pageData.frontmatter.footer = true;
  },
  themeConfig: {
    sidebar: false,
    footer: preview ? {
      message: `Preview · <span style="overflow-wrap:anywhere">${escape(preview.branch)}</span>`,
      copyright: `Commit <span style="overflow-wrap:anywhere">${escape(preview.commit)}</span>`,
    } : undefined,
    nav: [
      { text: 'Presentation', link: '/' },
      { text: 'Usage', link: '/usage/' },
      { text: 'Demo', link: '/demo/' },
      { text: 'GitHub ↗', link: 'https://github.com/at-rama/sqlite-vector-wasm' },
    ],
  },
});
