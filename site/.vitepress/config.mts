import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'sqlite-vector-wasm',
  lang: 'en',
  base: '/sqlite-vector-wasm/',
  themeConfig: {
    sidebar: false,
    nav: [
      { text: 'Presentation', link: '/' },
      { text: 'Usage', link: '/usage/' },
      { text: 'Demo', link: '/demo/' },
      { text: 'GitHub ↗', link: 'https://github.com/at-rama/sqlite-vector-wasm' },
    ],
  },
});
