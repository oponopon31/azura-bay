// variants.js — 130+ unique gold weapon variants (SPEC Bab 22).
// Scattered through the open world, NOT sold in gun stores. Gold/yellow
// icon in the world and in the Loadout / Weapons Locker menu; exclusive
// physical design + mods that cannot be changed at a gun store.
// Shared automatically: once one character finds one, it opens for
// Jason AND Lucia. Named examples from the spec: Clunker 556,
// Gutterball Morland 850, Kingfisher W22, Golden AK.
// The list below: 4 named + 126 generated variants (base weapon + a
// gold name), each flagged with its base weapon id.

import { ALL_WEAPONS } from './weapons.js';

const NAMED_VARIANTS = [
  { id: 'clunker556', name: 'Clunker 556', base: 'duke556', desc: 'A beat-up Duke 556 that shoots like it is brand new — gold trim, zero apologies.' },
  { id: 'gutterball', name: 'Gutterball Morland 850', base: 'morland850', desc: 'A Morland 850 with a bowling-ball finish. Strikes every time.' },
  { id: 'kingfisher', name: 'Kingfisher W22', base: 'w14', desc: 'A W-14 in kingfisher blue and gold — the prettiest rifle in Leonida.' },
  { id: 'goldenak', name: 'Golden AK', base: 'kz59', desc: 'A gold-plated KZ-59. Loud in every sense of the word.' },
];

const VARIANT_PREFIXES = [
  'Golden', 'Gilded', 'Royal', 'Midnight Gold', 'Sunset', 'Vice', 'Neon Gold',
  'Ivory', 'Crimson Gold', 'Emerald', 'Sapphire', 'Obsidian Gold', 'Chrome Gold',
  'Rose Gold', 'Platinum', 'Diamond', 'Onyx', 'Pearl', 'Bronze', 'Titanium',
];

export function buildVariants() {
  const variants = [...NAMED_VARIANTS];
  const used = new Set(variants.map((v) => v.id));
  // Two gold variants per base weapon (different prefixes), until 130+.
  for (const prefix of VARIANT_PREFIXES) {
    for (const w of ALL_WEAPONS) {
      if (variants.length >= 132) break;
      const id = `${prefix.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${w.id}`;
      if (used.has(id)) continue;
      used.add(id);
      variants.push({
        id,
        name: `${prefix} ${w.name}`,
        base: w.id,
        desc: `A gold-trimmed ${w.name} — found in the open world, never sold in a store.`,
      });
    }
    if (variants.length >= 132) break;
  }
  return variants;
}

export const VARIANTS = buildVariants();

export function createVariants(G) {
  const V = {
    list: VARIANTS,
    found: {}, // variant id -> true (shared between Jason & Lucia)
    find(id) {
      const v = VARIANTS.find((x) => x.id === id);
      if (!v || this.found[id]) return false;
      this.found[id] = true;
      // Shared automatically: both characters get the base weapon.
      for (const who of ['jason', 'lucia']) {
        if (!G.weapons.has(v.base, who)) {
          const cur = G.player.who;
          G.player.who = who;
          G.weapons.give(v.base);
          G.player.who = cur;
        }
      }
      G.hud.toast(`Gold variant found: ${v.name}! (shared: Jason & Lucia)`);
      G.audio.pickup();
      G.stats.goldVariants = (G.stats.goldVariants || 0) + 1;
      G.saveGame();
      return true;
    },
    count() { return Object.keys(this.found).length; },
    total() { return VARIANTS.length; },
  };
  return V;
}
