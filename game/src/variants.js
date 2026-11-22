// variants.js — Unique gold weapon variants (130+), SPEC §22.
// Scattered in the open world, NOT sold in regular gun shops. Gold/yellow
// icon in the world and in the Loadout / Weapons Locker; exclusive physical
// design + modifications that cannot be changed at Ammu-Nation.
// Shared automatically: once one character finds one, it opens for Cole & Mara.
// Examples: Clunker 556, Gutterball Morland 850, Kingfisher W22, Golden AK.
const PREFIXES = [
  'Golden', 'Clunker', 'Gutterball', 'Kingfisher', 'Rusty', 'Chrome',
  'Ivory', 'Ebony', 'Crimson', 'Midnight', 'Shadow', 'Royal',
];

const BASES = [
  '556', 'Morland 850', 'W22', 'AK', 'ES9', 'K17',
  'MP5', 'FF-50', 'Kalinga .50', 'Akulus', 'KZ-59',
];

// 12 prefixes × 11 bases = 132 unique gold variants.
export const VARIANTS = [];
for (const prefix of PREFIXES) {
  for (const base of BASES) {
    VARIANTS.push({ name: `${prefix} ${base}`, base, gold: true, shared: true });
  }
}

// Names of all variants found so far (for the loadout screen).
export function foundNames(found) {
  const set = new Set(found || []);
  return VARIANTS.filter((v) => set.has(v.name)).map((v) => v.name);
}

export function variantByName(name) {
  return VARIANTS.find((v) => v.name === name) || null;
}
