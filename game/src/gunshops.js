// gunshops.js — The 24 gun stores (SPEC Bab 9 + Bab 27).
// Store names are ORIGINAL — the spec says the shop brand is NOT
// "Ammu-Nation" (that name belongs to another game); the in-world chain is
// called by its own name here, with Phil's Ammu-Nation kept as the one
// named exception from the spec (Phil Cassidy's store).
// 6 Expanded stores are named in the spec; the other 18 are Standard.
// Expanded stores carry the full catalogue + attachments + the green
// weapon locker; Standard stores carry a smaller tier-limited stock.
// Tiers: tier 0 = melee, 1 = basic, 2 = advanced, 3 = heavy/special.
// Chapter-tied unlocks: tier 1 from Chapter 1, tier 2 from Chapter 3,
// tier 3 from Chapter 4 (heavy weapons need the story to progress).
// Round 5: table rows re-expressed one field per line. Values unchanged.

import { WEAPON_BY_ID, ALL_WEAPONS } from './weapons.js';

export const ATTACHMENT_CATEGORIES = [
  'Grips', 'Magazines', 'Optics', 'Suppressors',
  'Muzzle', 'Tactical Attachments', 'Flashlights', 'Cosmetic Finishes',
];

export const GUN_SHOPS = [
  // ---- 6 Expanded (named in the spec) ----
  {
    id: 'woodhatch',
    name: 'Woodhatch Arms',
    x: -320,
    z: 300,
    tier: 3,
    expanded: true,
    town: 'Capri',
  },
  {
    id: 'bigshots',
    name: 'Big Shots',
    x: -280,
    z: -200,
    tier: 3,
    expanded: true,
    town: 'Hamlet',
  },
  {
    id: 'phil',
    name: "Phil's Ammu-Nation",
    x: -40,
    z: -40,
    tier: 3,
    expanded: true,
    town: 'Vice City',
  },
  {
    id: 'blackeagle',
    name: 'Black Eagle',
    x: 80,
    z: 120,
    tier: 3,
    expanded: true,
    town: 'Vice City',
  },
  {
    id: 'ironoak',
    name: 'Iron & Oak',
    x: -200,
    z: 260,
    tier: 3,
    expanded: true,
    town: 'Ambrosia',
  },
  {
    id: 'prestige',
    name: 'Prestige Firearms',
    x: 300,
    z: 300,
    tier: 3,
    expanded: true,
    town: 'Ocean Beach',
  },
  // ---- 18 Standard ----
  {
    id: 'stronghold',
    name: 'Stronghold Ammunition',
    x: 120,
    z: -80,
    tier: 2,
    expanded: false,
    town: 'Vice City',
  },
  {
    id: 'pawnandgun',
    name: 'Pawn and Gun',
    x: -120,
    z: 160,
    tier: 2,
    expanded: false,
    town: 'Vice City',
  },
  {
    id: 'gellhorn',
    name: 'Gellhorn Gunworks',
    x: 320,
    z: -80,
    tier: 2,
    expanded: false,
    town: 'Port Gellhorn',
  },
  {
    id: 'watson',
    name: 'Watson Bay Firearms',
    x: -320,
    z: -280,
    tier: 2,
    expanded: false,
    town: 'Watson Bay',
  },
  {
    id: 'keylento',
    name: 'Key Lento Outfitters',
    x: 200,
    z: -320,
    tier: 1,
    expanded: false,
    town: 'Key Lento',
  },
  {
    id: 'waning',
    name: 'Waning Sands Arms',
    x: -160,
    z: 320,
    tier: 1,
    expanded: false,
    town: 'Waning Sands',
  },
  {
    id: 'millport',
    name: 'Millport Gun & Tackle',
    x: -240,
    z: 240,
    tier: 1,
    expanded: false,
    town: 'Millport',
  },
  {
    id: 'gloriana',
    name: 'Gloriana Key Arms',
    x: 240,
    z: -200,
    tier: 1,
    expanded: false,
    town: 'Gloriana Key',
  },
  {
    id: 'leonidakeys',
    name: 'Leonida Keys Gun Room',
    x: -80,
    z: -320,
    tier: 1,
    expanded: false,
    town: 'Leonida Keys',
  },
  {
    id: 'vicebeach',
    name: 'Vice Beach Firearms',
    x: 320,
    z: 160,
    tier: 2,
    expanded: false,
    town: 'Vice Beach',
  },
  {
    id: 'laperle',
    name: 'La Perle Arms',
    x: -80,
    z: 200,
    tier: 2,
    expanded: false,
    town: 'Vice City',
  },
  {
    id: 'salton',
    name: 'Salton Gun Supply',
    x: 160,
    z: 80,
    tier: 1,
    expanded: false,
    town: 'Vice City',
  },
  {
    id: 'bayside',
    name: 'Bayside Outfitters',
    x: 40,
    z: 240,
    tier: 1,
    expanded: false,
    town: 'Vice City',
  },
  {
    id: 'southside',
    name: 'Southside Arms',
    x: -200,
    z: -120,
    tier: 1,
    expanded: false,
    town: 'Vice City',
  },
  {
    id: 'balsero',
    name: 'Balsero Gunworks',
    x: 200,
    z: 40,
    tier: 1,
    expanded: false,
    town: 'Vice City',
  },
  {
    id: 'decordistrict',
    name: 'Decor District Arms',
    x: 0,
    z: 280,
    tier: 2,
    expanded: false,
    town: 'Vice City',
  },
  {
    id: 'emeraldsprings',
    name: 'Emerald Springs Hunting',
    x: -280,
    z: 120,
    tier: 1,
    expanded: false,
    town: 'Emerald Springs',
  },
  {
    id: 'ambrosia2',
    name: 'Ambrosia Gun & Pawn',
    x: -160,
    z: 280,
    tier: 1,
    expanded: false,
    town: 'Ambrosia',
  },
];

// Chapter-tied tier unlocks: tier 1 from Chapter 1, tier 2 from Chapter 3,
// tier 3 (heavy / special) from Chapter 4.
export function tierUnlocked(chapter) {
  if (chapter >= 4) return 3;
  if (chapter >= 3) return 2;
  return 1;
}

export function createGunshops(Game) {
  const S = {
    shops: GUN_SHOPS,
    // What this shop sells right now (chapter + shop tier limit it).
    stock(shopId) {
      const shop = GUN_SHOPS.find((s) => s.id === shopId);
      if (!shop) return [];
      const chapter = (Game.missions.current && Game.missions.current.ch) || 1;
      const maxTier = Math.min(shop.tier, tierUnlocked(chapter));
      return ALL_WEAPONS.filter((w) => (w.tier || 0) <= maxTier && (w.tier || 0) > 0 || (w.tier === 0 && shop.expanded));
    },
    nearestShop() {
      let best = null, bestD = 1e9;
      for (const s of GUN_SHOPS) {
        const d = Math.hypot(Game.player.pos.x - s.x, Game.player.pos.z - s.z);
        if (d < bestD) { bestD = d; best = s; }
      }
      return bestD < 25 ? best : null;
    },
    // Buy a weapon: cash, ownership, and the shopping challenges.
    buy(shopId, weaponId) {
      const w = WEAPON_BY_ID[weaponId];
      const shop = GUN_SHOPS.find((s) => s.id === shopId);
      if (!w || !shop) return { ok: false, reason: 'Unknown shop or weapon.' };
      if (Game.weapons.has(weaponId)) return { ok: false, reason: 'You already own that.' };
      if (Game.money < w.price) return { ok: false, reason: `You need $${w.price.toLocaleString()} — you have $${Math.floor(Game.money).toLocaleString()}.` };
      Game.money -= w.price;
      Game.weapons.give(weaponId);
      Game.stats.spentAtGunshops = (Game.stats.spentAtGunshops || 0) + w.price;
      Game.stats.weaponsBought = (Game.stats.weaponsBought || 0) + 1;
      this.checkChallenges();
      Game.audio.cash();
      Game.hud.toast(`Bought ${w.name} for $${w.price.toLocaleString()}.`);
      return { ok: true, weapon: w };
    },
    // Buy reserve ammo for a weapon the player owns.
    buyAmmo(weaponId, rounds) {
      const w = WEAPON_BY_ID[weaponId];
      // Ownership = the collection (see buyAttachment).
      const owned = Game.weapons.ownedAll ? Game.weapons.ownedAll().includes(weaponId) : Game.weapons.has(weaponId);
      if (!w || !owned) return { ok: false, reason: 'You do not own that weapon.' };
      if (w.capped === false) return { ok: false, reason: 'That weapon is uncapped — no ammo to buy.' };
      const cost = Math.ceil((rounds / 10) * 25);
      if (Game.money < cost) return { ok: false, reason: `Ammo costs $${cost} — you have $${Math.floor(Game.money).toLocaleString()}.` };
      Game.money -= cost;
      Game.weapons.ammo[weaponId] = (Game.weapons.ammo[weaponId] || 0) + rounds;
      Game.stats.spentAtGunshops = (Game.stats.spentAtGunshops || 0) + cost;
      Game.audio.cash();
      return { ok: true, cost, rounds };
    },
    // Buy an attachment (one of the 8 categories) for the active weapon.
    buyAttachment(weaponId, category) {
      if (!ATTACHMENT_CATEGORIES.includes(category)) return { ok: false, reason: 'Unknown attachment category.' };
      const w = WEAPON_BY_ID[weaponId];
      // Ownership = the collection, not the 5 wheel slots: a weapon you
      // own but are not currently carrying can still be fitted.
      const owned = Game.weapons.ownedAll ? Game.weapons.ownedAll().includes(weaponId) : Game.weapons.has(weaponId);
      if (!w || !owned) return { ok: false, reason: 'You do not own that weapon.' };
      const cost = 800;
      if (Game.money < cost) return { ok: false, reason: `Attachments cost $${cost}.` };
      Game.money -= cost;
      Game.stats.attachments = Game.stats.attachments || {};
      Game.stats.attachments[weaponId] = Game.stats.attachments[weaponId] || [];
      if (Game.stats.attachments[weaponId].includes(category)) return { ok: false, reason: 'Already fitted.' };
      Game.stats.attachments[weaponId].push(category);
      Game.stats.weaponsBought = (Game.stats.weaponsBought || 0);
      this.checkChallenges();
      Game.hud.toast(`${category} fitted to ${w.name}.`);
      return { ok: true, category };
    },
    // Shopping challenges (Bab 27): Well Armed (own 10 weapons),
    // Stylishly Armed (fit attachments to 5 weapons), Heavily Armed
    // (own a tier-3 weapon). Each pays a small bonus once.
    checkChallenges() {
      // Well Armed and Heavily Armed count the OWNED collection (every
      // weapon ever picked up), not the 5 wheel slots — ownedList() can
      // never exceed 5, so slot-based counts made both unreachable.
      const owned = Game.weapons.ownedAll ? Game.weapons.ownedAll().length : Game.weapons.ownedList().length;
      const fitted = Object.keys(Game.stats.attachments || {}).length;
      const heavy = (Game.weapons.ownedAll ? Game.weapons.ownedAll() : Game.weapons.ownedList())
        .some((id) => (WEAPON_BY_ID[id].tier || 0) >= 3);
      const done = Game.stats.shopChallenges || (Game.stats.shopChallenges = {});
      if (!done.wellArmed && owned >= 10) {
        done.wellArmed = true;
        Game.money += 1000;
        Game.hud.toast('Challenge complete: WELL ARMED — +$1,000.');
      }
      if (!done.stylishlyArmed && fitted >= 5) {
        done.stylishlyArmed = true;
        Game.money += 2000;
        Game.hud.toast('Challenge complete: STYLISHLY ARMED — +$2,000.');
      }
      if (!done.heavilyArmed && heavy) {
        done.heavilyArmed = true;
        Game.money += 5000;
        Game.hud.toast('Challenge complete: HEAVILY ARMED — +$5,000.');
      }
    },
    // The green weapon locker (Bab 23): at Expanded stores, the player's
    // owned weapons are stored here — a loadout that survives death.
    // Returns the full owned collection, not just the 5 wheel slots.
    locker() {
      const ids = Game.weapons.ownedAll ? Game.weapons.ownedAll() : Game.weapons.ownedList();
      return ids.map((id) => WEAPON_BY_ID[id].name);
    },
    // Round 3: how many of the 24 shops are Expanded (full stock + locker).
    expandedCount() {
      return this.shops.filter((s) => s.expanded).length;
    },
  };
  return S;
}
