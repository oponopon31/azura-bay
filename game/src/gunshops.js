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
// 8 attachment categories (Bab 27): Grips, Magazines, Optics, Suppressors,
// Muzzle/Tactical Attachments, Flashlights, Cosmetic Finishes — the spec
// lists 7 names for 8 categories; the 8th is Barrels (the missing slot).
// Shopping challenges (Bab 27): Well Armed, Stylishly Armed, Heavily Armed.

import { WEAPON_BY_ID, ALL_WEAPONS } from './weapons.js';

export const ATTACHMENT_CATEGORIES = [
  'Grips', 'Magazines', 'Optics', 'Suppressors',
  'Muzzle', 'Tactical Attachments', 'Flashlights', 'Cosmetic Finishes',
];

export const GUN_SHOPS = [
  // ---- 6 Expanded (named in the spec) ----
  { id: 'woodhatch', name: 'Woodhatch Arms', town: 'Capri', expanded: true, tier: 3, x: -320, z: 300 },
  { id: 'bigshots', name: 'Big Shots', town: 'Hamlet', expanded: true, tier: 3, x: -280, z: -200 },
  { id: 'phil', name: "Phil's Ammu-Nation", town: 'Vice City', expanded: true, tier: 3, x: -40, z: -40 },
  { id: 'blackeagle', name: 'Black Eagle', town: 'Vice City', expanded: true, tier: 3, x: 80, z: 120 },
  { id: 'ironoak', name: 'Iron & Oak', town: 'Ambrosia', expanded: true, tier: 3, x: -200, z: 260 },
  { id: 'prestige', name: 'Prestige Firearms', town: 'Ocean Beach', expanded: true, tier: 3, x: 300, z: 300 },
  // ---- 18 Standard ----
  { id: 'stronghold', name: 'Stronghold Ammunition', town: 'Vice City', expanded: false, tier: 2, x: 120, z: -80 },
  { id: 'pawnandgun', name: 'Pawn and Gun', town: 'Vice City', expanded: false, tier: 2, x: -120, z: 160 },
  { id: 'gellhorn', name: 'Gellhorn Gunworks', town: 'Port Gellhorn', expanded: false, tier: 2, x: 320, z: -80 },
  { id: 'watson', name: 'Watson Bay Firearms', town: 'Watson Bay', expanded: false, tier: 2, x: -320, z: -280 },
  { id: 'keylento', name: 'Key Lento Outfitters', town: 'Key Lento', expanded: false, tier: 1, x: 200, z: -320 },
  { id: 'waning', name: 'Waning Sands Arms', town: 'Waning Sands', expanded: false, tier: 1, x: -160, z: 320 },
  { id: 'millport', name: 'Millport Gun & Tackle', town: 'Millport', expanded: false, tier: 1, x: -240, z: 240 },
  { id: 'gloriana', name: 'Gloriana Key Arms', town: 'Gloriana Key', expanded: false, tier: 1, x: 240, z: -200 },
  { id: 'leonidakeys', name: 'Leonida Keys Gun Room', town: 'Leonida Keys', expanded: false, tier: 1, x: -80, z: -320 },
  { id: 'vicebeach', name: 'Vice Beach Firearms', town: 'Vice Beach', expanded: false, tier: 2, x: 320, z: 160 },
  { id: 'laperle', name: 'La Perle Arms', town: 'Vice City', expanded: false, tier: 2, x: -80, z: 200 },
  { id: 'salton', name: 'Salton Gun Supply', town: 'Vice City', expanded: false, tier: 1, x: 160, z: 80 },
  { id: 'bayside', name: 'Bayside Outfitters', town: 'Vice City', expanded: false, tier: 1, x: 40, z: 240 },
  { id: 'southside', name: 'Southside Arms', town: 'Vice City', expanded: false, tier: 1, x: -200, z: -120 },
  { id: 'balsero', name: 'Balsero Gunworks', town: 'Vice City', expanded: false, tier: 1, x: 200, z: 40 },
  { id: 'decordistrict', name: 'Decor District Arms', town: 'Vice City', expanded: false, tier: 2, x: 0, z: 280 },
  { id: 'emeraldsprings', name: 'Emerald Springs Hunting', town: 'Emerald Springs', expanded: false, tier: 1, x: -280, z: 120 },
  { id: 'ambrosia2', name: 'Ambrosia Gun & Pawn', town: 'Ambrosia', expanded: false, tier: 1, x: -160, z: 280 },
];

// Chapter-tied tier unlocks: tier 1 from Chapter 1, tier 2 from Chapter 3,
// tier 3 (heavy / special) from Chapter 4.
export function tierUnlocked(chapter) {
  if (chapter >= 4) return 3;
  if (chapter >= 3) return 2;
  return 1;
}

export function createGunshops(G) {
  const S = {
    shops: GUN_SHOPS,
    // What this shop sells right now (chapter + shop tier limit it).
    stock(shopId) {
      const shop = GUN_SHOPS.find((s) => s.id === shopId);
      if (!shop) return [];
      const chapter = (G.missions.current && G.missions.current.ch) || 1;
      const maxTier = Math.min(shop.tier, tierUnlocked(chapter));
      return ALL_WEAPONS.filter((w) => (w.tier || 0) <= maxTier && (w.tier || 0) > 0 || (w.tier === 0 && shop.expanded));
    },
    nearestShop() {
      let best = null, bestD = 1e9;
      for (const s of GUN_SHOPS) {
        const d = Math.hypot(G.player.pos.x - s.x, G.player.pos.z - s.z);
        if (d < bestD) { bestD = d; best = s; }
      }
      return bestD < 25 ? best : null;
    },
    // Buy a weapon: cash, ownership, and the shopping challenges.
    buy(shopId, weaponId) {
      const w = WEAPON_BY_ID[weaponId];
      const shop = GUN_SHOPS.find((s) => s.id === shopId);
      if (!w || !shop) return { ok: false, reason: 'Unknown shop or weapon.' };
      if (G.weapons.has(weaponId)) return { ok: false, reason: 'You already own that.' };
      if (G.money < w.price) return { ok: false, reason: `You need $${w.price.toLocaleString()} — you have $${Math.floor(G.money).toLocaleString()}.` };
      G.money -= w.price;
      G.weapons.give(weaponId);
      G.stats.spentAtGunshops = (G.stats.spentAtGunshops || 0) + w.price;
      G.stats.weaponsBought = (G.stats.weaponsBought || 0) + 1;
      this.checkChallenges();
      G.audio.cash();
      G.hud.toast(`Bought ${w.name} for $${w.price.toLocaleString()}.`);
      return { ok: true, weapon: w };
    },
    // Buy reserve ammo for a weapon the player owns.
    buyAmmo(weaponId, rounds) {
      const w = WEAPON_BY_ID[weaponId];
      // Ownership = the collection (see buyAttachment).
      const owned = G.weapons.ownedAll ? G.weapons.ownedAll().includes(weaponId) : G.weapons.has(weaponId);
      if (!w || !owned) return { ok: false, reason: 'You do not own that weapon.' };
      if (w.capped === false) return { ok: false, reason: 'That weapon is uncapped — no ammo to buy.' };
      const cost = Math.ceil((rounds / 10) * 25);
      if (G.money < cost) return { ok: false, reason: `Ammo costs $${cost} — you have $${Math.floor(G.money).toLocaleString()}.` };
      G.money -= cost;
      G.weapons.ammo[weaponId] = (G.weapons.ammo[weaponId] || 0) + rounds;
      G.stats.spentAtGunshops = (G.stats.spentAtGunshops || 0) + cost;
      G.audio.cash();
      return { ok: true, cost, rounds };
    },
    // Buy an attachment (one of the 8 categories) for the active weapon.
    buyAttachment(weaponId, category) {
      if (!ATTACHMENT_CATEGORIES.includes(category)) return { ok: false, reason: 'Unknown attachment category.' };
      const w = WEAPON_BY_ID[weaponId];
      // Ownership = the collection, not the 5 wheel slots: a weapon you
      // own but are not currently carrying can still be fitted.
      const owned = G.weapons.ownedAll ? G.weapons.ownedAll().includes(weaponId) : G.weapons.has(weaponId);
      if (!w || !owned) return { ok: false, reason: 'You do not own that weapon.' };
      const cost = 800;
      if (G.money < cost) return { ok: false, reason: `Attachments cost $${cost}.` };
      G.money -= cost;
      G.stats.attachments = G.stats.attachments || {};
      G.stats.attachments[weaponId] = G.stats.attachments[weaponId] || [];
      if (G.stats.attachments[weaponId].includes(category)) return { ok: false, reason: 'Already fitted.' };
      G.stats.attachments[weaponId].push(category);
      G.stats.weaponsBought = (G.stats.weaponsBought || 0);
      this.checkChallenges();
      G.hud.toast(`${category} fitted to ${w.name}.`);
      return { ok: true, category };
    },
    // Shopping challenges (Bab 27): Well Armed (own 10 weapons),
    // Stylishly Armed (fit attachments to 5 weapons), Heavily Armed
    // (own a tier-3 weapon). Each pays a small bonus once.
    checkChallenges() {
      // Well Armed and Heavily Armed count the OWNED collection (every
      // weapon ever picked up), not the 5 wheel slots — ownedList() can
      // never exceed 5, so slot-based counts made both unreachable.
      const owned = G.weapons.ownedAll ? G.weapons.ownedAll().length : G.weapons.ownedList().length;
      const fitted = Object.keys(G.stats.attachments || {}).length;
      const heavy = (G.weapons.ownedAll ? G.weapons.ownedAll() : G.weapons.ownedList())
        .some((id) => (WEAPON_BY_ID[id].tier || 0) >= 3);
      const done = G.stats.shopChallenges || (G.stats.shopChallenges = {});
      if (!done.wellArmed && owned >= 10) {
        done.wellArmed = true;
        G.money += 1000;
        G.hud.toast('Challenge complete: WELL ARMED — +$1,000.');
      }
      if (!done.stylishlyArmed && fitted >= 5) {
        done.stylishlyArmed = true;
        G.money += 2000;
        G.hud.toast('Challenge complete: STYLISHLY ARMED — +$2,000.');
      }
      if (!done.heavilyArmed && heavy) {
        done.heavilyArmed = true;
        G.money += 5000;
        G.hud.toast('Challenge complete: HEAVILY ARMED — +$5,000.');
      }
    },
    // The green weapon locker (Bab 23): at Expanded stores, the player's
    // owned weapons are stored here — a loadout that survives death.
    // Returns the full owned collection, not just the 5 wheel slots.
    locker() {
      const ids = G.weapons.ownedAll ? G.weapons.ownedAll() : G.weapons.ownedList();
      return ids.map((id) => WEAPON_BY_ID[id].name);
    },
  };
  return S;
}
