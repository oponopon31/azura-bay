// player.js — The on-foot hero: third-person movement, camera orbit and the
// player character mesh. Driving lives in driving.js.
// Bab 24: crouch is the responsive low stance (prone was REMOVED from the
// spec); swimming uses Lung Capacity when stamina runs low, and the player
// can shoot while swimming.
// Round 5: the mesh part names are renamed for clarity, Game replaces G.
// Behaviour unchanged.

import { PLAYER, WATER_Z } from './config.js';
import * as THREE from 'three';

export function createPlayer(Game) {
  // Hero mesh: teal coatMat, dark denimMat — Jason by default; setCharacter
  // swaps the colours for Lucia (crimson coatMat, dark hair).
  const g = new THREE.Group();
  const coatMat = new THREE.MeshLambertMaterial({ color: 0x0e7c7b });
  const denimMat = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
  const skinTone = new THREE.MeshLambertMaterial({ color: 0xc98d5f });
  const trunkMesh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.75, 0.36), coatMat);
  trunkMesh.position.y = 1.18; trunkMesh.castShadow = true;
  g.add(trunkMesh);
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), skinTone);
  headMesh.position.y = 1.78; headMesh.castShadow = true;
  g.add(headMesh);
  const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.1, 12),
    new THREE.MeshLambertMaterial({ color: 0xf1c40f }));
  capMesh.position.y = 1.98;
  g.add(capMesh);
  const legLeft = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.24), denimMat);
  legLeft.position.set(-0.15, 0.42, 0);
  g.add(legLeft);
  const legRight = legLeft.clone(); legRight.position.x = 0.15;
  g.add(legRight);
  const armLeft = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.7, 0.2), coatMat);
  armLeft.position.set(-0.4, 1.18, 0);
  g.add(armLeft);
  const armRight = armLeft.clone(); armRight.position.x = 0.4;
  g.add(armRight);
  g.visible = true;
  Game.scene.add(g);

  const P = {
    mesh: g, legLeft, legRight, armLeft, armRight,
    jacketMat: coatMat, capMesh: capMesh,
    who: 'jason', // playable protagonist: 'jason' | 'lucia'
    flashlight: null, flashlightOn: false,
    pos: new THREE.Vector3(-40, 0, 250),
    vel: new THREE.Vector3(),
    heading: Math.PI, // facing north, into town
    onFoot: true,
    get inCar() { return !this.onFoot; },
    car: null,
    speed: 0,
    health: PLAYER.health,
    maxHealth: PLAYER.health,
    walkPhase: 0,
    camYaw: 0,        // camera sits behind the player (offset dir = camYaw); player faces heading PI
    camPitch: 0.32,
    camDist: 7.5,
    aiming: false,
    crouching: false, // Bab 24: responsive crouch replaces prone
    swimming: false,  // in the sea (z past the water line)
    lungCapacity: 1,  // 0..1 — the swim trick's second wind (Bab 24)
    stamina: 1,       // 0..1 — sprint/swim stamina, fed by Cardio
    focusMeter: 1,    // 0..1 — Focus for slow-mo aiming / weak-point spotting (Bab 29 HUD)
    adrenaline: 0,    // 0..1 — builds on kills and on taking damage, decays (Bab 29 HUD)
    _lastHealth: PLAYER.health, // health on the previous update (damage detector)
    _lastHurtAt: -99, // Game.elapsed when damage was last taken (regen clock)
    _lastKills: 0,    // copsDown + civiliansHurt on the previous update

    // Switch the playable protagonist: the mesh colours change so the
    // player can tell at a glance who they are.
    // Jason: teal coatMat, yellow capMesh. Lucia: crimson coatMat, dark hair.
    setCharacter(who) {
      this.who = who;
      if (who === 'lucia') {
        this.jacketMat.color.setHex(0xa01848);
        this.capMesh.material.color.setHex(0x1a1a1a);
      } else {
        this.jacketMat.color.setHex(0x0e7c7b);
        this.capMesh.material.color.setHex(0xf1c40f);
      }
    },

    // L key: the Flashlight melee weapon doubles as a light source.
    toggleFlashlight() {
      if (!Game.weapons || !Game.weapons.has('flashlight')) {
        Game.hud.toast('You need the Flashlight to light the dark.');
        return;
      }
      if (!this.flashlight) {
        this.flashlight = new THREE.SpotLight(0xfff2cc, 0, 30, 0.5, 0.4);
        Game.scene.add(this.flashlight);
        Game.scene.add(this.flashlight.target);
      }
      this.flashlightOn = !this.flashlightOn;
      this.flashlight.intensity = this.flashlightOn ? 60 : 0;
      Game.hud.toast(this.flashlightOn ? 'Flashlight on' : 'Flashlight off');
    },

    resetToSafehouse() {
      this.pos.set(-40, 0, 250);
      this.heading = Math.PI;
      this.camYaw = 0;
      this.vel.set(0, 0, 0);
      this.health = this.maxHealth;
      this.stamina = 1;
      this.lungCapacity = 1;
      this.focusMeter = 1;
      this.adrenaline = 0;
      this._lastHealth = this.maxHealth;
      this._lastHurtAt = -99;
      this._lastKills = 0;
      this.swimming = false;
      this.crouching = false;
      if (this.car) this.exitCar();
    },

    update(dt) {
      if (!this.onFoot) return;
      const k = Game.input.keys;
      // Crouch: hold C (ControlLeft) — the responsive low stance (Bab 24).
      this.crouching = !!(k['KeyC'] || k['ControlLeft']);
      // Camera-relative movement: W is away from the camera.
      let ix = 0, iz = 0;
      if (k['KeyW'] || k['ArrowUp']) iz += 1;
      if (k['KeyS'] || k['ArrowDown']) iz -= 1;
      if (k['KeyA']) ix -= 1;
      if (k['KeyD']) ix += 1;
      // Arrow keys steer the camera when not moving forward/back.
      if (k['ArrowLeft']) this.camYaw += 1.9 * dt;
      if (k['ArrowRight']) this.camYaw -= 1.9 * dt;
      // Always Run (Bab 25 setting): forward = run without holding Shift.
      const alwaysRun = Game.settings && Game.settings.alwaysRun;
      const running = alwaysRun || k['ShiftLeft'] || k['ShiftRight'];
      let targetSpeed = (ix || iz) ? (running ? PLAYER.runSpeed : PLAYER.walkSpeed) : 0;
      if (this.crouching) targetSpeed *= 0.45;
      // Heavy weapons slow you down (LMG, minigun, launchers).
      if (Game.weapons) {
        const w = Game.weapons.active();
        if (w && w.moveSlow) targetSpeed *= w.moveSlow;
      }
      // Super Run cheat (Bab 3): sprint speed x1.6 while it is active.
      if (Game.cheats && Game.cheats.isActive('superrun')) targetSpeed *= 1.6;
      // Bab 29 HUD meters: Focus drains while aiming and refills otherwise;
      // Adrenaline builds on kills and on taking damage, then decays — while
      // it is high (>= 0.5) sprinting costs half the stamina.
      const adr = this.adrenaline >= 0.5 ? 0.5 : 1;
      if (this.aiming) this.focusMeter = Math.max(0, this.focusMeter - dt * 0.10);
      else this.focusMeter = Math.min(1, this.focusMeter + dt * 0.05);
      if (this.health < this._lastHealth) {
        this._lastHurtAt = Game.elapsed;
        this.adrenaline = Math.min(1, this.adrenaline + 0.08);
      }
      this._lastHealth = this.health;
      const kills = (Game.stats.copsDown || 0) + (Game.stats.civiliansHurt || 0);
      if (kills > this._lastKills) {
        this.adrenaline = Math.min(1, this.adrenaline + 0.25 * (kills - this._lastKills));
        this._lastKills = kills;
      }
      this.adrenaline = Math.max(0, this.adrenaline - dt * 0.04);
      // Health regen: only out of combat (8 s since the last hit) and only
      // up to the regen cap — half of max health. Above the cap, health
      // stays where it is; the HUD draws the cap as a tick on the bar.
      const regenCap = this.maxHealth * 0.5;
      if (this.health < regenCap && Game.elapsed - this._lastHurtAt > 8) {
        this.health = Math.min(regenCap, this.health + 3 * dt);
      }
      // Swimming: past the water line the player is in the sea.
      this.swimming = this.pos.z > WATER_Z;
      if (this.swimming) {
        // Sprint-swim drains stamina; near-empty stamina switches to Lung
        // Capacity, which lets the player surge twice as long (Bab 24 trick).
        if (running && (ix || iz)) this.stamina = Math.max(0, this.stamina - dt * 0.12 * adr);
        else this.stamina = Math.min(1, this.stamina + dt * 0.05);
        const onLungs = this.stamina < 0.15;
        if (onLungs) this.lungCapacity = Math.max(0, this.lungCapacity - dt * 0.03);
        else this.lungCapacity = Math.min(1, this.lungCapacity + dt * 0.02);
        targetSpeed = (ix || iz) ? (onLungs ? PLAYER.walkSpeed * 1.6 : PLAYER.walkSpeed * 0.8) : 0;
      } else {
        // On land, stamina recovers when not sprinting.
        if (!running || !(ix || iz)) this.stamina = Math.min(1, this.stamina + dt * 0.08);
        else this.stamina = Math.max(0, this.stamina - dt * 0.04 * adr);
      }
      const fwdX = Math.sin(this.camYaw), fwdZ = Math.cos(this.camYaw);
      const rightX = Math.cos(this.camYaw), rightZ = -Math.sin(this.camYaw);
      // Note: camera sits behind the player, so forward is -camYaw direction.
      const mx = (-fwdX) * iz + rightX * ix;
      const mz = (-fwdZ) * iz + rightZ * ix;
      const mLen = Math.hypot(mx, mz);
      if (mLen > 0.01) {
        const tx = mx / mLen, tz = mz / mLen;
        this.vel.x += (tx * targetSpeed - this.vel.x) * Math.min(1, 10 * dt);
        this.vel.z += (tz * targetSpeed - this.vel.z) * Math.min(1, 10 * dt);
        this.heading = Math.atan2(this.vel.x, this.vel.z);
      } else {
        this.vel.x *= Math.max(0, 1 - 12 * dt);
        this.vel.z *= Math.max(0, 1 - 12 * dt);
      }
      this.speed = Math.hypot(this.vel.x, this.vel.z);
      // Integrate with building collision (circle vs AABB).
      const nx = this.pos.x + this.vel.x * dt;
      const nz = this.pos.z + this.vel.z * dt;
      if (!collides(Game, nx, this.pos.z, 0.5)) this.pos.x = nx;
      if (!collides(Game, this.pos.x, nz, 0.5)) this.pos.z = nz;
      // Stay inside the playable area (city + beach + harbor).
      this.pos.x = THREE.MathUtils.clamp(this.pos.x, -360, 470);
      this.pos.z = THREE.MathUtils.clamp(this.pos.z, -360, 430);
      this.walkPhase += dt * this.speed * 2.4;
      const swing = Math.sin(this.walkPhase) * Math.min(1, this.speed / 5) * 0.6;
      this.legLeft.rotation.x = swing;
      this.legRight.rotation.x = -swing;
      this.armLeft.rotation.x = -swing * 0.8;
      this.armRight.rotation.x = swing * 0.8;
      // Crouch pose: trunkMesh dips, legs bend.
      this.mesh.position.copy(this.pos);
      this.mesh.position.y = this.crouching ? -0.35 : 0;
      this.mesh.rotation.y = this.heading;
      this.mesh.visible = true;
      // Footsteps on the beach slow you a little.
      if (this.pos.z > 336 && this.pos.z <= WATER_Z) this.vel.multiplyScalar(0.985);
    },

    // Third-person camera: orbit behind the player, or over the shoulder while aiming.
    updateCamera(dt) {
      const cam = Game.camera;
      // Scope zoom: aiming with a scoped weapon narrows the field of view.
      // First-person via scope (Bab 25): R3 with a sight/scope = FOV 12.
      let wantFov = 62;
      if (this.aiming && Game.weapons) {
        const w = Game.weapons.active();
        if (w && w.zoom) wantFov = 62 / w.zoom;
        else if (w && Game.settings && Game.settings.scopeFirstPerson) wantFov = 14;
      }
      if (Math.abs(cam.fov - wantFov) > 0.5) {
        cam.fov += (wantFov - cam.fov) * Math.min(1, 12 * dt);
        cam.updateProjectionMatrix();
      }
      // The flashlight beam follows the camera.
      if (this.flashlight && this.flashlightOn) {
        this.flashlight.position.copy(cam.position);
        const ahead = new THREE.Vector3();
        cam.getWorldDirection(ahead);
        this.flashlight.target.position.copy(cam.position).addScaledVector(ahead, 10);
      }
      const target = new THREE.Vector3(this.pos.x, this.pos.y + 1.6, this.pos.z);
      if (this.aiming) {
        const d = 4.2;
        // Over-the-shoulder aim: the crosshair (screen centre) must sit on a
        // person-sized target at 2–20 m. The old numbers put the camera at
        // y≈2.56 looking at y≈1.84, so the ray crossed 8 m at headMesh-top
        // height and flew OVER a cop's headMesh at close range (2 m → y≈2.24,
        // above the 2.03 capMesh) — a player aiming at a cop two metres away
        // missed every shot. Lower both ends: camera y≈1.9, lookAt y≈1.3
        // at the default pitch puts the ray at chest height at 8 m (1.42),
        // in the headMesh at 2 m (1.66), and at the legs at 20 m (0.94).
        const off = new THREE.Vector3(
          Math.sin(this.camYaw) * d, 0.05 + this.camPitch * 0.8, Math.cos(this.camYaw) * d);
        cam.position.lerp(new THREE.Vector3().addVectors(target, off), Math.min(1, 14 * dt));
        cam.lookAt(target.x - Math.sin(this.camYaw) * 10, 0.7 + this.camPitch * 2, target.z - Math.cos(this.camYaw) * 10);
        return;
      }
      const d = this.camDist;
      const cx = this.pos.x + Math.sin(this.camYaw) * d * Math.cos(this.camPitch);
      const cy = this.pos.y + 1.6 + Math.sin(this.camPitch) * d;
      const cz = this.pos.z + Math.cos(this.camYaw) * d * Math.cos(this.camPitch);
      const desired = new THREE.Vector3(cx, cy, cz);
      // Keep the camera out of buildings: clamp it above the ground and pull in on collision.
      desired.y = Math.max(desired.y, 1.2);
      cam.position.lerp(desired, Math.min(1, 10 * dt));
      const shake = Game.effects.shakeOffset();
      cam.lookAt(target.x + shake.x, target.y + shake.y, target.z);
    },

    exitCar() {
      if (!this.car) return;
      const car = this.car;
      car.driver = 'parked';
      car.speed = 0;
      // Step out on the driver's side.
      const sx = car.pos.x + Math.cos(car.heading) * 2.2;
      const sz = car.pos.z - Math.sin(car.heading) * 2.2;
      this.pos.set(sx, 0, sz);
      this.heading = car.heading;
      this.camYaw = car.heading + Math.PI;
      this.car = null;
      this.onFoot = true;
      this.mesh.visible = true;
    },
  };
  return P;
}

// Circle vs building AABBs.
export function collides(Game, x, z, r) {
  for (const c of Game.city.colliders) {
    const cx = Math.max(c.minX, Math.min(x, c.maxX));
    const cz = Math.max(c.minZ, Math.min(z, c.maxZ));
    const dx = x - cx, dz = z - cz;
    if (dx * dx + dz * dz < r * r) return true;
  }
  return false;
}

// Push a circle out of building AABBs; returns true if a hit happened.
export function resolveCollision(Game, pos, r) {
  let hit = false;
  for (const c of Game.city.colliders) {
    const cx = Math.max(c.minX, Math.min(pos.x, c.maxX));
    const cz = Math.max(c.minZ, Math.min(pos.z, c.maxZ));
    let dx = pos.x - cx, dz = pos.z - cz;
    let d2 = dx * dx + dz * dz;
    if (d2 < r * r) {
      hit = true;
      if (d2 < 0.0001) { dx = 0; dz = -1; d2 = 1; }
      const d = Math.sqrt(d2);
      pos.x = cx + (dx / d) * r;
      pos.z = cz + (dz / d) * r;
    }
  }
  return hit;
}

// ---- Round 3: clamp a position inside the playable bounds ----
export function clampToBounds(pos, half) {
  pos.x = Math.max(-half, Math.min(half, pos.x));
  pos.z = Math.max(-half, Math.min(half, pos.z));
  return pos;
}
