// A tiny static server for game/ (Node 22, standard library only), so an entry can be played
// locally without a build step: `node serve.ts` serves game/ on http://localhost:8080.
// `node serve.ts --port 8901` runs a second copy for screenshot work without touching :8080.
// It sends the MIME types a browser game needs, refuses any path outside game/, and otherwise
// does nothing clever: this is a development convenience, not a web server for the internet.
import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const gameRoot = resolve(fileURLToPath(new URL('./game', import.meta.url)));
const argv = process.argv.slice(2);

function flagValue(flag, fallback) {
  const at = argv.indexOf(flag);
  return at === -1 ? fallback : (argv[at + 1] || fallback);
}

const wantedPort = Number(flagValue('--port', '8080'));
const port = Number.isInteger(wantedPort) && wantedPort > 0 && wantedPort < 65536 ? wantedPort : 8080;
// Round 3: --host (default loopback; pass 0.0.0.0 only on a trusted LAN).
const host = flagValue('--host', '127.0.0.1');

const TYPES: Record<string, string> = {
  '.bin': 'application/octet-stream',
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
  '.wav': 'audio/wav',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function sendText(response, code, body) {
  response.writeHead(code).end(body);
}

createServer((request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');
  let path: string;
  try {
    path = decodeURIComponent(url.pathname);
  } catch {
    sendText(response, 400, 'bad request');
    return;
  }
  if (path.endsWith('/')) path += 'index.html';
  // Round 3: a health endpoint for the screenshot / smoke-test harness.
  if (path === '/__health') {
    response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ ok: true, game: 'azura-bay', round: 3 }));
    return;
  }
  const target = resolve(join(gameRoot, normalize(path)));
  if (target !== gameRoot && !target.startsWith(gameRoot + sep)) {
    sendText(response, 403, 'forbidden');
    return;
  }
  let bytes: number;
  try {
    const info = statSync(target);
    if (!info.isFile()) throw new Error('not a file');
    bytes = info.size;
  } catch {
    sendText(response, 404, 'not found');
    return;
  }
  response.writeHead(200, {
    'content-type': TYPES[extname(target).toLowerCase()] ?? 'application/octet-stream',
    'content-length': bytes,
    'cache-control': 'no-store',
  });
  createReadStream(target).pipe(response);
}).listen(port, host, () => {
  console.log(`game/ is on http://${host}:${port}`);
});
