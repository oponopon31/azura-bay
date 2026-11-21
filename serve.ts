// AZURA BAY — dev server (round 7 re-compose, written fresh under r7).
// Serves game/ statically. GET /__health returns {"ok":true}.
// Usage: node serve.ts [--host 0.0.0.0] [--port 8000]

import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join, dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const GAME_DIR = join(ROOT, "game");

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function parseArgs(): { host: string; port: number } {
  const args = process.argv.slice(2);
  let host = "127.0.0.1";
  let port = 8000;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--host" && args[i + 1]) host = args[++i];
    else if (args[i] === "--port" && args[i + 1]) port = Number(args[++i]);
  }
  return { host, port };
}

const { host, port } = parseArgs();

const server = createServer((req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  if (url.pathname === "/__health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }
  let path = url.pathname === "/" ? "/index.html" : url.pathname;
  const file = resolve(join(GAME_DIR, "." + path));
  if (!file.startsWith(GAME_DIR) || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});

server.listen(port, host, () => {
  console.log("AZURA BAY dev server: http://" + host + ":" + port + "/");
  console.log("health: http://" + host + ":" + port + "/__health");
});
