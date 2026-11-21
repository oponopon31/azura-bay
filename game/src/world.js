// world.js — The catch-all world systems (SPEC Bab 17–28).
// Everything that is not a mission, a weapon, a shop or a radio:
// weapon bloom + shot tracking, car hit parts (free-aim from a car),
// body armor, weather, the Photo Studio (4 tabs), accessibility
// settings (which NEVER disable trophies/saves — unlike cheats),
// D-Pad Wardrobe + instant disguise, specialist workshops + Wink scan,
// Radio Scanner, Vehicle Tab, Focus Mode exploration, scuba, Fog of War
// hooks, Neighbour Favours, Joey, Paradise Taxi, fridge + pets, animal
// reputation, Settings (Always Run, HUD Compass, Lock-On Partial/Full/
// Free Aim), partner interactions (Bab 26), DualSense + Classic scheme,
// the military ramp, the hidden pistol in crowds, swim shooting, the
// Equipment Wheel (parachute + armor share one slot), and the gold
// weapon variants (130+, see variants.js).

import * as THREE from 'three';

export const WORKSHOPS = [
  { id: 'muscle', name: 'Muscle Car Workshop', specialty: 'muscle', x: 200, z: -40 },
  { id: 'tuning', name: 'Tuning Workshop', specialty: 'sports', x: 160, z: 120 },
  { id: 'donk', name: 'Donk Workshop', specialty: 'donk', x: -160, z: -120 },
  { id: 'offroad', name: 'Off-Road Workshop', specialty: 'offroad', x: -280, z: 80 },
  { id: 'luxury', name: 'Luxury Workshop', specialty: 'supercar', x: 80, z: 240 },
];

export function createWorld(G) {
  const W = {
    // ---- Combat helpers (called by combat.js / weapons.js) ----
    warningShots: false,   // toggled by the player: aim high = warn, not hit
    nonLethalMode: false,  // toggled: limb shots incapacitate, never kill
    weaponDrops: [],       // {id, pos, mesh} — weapons dropped in the world
    _bloom: 0,
    bloom() { return Math.max(this._bloom, G.weapons ? G.weapons.bloom : 0); },
    // Called on every shot: bloom grows with sustained fire, decays at rest.
    noteShotFired(w) {
      this._bloom = Math.min(1, this._bloom + 0.08);
      this._lastShotAt = G.elapsed;
      // Open longarm on the street: NPCs panic and report to police.
      if (w && ['smg', 'shotgun', 'rifle', 'lmg', 'sniper', 'heavy'].includes(w.kind)) {
        G.pedestrians.panicNearby?.(G, 20);
      }
    },
    updateBloom(dt) {
      if (G.elapsed - (this._lastShotAt || 0) > 0.5) this._bloom = Math.max(0, this._bloom - dt * 1.5);
    },
    // Bab 25 free-aim from a car window: which part of the car did the
    // shot hit? Front third = engine, low sides = tires, rear = tank,
    // cabin = driver. Returns 'engine' | 'tire' | 'tank' | 'driver' | 'body'.
    carHitPart(car, point) {
      const local = car.mesh.worldToLocal(point.clone());
      const len = 4.6; // approx car length
      if (local.z > len * 0.3) return 'engine';
      if (local.z < -len * 0.3) return 'tank';
      if (Math.abs(local.x) > 0.9 && local.y < 0.5) return 'tire';
      if (local.y > 0.8) return 'driver';
      return 'body';
    },
    // Drop a weapon on the ground (cops drop theirs when disarmed).
    dropWeapon(id, pos) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.12, 0.18),
        new THREE.MeshBasicMaterial({ color: 0x333333 })
      );
      mesh.position.copy(pos);
      mesh.position.y = 0.2;
      G.scene.add(mesh);
      this.weaponDrops.push({ id, pos: pos.clone(), mesh });
    },
    // ---- Body armor (Bab 3 cheat + police trunk loot) ----
    armor: 0,
    addBodyArmor(n) {
      this.armor = Math.min(100, this.armor + n);
      G.hud.toast(`Body armor: ${this.armor}%.`);
    },
    // ---- Weather (Bab 3 Cycle Weather cheat) ----
    weather: 'clear',
    cycleWeather() {
      const order = ['clear', 'rain', 'storm', 'fog'];
      const i = order.indexOf(this.weather);
      this.weather = order[(i + 1) % order.length];
      G.hud.toast(`Weather: ${this.weather}.`);
      return this.weather;
    },
    // ---- Radio Scanner (Bab 20): hear police sweep reports ----
    scannerOn: false,
    scannerReport() {
      if (!this.scannerOn) return null;
      const stars = G.police.stars;
      if (stars === 0) return 'Scanner: all quiet. No units in the area.';
      return `Scanner: ${stars} star${stars > 1 ? 's' : ''} — sweep radius ${stars * 80}m, roadblocks ${G.police.roadblocks ? 'active' : 'none'}, they know: ${G.police.memory ? 'your face, your clothes, your plate' : 'a description'}.`;
    },
    // ---- Vehicle Tab (Bab 20): hold Radio, swipe to Vehicles ----
    vehicleTab: { hazards: false, headlights: 'auto', engineOn: true, windows: 'up', trunkOpen: false },
    setVehicleTab(patch) {
      Object.assign(this.vehicleTab, patch);
      return this.vehicleTab;
    },
    // ---- Focus Mode (Bab 20): L3+R3 outside combat, no time limit ----
    focusMode: false,
    focusHighlights() {
      // What Focus Mode highlights: interactive (yellow), cash (green),
      // animal tracks, safe codes on wall notes, door status
      // (white = openable, red = alarmed).
      if (!this.focusMode) return [];
      const out = [];
      if (G.collectibles) {
        const n = G.collectibles.nearest('flamingos');
        if (n && n.dist < 60) out.push({ kind: 'collectible', x: n.x, z: n.z, color: 'yellow' });
      }
      return out;
    },
    // ---- Scuba (Bab 20): instant scuba gear from a boat in open water ----
    scuba: false,
    oxygen: 100,
    enterScuba() {
      if (!G.player.car || G.player.car.kind !== 'boat') return { ok: false, reason: 'Get on a boat in open water first.' };
      this.scuba = true;
      this.oxygen = 100;
      G.hud.toast('Scuba gear on — dive for sunken treasure. Watch the oxygen.');
      return { ok: true };
    },
    updateScuba(dt) {
      if (!this.scuba) return;
      this.oxygen -= dt * 1.2;
      if (this.oxygen <= 0) {
        this.scuba = false;
        G.player.health -= 10;
        G.hud.toast('Out of oxygen! Get to the surface!');
      }
    },
    // ---- Photo Studio (Bab 22): 4 tabs from the Pause menu ----
    photoSettings: { tab: 'Camera', speed: 1, grid: false, roll: 0, fov: 60, dof: 0, aperture: 2.8, focusDist: 10, aspect: '16:9', hideCharacter: false, lights: [] },
    renderPhotoStudio(el) {
      const s = this.photoSettings;
      const tabs = ['Camera', 'Effects', 'Lighting', 'Overlays'];
      let body = '';
      if (s.tab === 'Camera') {
        body = `Camera Speed: ${s.speed}x · Grid: ${s.grid ? 'on' : 'off'} · Roll: ${s.roll}°<br>FOV: ${s.fov} · Depth of Field: ${s.dof} · Aperture: f/${s.aperture} · Focus: ${s.focusDist}m<br>Aspect: ${s.aspect} (16:9 / 1:1 / 9:16)<br><br><button data-photo="fov+" style="margin:2px;padding:6px 10px">FOV +</button><button data-photo="fov-" style="margin:2px;padding:6px 10px">FOV −</button><button data-photo="aspect" style="margin:2px;padding:6px 10px">Cycle aspect</button><button data-photo="hide" style="margin:2px;padding:6px 10px">${s.hideCharacter ? 'Show character' : 'Hide character'}</button>`;
      } else if (s.tab === 'Effects') {
        body = `Effects: Depth of Field blur, Aperture, Focus Distance — set on the Camera tab.<br><br>Screen filters (16, from cheats): ${G.cheats ? Object.keys(G.cheats.active).filter((id) => id.startsWith('filter')).join(', ') || 'none active' : 'none'}`;
      } else if (s.tab === 'Lighting') {
        body = `Lighting Layers: ${s.lights.length} placed (Spotlight / Floodlight / Softbox).<br><br><button data-photo="light-spot" style="margin:2px;padding:6px 10px">Add Spotlight</button><button data-photo="light-flood" style="margin:2px;padding:6px 10px">Add Floodlight</button><button data-photo="light-soft" style="margin:2px;padding:6px 10px">Add Softbox</button>`;
      } else {
        body = `Overlays: grid, aspect guides, and the Snapmatic GTA 7 joke poster.<br><br><button data-photo="snap" style="margin:2px;padding:6px 10px">Take the photo</button>`;
      }
      el.innerHTML = `<h3 style="color:#ffd23f;letter-spacing:2px">PHOTO STUDIO</h3><div style="display:flex;gap:4px;margin:8px 0">${tabs.map((t) => `<button data-tab="${t}" style="padding:5px 10px;background:${t === s.tab ? '#ffd23f' : 'rgba(255,255,255,0.08)'};color:${t === s.tab ? '#111' : '#eee'};border:1px solid rgba(255,255,255,0.2);border-radius:6px;cursor:pointer">${t}</button>`).join('')}</div><div>${body}</div><div style="margin-top:8px;color:#9fb8c8;font-size:11px">O closes · works even mid-cutscene</div>`;
      el.querySelectorAll('button[data-tab]').forEach((b) => {
        b.addEventListener('click', () => { s.tab = b.dataset.tab; this.renderPhotoStudio(el); });
      });
      el.querySelectorAll('button[data-photo]').forEach((b) => {
        b.addEventListener('click', () => {
          const a = b.dataset.photo;
          if (a === 'fov+') s.fov = Math.min(110, s.fov + 5);
          else if (a === 'fov-') s.fov = Math.max(30, s.fov - 5);
          else if (a === 'aspect') s.aspect = s.aspect === '16:9' ? '1:1' : s.aspect === '1:1' ? '9:16' : '16:9';
          else if (a === 'hide') s.hideCharacter = !s.hideCharacter;
          else if (a.startsWith('light-')) s.lights.push(a.slice(6));
          else if (a === 'snap') this.takePhoto();
          this.renderPhotoStudio(el);
        });
      });
    },
    takePhoto() {
      G.hud.toast('Photo saved to Snapmatic.');
      if (G.stats) G.stats.photos = (G.stats.photos || 0) + 1;
      return true;
    },
    // ---- Accessibility (Bab 22): NEVER disables trophies/saves ----
    accessibility: {
      accessibleCombat: false, reducedVehicleDamage: false,
      simplifiedMinigames: false, highContrast: false,
      colorblindFocus: false, largeText: false, mapIconColors: false,
      centerDot: false, narration: false, fullCaptions: false,
    },
    setAccessibility(key, value) {
      if (key in this.accessibility) {
        this.accessibility[key] = value;
        G.hud.toast(`Accessibility: ${key} ${value ? 'on' : 'off'} — trophies & saves still active.`);
        return true;
      }
      return false;
    },
    // ---- D-Pad Wardrobe + instant disguise (Bab 21) ----
    wardrobe: { hoodie: 'down', hat: 'forward', glasses: false },
    setWardrobe(patch) {
      Object.assign(this.wardrobe, patch);
      return this.wardrobe;
    },
    // Sunglasses + hat, out of police sight: defeats Appearance
    // Recognition without changing the whole outfit.
    instantDisguise() {
      if (G.police.seenNow) { G.hud.toast('Too late — they are looking at you right now.'); return false; }
      this.wardrobe.glasses = true;
      this.wardrobe.hat = 'forward';
      if (G.police.clearMemory) G.police.clearMemory();
      G.hud.toast('Disguise on — sunglasses + hat. Appearance Recognition beaten.');
      return true;
    },
    // ---- Specialist workshops + Wink scan (Bab 21) ----
    workshopFor(car) {
      const cat = car.model ? (G.vehicleDb ? (G.vehicleDb.byName(car.model) || {}).cat : null) : null;
      if (cat === 'muscle') return WORKSHOPS[0];
      if (cat === 'sports' || cat === 'supercar') return WORKSHOPS[1];
      if (cat === 'offroad') return WORKSHOPS[3];
      if (cat === 'supercar') return WORKSHOPS[4];
      return WORKSHOPS[1]; // Tuning is the default
    },
    winkScan(car) {
      if (!car) return null;
      return {
        model: car.model || car.kind,
        locked: car.securityTier > 0,
        alarm: car.securityTier >= 2,
        tracker: !!car.tracker,
        fuel: Math.round(car.fuel * 100),
        workshop: this.workshopFor(car).name,
      };
    },
    // ---- Settings (Bab 25) ----
    settings: {
      alwaysRun: false, hudCompass: false, lockOn: 'Partial',
      killCam: true, crashCam: true, controlScheme: 'default',
      speedLimiter: false, lightBar: true, triggerResistance: 0.5,
    },
    setSetting(key, value) {
      if (key in this.settings) { this.settings[key] = value; return true; }
      return false;
    },
    // ---- Partner interactions (Bab 26) ----
    partner: { closeness: 40, holdingHands: false },
    holdHands(on) {
      this.partner.holdingHands = on;
      if (on) this.partner.closeness = Math.min(100, this.partner.closeness + 1);
      return this.partner.holdingHands;
    },
    chivalry() {
      // Hold Triangle/Y near your own car: open the passenger door.
      if (!G.player.car) { G.hud.toast('Get near your own car first.'); return false; }
      this.partner.closeness = Math.min(100, this.partner.closeness + 2);
      G.hud.toast('You open the passenger door for your partner. Chivalry lives.');
      return true;
    },
    offerFood() {
      this.partner.closeness = Math.min(100, this.partner.closeness + 3);
      G.hud.toast('You offer food and a drink. They take it — closeness up.');
      return true;
    },
    askOut() {
      this.partner.closeness = Math.min(100, this.partner.closeness + 5);
      G.hud.toast('You ask your partner out — a date, a drive, a job together.');
      return true;
    },
    chatPartner() {
      G.hud.showDialog(G.player.who === 'lucia' ? 'JASON' : 'LUCIA', 'We\'re good. We\'re always good. Now drive.', 5000);
      this.partner.closeness = Math.min(100, this.partner.closeness + 1);
      return true;
    },
    // ---- Neighbour Favours, Joey, Paradise Taxi (Bab 23) ----
    neighbourFavour() {
      const favours = [
        'Help a neighbour carry groceries — +$50 and a smile.',
        'A neighbour\'s cat is stuck on the roof. You get it down.',
        'Jump-start a neighbour\'s car — they owe you one.',
      ];
      const f = favours[Math.floor(Math.random() * favours.length)];
      G.money += 50;
      G.hud.toast(`Neighbour favour: ${f}`);
      return f;
    },
    callJoey() {
      // Joey: the phone contact who clears your wanted level (for a price).
      if (G.police.stars === 0) { G.hud.toast('Joey: you\'re clean already. Save it for when you need it.'); return false; }
      const cost = G.police.stars * 500;
      if (G.money < cost) { G.hud.toast(`Joey wants $${cost} to make this go away.`); return false; }
      G.money -= cost;
      G.police.heat = 0;
      G.police.stars = 0;
      G.hud.toast(`Joey made a call — the heat is off. -$${cost}.`);
      return true;
    },
    paradiseTaxi() {
      if (G.money < 100) { G.hud.toast('Paradise Taxi needs $100.'); return false; }
      G.money -= 100;
      G.player.pos.set(300, 0, 300);
      G.hud.toast('Paradise Taxi dropped you at Ocean Beach — $100.');
      return true;
    },
    // ---- Fridge + pets (Bab 23) ----
    fridge: { food: 5, drinks: 5 },
    eatFromFridge() {
      if (this.fridge.food <= 0) { G.hud.toast('The fridge is empty.'); return false; }
      this.fridge.food--;
      G.player.health = Math.min(G.player.maxHealth, G.player.health + 20);
      if (G.attributes) G.attributes.eat(G.player.who, 600);
      G.hud.toast('Ate from the fridge — +20 health.');
      return true;
    },
    pets: { dog: false, cat: false },
    adoptPet(kind) {
      if (!['dog', 'cat'].includes(kind)) return false;
      this.pets[kind] = true;
      G.hud.toast(`Adopted a ${kind} — it waits for you at the safehouse.`);
      return true;
    },
    // ---- Animal reputation (Bab 23): petting dogs/cats, feeding wildlife ----
    animalRep: 0,
    petAnimal(kind) {
      this.animalRep = Math.min(100, this.animalRep + 2);
      if (G.attributes) G.attributes.focusActivity(G.player.who, 'kindness');
      G.hud.toast(`You pet the ${kind}. Animal reputation up (${this.animalRep}).`);
      return this.animalRep;
    },
    // ---- Hide in Car (Bab 18): crouch in the back seat — police sight
    // cannot find the player while hidden (police.js reads this flag). ----
    hiddenInCar: false,
    hideInCar(on) {
      if (!G.player.car) { G.hud.toast('Get in a car first.'); return false; }
      this.hiddenInCar = !!on;
      G.hud.toast(on ? 'Hidden in the back seat — they cannot see you.' : 'You sit up again.');
      return this.hiddenInCar;
    },
    // ---- Military ramp (Bab 26): a gentle slope into the base ----
    militaryRamp: { x: -320, z: -320, note: 'A gentle ramp into the military base — no jump needed.' },
    // ---- Hidden pistol in crowds (Bab 26) ----
    hiddenPistol() {
      // In a crowd, a pistol stays hidden — no panic, no police report.
      const crowd = G.peds ? G.peds.filter((p) => p.alive && p.pos.distanceTo(G.player.pos) < 15).length : 0;
      return crowd >= 5;
    },
    // ---- Swim shooting (Bab 26): allowed while swimming ----
    swimShooting: true,
    // ---- Equipment Wheel (Bab 23): parachute + armor share one slot ----
    equipment: { parachute: false, armor: 0 },
    equipParachute() {
      if (this.equipment.armor > 0) { G.hud.toast('One slot: parachute OR armor — the armor stays, the chute does not fit.'); return false; }
      this.equipment.parachute = true;
      G.hud.toast('Parachute equipped (Equipment Wheel).');
      return true;
    },
    update(dt) {
      this.updateBloom(dt);
      this.updateScuba(dt);
    },
  };
  return W;
}
