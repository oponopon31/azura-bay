// police.js — The wanted system: heat and stars, police cars that chase and ram,
// foot cops, roadblocks and the helicopter at 3+ stars, plus busted/wasted.
// Bab 12: Heat is the police memory — outfit, vehicle, weapon, partner — and
// stars have five states (hollow / solid / blinking / red / 6-star manhunt).
// Bab 21: at 1–2 stars the police order the player to surrender first.
// At 1–2 stars the police order a surrender first — Y surrenders, and the
// order comes before the shooting.
// Round 5: mesh builders renamed (makeCopMesh / makeHeliMesh), the cop
// uniform material renamed, Game replaces G. Behaviour unchanged.

import { makeCar } from './vehicles.js';
import { WANTED, starsFromHeat, policeCarCount, helicopterAt, CITY_HALF, PITCH, GRID, onRoad, nearestRoad } from './config.js';
import * as THREE from 'three';

function makeHeliMesh() {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshLambertMaterial({ color: 0x223344 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.4, 4.6), bodyMat);
  body.castShadow = true;
  g.add(body);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 1.4),
    new THREE.MeshLambertMaterial({ color: 0x88bbdd }));
  glass.position.set(0, 0.3, 1.8);
  g.add(glass);
  const rotorGeo = new THREE.BoxGeometry(9, 0.08, 0.5);
  const rotor = new THREE.Mesh(rotorGeo, new THREE.MeshLambertMaterial({ color: 0x111111 }));
  rotor.position.y = 1.0;
  g.add(rotor);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 3.4), bodyMat);
  tail.position.set(0, 0.2, -3.8);
  g.add(tail);
  const spot = new THREE.SpotLight(0xfff2c0, 0, 90, 0.35, 0.4);
  spot.position.set(0, -0.8, 0);
  g.add(spot);
  g.add(spot.target);
  return { group: g, rotor, spot };
}

function makeCopMesh() {
  const g = new THREE.Group();
  const copUniform = new THREE.MeshLambertMaterial({ color: 0x1a2f5e });
  const skin = new THREE.MeshLambertMaterial({ color: 0xd9a066 });
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.75, 0.36), copUniform);
  torso.position.y = 1.18; torso.castShadow = true;
  g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), skin);
  head.position.y = 1.78; head.castShadow = true;
  g.add(head);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.1, 12), copUniform);
  cap.position.y = 1.98;
  g.add(cap);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.24), copUniform);
  legL.position.set(-0.15, 0.42, 0);
  g.add(legL);
  const legR = legL.clone(); legR.position.x = 0.15;
  g.add(legR);
  return g;
}

export function createPolice(Game) {
  const P = {
    heat: 0,
    stars: 0,
    cops: [],          // foot cops {mesh,pos,heading,health,alive,shootCooldown,bustedTimer}
    heli: null,        // {group,rotor,spot,pos,health}
    roadblocks: [],    // {mesh,x,z}
    lastSeen: 0,       // time the player was last seen by any police
    lastSeenPos: null,  // where the player was last seen (the search area)
    seenNow: false,
    bustedTimer: 0,
    spawnCooldown: 0,
    // Bab 12 Heat memory: what the police remember about the player.
    memory: { outfit: null, vehicle: null, weapon: null, partner: false, cctv: false },
    starState: 'none', // hollow | solid | blinking | red | six
    surrenderOffered: false,
    escapes3Star: 0,   // counted for the Raise Heat Level cheat unlock

    addHeat(amount, why) {
      if (Game.mode !== 'playing') return;
      if (amount <= 0) return;
      const before = this.stars;
      this.heat = Math.min(WANTED.maxHeat, this.heat + amount);
      this.stars = starsFromHeat(this.heat);
      if (this.stars > before) {
        Game.hud.toast(`Wanted level up — ${this.stars} star${this.stars > 1 ? 's' : ''}!`);
        Game.audio.blip(440, 0.2, 'square', 0.12);
      }
      this.lastSeen = Game.elapsed;
      Game.stats.crimes++;
    },

    // Bab 12: the police remember the current outfit / vehicle / weapon.
    // Changing them after the stars clear breaks recognition.
    rememberClues() {
      this.memory.outfit = Game.wardrobe ? Game.wardrobe.currentOutfit() : 'default';
      this.memory.vehicle = Game.player.car ? Game.player.car.model : null;
      this.memory.weapon = Game.weapons ? Game.weapons.active().id : null;
      this.memory.partner = !!(Game.stats.partnerNearby);
    },
    // Recognition check: same outfit + same car after the stars clear =
    // the police spot the player again ("RECOGNIZED").
    checkRecognition() {
      if (this.stars > 0) return false;
      const sameOutfit = this.memory.outfit && this.memory.outfit === (Game.wardrobe ? Game.wardrobe.currentOutfit() : 'default');
      const sameCar = this.memory.vehicle && Game.player.car && Game.player.car.model === this.memory.vehicle;
      if ((sameOutfit || sameCar) && Game.police.cops.some((c) => c.alive && c.pos.distanceTo(Game.player.pos) < 25)) {
        Game.hud.toast('RECOGNIZED! The police remember that outfit / car!');
        this.addHeat(20, 'recognized by police');
        return true;
      }
      return false;
    },
    // Bab 12 escape routes: change clothes (via the car trunk), disguise,
    // swap cars, Pay 'n' Spray, call Joey, or loot a police trunk.
    clearMemory(why) {
      this.memory = { outfit: null, vehicle: null, weapon: null, partner: false, cctv: false };
      Game.hud.toast(`Heat memory cleared — ${why}.`);
    },
    lootPoliceTrunk() {
      const pc = Game.cars.find((c) => c.driver === 'police' && c.pos.distanceTo(Game.player.pos) < 6);
      if (!pc) { Game.hud.toast('No police car nearby to loot.'); return false; }
      Game.hud.toast('Police trunk looted: Body Armor + shotgun shells.');
      if (Game.weapons) { Game.weapons.give('morland850'); Game.weapons.magAmmo.morland850 = 6; }
      if (Game.world) Game.world.addBodyArmor(50);
      return true;
    },

    // Line of sight from any police unit to the player (distance-based).
    // Hiding rule: on foot and off the road (in a park, a yard, the beach),
    // the player is hidden unless a unit is right on top of them (< 12 m).
    // That is what makes losing the cops possible.
    anyPoliceSeesPlayer() {
      const p = Game.player.pos;
      // Smoke: standing inside a smoke cloud hides the player from every unit.
      if (Game.combat) {
        for (const cloud of Game.combat.smokeClouds) {
          if (Math.hypot(p.x - cloud.pos.x, p.z - cloud.pos.z) < cloud.radius) return false;
        }
      }
      // Hide in Car (Bab 18): ducked down in the car, the police eye passes over.
      if (Game.world && Game.world.hiddenInCar) return false;
      const hidden = Game.player.onFoot && !onRoad(p.x, p.z);
      for (const car of Game.cars) {
        if (car.driver === 'police') {
          const d = car.pos.distanceTo(p);
          if (d < 70 && (!hidden || d < 12)) return true;
        }
      }
      for (const cop of this.cops) {
        if (cop.alive) {
          const d = cop.pos.distanceTo(p);
          if (d < 40 && (!hidden || d < 12)) return true;
        }
      }
      if (this.heli && !Game.player.onFoot && this.heli.pos.distanceTo(p) < 120) return true;
      return false;
    },

    update(dt) {
      // Heat decays only after being unseen for a while.
      this.seenNow = this.anyPoliceSeesPlayer();
      if (this.seenNow) {
        this.lastSeen = Game.elapsed;
        if (!this.lastSeenPos) this.lastSeenPos = new THREE.Vector3();
        this.lastSeenPos.copy(Game.player.pos);
      }
      if (this.stars > 0 && Game.elapsed - this.lastSeen > WANTED.decayDelay) {
        this.heat = Math.max(0, this.heat - WANTED.decayRate * dt);
        const s = starsFromHeat(this.heat);
        if (s < this.stars) {
          Game.hud.toast('The heat is cooling off…');
          if (s === 0 && this.stars >= 3) { this.escapes3Star++; this.rememberClues(); }
        }
        this.stars = s;
        if (this.stars === 0) this.checkRecognition();
      }
      // Star state (Bab 12): hollow while merely reported, solid while seen,
      // blinking while out of sight, red while the area is being searched.
      this.starState = this.stars <= 0 ? 'none'
        : this.seenNow ? 'solid'
        : (Game.elapsed - this.lastSeen < 4 ? 'blinking' : 'red');
      // Surrender (Bab 21): at 1–2 stars the police order the player to
      // give up before they open fire.
      if ((this.stars === 1 || this.stars === 2) && !this.surrenderOffered && this.seenNow) {
        this.surrenderOffered = true;
        Game.hud.toast('Police: "Hands up! Surrender now!" (press Y to give up)');
        Game.hud.showDialog('VCPD', '"Put your hands up and this ends clean. Keep running and it ends worse."', 5000);
      }
      if (this.stars === 0) this.surrenderOffered = false;
      // Speeding past a police car adds a little heat (close and very fast only).
      if (Game.player.inCar && Game.player.speed > 30) {
        for (const car of Game.cars) {
          if (car.driver === 'police' && car.pos.distanceTo(Game.player.pos) < 12) {
            this.heat = Math.min(WANTED.maxHeat, this.heat + 2 * dt);
            this.stars = starsFromHeat(this.heat);
            this.lastSeen = Game.elapsed;
          }
        }
      }
      this.maintainUnits(dt);
      this.updatePoliceCars(dt);
      this.updateCops(dt);
      this.updateHeli(dt);
      // Siren volume follows the nearest police car.
      let siren = 0;
      if (this.stars > 0) {
        let nearest = 1e9;
        for (const car of Game.cars) {
          if (car.driver === 'police') nearest = Math.min(nearest, car.pos.distanceTo(Game.player.pos));
        }
        siren = nearest < 1e8 ? Math.max(0.15, 1 - nearest / 120) : 0.3;
      }
      Game.audio.setSiren(siren);
    },

    // Bab 21 surrender: give up at 1–2 stars — a fine, no chase, story continues.
    surrender() {
      if (this.stars < 1 || this.stars > 2) { Game.hud.toast('Too hot to surrender now.'); return false; }
      const fine = Math.min(Game.money, 150);
      Game.money -= fine;
      this.heat = 0;
      this.stars = 0;
      this.starState = 'none';
      Game.hud.toast(`You surrendered. Fine $${fine}. The VCPD lets you walk.`);
      return true;
    },

    maintainUnits(dt) {
      this.spawnCooldown -= dt;
      if (this.spawnCooldown > 0) return;
      this.spawnCooldown = 1.0;
      // Police cars.
      const wantCars = policeCarCount(this.stars);
      const haveCars = Game.cars.filter((c) => c.driver === 'police').length;
      if (haveCars < wantCars) {
        this.spawnPoliceCar();
      } else if (haveCars > wantCars) {
        const extra = Game.cars.find((c) => c.driver === 'police');
        if (extra) { extra.driver = 'parked'; extra.speed = 0; }
      }
      // Foot cops when the player is on foot and wanted.
      const wantCops = Game.player.onFoot ? Math.min(3, this.stars) : 0;
      const haveCops = this.cops.filter((c) => c.alive).length;
      if (haveCops < wantCops) this.spawnCop();
      // Heat gone: foot cops give up and leave.
      if (this.stars === 0 && this.cops.length > 0) {
        for (const cop of this.cops) Game.scene.remove(cop.mesh);
        this.cops = [];
      }
      // Helicopter at 3+ stars.
      if (helicopterAt(this.stars) && !this.heli) this.spawnHeli();
      if (!helicopterAt(this.stars) && this.heli) this.removeHeli();
      // Roadblocks at 4+ stars: two striped barriers ahead of the player on the road.
      if (this.stars >= 4 && this.roadblocks.length === 0) this.spawnRoadblocks();
      if (this.stars < 4 && this.roadblocks.length > 0) this.clearRoadblocks();
    },

    spawnPoliceCar() {
      // Reuse a traffic car when the city is already full of cars.
      if (Game.cars.length >= 40) {
        const traffic = Game.cars.find((c) => c.driver === 'traffic');
        if (traffic) {
          traffic.driver = 'police';
          traffic.speed = 10;
          return traffic;
        }
      }
      const p = Game.player.pos;
      // Spawn on a road 60–90 m away, roughly ahead of the player.
      const road = -CITY_HALF + Game.rng.int(0, GRID - 1) * PITCH;
      const angle = Game.rng.range(0, Math.PI * 2);
      const x = THREE.MathUtils.clamp(p.x + Math.cos(angle) * 75, -CITY_HALF, CITY_HALF);
      const z = THREE.MathUtils.clamp(p.z + Math.sin(angle) * 75, -CITY_HALF, CITY_HALF);
      const car = makeCar(Game, 'police', x, z, Math.atan2(p.x - x, p.z - z), 'police');
      car.speed = 10;
      return car;
    },

    spawnCop() {
      const p = Game.player.pos;
      const angle = Game.rng.range(0, Math.PI * 2);
      const x = THREE.MathUtils.clamp(p.x + Math.cos(angle) * 22, -CITY_HALF, CITY_HALF);
      const z = THREE.MathUtils.clamp(p.z + Math.sin(angle) * 22, -CITY_HALF, CITY_HALF);
      const mesh = makeCopMesh();
      mesh.position.set(x, 0, z);
      mesh.userData.hitKind = 'cop';
      Game.scene.add(mesh);
      const cop = {
        mesh, pos: new THREE.Vector3(x, 0, z), heading: 0,
        health: 100, alive: true, shootCooldown: 1, bustedTimer: 0, walkPhase: 0,
        stunnedUntil: 0, stunned: false,
      };
      mesh.userData.ref = cop;
      this.cops.push(cop);
      return cop;
    },

    killCop(cop) {
      cop.alive = false;
      cop.mesh.rotation.x = -Math.PI / 2;
      cop.mesh.position.y = 0.3;
      Game.effects.blood(cop.pos.x, 1, cop.pos.z);
      Game.stats.copsDown++;
    },

    // Stun (Coil Shocker / flashbang): the cop falls and stays down for
    // `secs`, then gets back up. Not lethal — it never adds to copsDown.
    stunCop(cop, secs) {
      if (!cop.alive || cop.stunned) return;
      cop.stunned = true;
      cop.stunnedUntil = Game.elapsed + secs;
      cop.mesh.rotation.x = -Math.PI / 2;
      cop.mesh.position.y = 0.3;
      Game.effects.sparks(cop.pos.x, 1, cop.pos.z, 8);
      Game.audio.zap();
      Game.hud.toast('Officer stunned.');
    },

    spawnHeli() {
      const { group, rotor, spot } = makeHeliMesh();
      group.userData.hitKind = 'heli';
      const pos = Game.player.pos.clone().add(new THREE.Vector3(20, 42, -20));
      group.position.copy(pos);
      Game.scene.add(group);
      this.heli = { group, rotor, spot, pos, health: 200 };
      group.userData.ref = this.heli;
      Game.hud.toast('Police helicopter overhead!');
    },

    removeHeli() {
      if (!this.heli) return;
      Game.scene.remove(this.heli.group);
      this.heli = null;
    },

    downHelicopter() {
      if (!this.heli) return;
      Game.effects.sparks(this.heli.pos.x, this.heli.pos.y, this.heli.pos.z, 40);
      Game.effects.smoke(this.heli.pos.x, this.heli.pos.y, this.heli.pos.z, 20);
      Game.hud.toast('Helicopter down!');
      Game.audio.crash(1);
      this.removeHeli();
      this.addHeat(20, 'downed the helicopter');
    },

    spawnRoadblocks() {
      const p = Game.player.pos;
      const mat = new THREE.MeshLambertMaterial({ color: 0xff5533, emissive: 0x441100 });
      for (const off of [-14, 14]) {
        const barrier = new THREE.Mesh(new THREE.BoxGeometry(7, 1.1, 0.8), mat);
        const x = THREE.MathUtils.clamp(p.x + off, -CITY_HALF, CITY_HALF);
        const z = p.z;
        barrier.position.set(x, 0.55, z);
        barrier.castShadow = true;
        Game.scene.add(barrier);
        this.roadblocks.push({ mesh: barrier, x, z });
        Game.city.colliders.push({ minX: x - 3.5, maxX: x + 3.5, minZ: z - 0.5, maxZ: z + 0.5 });
      }
      Game.hud.toast('Roadblock ahead!');
    },

    clearRoadblocks() {
      for (const rb of this.roadblocks) {
        Game.scene.remove(rb.mesh);
        const idx = Game.city.colliders.findIndex((c) => Math.abs(c.minX - (rb.x - 3.5)) < 0.01);
        if (idx >= 0) Game.city.colliders.splice(idx, 1);
      }
      this.roadblocks = [];
    },

    // Police cars steer toward the player and ram. When they lose sight they
    // drive to the last seen position, search, then give up and go back on patrol.
    updatePoliceCars(dt) {
      const p = Game.player.pos;
      const search = this.lastSeenPos || p;
      for (const car of Game.cars) {
        if (car.driver !== 'police') continue;
        const dx = p.x - car.pos.x, dz = p.z - car.pos.z;
        const dist = Math.hypot(dx, dz);
        const sees = this.seenNow;
        if (sees) { car.loseTimer = 0; }
        else car.loseTimer = (car.loseTimer || 0) + dt;
        // Give up: back to traffic patrol.
        if (car.loseTimer > 8) {
          car.driver = 'traffic';
          car.route = { axis: 'x', road: nearestRoad(car.pos.z), dir: 1, targetSpeed: 9 };
          car.speed = 9;
          car.loseTimer = 0;
          continue;
        }
        const tx = sees ? p.x : search.x;
        const tz = sees ? p.z : search.z;
        const tdx = tx - car.pos.x, tdz = tz - car.pos.z;
        const tdist = Math.hypot(tdx, tdz);
        const wantHeading = Math.atan2(tdx, tdz);
        let dh = wantHeading - car.heading;
        while (dh > Math.PI) dh -= Math.PI * 2;
        while (dh < -Math.PI) dh += Math.PI * 2;
        car.heading += THREE.MathUtils.clamp(dh, -2.4 * dt, 2.4 * dt);
        // Ram speed when the player is in sight; cruise to the search area otherwise.
        const wantSpeed = sees
          ? (dist > 8 ? car.cls.maxSpeed * 0.95 : car.cls.maxSpeed * 0.4)
          : (tdist > 10 ? car.cls.maxSpeed * 0.6 : 0);
        car.speed += THREE.MathUtils.clamp(wantSpeed - car.speed, -18 * dt, 14 * dt);
        car.pos.x += Math.sin(car.heading) * car.speed * dt;
        car.pos.z += Math.cos(car.heading) * car.speed * dt;
        // Ram damage when touching the player's car — one hit per police
        // car per second, not one per frame: the old per-frame 0.02 wrecked
        // a car in under a second of contact, which made every chase end
        // in a dead car before the player could do anything.
        if (Game.player.inCar && Game.player.car && dist < 5 && Math.abs(car.speed) > 6) {
          if (Game.elapsed - (car.lastRamAt || 0) > 1) {
            car.lastRamAt = Game.elapsed;
            Game.player.car.health = Math.max(0, Game.player.car.health - 0.03);
            Game.effects.sparks(car.pos.x, 1, car.pos.z, 4);
          }
        }
        // A police car that touches the player on foot busts them.
        if (Game.player.onFoot && dist < 2.5 && Game.player.speed < 1.5) {
          this.bustedTimer += dt;
          if (this.bustedTimer > 1.2) this.busted();
        } else if (Game.player.onFoot && dist < 2.5) {
          // Cop car shoves the player.
          Game.player.pos.x += Math.sin(car.heading) * 3 * dt;
          Game.player.pos.z += Math.cos(car.heading) * 3 * dt;
        }
      }
      if (!Game.player.onFoot || Game.player.speed > 1.5) this.bustedTimer = Math.max(0, this.bustedTimer - dt);
    },

    updateCops(dt) {
      const p = Game.player.pos;
      const search = this.lastSeenPos || p;
      for (let i = this.cops.length - 1; i >= 0; i--) {
        const cop = this.cops[i];
        if (!cop.alive) continue;
        // Stunned: stays down and does nothing until the stun expires,
        // then gets back up.
        if (cop.stunned) {
          if (Game.elapsed >= cop.stunnedUntil) {
            cop.stunned = false;
            cop.mesh.rotation.x = 0;
            cop.mesh.position.y = 0;
          } else {
            continue;
          }
        }
        const dx = p.x - cop.pos.x, dz = p.z - cop.pos.z;
        const dist = Math.hypot(dx, dz);
        // Lost the trail: after 6 s beyond 45 m, the cop gives up and leaves.
        if (dist > 45) cop.lostTimer = (cop.lostTimer || 0) + dt;
        else cop.lostTimer = 0;
        if (cop.lostTimer > 6) {
          Game.scene.remove(cop.mesh);
          this.cops.splice(i, 1);
          continue;
        }
        // Chase the player when close, otherwise search the last seen spot.
        const tx = dist < 40 ? p.x : search.x;
        const tz = dist < 40 ? p.z : search.z;
        const tdx = tx - cop.pos.x, tdz = tz - cop.pos.z;
        const want = Math.atan2(tdx, tdz);
        let dh = want - cop.heading;
        while (dh > Math.PI) dh -= Math.PI * 2;
        while (dh < -Math.PI) dh += Math.PI * 2;
        cop.heading += THREE.MathUtils.clamp(dh, -5 * dt, 5 * dt);
        const tdist = Math.hypot(tdx, tdz);
        const speed = tdist > 2 ? 5.2 : 0;
        cop.pos.x += Math.sin(cop.heading) * speed * dt;
        cop.pos.z += Math.cos(cop.heading) * speed * dt;
        cop.walkPhase += dt * speed * 3;
        cop.mesh.position.copy(cop.pos);
        cop.mesh.rotation.y = cop.heading;
        // Busted: a cop catches the player standing still on foot.
        if (Game.player.onFoot && dist < 2.2 && Game.player.speed < 1.5) {
          cop.bustedTimer += dt;
          if (cop.bustedTimer > 1.5) this.busted();
        } else {
          cop.bustedTimer = Math.max(0, cop.bustedTimer - dt);
        }
      }
    },

    updateHeli(dt) {
      if (!this.heli) return;
      const h = this.heli;
      // The helicopter tracks the player in a car; on foot it circles the
      // last seen position, so ditching the car breaks its eye.
      const anchor = Game.player.onFoot ? (this.lastSeenPos || Game.player.pos) : Game.player.pos;
      const target = anchor.clone().add(new THREE.Vector3(18, 42, -18));
      h.pos.lerp(target, Math.min(1, 1.2 * dt));
      h.group.position.copy(h.pos);
      h.rotor.rotation.y += dt * 22;
      h.spot.target.position.copy(anchor);
      h.spot.intensity = Game.timeOfDay > 18.4 ? 60 : 0;
      h.group.lookAt(anchor.x, h.pos.y, anchor.z);
    },

    // Caught: lose cash, stars cleared, respawn at the safehouse.
    // An active mission is blown — it restarts from the briefing.
    busted() {
      if (Game.mode !== 'playing') return;
      const fine = Math.min(Game.money, 300);
      Game.money -= fine;
      this.heat = 0;
      this.stars = 0;
      this.starState = 'none';
      this.bustedTimer = 0;
      Game.hud.showEndCard('BUSTED', `The Azura Bay PD caught up with you. Fine: $${fine}. Your crew bailed you out.`);
      Game.mode = 'busted';
      Game.audio.setSiren(0);
      Game.audio.blip(220, 0.4, 'square', 0.15);
      if (Game.missions.active) Game.missions.fail('You got caught.');
      Game.saveGame();
    },

    // Health hit zero: respawn at the safehouse with a hospital bill.
    wasted() {
      if (Game.mode !== 'playing') return;
      const bill = Math.min(Game.money, 200);
      Game.money -= bill;
      this.heat = 0;
      this.stars = 0;
      this.starState = 'none';
      Game.hud.showEndCard('WASTED', `You flatlined in Azura Bay. Hospital bill: $${bill}. The crew patched you up.`);
      Game.mode = 'wasted';
      Game.audio.setSiren(0);
      Game.audio.blip(160, 0.5, 'sawtooth', 0.15);
      if (Game.missions.active) Game.missions.fail('You flatlined.');
      Game.saveGame();
    },

    // After the end card, respawn at the safehouse.
    respawn() {
      if (Game.player.car) { Game.player.car.driver = 'parked'; Game.player.car.speed = 0; Game.player.car = null; }
      Game.player.onFoot = true;
      Game.player.mesh.visible = true;
      Game.player.resetToSafehouse();
      // Clear the pursuit.
      for (const car of Game.cars) if (car.driver === 'police') { car.driver = 'parked'; car.speed = 0; }
      for (const cop of this.cops) { Game.scene.remove(cop.mesh); }
      this.cops = [];
      if (this.heli) this.removeHeli();
      this.clearRoadblocks();
      Game.mode = 'playing';
    },
    // Round 3: average heat per wanted star (HUD wanted tooltip).
    heatPerStar() {
      return this.stars > 0 ? Math.round(this.heat / this.stars) : 0;
    },
  };
  return P;
}
