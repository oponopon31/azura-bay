// serve.ts — AZURA BAY dev server.
// Serves the game (game/) and screenshots over HTTP for local playtesting.
// Routes: GET /__health (liveness), everything else serves files from game/
// (and /screenshots/* from screenshots/). Flag: --host (listen on 0.0.0.0
// instead of localhost). Usage: node serve.ts [--host] [--port 8080]
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const args = process.argv.slice(2);
const host = args.includes('--host') ? '0.0.0.0' : '127.0.0.1';
const portFlag = args.indexOf('--port');
const port = portFlag >= 0 ? Number(args[portFlag + 1]) || 8080 : 8080;

const MIME: Record<string, string> = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
};

const server = createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  if (url.pathname === '/__health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ ok: true, game: 'AZURA BAY' }));
    return;
  }
  const rel = normalize(url.pathname.replace(/^\/+/, '') || 'index.html');
  const candidates = rel.startsWith('screenshots/')
    ? [join(ROOT, rel)]
    : [join(ROOT, 'game', rel)];
  const file = candidates.find((c) => existsSync(c) && statSync(c).isFile());
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});

server.listen(port, host, () => {
  console.log(`AZURA BAY dev server: http://${host}:${port}/  (health: /__health)`);
});
