// weapons.js — The arsenal. 66 user-specified weapons + 3 coordinator-added
// Specials = 69 entries total. The four data tables (sidearms below, and
// longarms / melee / explosives / special in their own files) are the truth;
// this file is the engine: slots, switching, reload, recoil, and firing.
// Categories: Sidearm (pistols & revolvers) / Longarm (SMG, Shotgun, Rifle,
// LMG, Sniper, Heavy) / Melee / Explosive / Special.
// Slots: Sidearm, Melee, Primary, Secondary, Explosive — 5 slots total.
// Wheel: hold Tab → left = melee, right = sidearm, up = primary, down = explosive.
// Start loadouts: Jason ES9 (Girardi ES9), Lucia K17 (Klose K17).
// NOTE: the user's arsenal has no minigun, a GTA staple. The Special category
// (Minigun / Railgun / Firework Launcher) is a COORDINATOR ADDITION, not user
// spec — vetoable. Delete weapons-special.js and the one import line below
// and the other 66 weapons keep working exactly as before.
// Bab 25 mechanics: revolvers and the pistol are uncapped (no mag limit,
// reload only); rifles have vertical recoil; throwing knives are thrown
// from the melee slot; the weapon wheel shows ammo and damage.
// Bab 21: Bloom — continuous fire makes each shot less accurate, so short
// bursts stay tight. Pistol whip (V): a pistol in the hand is also a club.
// Round 5: sidearm rows re-expressed one field per line, the category
// helper renamed, Game replaces G. Values unchanged.

import { SPECIAL } from './weapons-special.js';
import { EXPLOSIVES } from './weapons-explosives.js';
import { MELEE } from './weapons-melee.js';
import { LONGARMS } from './weapons-longarms.js';

export const WEAPON_CATEGORIES = ['Sidearm', 'Longarm', 'Melee', 'Explosive', 'Special'];

// ---- Sidearms (16) ----
// Revolvers (`capped: false`) and the standard pistol are uncapped (Bab 25):
// no magazine limit — they reload by spinning the cylinder, not by a mag.
export const SIDEARMS = [
  {
    id: 'nipper',
    name: 'Scorpio Nipper .38',
    kind: 'revolver',
    damage: 28,
    rpm: 150,
    mag: 6,
    mode: 'semi',
    capped: false,
    handling: 0.78,
    range: 65,
    recoil: 0.85,
    spread: 0.013,
    reloadMs: 1900,
    tracer: 0xffd27a,
    price: 1100,
    tier: 1,
    desc: 'A compact lightweight .38 — small, light, and quick to draw.',
  },
  {
    id: 'es9',
    name: 'Girardi ES9',
    kind: 'pistol',
    damage: 25,
    rpm: 450,
    mag: 17,
    mode: 'semi',
    handling: 0.70,
    range: 60,
    recoil: 0.35,
    spread: 0.012,
    reloadMs: 1200,
    tracer: 0xffe9a8,
    price: 800,
    tier: 1,
    desc: 'The standard-issue sidearm — Jason’s start pistol.',
  },
  {
    id: 'k17',
    name: 'Klose K17',
    kind: 'pistol',
    damage: 24,
    rpm: 420,
    mag: 15,
    mode: 'semi',
    handling: 0.72,
    range: 60,
    recoil: 0.32,
    spread: 0.012,
    reloadMs: 1100,
    tracer: 0xffe9a8,
    price: 800,
    tier: 1,
    desc: 'A compact polymer 9mm — Lucia’s start pistol.',
  },
  {
    id: 'duke1992',
    name: 'Duke Arms 1992',
    kind: 'pistol',
    damage: 27,
    rpm: 380,
    mag: 8,
    mode: 'semi',
    handling: 0.68,
    range: 62,
    recoil: 0.45,
    spread: 0.011,
    reloadMs: 1300,
    tracer: 0xffe9a8,
    price: 1000,
    tier: 1,
    desc: 'A heavy M1911-style pistol — all steel, all business.',
  },
  {
    id: 'es18',
    name: 'Girardi ES18',
    kind: 'pistol',
    damage: 26,
    rpm: 600,
    mag: 18,
    mode: 'burst',
    handling: 0.74,
    range: 58,
    recoil: 0.42,
    spread: 0.016,
    reloadMs: 1400,
    tracer: 0xffe9a8,
    price: 2100,
    tier: 2,
    desc: 'A burst-fire pistol — three rounds per pull, tight as a drum.',
  },
  {
    id: 'k17mcd',
    name: 'Klose K17 MCD',
    kind: 'pistol',
    damage: 20,
    rpm: 850,
    mag: 24,
    mode: 'auto',
    handling: 0.72,
    range: 50,
    recoil: 0.40,
    spread: 0.020,
    reloadMs: 1500,
    tracer: 0xffe9a8,
    price: 2400,
    tier: 2,
    desc: 'A full-auto machine pistol — 24 rounds, hold the trigger and empty it.',
  },
  {
    id: 'drx',
    name: 'Schlamm DRX',
    kind: 'pistol',
    damage: 26,
    rpm: 360,
    mag: 12,
    mode: 'semi',
    handling: 0.88,
    range: 70,
    recoil: 0.30,
    spread: 0.010,
    reloadMs: 1200,
    tracer: 0xffe9a8,
    price: 2600,
    tier: 2,
    desc: 'A tactical precision pistol — the most accurate handgun in the case.',
  },
  {
    id: 'kalinga50',
    name: 'Fairview Kalinga .50',
    kind: 'pistol',
    damage: 50,
    rpm: 130,
    mag: 6,
    mode: 'semi',
    handling: 0.55,
    range: 75,
    recoil: 1.15,
    spread: 0.010,
    reloadMs: 2200,
    tracer: 0xffd27a,
    price: 4200,
    tier: 2,
    desc: 'A big-bore Desert Eagle-style .50 — the hardest-hitting pistol in the arsenal.',
  },
  {
    id: 'stungun',
    name: 'Coil Shocker',
    kind: 'pistol',
    damage: 0,
    rpm: 120,
    mag: 1,
    mode: 'semi',
    stun: true,
    stunSecs: 5,
    handling: 0.75,
    range: 10,
    recoil: 0.10,
    spread: 0.005,
    reloadMs: 800,
    tracer: 0x7fd4ff,
    price: 1000,
    tier: 2,
    desc: 'An electric stun gun — drops a target to the ground, unharmed, for five seconds. Non-lethal.',
  },
  {
    id: 'wcr1',
    name: 'Wortham WCR-1',
    kind: 'revolver',
    damage: 32,
    rpm: 150,
    mag: 5,
    mode: 'semi',
    capped: false,
    handling: 0.95,
    range: 60,
    recoil: 0.70,
    spread: 0.012,
    reloadMs: 1800,
    tracer: 0xffd27a,
    price: 2200,
    tier: 2,
    desc: 'A snub-nose revolver — the best-handling wheelgun in the case.',
  },
  {
    id: 'hawk38',
    name: 'Hawk & Little .38',
    kind: 'revolver',
    damage: 30,
    rpm: 150,
    mag: 6,
    mode: 'semi',
    capped: false,
    handling: 0.72,
    range: 68,
    recoil: 0.75,
    spread: 0.011,
    reloadMs: 1900,
    tracer: 0xffd27a,
    price: 1300,
    tier: 1,
    desc: 'A classic double-action .38 revolver — old school, always works.',
  },
  {
    id: 'mustang357',
    name: 'Duke Mustang .357',
    kind: 'revolver',
    damage: 40,
    rpm: 140,
    mag: 6,
    mode: 'semi',
    capped: false,
    handling: 0.66,
    range: 72,
    recoil: 1.00,
    spread: 0.010,
    reloadMs: 2000,
    tracer: 0xffd27a,
    price: 2800,
    tier: 2,
    desc: 'A .357 magnum revolver — heavy, loud, and very final.',
  },
  {
    id: 'morgan',
    name: 'Hawk & Little Morgan',
    kind: 'revolver',
    damage: 44,
    rpm: 120,
    mag: 6,
    mode: 'semi',
    capped: false,
    handling: 0.58,
    range: 76,
    recoil: 1.10,
    spread: 0.010,
    reloadMs: 2100,
    tracer: 0xffd27a,
    price: 3200,
    tier: 2,
    desc: 'A big special revolver — the Morgan hits like a freight train.',
  },
  {
    id: 'akulus',
    name: 'Scorpio Akulus',
    kind: 'revolver',
    damage: 52,
    rpm: 110,
    mag: 6,
    mode: 'semi',
    capped: false,
    handling: 0.50,
    range: 78,
    recoil: 1.30,
    spread: 0.009,
    reloadMs: 2300,
    tracer: 0xffd27a,
    price: 3000,
    tier: 2,
    desc: 'A heavy long-barrel revolver — the hardest-hitting revolver in the arsenal.',
  },
  {
    id: 'capo',
    name: 'Capo Pistol',
    kind: 'pistol',
    damage: 25,
    rpm: 420,
    mag: 14,
    mode: 'semi',
    handling: 0.70,
    range: 60,
    recoil: 0.35,
    spread: 0.012,
    reloadMs: 1200,
    tracer: 0xffe9a8,
    price: 900,
    tier: 1,
    desc: 'A classic cartel-style pistol — old, reliable, and everywhere.',
  },
  {
    id: 'service',
    name: 'Beretta-style Service Pistol',
    kind: 'pistol',
    damage: 24,
    rpm: 400,
    mag: 15,
    mode: 'semi',
    handling: 0.72,
    range: 62,
    recoil: 0.33,
    spread: 0.011,
    reloadMs: 1150,
    tracer: 0xffe9a8,
    price: 850,
    tier: 1,
    desc: 'A standard service pistol — the duty sidearm, plain and dependable.',
  },
];

export const ALL_WEAPONS = [...SIDEARMS, ...LONGARMS, ...MELEE, ...EXPLOSIVES, ...SPECIAL];
export const WEAPON_BY_ID = {};
for (const w of ALL_WEAPONS) WEAPON_BY_ID[w.id] = w;

export const START_LOADOUT = { jason: 'es9', lucia: 'k17' };

function kindCategory(w) {
  if (w.kind === 'pistol' || w.kind === 'revolver') return 'Sidearm';
  if (['smg', 'shotgun', 'rifle', 'lmg', 'sniper', 'heavy'].includes(w.kind)) return 'Longarm';
  if (w.kind === 'melee') return 'Melee';
  if (w.kind === 'explosive') return 'Explosive';
  if (w.kind === 'special') return 'Special';
  return 'Sidearm';
}

// Which weapon slot a category lives in (wheel: up = primary, down = explosive).
const SLOT_FOR = { Sidearm: 'sidearm', Melee: 'melee', Longarm: 'primary', Explosive: 'explosive', Special: 'secondary' };

export function createWeapons(Game) {
  const W = {
    // who -> { sidearm, melee, primary, secondary, explosive } (weapon ids)
    slots: {},
    // who -> [weapon ids] — EVERY weapon the character has ever owned.
    // The 5 slots only hold one weapon each, so ownedList() can never
    // exceed 5; the shop challenges (Well Armed: own 10) must count this
    // collection instead, or they can never trigger.
    owned: {},
    current: null, // weapon id
    ammo: {},      // id -> reserve ammo (uncapped weapons ignore this)
    magAmmo: 0,    // rounds in the current magazine
    reloading: false,
    throwMode: 'smoke', // smoke/flash for the smoke-flash grenade (X switches)
    lastShotAt: 0,
    fireHeld: false,
    charge: 0,     // railgun charge (0–1)
    spinUp: 0,     // minigun spin-up (0–1)
    bloom: 0,      // Bab 21 bloom: sustained fire widens spread
    lastFireTime: 0,

    setCharacter(who) {
      if (!this.slots[who]) {
        // Start loadout: each character starts with their own pistol.
        this.slots[who] = {
          sidearm: START_LOADOUT[who] || 'es9',
          melee: null, primary: null, secondary: null, explosive: null,
        };
        this.ammo[START_LOADOUT[who]] = 60;
        this.owned[who] = [START_LOADOUT[who] || 'es9'];
      }
      // Equip the character's sidearm if nothing is in hand yet.
      if (!this.current) this.equip(this.slots[who].sidearm, who);
    },

    byId(id) { return WEAPON_BY_ID[id] || null; },
    active() { return this.byId(this.current); },
    // Weapons the player owns for the CURRENT character, in wheel order.
    ownedList(who) {
      who = who || Game.player.who;
      const s = this.slots[who] || {};
      return ['melee', 'sidearm', 'primary', 'secondary', 'explosive']
        .map((k) => s[k]).filter(Boolean);
    },
    has(id, who) { return this.ownedList(who).includes(id); },
    // Every weapon the character has ever owned (the collection, not the
    // 5 wheel slots). Used by the shop challenges and the save file.
    ownedAll(who) {
      who = who || Game.player.who;
      if (!this.owned[who]) this.owned[who] = [];
      return this.owned[who];
    },

    give(id) {
      const w = this.byId(id);
      if (!w) return false;
      const who = Game.player.who;
      if (!this.slots[who]) this.setCharacter(who);
      const slot = SLOT_FOR[kindCategory(w)];
      this.slots[who][slot] = id;
      // Record the collection (a weapon leaves the slot when another one
      // of the same category is picked up, but it stays owned).
      if (!this.owned[who]) this.owned[who] = [];
      if (!this.owned[who].includes(id)) this.owned[who].push(id);
      // Reserve ammo on pickup (uncapped weapons don't need it).
      if (w.capped !== false && w.mag) {
        this.ammo[id] = (this.ammo[id] || 0) + w.mag * 2;
      }
      if (!this.current) this.equip(id, who);
      Game.hud.toast(`Picked up ${w.name}.`);
      Game.audio.pickup();
      return true;
    },

    equip(id, who) {
      const w = this.byId(id);
      if (!w || !this.has(id, who)) return false;
      this.current = id;
      // Loading a mag from reserve; uncapped weapons load the full mag.
      const mag = w.mag || 0;
      if (w.capped === false) {
        this.magAmmo = mag;
      } else {
        const take = Math.min(mag, this.ammo[id] || 0);
        this.ammo[id] = (this.ammo[id] || 0) - take;
        this.magAmmo = take;
      }
      this.reloading = false;
      this.charge = 0;
      this.spinUp = 0;
      this.bloom = 0;
      return true;
    },

    equipSlot(slotName, who) {
      who = who || Game.player.who;
      const s = this.slots[who];
      if (!s || !s[slotName]) return false;
      return this.equip(s[slotName], who);
    },

    // Cycle to the next owned weapon (wheel key / number keys).
    next() {
      const list = this.ownedList();
      if (list.length < 2) return;
      const i = list.indexOf(this.current);
      this.equip(list[(i + 1) % list.length]);
    },

    startReload() {
      const w = this.active();
      if (!w || this.reloading || !w.mag) return;
      if (w.capped !== false && (this.ammo[w.id] || 0) <= 0) {
        Game.hud.toast('No reserve ammo — buy more at a gun store.');
        return;
      }
      if (this.magAmmo >= w.mag) return;
      this.reloading = true;
      this.reloadDoneAt = Game.elapsed + w.reloadMs / 1000;
      Game.audio.click?.();
    },

    toggleThrowMode() {
      // X switches the smoke/flash grenade between its two modes.
      this.throwMode = this.throwMode === 'smoke' ? 'flash' : 'smoke';
      Game.hud.toast(`Grenade mode: ${this.throwMode === 'smoke' ? 'Smoke' : 'Flashbang'}.`);
    },

    detonateStickies() {
      Game.combat.detonateStickies();
    },

    // Bab 25: the pistol is also a club — V pistol-whips the nearest target.
    pistolWhip() {
      const w = this.active();
      if (!w || (w.kind !== 'pistol' && w.kind !== 'revolver')) return;
      Game.combat.meleeSwing({ damage: 20, range: 1.8, swingMs: 300, knockback: 2 });
    },

    // Bab 25: throwing knives are thrown from the melee slot (hold Q).
    // Round 4: the thrown knife is a runtime projectile, not a table entry — its { id: 'knife-thrown' } literal must never be counted as a 70th weapon.
    throwKnife() {
      if (!this.has('knife')) return;
      Game.combat.throwWeapon({ id: 'knife-thrown', damage: 30, range: 20, kind: 'explosive' });
    },

    // ---- Firing ----
    triggerDown() {
      const w = this.active();
      if (!w) return;
      this.fireHeld = true;
      const now = Game.elapsed;
      if (w.kind === 'melee') {
        if (now - this.lastShotAt >= (w.swingMs || 400) / 1000) {
          this.lastShotAt = now;
          Game.combat.meleeSwing(w);
        }
        return;
      }
      if (w.flame) {
        Game.combat.fireFlame(w);
        return;
      }
      if (w.projectile) {
        if (now - this.lastShotAt < 60 / w.rpm) return;
        if (this.reloading) return;
        if (this.magAmmo <= 0) { this.startReload(); return; }
        this.magAmmo--;
        this.lastShotAt = now;
        Game.combat.fireProjectile(w);
        return;
      }
      if (w.mode === 'throw') {
        if (now - this.lastShotAt < 60 / w.rpm) return;
        if (this.reloading) return;
        this.lastShotAt = now;
        Game.combat.throwWeapon(w, this.throwMode);
        return;
      }
      if (w.mode === 'charge') {
        // Railgun: hold to charge, release to fire (triggerUp does it).
        this.charge = Math.min(1, this.charge + 1 / 60);
        return;
      }
      if (w.spinUp !== undefined) {
        // Minigun: spin up first, then fire at full rate.
        this.spinUp = Math.min(1, this.spinUp + 1 / 60);
        if (this.spinUp < 1) { Game.audio.spinup?.(); return; }
      }
      if (this.reloading) return;
      if (now - this.lastShotAt < 60 / w.rpm) return;
      if (this.magAmmo <= 0) { this.startReload(); return; }
      // Burst-fire (Girardi ES18, SPEC §2a): one pull fires three rounds,
      // each spending one round from the magazine.
      const burst = w.mode === 'burst' ? 3 : 1;
      for (let i = 0; i < burst && this.magAmmo > 0; i++) {
        this.magAmmo--;
        this.bloom = Math.min(1, this.bloom + 0.12); // Bab 21 bloom
        if (Game.world) Game.world.noteShotFired(w);
        Game.combat.fireShot(w, this.charge);
      }
      this.lastShotAt = now;
      this.lastFireTime = now;
    },

    triggerUp() {
      this.fireHeld = false;
      const w = this.active();
      if (w && w.mode === 'charge' && this.charge > 0.15) {
        // Railgun release: the charge shot, pierces everything in the line.
        if (this.magAmmo <= 0) { this.startReload(); this.charge = 0; return; }
        this.magAmmo--;
        this.lastShotAt = Game.elapsed;
        Game.combat.fireShot(w, this.charge);
      }
      this.charge = 0;
      this.spinUp = 0;
    },

    // Pick up a weapon lying on the ground (dropped by a cop / found in the world).
    tryPickup() {
      if (!Game.world || !Game.world.weaponDrops) return false;
      const drops = Game.world.weaponDrops;
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        if (Game.player.pos.distanceTo(d.pos) < 2) {
          Game.scene.remove(d.mesh);
          drops.splice(i, 1);
          this.give(d.id);
          return true;
        }
      }
      return false;
    },

    // Melee in the hand: tryMelee is what the melee key calls.
    tryMelee() {
      const w = this.active();
      if (w && w.kind === 'melee') {
        if (Game.elapsed - this.lastShotAt >= (w.swingMs || 400) / 1000) {
          this.lastShotAt = Game.elapsed;
          Game.combat.meleeSwing(w);
        }
      } else {
        Game.combat.punch();
      }
    },

    update(dt) {
      const w = this.active();
      if (!w) return;
      // Reload completion.
      if (this.reloading && Game.elapsed >= this.reloadDoneAt) {
        this.reloading = false;
        const mag = w.mag || 0;
        if (w.capped === false) {
          this.magAmmo = mag;
        } else {
          const take = Math.min(mag - this.magAmmo, this.ammo[w.id] || 0);
          this.ammo[w.id] = (this.ammo[w.id] || 0) - take;
          this.magAmmo += take;
        }
        Game.audio.click?.();
      }
      // Auto fire while the trigger is held (auto weapons only).
      if (this.fireHeld && w.mode === 'auto' && !w.flame && !w.projectile && w.mode !== 'throw') {
        this.triggerDown();
      }
      // Bloom decays when not firing (Bab 21).
      if (Game.elapsed - this.lastFireTime > 0.5) this.bloom = Math.max(0, this.bloom - dt * 2);
      // Minigun spin-down when the trigger is released.
      if (w.spinUp === undefined && this.spinUp > 0) this.spinUp = Math.max(0, this.spinUp - dt * 2);
    },

    // ---- Save / load: the owned collection (slots themselves are NOT
    // saved — a load restores the start loadout, as in round 1) ----
    serialize() {
      return { owned: this.owned };
    },
    restore(data) {
      if (!data || !data.owned) return;
      for (const who of Object.keys(data.owned)) {
        const ids = data.owned[who].filter((id) => this.byId(id));
        if (ids.length) this.owned[who] = ids;
      }
    },
  };
  return W;
}

// ---- Round 3: weapon math helpers ----
// Damage per second at full fire rate (guns) or full swing speed (melee);
// blast weapons rate their burst over the fuse, burn weapons rate 0 here
// (their damage is burnDps, not a direct hit).
export function weaponDps(id) {
  const w = WEAPON_BY_ID[id];
  if (!w) return 0;
  if (w.swingMs) return Math.round((w.damage * 1000) / w.swingMs);
  if (w.blastDamage && !w.damage) return Math.round(w.blastDamage / Math.max(0.5, w.fuse || 2.5));
  return Math.round((w.damage * (w.rpm || 0)) / 60);
}

// All weapon ids in one tier (0 street, 1 early, 2 mid, 3 end-game).
export function weaponsInTier(tier) {
  return ALL_WEAPONS.filter((w) => w.tier === tier).map((w) => w.id);
}
