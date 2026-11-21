// AZURA BAY — pedestrians (round 7 re-compose, written fresh under r7).
// NPC pedestrians: walk, panic, flee, call police. Density varies by
// zone and time (Vice City busy at night, Keys quiet at dawn).

import { mulberry32, hashSeed } from "./rng.js";

export const PED_TYPES = ["walker", "runner", "shopper", "worker", "tourist", "gang", "cop", "medic"];

export function spawnPedestrians(count, zone, seed) {
  const rand = mulberry32(hashSeed(seed || ("peds-" + zone)));
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push({
      id: "ped-" + zone + "-" + (i + 1),
      type: PED_TYPES[Math.floor(rand() * PED_TYPES.length)],
      x: Math.round(-880 + rand() * 1080),
      z: Math.round(-800 + rand() * 1600),
      speed: 1 + rand() * 2,
      panic: 0,
      zone,
    });
  }
  return out;
}

// Density by zone and hour (0-23). Vice City is busy at night.
export function pedDensity(zone, hour) {
  const base = { "Vice City": 100, "Vice Beach": 80, "Leonida Keys": 30, "Port Gellhorn": 40, "Ambrosia": 35, "Grassrivers": 20, "Mount Kalaga": 15 }[zone] || 40;
  const nightBoost = (hour >= 20 || hour < 2) ? 1.3 : 1.0;
  const dawnDip = (hour >= 5 && hour < 7) ? 0.5 : 1.0;
  return Math.round(base * nightBoost * dawnDip);
}
export function panicPeds(peds, x, z, radius) {
  for (const p of peds) {
    const d = Math.hypot(p.x - x, p.z - z);
    if (d < radius) p.panic = 100;
  }
  return peds;
}
export function fleePeds(peds, x, z) {
  for (const p of peds) {
    if (p.panic > 0) {
      const dx = p.x - x, dz = p.z - z;
      const len = Math.hypot(dx, dz) || 1;
      p.x += (dx / len) * p.speed * 2;
      p.z += (dz / len) * p.speed * 2;
      p.panic = Math.max(0, p.panic - 5);
    }
  }
  return peds;
}
export function countByType(peds) {
  const counts = {};
  for (const p of peds) counts[p.type] = (counts[p.type] || 0) + 1;
  return counts;
}
