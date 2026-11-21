// AZURA BAY — stunts & free-roam robberies (round 7 re-compose, fresh under r7).
// SPEC.md Bab 6. Stunts: 130 jumps, 202 under-bridges, 40 knife flights,
// 25 base jumps = 397, placed by seeded RNG (real completion logic).
// Robberies: per-kind counts sum to 173 (the user's "175" label is his own
// arithmetic; this file reports the real 173 and the label separately).

export const STUNT_KINDS = [
  { kind: "jump", name: "Stunt Jumps", count: 130 },
  { kind: "bridge", name: "Under the Bridges", count: 202 },
  { kind: "knife", name: "Knife Flights", count: 40 },
  { kind: "base", name: "Base Jumps", count: 25 },
];
export const STUNT_TOTAL = 397;

export const ROBBERY_KINDS = [
  { kind: "minimarket", name: "Convenience Stores", count: 72 },
  { kind: "fastfood", name: "Fast Food Joints", count: 23 },
  { kind: "bank", name: "Bank Jobs", count: 22, note: "14 small banks + 8 large vaults" },
  { kind: "jewelry", name: "Jewelry Stores", count: 20 },
  { kind: "pawn", name: "Pawn Shops", count: 15 },
  { kind: "liquor", name: "Liquor Stores", count: 14 },
  { kind: "payday", name: "Payday Loans", count: 7 },
];
export const ROBBERY_TOTAL_LABEL = 175;
export const ROBBERY_TOTAL_ACTUAL = ROBBERY_KINDS.reduce((s, r) => s + r.count, 0); // 173

import { mulberry32, hashSeed } from "./rng.js";

// Seeded placement: deterministic stunt sites across the map.
export function stuntSites(kind, count) {
  const rand = mulberry32(hashSeed("stunt-" + kind));
  const sites = [];
  for (let i = 0; i < count; i++) {
    sites.push({
      id: kind + "-" + (i + 1),
      kind,
      x: Math.round(-880 + rand() * 1080),
      z: Math.round(-800 + rand() * 1600),
      done: false,
    });
  }
  return sites;
}

export function allStuntSites() {
  const out = [];
  for (const k of STUNT_KINDS) out.push(...stuntSites(k.kind, k.count));
  return out;
}

export function stuntCountByKind(kind) {
  const k = STUNT_KINDS.find((s) => s.kind === kind);
  return k ? k.count : 0;
}
export function totalStunts() { return STUNT_TOTAL; }
export function totalRobberies() { return ROBBERY_TOTAL_ACTUAL; }
