import { defineConfig } from 'vite';

const headers = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

export default defineConfig({
  base: '/vite-example/',
  worker: { format: 'es' },
  server: { headers },
  preview: { headers },
});
