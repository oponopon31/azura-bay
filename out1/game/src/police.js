// police.js — The wanted system: heat and stars, police cars that chase and ram,
// foot cops, roadblocks and the helicopter at 3+ stars, plus busted/wasted.

import * as THREE from 'three';
import { WANTED, starsFromHeat, policeCarCount, helicopterAt, CITY_HALF, PITCH, GRID } from './config.js';
import { makeCar } from './vehicles.js';

function buildCopMesh() {
  const g = new THREE.Group();
  const uniform = new THREE.MeshLambertMaterial({ color: 0x1a2f5e });
  const skin = new THREE.MeshLambertMaterial({ color: 0xd9a066 });
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.75, 0.36), uniform);
  torso.position.y = 1.18; torso.castShadow = true;
  g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), skin);
  head.position.y = 1.78; head.castShadow = true;
  g.add(head);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.1, 12), uniform);
  cap.position.y = 1.98;
  g.add(cap);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.24), uniform);
  legL.position.set(-0.15, 0.42, 0);
  g.add(legL);
  const legR = legL.clone(); legR.position.x = 0.15;
  g.add(legR);
  return g;
}

function buildHeliMesh() {
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

export function createPolice(G) {
  const P = {
    heat: 0,
    stars: 0,
    cops: [],          // foot cops {mesh,pos,heading,health,alive,shootCooldown,bustedTimer}
    heli: null,        // {group,rotor,spot,pos,health}
    roadblocks: [],    // {mesh,x,z}
    lastSeen: 0,       // time the player was last seen by any police
    seenNow: false,
    bustedTimer: 0,
    spawnCooldown: 0,

    addHeat(amount, why) {
      if (G.mode !== 'playing') return;
      if (amount <= 0) return;
      const before = this.stars;
      this.heat = Math.min(WANTED.maxHeat, this.heat + amount);
      this.stars = starsFromHeat(this.heat);
      if (this.stars > before) {
        G.hud.toast(`Wanted level up — ${this.stars} star${this.stars > 1 ? 's' : ''}!`);
        G.audio.blip(440, 0.2, 'square', 0.12);
      }
      this.lastSeen = G.elapsed;
      G.stats.crimes++;
    },

    // Line of sight from any police unit to the player (distance-based, no occlusion).
    anyPoliceSeesPlayer() {
      const p = G.player.pos;
      for (const car of G.cars) {
        if (car.driver === 'police' && car.pos.distanceTo(p) < 70) return true;
      }
      for (const cop of this.cops) {
        if (cop.alive && cop.pos.distanceTo(p) < 40) return true;
      }
      if (this.heli && !G.player.onFoot && this.heli.pos.distanceTo(p) < 120) return true;
      return false;
    },

    update(dt) {
      // Heat decays only after being unseen for a while.
      this.seenNow = this.anyPoliceSeesPlayer();
      if (this.seenNow) this.lastSeen = G.elapsed;
      if (this.stars > 0 && G.elapsed - this.lastSeen > WANTED.decayDelay) {
        this.heat = Math.max(0, this.heat - WANTED.decayRate * dt);
        const s = starsFromHeat(this.heat);
        if (s < this.stars) G.hud.toast('The heat is cooling off…');
        this.stars = s;
      }
      // Speeding past a police car adds heat.
      if (G.player.inCar && G.player.speed > 28) {
        for (const car of G.cars) {
          if (car.driver === 'police' && car.pos.distanceTo(G.player.pos) < 25) {
            this.heat = Math.min(WANTED.maxHeat, this.heat + WANTED.speedPastCop * dt);
            this.stars = starsFromHeat(this.heat);
            this.lastSeen = G.elapsed;
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
        for (const car of G.cars) {
          if (car.driver === 'police') nearest = Math.min(nearest, car.pos.distanceTo(G.player.pos));
        }
        siren = nearest < 1e8 ? Math.max(0.15, 1 - nearest / 120) : 0.3;
      }
      G.audio.setSiren(siren);
    },

    maintainUnits(dt) {
      this.spawnCooldown -= dt;
      if (this.spawnCooldown > 0) return;
      this.spawnCooldown = 1.0;
      // Police cars.
      const wantCars = policeCarCount(this.stars);
      const haveCars = G.cars.filter((c) => c.driver === 'police').length;
      if (haveCars < wantCars) {
        this.spawnPoliceCar();
      } else if (haveCars > wantCars) {
        const extra = G.cars.find((c) => c.driver === 'police');
        if (extra) { extra.driver = 'parked'; extra.speed = 0; }
      }
      // Foot cops when the player is on foot and wanted.
      const wantCops = G.player.onFoot ? Math.min(3, this.stars) : 0;
      const haveCops = this.cops.filter((c) => c.alive).length;
      if (haveCops < wantCops) this.spawnCop();
      // Heat gone: foot cops give up and leave.
      if (this.stars === 0 && this.cops.length > 0) {
        for (const cop of this.cops) G.scene.remove(cop.mesh);
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
      const p = G.player.pos;
      // Spawn on a road 60–90 m away, roughly ahead of the player.
      const road = -CITY_HALF + G.rng.int(0, GRID - 1) * PITCH;
      const angle = G.rng.range(0, Math.PI * 2);
      const x = THREE.MathUtils.clamp(p.x + Math.cos(angle) * 75, -CITY_HALF, CITY_HALF);
      const z = THREE.MathUtils.clamp(p.z + Math.sin(angle) * 75, -CITY_HALF, CITY_HALF);
      const car = makeCar(G, 'police', x, z, Math.atan2(p.x - x, p.z - z), 'police');
      car.speed = 10;
      return car;
    },

    spawnCop() {
      const p = G.player.pos;
      const angle = G.rng.range(0, Math.PI * 2);
      const x = THREE.MathUtils.clamp(p.x + Math.cos(angle) * 22, -CITY_HALF, CITY_HALF);
      const z = THREE.MathUtils.clamp(p.z + Math.sin(angle) * 22, -CITY_HALF, CITY_HALF);
      const mesh = buildCopMesh();
      mesh.position.set(x, 0, z);
      mesh.userData.hitKind = 'cop';
      G.scene.add(mesh);
      const cop = {
        mesh, pos: new THREE.Vector3(x, 0, z), heading: 0,
        health: 100, alive: true, shootCooldown: 1, bustedTimer: 0, walkPhase: 0,
      };
      mesh.userData.ref = cop;
      this.cops.push(cop);
      return cop;
    },

    killCop(cop) {
      cop.alive = false;
      cop.mesh.rotation.x = -Math.PI / 2;
      cop.mesh.position.y = 0.3;
      G.effects.blood(cop.pos.x, 1, cop.pos.z);
      G.stats.copsDown++;
    },

    spawnHeli() {
      const { group, rotor, spot } = buildHeliMesh();
      group.userData.hitKind = 'heli';
      const pos = G.player.pos.clone().add(new THREE.Vector3(20, 42, -20));
      group.position.copy(pos);
      G.scene.add(group);
      this.heli = { group, rotor, spot, pos, health: 200 };
      group.userData.ref = this.heli;
      G.hud.toast('Police helicopter overhead!');
    },

    removeHeli() {
      if (!this.heli) return;
      G.scene.remove(this.heli.group);
      this.heli = null;
    },

    downHelicopter() {
      if (!this.heli) return;
      G.effects.sparks(this.heli.pos.x, this.heli.pos.y, this.heli.pos.z, 40);
      G.effects.smoke(this.heli.pos.x, this.heli.pos.y, this.heli.pos.z, 20);
      G.hud.toast('Helicopter down!');
      G.audio.crash(1);
      this.removeHeli();
      this.addHeat(20, 'downed the helicopter');
    },

    spawnRoadblocks() {
      const p = G.player.pos;
      const mat = new THREE.MeshLambertMaterial({ color: 0xff5533, emissive: 0x441100 });
      for (const off of [-14, 14]) {
        const barrier = new THREE.Mesh(new THREE.BoxGeometry(7, 1.1, 0.8), mat);
        const x = THREE.MathUtils.clamp(p.x + off, -CITY_HALF, CITY_HALF);
        const z = p.z;
        barrier.position.set(x, 0.55, z);
        barrier.castShadow = true;
        G.scene.add(barrier);
        this.roadblocks.push({ mesh: barrier, x, z });
        G.city.colliders.push({ minX: x - 3.5, maxX: x + 3.5, minZ: z - 0.5, maxZ: z + 0.5 });
      }
      G.hud.toast('Roadblock ahead!');
    },

    clearRoadblocks() {
      for (const rb of this.roadblocks) {
        G.scene.remove(rb.mesh);
        const idx = G.city.colliders.findIndex((c) => Math.abs(c.minX - (rb.x - 3.5)) < 0.01);
        if (idx >= 0) G.city.colliders.splice(idx, 1);
      }
      this.roadblocks = [];
    },

    // Police cars steer toward the player and ram.
    updatePoliceCars(dt) {
      const p = G.player.pos;
      for (const car of G.cars) {
        if (car.driver !== 'police') continue;
        const dx = p.x - car.pos.x, dz = p.z - car.pos.z;
        const dist = Math.hypot(dx, dz);
        const wantHeading = Math.atan2(dx, dz);
        let dh = wantHeading - car.heading;
        while (dh > Math.PI) dh -= Math.PI * 2;
        while (dh < -Math.PI) dh += Math.PI * 2;
        car.heading += THREE.MathUtils.clamp(dh, -2.4 * dt, 2.4 * dt);
        const wantSpeed = dist > 8 ? car.cls.maxSpeed * 0.95 : car.cls.maxSpeed * 0.4;
        car.speed += THREE.MathUtils.clamp(wantSpeed - car.speed, -18 * dt, 14 * dt);
        car.pos.x += Math.sin(car.heading) * car.speed * dt;
        car.pos.z += Math.cos(car.heading) * car.speed * dt;
        // Ram damage when touching the player's car.
        if (G.player.inCar && G.player.car && dist < 5 && Math.abs(car.speed) > 6) {
          G.player.car.health = Math.max(0, G.player.car.health - 0.02);
          G.effects.sparks(car.pos.x, 1, car.pos.z, 4);
        }
        // A police car that touches the player on foot busts them.
        if (G.player.onFoot && dist < 2.5 && G.player.speed < 1.5) {
          this.bustedTimer += dt;
          if (this.bustedTimer > 1.2) this.busted();
        } else if (G.player.onFoot && dist < 2.5) {
          // Cop car shoves the player.
          G.player.pos.x += Math.sin(car.heading) * 3 * dt;
          G.player.pos.z += Math.cos(car.heading) * 3 * dt;
        }
      }
      if (!G.player.onFoot || G.player.speed > 1.5) this.bustedTimer = Math.max(0, this.bustedTimer - dt);
    },

    updateCops(dt) {
      const p = G.player.pos;
      for (const cop of this.cops) {
        if (!cop.alive) continue;
        const dx = p.x - cop.pos.x, dz = p.z - cop.pos.z;
        const dist = Math.hypot(dx, dz);
        const want = Math.atan2(dx, dz);
        let dh = want - cop.heading;
        while (dh > Math.PI) dh -= Math.PI * 2;
        while (dh < -Math.PI) dh += Math.PI * 2;
        cop.heading += THREE.MathUtils.clamp(dh, -5 * dt, 5 * dt);
        const speed = dist > 4 ? 5.2 : 0;
        cop.pos.x += Math.sin(cop.heading) * speed * dt;
        cop.pos.z += Math.cos(cop.heading) * speed * dt;
        cop.walkPhase += dt * speed * 3;
        cop.mesh.position.copy(cop.pos);
        cop.mesh.rotation.y = cop.heading;
        // Busted: a cop catches the player standing still on foot.
        if (G.player.onFoot && dist < 2.2 && G.player.speed < 1.5) {
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
      const target = G.player.pos.clone().add(new THREE.Vector3(18, 42, -18));
      h.pos.lerp(target, Math.min(1, 1.2 * dt));
      h.group.position.copy(h.pos);
      h.rotor.rotation.y += dt * 22;
      h.spot.target.position.copy(G.player.pos);
      h.spot.intensity = G.timeOfDay > 18.4 ? 60 : 0;
      h.group.lookAt(G.player.pos.x, h.pos.y, G.player.pos.z);
    },

    // Caught: lose cash, stars cleared, respawn at the safehouse.
    busted() {
      if (G.mode !== 'playing') return;
      const fine = Math.min(G.money, 300);
      G.money -= fine;
      this.heat = 0;
      this.stars = 0;
      this.bustedTimer = 0;
      G.hud.showEndCard('BUSTED', `The Azura Bay PD caught up with you. Fine: $${fine}. Your crew bailed you out.`);
      G.mode = 'busted';
      G.audio.setSiren(0);
      G.audio.blip(220, 0.4, 'square', 0.15);
      G.saveGame();
    },

    // Health hit zero: respawn at the safehouse with a hospital bill.
    wasted() {
      if (G.mode !== 'playing') return;
      const bill = Math.min(G.money, 200);
      G.money -= bill;
      this.heat = 0;
      this.stars = 0;
      G.hud.showEndCard('WASTED', `You flatlined in Azura Bay. Hospital bill: $${bill}. The crew patched you up.`);
      G.mode = 'wasted';
      G.audio.setSiren(0);
      G.audio.blip(160, 0.5, 'sawtooth', 0.15);
      G.saveGame();
    },

    // After the end card, respawn at the safehouse.
    respawn() {
      if (G.player.car) { G.player.car.driver = 'parked'; G.player.car.speed = 0; G.player.car = null; }
      G.player.onFoot = true;
      G.player.mesh.visible = true;
      G.player.resetToSafehouse();
      // Clear the pursuit.
      for (const car of G.cars) if (car.driver === 'police') { car.driver = 'parked'; car.speed = 0; }
      for (const cop of this.cops) { G.scene.remove(cop.mesh); }
      this.cops = [];
      if (this.heli) this.removeHeli();
      this.clearRoadblocks();
      G.mode = 'playing';
    },
  };
  return P;
}
