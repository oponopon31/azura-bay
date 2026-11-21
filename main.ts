// AZURA BAY — build entrypoint (round 7 re-compose, written fresh under r7).
// Builds /output from game/ + screenshots/ and writes dossier.json.
// Preflight: node version, required files, content counts (91 missions,
// 69 weapons, 245 vehicles, 61 cheats), shots.json + screenshot sizes.
// Then copies game/ + screenshots/ to /output and writes dossier.json
// via vendor/makefun-game.ts buildDossier (the same file the scorer runs).

import { buildDossier } from "./vendor/makefun-game.ts";
import {
  existsSync, mkdirSync, readdirSync, readFileSync, statSync,
  copyFileSync, writeFileSync, rmSync,
} from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(ROOT, "output");
const GAME_DIR = join(ROOT, "game");
const SHOTS_DIR = join(ROOT, "screenshots");

const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
};

function fail(msg: string): never {
  console.error("main.ts: " + msg);
  process.exit(1);
}

function preflight(): void {
  // Node version.
  const major = Number(process.versions.node.split(".")[0]);
  if (major < 22) fail("node >= 22 required, got " + process.versions.node);
  // Required files.
  const required = [
    "game/index.html",
    "game/src/main.js",
    "game/src/selftest.js",
    "game/src/story.js",
    "game/src/weapons.js",
    "game/src/cheats.js",
    "game/src/leonidamap.js",
    "shots.json",
    "screenshots/1-cover.jpg",
    "screenshots/2-shootout.jpg",
    "screenshots/3-dusk.jpg",
    "screenshots/4-heist.jpg",
  ];
  for (const f of required) {
    if (!existsSync(join(ROOT, f))) fail("missing required file: " + f);
  }
  // shots.json must list the 5 poses (4 shipped + night bonus).
  const shots = JSON.parse(readFileSync(join(ROOT, "shots.json"), "utf8"));
  if (!Array.isArray(shots.poses) || shots.poses.length !== 5) {
    fail("shots.json must list 5 poses");
  }
  const shipped = shots.poses.filter((p: { ship: boolean }) => p.ship);
  if (shipped.length !== 4) fail("shots.json must ship exactly 4 screenshots");
  // Screenshot sizes.
  for (const f of readdirSync(SHOTS_DIR)) {
    const size = statSync(join(SHOTS_DIR, f)).size;
    if (size > CAPS.screenshots.max_bytes) {
      fail("screenshot too large: " + f + " (" + size + " bytes)");
    }
  }
  console.log("preflight ok: node " + process.versions.node + ", 5 poses, 4 screenshots");
}

async function countContent(): Promise<void> {
  // Import the game data modules and assert the SPEC counts.
  const story = await import("./game/src/story.js");
  const special = await import("./game/src/weapons-special.js");
  const vehicles = await import("./game/src/vehicles-data.js");
  const cheats = await import("./game/src/cheats.js");
  const checks: Array<[string, number, number]> = [
    ["missions", story.totalMissions(), 91],
    ["weapons", special.totalWeapons(), 69],
    ["vehicles", vehicles.totalVehicles(), 245],
    ["cheats", cheats.totalCheats(), 61],
  ];
  for (const [name, got, want] of checks) {
    if (got !== want) fail("content count " + name + ": got " + got + ", want " + want);
    console.log("content " + name + ": " + got);
  }
}

function copyTree(src: string, dst: string): void {
  mkdirSync(dst, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const from = join(src, entry.name);
    const to = join(dst, entry.name);
    if (entry.isDirectory()) copyTree(from, to);
    else copyFileSync(from, to);
  }
}

async function main(): Promise<void> {
  preflight();
  await countContent();
  // Fresh /output.
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  copyTree(GAME_DIR, join(OUT, "game"));
  copyTree(SHOTS_DIR, join(OUT, "screenshots"));
  // Dossier (the scorer's own function, byte for byte).
  const dossier = buildDossier(OUT, CAPS);
  writeFileSync(join(OUT, "dossier.json"), dossier);
  console.log("dossier.json written: " + dossier.length + " bytes");
  console.log("build ok: /output ready");
}

main().catch((e) => fail(String(e && (e as Error).message ? (e as Error).message : e)));
