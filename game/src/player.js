// player.js — The on-foot hero: third-person movement, camera orbit and the
// player character mesh. Driving lives in driving.js.

import * as THREE from 'three';
import { PLAYER, onRoad } from './config.js';

export function createPlayer(G) {
  // Hero mesh: teal jacket, dark jeans — Jason by default; setCharacter
  // swaps the colours for Lucia (crimson jacket, dark hair).
  const g = new THREE.Group();
  const jacket = new THREE.MeshLambertMaterial({ color: 0x0e7c7b });
  const jeans = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
  const skin = new THREE.MeshLambertMaterial({ color: 0xc98d5f });
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.75, 0.36), jacket);
  torso.position.y = 1.18; torso.castShadow = true;
  g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), skin);
  head.position.y = 1.78; head.castShadow = true;
  g.add(head);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.1, 12),
    new THREE.MeshLambertMaterial({ color: 0xf1c40f }));
  cap.position.y = 1.98;
  g.add(cap);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.85, 0.24), jeans);
  legL.position.set(-0.15, 0.42, 0);
  g.add(legL);
  const legR = legL.clone(); legR.position.x = 0.15;
  g.add(legR);
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.7, 0.2), jacket);
  armL.position.set(-0.4, 1.18, 0);
  g.add(armL);
  const armR = armL.clone(); armR.position.x = 0.4;
  g.add(armR);
  g.visible = true;
  G.scene.add(g);

  const P = {
    mesh: g, legL, legR, armL, armR,
    jacketMat: jacket, capMesh: cap,
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

    // Switch the playable protagonist: the mesh colours change so the
    // player can tell at a glance who they are.
    // Jason: teal jacket, yellow cap. Lucia: crimson jacket, dark hair.
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
      if (!G.weapons || !G.weapons.has('flashlight')) {
        G.hud.toast('You need the Flashlight to light the dark.');
        return;
      }
      if (!this.flashlight) {
        this.flashlight = new THREE.SpotLight(0xfff2cc, 0, 30, 0.5, 0.4);
        G.scene.add(this.flashlight);
        G.scene.add(this.flashlight.target);
      }
      this.flashlightOn = !this.flashlightOn;
      this.flashlight.intensity = this.flashlightOn ? 60 : 0;
      G.hud.toast(this.flashlightOn ? 'Flashlight on' : 'Flashlight off');
    },

    resetToSafehouse() {
      this.pos.set(-40, 0, 250);
      this.heading = Math.PI;
      this.camYaw = 0;
      this.vel.set(0, 0, 0);
      this.health = this.maxHealth;
      if (this.car) this.exitCar();
    },

    update(dt) {
      if (!this.onFoot) return;
      const k = G.input.keys;
      // Camera-relative movement: W is away from the camera.
      let ix = 0, iz = 0;
      if (k['KeyW'] || k['ArrowUp']) iz += 1;
      if (k['KeyS'] || k['ArrowDown']) iz -= 1;
      if (k['KeyA']) ix -= 1;
      if (k['KeyD']) ix += 1;
      // Arrow keys steer the camera when not moving forward/back.
      if (k['ArrowLeft']) this.camYaw += 1.9 * dt;
      if (k['ArrowRight']) this.camYaw -= 1.9 * dt;
      const running = k['ShiftLeft'] || k['ShiftRight'];
      let targetSpeed = (ix || iz) ? (running ? PLAYER.runSpeed : PLAYER.walkSpeed) : 0;
      // Heavy weapons slow you down (LMG, minigun, launchers).
      if (G.weapons) {
        const w = G.weapons.active();
        if (w && w.moveSlow) targetSpeed *= w.moveSlow;
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
      if (!collides(G, nx, this.pos.z, 0.5)) this.pos.x = nx;
      if (!collides(G, this.pos.x, nz, 0.5)) this.pos.z = nz;
      // Stay inside the playable area (city + beach + harbor).
      this.pos.x = THREE.MathUtils.clamp(this.pos.x, -360, 470);
      this.pos.z = THREE.MathUtils.clamp(this.pos.z, -360, 430);
      this.walkPhase += dt * this.speed * 2.4;
      const swing = Math.sin(this.walkPhase) * Math.min(1, this.speed / 5) * 0.6;
      this.legL.rotation.x = swing;
      this.legR.rotation.x = -swing;
      this.armL.rotation.x = -swing * 0.8;
      this.armR.rotation.x = swing * 0.8;
      this.mesh.position.copy(this.pos);
      this.mesh.rotation.y = this.heading;
      this.mesh.visible = true;
      // Footsteps on the beach slow you a little.
      if (this.pos.z > 336) this.vel.multiplyScalar(0.985);
    },

    // Third-person camera: orbit behind the player, or over the shoulder while aiming.
    updateCamera(dt) {
      const cam = G.camera;
      // Scope zoom: aiming with a scoped weapon narrows the field of view.
      let wantFov = 62;
      if (this.aiming && G.weapons) {
        const w = G.weapons.active();
        if (w && w.zoom) wantFov = 62 / w.zoom;
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
        // y≈2.56 looking at y≈1.84, so the ray crossed 8 m at head-top
        // height and flew OVER a cop's head at close range (2 m → y≈2.24,
        // above the 2.03 cap) — a player aiming at a cop two metres away
        // missed every shot. Lower both ends: camera y≈1.9, lookAt y≈1.3
        // at the default pitch puts the ray at chest height at 8 m (1.42),
        // in the head at 2 m (1.66), and at the legs at 20 m (0.94).
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
      const shake = G.effects.shakeOffset();
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
export function collides(G, x, z, r) {
  for (const c of G.city.colliders) {
    const cx = Math.max(c.minX, Math.min(x, c.maxX));
    const cz = Math.max(c.minZ, Math.min(z, c.maxZ));
    const dx = x - cx, dz = z - cz;
    if (dx * dx + dz * dz < r * r) return true;
  }
  return false;
}

// Push a circle out of building AABBs; returns true if a hit happened.
export function resolveCollision(G, pos, r) {
  let hit = false;
  for (const c of G.city.colliders) {
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
