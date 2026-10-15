import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

export const base = '/sqlite-vector-wasm/';

// Prefix-aware loopback fixture, deliberately without COOP/COEP headers.
export async function serveSite(directory, prefix = base) {
  const root = resolve(directory);
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
    '.css': 'text/css', '.json': 'application/json', '.wasm': 'application/wasm',
    '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (!pathname.startsWith(prefix)) return response.writeHead(404).end();
      const relative = pathname.slice(prefix.length) + (pathname.endsWith('/') ? 'index.html' : '');
      const file = resolve(root, relative);
      if (!file.startsWith(root + sep)) return response.writeHead(403).end();
      const bytes = await readFile(file);
      response.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream',
        'Cache-Control': 'no-store' });
      response.end(bytes);
    } catch (error) {
      response.writeHead(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 400).end();
    }
  });
  await new Promise((accept, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', accept);
  });
  return {
    url: `http://127.0.0.1:${server.address().port}${prefix}`,
    close: () => new Promise((accept, reject) => {
      server.close(error => error ? reject(error) : accept());
      server.closeAllConnections();
    }),
  };
}
