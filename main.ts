// main.ts — AZURA BAY entrypoint (round 3).
// Preflight boot chain, then build the dossier with the kit's buildDossier.
// 1. index.html must load ./src/main.js.
// 2. Every module main.js statically imports must exist on disk.
// 3. Content counts from the game's own data files (91 missions, 69 weapons,
//    245 vehicles, 61 cheats) — a mismatch only WARNS, it never fails.
// 4. shots.json + screenshot sizes are validated.
// 5. game/ + screenshots/ are copied to ./output and dossier.json is written
//    via buildDossier (the scorer's cap does not change).
import { buildDossier } from './vendor/makefun-game.ts';
import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync, statSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MISSIONS } from './game/src/missions.js';
import { SIDEARMS } from './game/src/weapons.js';
import { LONGARMS } from './game/src/weapons-longarms.js';
import { MELEE } from './game/src/weapons-melee.js';
import { EXPLOSIVES } from './game/src/weapons-explosives.js';
import { SPECIALS } from './game/src/weapons-special.js';
import { VEHICLES } from './game/src/vehicles-data.js';
import { CHEATS } from './game/src/cheats.js';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'output');

function fail(msg: string): never {
  console.error(`main.ts: ${msg}`);
  process.exit(1);
}

// 1. index.html must load ./src/main.js.
const indexHtml = readFileSync(join(ROOT, 'game', 'index.html'), 'utf8');
if (!indexHtml.includes('./src/main.js')) fail('game/index.html does not load ./src/main.js');

// 2. Every static import of main.js must exist on disk.
const mainJs = readFileSync(join(ROOT, 'game', 'src', 'main.js'), 'utf8');
const specifiers = [...mainJs.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);
for (const spec of specifiers) {
  if (!spec.startsWith('.')) continue;
  const target = join(ROOT, 'game', 'src', spec);
  if (!existsSync(target)) fail(`main.js imports ${spec} but ${target} does not exist`);
}

// 3. Content counts from the game's own data (warn only).
const weapons = SIDEARMS.length + LONGARMS.length + MELEE.length + EXPLOSIVES.length + SPECIALS.length;
const counts = { missions: MISSIONS.length, weapons, vehicles: VEHICLES.length, cheats: CHEATS.length };
const expected = { missions: 91, weapons: 69, vehicles: 245, cheats: 61 };
for (const [k, v] of Object.entries(counts)) {
  if (v !== (expected as Record<string, number>)[k]) {
    console.warn(`main.ts: WARNING content count off: ${k} = ${v} (expected ${(expected as Record<string, number>)[k]})`);
  }
}
console.log(`main.ts: content counts ${JSON.stringify(counts)}`);

// 4. shots.json + screenshot sizes.
const shots = JSON.parse(readFileSync(join(ROOT, 'shots.json'), 'utf8'));
if (!Array.isArray(shots.shots) || shots.shots.length !== 5) fail('shots.json must hold 5 shots');
if (!Array.isArray(shots.submitted) || shots.submitted.length !== 4) fail('shots.json must list 4 submitted screenshots');
for (const name of shots.submitted) {
  // Screenshot files are numbered: 1-cover.jpg, 2-shootout.jpg, 3-dusk.jpg, 4-heist.jpg.
  const order = ['cover', 'shootout', 'dusk', 'heist', 'night'];
  const file = join(ROOT, 'screenshots', `${order.indexOf(name) + 1}-${name}.jpg`);
  if (!existsSync(file)) fail(`missing screenshot screenshots/${order.indexOf(name) + 1}-${name}.jpg`);
  const size = statSync(file).size;
  if (size > 262144) fail(`screenshots/${name}.jpg is ${size} bytes, over the 262144 cap`);
}

// 5. Copy game/ + screenshots/ to ./output, then write the dossier.
mkdirSync(OUT, { recursive: true });
cpSync(join(ROOT, 'game'), join(OUT, 'game'), { recursive: true });
cpSync(join(ROOT, 'screenshots'), join(OUT, 'screenshots'), { recursive: true });
const dossier = buildDossier(OUT, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
});
writeFileSync(join(OUT, 'dossier.json'), dossier);
console.log(`main.ts: dossier written (${dossier.length} bytes) to output/dossier.json`);
