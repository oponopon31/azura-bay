// weapons.js — The arsenal. 66 user-specified weapons + 3 coordinator-added
// Specials = 69 entries total. The four data tables (sidearms below, and
// longarms / melee / explosives / special in their own files) are the truth;
// this file is the engine: slots, switching, reload, recoil, and firing.
// Categories: Sidearm (pistols & revolvers) / Longarm (SMG, Shotgun, Rifle,
// LMG, Sniper, Heavy) / Melee / Explosive / Special.
// Slots: Sidearm, Melee, Primary, Secondary, Explosive — 5 slots total.
// Wheel: hold Tab → left = melee, right = sidearm, up = primary, down = explosive.
// Start loadouts: Jason ES9 (Eternal Star 9), Lucia K17 (Kalinga 17).
// NOTE: the user's arsenal has no minigun, a GTA staple. The Special category
// (Minigun / Railgun / Firework Launcher) is a COORDINATOR ADDITION, not user
// spec — vetoable. Delete weapons-special.js and the one import line below
// and the other 66 weapons keep working exactly as before.
// Bab 25 mechanics: revolvers and the pistol are uncapped (no mag limit,
// reload only); rifles have vertical recoil; throwing knives are thrown
// from the melee slot; the weapon wheel shows ammo and damage.
// Bab 21: Bloom — continuous fire makes each shot less accurate, so short
// bursts stay tight. Pistol whip (V): a pistol in the hand is also a club.

import { LONGARMS } from './weapons-longarms.js';
import { MELEE } from './weapons-melee.js';
import { EXPLOSIVES } from './weapons-explosives.js';
import { SPECIAL } from './weapons-special.js';

export const WEAPON_CATEGORIES = ['Sidearm', 'Longarm', 'Melee', 'Explosive', 'Special'];

// ---- Sidearms (16) ----
// Revolvers (`capped: false`) and the standard pistol are uncapped (Bab 25):
// no magazine limit — they reload by spinning the cylinder, not by a mag.
export const SIDEARMS = [
  { id: 'es9', name: 'Eternal Star 9', kind: 'pistol', damage: 25, rpm: 450, mag: 17, mode: 'semi', handling: 0.70, range: 60, recoil: 0.35, spread: 0.012, reloadMs: 1200, tracer: 0xffe9a8, price: 800, tier: 1, desc: 'The standard-issue sidearm — Jason’s start pistol.' },
  { id: 'k17', name: 'Kalinga 17', kind: 'pistol', damage: 24, rpm: 420, mag: 15, mode: 'semi', handling: 0.72, range: 60, recoil: 0.32, spread: 0.012, reloadMs: 1100, tracer: 0xffe9a8, price: 800, tier: 1, desc: 'A compact pistol — Lucia’s start pistol.' },
  { id: 'm19', name: 'M19', kind: 'pistol', damage: 27, rpm: 400, mag: 15, mode: 'semi', handling: 0.68, range: 62, recoil: 0.38, spread: 0.011, reloadMs: 1200, tracer: 0xffe9a8, price: 900, tier: 1, desc: 'A military pistol — reliable, accurate, and everywhere.' },
  { id: 'p12', name: 'P12', kind: 'pistol', damage: 26, rpm: 380, mag: 12, mode: 'semi', handling: 0.70, range: 62, recoil: 0.36, spread: 0.011, reloadMs: 1150, tracer: 0xffe9a8, price: 950, tier: 1, desc: 'A compact pistol — small, light, and quick to draw.' },
  { id: 'p45', name: 'P45', kind: 'pistol', damage: 32, rpm: 320, mag: 10, mode: 'semi', handling: 0.65, range: 65, recoil: 0.45, spread: 0.012, reloadMs: 1300, tracer: 0xffe9a8, price: 1100, tier: 1, desc: 'A heavy pistol — big bore, big holes.' },
  { id: 'ap', name: 'AP Pistol', kind: 'pistol', damage: 23, rpm: 750, mag: 18, mode: 'auto', handling: 0.68, range: 55, recoil: 0.42, spread: 0.018, reloadMs: 1400, tracer: 0xffe9a8, price: 1800, tier: 2, desc: 'An automatic pistol — hold the trigger and empty the mag.' },
  { id: 'hmk', name: 'HMK Machine Pistol', kind: 'pistol', damage: 20, rpm: 850, mag: 24, mode: 'auto', handling: 0.72, range: 50, recoil: 0.40, spread: 0.020, reloadMs: 1500, tracer: 0xffe9a8, price: 1600, tier: 2, desc: 'A machine pistol — a buzzsaw in a handgun’s body.' },
  { id: 'sawed', name: 'Sawed-off Pistol', kind: 'pistol', damage: 18, pellets: 5, rpm: 300, mag: 6, mode: 'semi', handling: 0.60, range: 30, recoil: 0.90, spread: 0.090, reloadMs: 1600, tracer: 0xffd27a, price: 1400, tier: 1, desc: 'A sawed-off pistol — a shotgun that fits in a holster.' },
  { id: 'pocket', name: 'Pocket Pistol', kind: 'pistol', damage: 20, rpm: 380, mag: 8, mode: 'semi', handling: 0.75, range: 45, recoil: 0.30, spread: 0.015, reloadMs: 1000, tracer: 0xffe9a8, price: 600, tier: 1, desc: 'A pocket pistol — the smallest gun in the case, and the easiest to hide.' },
  { id: 'scorp', name: 'Scorpion', kind: 'pistol', damage: 21, rpm: 800, mag: 20, mode: 'auto', handling: 0.70, range: 50, recoil: 0.45, spread: 0.019, reloadMs: 1400, tracer: 0xffe9a8, price: 1700, tier: 2, desc: 'A machine pistol — the Scorpion stings in bursts.' },
  { id: 'dual', name: 'Dual Pistols', kind: 'pistol', damage: 24, rpm: 500, mag: 30, mode: 'auto', handling: 0.65, range: 55, recoil: 0.40, spread: 0.016, reloadMs: 1500, tracer: 0xffe9a8, price: 2200, tier: 2, desc: 'Two pistols at once — twice the guns, twice the noise.' },
  { id: 'revolver50', name: 'Hawk & Little .50', kind: 'revolver', damage: 48, rpm: 120, mag: 6, mode: 'semi', capped: false, handling: 0.55, range: 75, recoil: 1.20, spread: 0.010, reloadMs: 2200, tracer: 0xffd27a, price: 2600, tier: 2, desc: 'A .50 revolver — six rounds, each one a conversation ender.' },
  { id: 'akulus', name: 'Akulus', kind: 'revolver', damage: 52, rpm: 110, mag: 6, mode: 'semi', capped: false, handling: 0.50, range: 78, recoil: 1.30, spread: 0.009, reloadMs: 2300, tracer: 0xffd27a, price: 3000, tier: 2, desc: 'A heavy revolver — the hardest-hitting handgun in the arsenal.' },
  { id: 'kalinga', name: 'Kalinga 48', kind: 'revolver', damage: 48, rpm: 130, mag: 6, mode: 'semi', capped: false, handling: 0.52, range: 76, recoil: 1.25, spread: 0.010, reloadMs: 2200, tracer: 0xffd27a, price: 2800, tier: 2, desc: 'A heavy revolver — the Kalinga 48 hits harder than any pistol in the case.' },
  { id: 'stungun', name: 'Stun Gun', kind: 'pistol', damage: 0, rpm: 120, mag: 1, mode: 'semi', stun: true, stunSecs: 5, handling: 0.75, range: 10, recoil: 0.10, spread: 0.005, reloadMs: 800, tracer: 0x7fd4ff, price: 1000, tier: 2, desc: 'A stun gun — drops a target to the ground, unharmed, for five seconds. Non-lethal.' },
  { id: 'flaregun', name: 'Flare Gun', kind: 'pistol', damage: 60, rpm: 60, mag: 1, mode: 'semi', handling: 0.60, range: 90, recoil: 0.80, spread: 0.008, reloadMs: 1500, fire: true, tracer: 0xff7a1a, price: 1200, tier: 2, desc: 'A flare gun — a burning flare that sets the target alight and signals for miles.' },
];

export const ALL_WEAPONS = [...SIDEARMS, ...LONGARMS, ...MELEE, ...EXPLOSIVES, ...SPECIAL];
export const WEAPON_BY_ID = {};
for (const w of ALL_WEAPONS) WEAPON_BY_ID[w.id] = w;

export const START_LOADOUT = { jason: 'es9', lucia: 'k17' };

function categoryOf(w) {
  if (w.kind === 'pistol' || w.kind === 'revolver') return 'Sidearm';
  if (['smg', 'shotgun', 'rifle', 'lmg', 'sniper', 'heavy'].includes(w.kind)) return 'Longarm';
  if (w.kind === 'melee') return 'Melee';
  if (w.kind === 'explosive') return 'Explosive';
  if (w.kind === 'special') return 'Special';
  return 'Sidearm';
}

// Which weapon slot a category lives in (wheel: up = primary, down = explosive).
const SLOT_FOR = { Sidearm: 'sidearm', Melee: 'melee', Longarm: 'primary', Explosive: 'explosive', Special: 'secondary' };

export function createWeapons(G) {
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
      who = who || G.player.who;
      const s = this.slots[who] || {};
      return ['melee', 'sidearm', 'primary', 'secondary', 'explosive']
        .map((k) => s[k]).filter(Boolean);
    },
    has(id, who) { return this.ownedList(who).includes(id); },
    // Every weapon the character has ever owned (the collection, not the
    // 5 wheel slots). Used by the shop challenges and the save file.
    ownedAll(who) {
      who = who || G.player.who;
      if (!this.owned[who]) this.owned[who] = [];
      return this.owned[who];
    },

    give(id) {
      const w = this.byId(id);
      if (!w) return false;
      const who = G.player.who;
      if (!this.slots[who]) this.setCharacter(who);
      const slot = SLOT_FOR[categoryOf(w)];
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
      G.hud.toast(`Picked up ${w.name}.`);
      G.audio.pickup();
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
      who = who || G.player.who;
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
        G.hud.toast('No reserve ammo — buy more at a gun store.');
        return;
      }
      if (this.magAmmo >= w.mag) return;
      this.reloading = true;
      this.reloadDoneAt = G.elapsed + w.reloadMs / 1000;
      G.audio.click?.();
    },

    toggleThrowMode() {
      // X switches the smoke/flash grenade between its two modes.
      this.throwMode = this.throwMode === 'smoke' ? 'flash' : 'smoke';
      G.hud.toast(`Grenade mode: ${this.throwMode === 'smoke' ? 'Smoke' : 'Flashbang'}.`);
    },

    detonateStickies() {
      G.combat.detonateStickies();
    },

    // Bab 25: the pistol is also a club — V pistol-whips the nearest target.
    pistolWhip() {
      const w = this.active();
      if (!w || (w.kind !== 'pistol' && w.kind !== 'revolver')) return;
      G.combat.meleeSwing({ damage: 20, range: 1.8, swingMs: 300, knockback: 2 });
    },

    // Bab 25: throwing knives are thrown from the melee slot (hold Q).
    throwKnife() {
      if (!this.has('knife')) return;
      G.combat.throwWeapon({ id: 'knife-thrown', damage: 30, range: 20, kind: 'explosive' });
    },

    // ---- Firing ----
    triggerDown() {
      const w = this.active();
      if (!w) return;
      this.fireHeld = true;
      const now = G.elapsed;
      if (w.kind === 'melee') {
        if (now - this.lastShotAt >= (w.swingMs || 400) / 1000) {
          this.lastShotAt = now;
          G.combat.meleeSwing(w);
        }
        return;
      }
      if (w.flame) {
        G.combat.fireFlame(w);
        return;
      }
      if (w.projectile) {
        if (now - this.lastShotAt < 60 / w.rpm) return;
        if (this.reloading) return;
        if (this.magAmmo <= 0) { this.startReload(); return; }
        this.magAmmo--;
        this.lastShotAt = now;
        G.combat.fireProjectile(w);
        return;
      }
      if (w.mode === 'throw') {
        if (now - this.lastShotAt < 60 / w.rpm) return;
        if (this.reloading) return;
        this.lastShotAt = now;
        G.combat.throwWeapon(w, this.throwMode);
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
        if (this.spinUp < 1) { G.audio.spinup?.(); return; }
      }
      if (this.reloading) return;
      if (now - this.lastShotAt < 60 / w.rpm) return;
      if (this.magAmmo <= 0) { this.startReload(); return; }
      this.magAmmo--;
      this.lastShotAt = now;
      this.bloom = Math.min(1, this.bloom + 0.12); // Bab 21 bloom
      this.lastFireTime = now;
      if (G.world) G.world.noteShotFired(w);
      G.combat.fireShot(w, this.charge);
    },

    triggerUp() {
      this.fireHeld = false;
      const w = this.active();
      if (w && w.mode === 'charge' && this.charge > 0.15) {
        // Railgun release: the charge shot, pierces everything in the line.
        if (this.magAmmo <= 0) { this.startReload(); this.charge = 0; return; }
        this.magAmmo--;
        this.lastShotAt = G.elapsed;
        G.combat.fireShot(w, this.charge);
      }
      this.charge = 0;
      this.spinUp = 0;
    },

    // Pick up a weapon lying on the ground (dropped by a cop / found in the world).
    tryPickup() {
      if (!G.world || !G.world.weaponDrops) return false;
      const drops = G.world.weaponDrops;
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        if (G.player.pos.distanceTo(d.pos) < 2) {
          G.scene.remove(d.mesh);
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
        if (G.elapsed - this.lastShotAt >= (w.swingMs || 400) / 1000) {
          this.lastShotAt = G.elapsed;
          G.combat.meleeSwing(w);
        }
      } else {
        G.combat.punch();
      }
    },

    update(dt) {
      const w = this.active();
      if (!w) return;
      // Reload completion.
      if (this.reloading && G.elapsed >= this.reloadDoneAt) {
        this.reloading = false;
        const mag = w.mag || 0;
        if (w.capped === false) {
          this.magAmmo = mag;
        } else {
          const take = Math.min(mag - this.magAmmo, this.ammo[w.id] || 0);
          this.ammo[w.id] = (this.ammo[w.id] || 0) - take;
          this.magAmmo += take;
        }
        G.audio.click?.();
      }
      // Auto fire while the trigger is held (auto weapons only).
      if (this.fireHeld && w.mode === 'auto' && !w.flame && !w.projectile && w.mode !== 'throw') {
        this.triggerDown();
      }
      // Bloom decays when not firing (Bab 21).
      if (G.elapsed - this.lastFireTime > 0.5) this.bloom = Math.max(0, this.bloom - dt * 2);
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
