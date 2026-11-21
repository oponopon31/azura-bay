// weapons.js — Weapon data + the inventory / switching / firing system.
//
// Data is organised as one table per category inside WEAPON_CATEGORIES, so a
// new category (rifles, shotguns, …) is just one more table — nothing here is
// hard-coded to sidearms. Every weapon is a structured object with the same
// fields; stats are my own design, following the brief for each gun:
//   damage  — health damage per hit (a foot cop has 100)
//   rpm     — rounds per minute (the fire interval is 60/rpm seconds)
//   mag     — rounds in one magazine
//   mode    — 'semi' (one shot per pull), 'burst' (N shots per pull), 'auto'
//   handling— 0..1: higher means less spread, faster reload, quicker recovery
//   range   — effective range in metres
//   recoil  — camera kick per shot
//   spread  — base spread in radians
//   reloadMs— base reload time (handling shortens it)
//   stun    — true for the shocker: incapacitates instead of killing

import * as THREE from 'three';
import { LONGARMS } from './weapons-longarms.js';
import { MELEE } from './weapons-melee.js';
import { EXPLOSIVES } from './weapons-explosives.js';
import { SPECIAL } from './weapons-special.js';

export const WEAPON_CATEGORIES = {
  // ---- Sidearms: pistols and revolvers (including the stun gun) ----
  sidearms: [
    { id: 'nipper', name: 'Scorpio Nipper .38', kind: 'pistol', damage: 16, rpm: 420, mag: 10, mode: 'semi', handling: 0.92, range: 50, recoil: 0.30, spread: 0.016, reloadMs: 1000, tracer: 0xffe9a8, price: 400, tier: 0, desc: 'A featherweight pocket pistol — fast in the hand, light on punch.' },
    { id: 'es9', name: 'Girardi ES9', kind: 'pistol', damage: 22, rpm: 360, mag: 15, mode: 'semi', handling: 0.78, range: 70, recoil: 0.50, spread: 0.012, reloadMs: 1300, tracer: 0xffe9a8, price: 600, tier: 0, desc: "Jason's everyday sidearm — plain, reliable, honest." },
    { id: 'k17', name: 'Klose K17', kind: 'pistol', damage: 21, rpm: 380, mag: 17, mode: 'semi', handling: 0.82, range: 70, recoil: 0.45, spread: 0.011, reloadMs: 1200, tracer: 0xffe9a8, price: 650, tier: 0, desc: "Lucia's polymer 9mm — light, quick, and always where she left it." },
    { id: 'duke1992', name: 'Duke Arms 1992', kind: 'pistol', damage: 32, rpm: 240, mag: 8, mode: 'semi', handling: 0.62, range: 65, recoil: 0.80, spread: 0.014, reloadMs: 1500, tracer: 0xffd27a, price: 1100, tier: 1, desc: 'A heavy steel slab in the old style — every round lands like a door slamming.' },
    { id: 'es18', name: 'Girardi ES18', kind: 'pistol', damage: 20, rpm: 540, mag: 18, mode: 'burst', burst: 3, handling: 0.72, range: 65, recoil: 0.55, spread: 0.014, reloadMs: 1400, tracer: 0xffe9a8, price: 1500, tier: 1, desc: 'Three-round bursts — one trigger pull, three arguments.' },
    { id: 'k17mcd', name: 'Klose K17 MCD', kind: 'pistol', damage: 18, rpm: 780, mag: 24, mode: 'auto', handling: 0.66, range: 60, recoil: 0.60, spread: 0.020, reloadMs: 1600, tracer: 0xffe9a8, price: 2200, tier: 2, desc: 'The K17 with the fun switch on — a 24-round hose.' },
    { id: 'drx', name: 'Schlamm DRX', kind: 'pistol', damage: 26, rpm: 300, mag: 12, mode: 'semi', handling: 0.88, range: 90, recoil: 0.45, spread: 0.006, reloadMs: 1300, tracer: 0xbfd9ff, price: 1800, tier: 1, desc: 'A tactical pistol built for tight groups — the most precise handgun in the case.' },
    { id: 'kalinga', name: 'Fairview Kalinga .50', kind: 'pistol', damage: 48, rpm: 150, mag: 7, mode: 'semi', handling: 0.50, range: 80, recoil: 1.40, spread: 0.016, reloadMs: 1700, tracer: 0xff9a3c, price: 3500, tier: 2, desc: 'A hand cannon in .50 — the hardest-hitting pistol money buys. It kicks like a mule.' },
    { id: 'shocker', name: 'Coil Shocker', kind: 'stun', damage: 0, rpm: 200, mag: 6, mode: 'semi', handling: 0.80, range: 25, recoil: 0.20, spread: 0.010, reloadMs: 1200, stun: true, stunSecs: 5, tracer: 0x7fd4ff, price: 900, tier: 1, desc: 'A crackling stun gun — drops a target to the ground without killing them.' },
    { id: 'wcr1', name: 'Wortham WCR-1', kind: 'revolver', damage: 24, rpm: 300, mag: 6, mode: 'semi', handling: 0.96, range: 55, recoil: 0.50, spread: 0.012, reloadMs: 900, tracer: 0xffe9a8, price: 800, tier: 0, desc: 'A snub-nose revolver that handles like a thought — the quickest draw in the drawer.' },
    { id: 'hawk38', name: 'Hawk & Little .38', kind: 'revolver', damage: 26, rpm: 240, mag: 6, mode: 'semi', handling: 0.78, range: 60, recoil: 0.60, spread: 0.013, reloadMs: 1800, tracer: 0xffe9a8, price: 700, tier: 0, desc: 'A classic double-action wheelgun — old, plain, and always ready.' },
    { id: 'mustang', name: 'Duke Mustang .357', kind: 'revolver', damage: 38, rpm: 180, mag: 6, mode: 'semi', handling: 0.62, range: 70, recoil: 1.00, spread: 0.014, reloadMs: 2000, tracer: 0xffd27a, price: 2000, tier: 1, desc: 'A .357 magnum with a bark to match its bite.' },
    { id: 'morgan', name: 'Hawk & Little Morgan', kind: 'revolver', damage: 34, rpm: 200, mag: 6, mode: 'semi', handling: 0.66, range: 75, recoil: 0.90, spread: 0.013, reloadMs: 1900, tracer: 0xffd27a, price: 1700, tier: 1, desc: 'An oversized revolver built for big hands and bigger statements.' },
    { id: 'akulus', name: 'Scorpio Akulus', kind: 'revolver', damage: 52, rpm: 120, mag: 6, mode: 'semi', handling: 0.45, range: 90, recoil: 1.60, spread: 0.015, reloadMs: 2400, tracer: 0xff9a3c, price: 3200, tier: 2, desc: 'A long-barrelled heavyweight — the hardest-hitting revolver in the case. One round ends the conversation.' },
    { id: 'capo', name: 'Capo Pistol', kind: 'pistol', damage: 24, rpm: 330, mag: 12, mode: 'semi', handling: 0.72, range: 65, recoil: 0.55, spread: 0.013, reloadMs: 1300, tracer: 0xffe9a8, price: 1000, tier: 0, desc: 'A cartel classic — engraved, loud, and never far from its owner.' },
    { id: 'service', name: 'Service Pistol', kind: 'pistol', damage: 20, rpm: 360, mag: 15, mode: 'semi', handling: 0.80, range: 70, recoil: 0.45, spread: 0.012, reloadMs: 1300, tracer: 0xffe9a8, price: 850, tier: 0, desc: 'A Beretta-style service pistol — the standard-issue sidearm of the Leonida police.' },
  ],
  // Longarms (37), melee (9) and explosives (4) live in their own tables so
  // each category can grow without touching this file.
  longarms: LONGARMS,
  melee: MELEE,
  explosives: EXPLOSIVES,
  // *** Kategori Special = tambahan koordinator, BUKAN spesifikasi user — bisa di-veto. ***
  special: SPECIAL,
};

// Flat lookup: id -> weapon def (built from every category table).
// Each def also gets its category stamped on as `cat`.
export const WEAPON_BY_ID = {};
for (const [cat, list] of Object.entries(WEAPON_CATEGORIES)) {
  for (const w of list) { w.cat = cat; WEAPON_BY_ID[w.id] = w; }
}
export const CATEGORY_ORDER = Object.keys(WEAPON_CATEGORIES);

// Starting loadout per character: Jason opens with the ES9, Lucia with the K17.
export const START_LOADOUT = { jason: 'es9', lucia: 'k17' };

// World pickups: a few sidearms are found lying around the city; the rest are
// earned from mission rewards (missions call W.give(id)).
const PICKUP_SPOTS = [
  { weapon: 'nipper', x: -80, z: 360, label: 'Beach pier' },
  { weapon: 'duke1992', x: 210, z: 250, label: 'Garage' },
  { weapon: 'wcr1', x: 40, z: 40, label: 'Central park' },
  { weapon: 'hawk38', x: 400, z: 40, label: 'Harbor' },
  { weapon: 'capo', x: 80, z: -80, label: 'Downtown alley' },
  { weapon: 'service', x: -80, z: 280, label: 'Safehouse' },
];

export function createWeapons(G) {
  const W = {
    byId: WEAPON_BY_ID, // flat id -> def lookup (used by the HUD + self-test)
    who: 'jason',
    owned: { jason: [START_LOADOUT.jason], lucia: [START_LOADOUT.lucia] },
    current: { jason: START_LOADOUT.jason, lucia: START_LOADOUT.lucia },
    magAmmo: {},        // weapon id -> rounds currently in the magazine
    reloading: false,
    reloadUntil: 0,
    lastShotAt: 0,
    burstLeft: 0,
    burstNextAt: 0,
    triggerHeld: false,
    triggerDownAt: 0,
    charging: false,     // railgun charge shot in progress
    chargeStart: 0,
    spunUp: false,       // minigun spin-up complete
    spinUpStart: 0,
    lastSwingAt: 0,      // melee swing timer
    throwMode: 'smoke',  // smoke/flashbang grenade mode (X toggles)
    pickups: [],

    active() {
      return WEAPON_BY_ID[this.current[this.who]];
    },
    ownedList() {
      // Owned weapons in category order (sidearms first, then later categories).
      const ids = this.owned[this.who];
      const order = [];
      for (const cat of CATEGORY_ORDER) {
        for (const w of WEAPON_CATEGORIES[cat]) if (ids.includes(w.id)) order.push(w);
      }
      return order;
    },
    has(id) { return this.owned[this.who].includes(id); },

    give(id, who) {
      const owner = who || this.who;
      if (!WEAPON_BY_ID[id]) return false;
      if (!this.owned[owner].includes(id)) this.owned[owner].push(id);
      this.magAmmo[id] = WEAPON_BY_ID[id].mag;
      return true;
    },
    giveAll(who) {
      for (const id of Object.keys(WEAPON_BY_ID)) this.give(id, who || this.who);
    },

    equip(id) {
      if (!this.has(id)) return false;
      this.current[this.who] = id;
      this.burstLeft = 0;
      this.reloading = false;
      const w = WEAPON_BY_ID[id];
      if (this.magAmmo[id] === undefined) this.magAmmo[id] = w.mag;
      G.hud.toast(`${w.name} — ${w.mode === 'auto' ? 'full-auto' : w.mode === 'burst' ? `burst ×${w.burst}` : 'semi-auto'}`);
      return true;
    },
    equipSlot(n) {
      const list = this.ownedList();
      if (n >= 1 && n <= list.length) return this.equip(list[n - 1].id);
      return false;
    },
    next() {
      const list = this.ownedList();
      if (list.length < 2) return;
      const i = list.findIndex((w) => w.id === this.current[this.who]);
      this.equip(list[(i + 1) % list.length].id);
    },
    setCharacter(who) {
      if (who !== 'jason' && who !== 'lucia') return;
      this.who = who;
      this.burstLeft = 0;
      this.reloading = false;
      this.triggerHeld = false;
    },

    // ---- Firing (dispatch by weapon kind) ----
    triggerDown() {
      if (G.mode !== 'playing') return;
      const w = this.active();
      this.triggerHeld = true;
      this.triggerDownAt = performance.now();
      if (w.kind === 'melee') { this.tryMelee(); return; }
      if (w.kind === 'explosive') { this.tryThrow(); return; }
      if (w.mode === 'charge') { this.charging = true; this.chargeStart = performance.now(); return; }
      if (w.mode === 'burst') {
        this.burstLeft = w.burst;
        this.burstNextAt = performance.now();
      } else {
        this.tryFire();
      }
    },
    triggerUp() {
      this.triggerHeld = false;
      // Railgun: release fires the charged shot (damage scales with charge).
      const w = this.active();
      if (this.charging && w.mode === 'charge') {
        this.charging = false;
        const charge = Math.min(1, (performance.now() - this.chargeStart) / 800);
        if (charge > 0.15) this.tryFire(charge);
      }
      this.charging = false;
    },
    // One trigger pull for a firearm / launcher / flamethrower.
    // `charge` (railgun) scales the damage 0.5–1.0.
    tryFire(charge) {
      if (G.mode !== 'playing' || this.reloading) return false;
      const w = this.active();
      if (w.kind === 'melee' || w.kind === 'explosive') return false;
      const now = performance.now();
      // Minigun: spin up before the first round leaves the barrel.
      if (w.spinUp && !this.spunUp) {
        if (!this.spinUpStart) this.spinUpStart = now;
        if (now - this.spinUpStart < w.spinUp * 1000) { G.audio.spinup?.(); return false; }
        this.spunUp = true;
      }
      const interval = 60000 / w.rpm;
      if (now - this.lastShotAt < interval) return false;
      if ((this.magAmmo[w.id] ?? w.mag) <= 0) { this.startReload(); return false; }
      this.lastShotAt = now;
      this.magAmmo[w.id]--;
      if (w.flame) G.combat.fireFlame(w);
      else if (w.projectile) G.combat.fireProjectile(w);
      else G.combat.fireShot(w, charge);
      if (this.magAmmo[w.id] <= 0) this.startReload();
      return true;
    },
    // Melee swing: arc in front of the player, no ammo.
    tryMelee() {
      if (G.mode !== 'playing') return false;
      const w = this.active();
      const now = performance.now();
      const interval = w.swingMs || 400;
      if (now - this.lastSwingAt < interval) return false;
      this.lastSwingAt = now;
      G.combat.meleeSwing(w);
      return true;
    },
    // Throw an explosive (frag / sticky / molotov / smoke-flash).
    tryThrow() {
      if (G.mode !== 'playing') return false;
      const w = this.active();
      const now = performance.now();
      if (now - this.lastShotAt < 60000 / w.rpm) return false;
      if ((this.magAmmo[w.id] ?? 0) <= 0) {
        G.hud.toast(`No ${w.name} left — buy more at the gun store.`);
        return false;
      }
      this.lastShotAt = now;
      this.magAmmo[w.id]--;
      G.combat.throwWeapon(w, this.throwMode);
      return true;
    },
    // Smoke/flashbang mode toggle (X key).
    toggleThrowMode() {
      const w = this.active();
      if (!w.modes) return;
      this.throwMode = this.throwMode === 'smoke' ? 'flash' : 'smoke';
      G.hud.toast(`${w.name}: ${this.throwMode === 'smoke' ? 'Smoke' : 'Flashbang'} mode`);
    },
    // Detonate all placed sticky bombs (G key).
    detonateStickies() {
      G.combat.detonateStickies();
    },
    startReload() {
      if (this.reloading) return;
      const w = this.active();
      if (w.kind === 'melee' || w.kind === 'explosive') return;
      if ((this.magAmmo[w.id] ?? w.mag) >= w.mag) return;
      this.reloading = true;
      // Higher handling reloads faster.
      const ms = w.reloadMs * (1.25 - w.handling * 0.5);
      this.reloadUntil = performance.now() + ms;
      G.hud.toast('Reloading…');
    },
    update(dt) {
      // Burst fire: spaced shots after one trigger pull.
      if (this.burstLeft > 0 && performance.now() >= this.burstNextAt) {
        if (this.tryFire()) {
          this.burstLeft--;
          this.burstNextAt = performance.now() + 60000 / this.active().rpm;
        } else {
          this.burstLeft = 0;
        }
      }
      // Full-auto (and flamethrower / minigun): keep firing while held.
      const w = this.active();
      if (this.triggerHeld && (w.mode === 'auto' || w.flame)) this.tryFire();
      // Minigun spin-down when the trigger is released.
      if (!this.triggerHeld) { this.spunUp = false; this.spinUpStart = 0; }
      // Reload completion.
      if (this.reloading && performance.now() >= this.reloadUntil) {
        this.reloading = false;
        const aw = this.active();
        this.magAmmo[aw.id] = aw.mag;
      }
      this.updatePickups(dt);
    },

    // ---- World pickups ----
    spawnPickups() {
      for (const spot of PICKUP_SPOTS) {
        const w = WEAPON_BY_ID[spot.weapon];
        const group = new THREE.Group();
        const crate = new THREE.Mesh(
          new THREE.BoxGeometry(1.1, 0.55, 0.7),
          new THREE.MeshLambertMaterial({ color: 0x2e2a26 })
        );
        crate.position.y = 0.28;
        const stripe = new THREE.Mesh(
          new THREE.BoxGeometry(1.12, 0.12, 0.72),
          new THREE.MeshLambertMaterial({ color: 0xffc247, emissive: 0x664400 })
        );
        stripe.position.y = 0.5;
        const gun = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 0.12, 0.16),
          new THREE.MeshLambertMaterial({ color: 0x1a1a1a })
        );
        gun.position.y = 0.68;
        group.add(crate, stripe, gun);
        group.position.set(spot.x, 0, spot.z);
        G.scene.add(group);
        this.pickups.push({ weapon: spot.weapon, label: spot.label, mesh: group, pos: new THREE.Vector3(spot.x, 0, spot.z), taken: false });
      }
    },
    updatePickups(dt) {
      for (const p of this.pickups) {
        if (p.taken) continue;
        p.mesh.rotation.y += dt * 0.6;
        p.mesh.position.y = Math.sin(G.elapsed * 2 + p.pos.x) * 0.08;
      }
    },
    nearestPickup() {
      for (const p of this.pickups) {
        if (p.taken) continue;
        if (Math.hypot(p.pos.x - G.player.pos.x, p.pos.z - G.player.pos.z) < 3) return p;
      }
      return null;
    },
    collectPickup(p) {
      if (p.taken) return;
      p.taken = true;
      G.scene.remove(p.mesh);
      this.give(p.weapon);
      this.equip(p.weapon);
      G.audio.pickup();
      G.hud.toast(`Picked up ${WEAPON_BY_ID[p.weapon].name} (${p.label})`);
    },
    // E key: grab a nearby world pickup if one is in reach.
    tryPickup() {
      const p = this.nearestPickup();
      if (!p) return false;
      this.collectPickup(p);
      return true;
    },
  };

  // Start each character with a full magazine.
  for (const who of ['jason', 'lucia']) W.magAmmo[START_LOADOUT[who]] = WEAPON_BY_ID[START_LOADOUT[who]].mag;
  W.spawnPickups();
  return W;
}
