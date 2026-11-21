// combat.js — Shooting, melee and drive-by combat. Hitscan with a raycaster,
// muzzle flash, tracers, ammo/reload, and police who shoot back.

import * as THREE from 'three';
import { WEAPON } from './config.js';

export function createCombat(G) {
  const raycaster = new THREE.Raycaster();
  // Visible tracer line, reused.
  const tracerGeo = new THREE.BufferGeometry();
  tracerGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
  const tracer = new THREE.Line(tracerGeo,
    new THREE.LineBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0 }));
  tracer.frustumCulled = false;
  G.scene.add(tracer);

  const C = {
    ammo: WEAPON.pistol.magSize,
    reloading: false,
    reloadUntil: 0,
    shotsRecently: 0,          // counts down; pedestrians flee while > 0
    lastShotPos: new THREE.Vector3(),
    tracerUntil: 0,

    // Shoot from the camera centre toward the crosshair.
    shoot() {
      if (G.mode !== 'playing') return;
      if (this.reloading) return;
      if (this.ammo <= 0) { this.startReload(); return; }
      this.ammo--;
      const cam = G.camera;
      raycaster.setFromCamera(new THREE.Vector2(0, 0), cam);
      raycaster.far = WEAPON.pistol.range;
      // Spread.
      raycaster.ray.direction.x += (Math.random() - 0.5) * WEAPON.pistol.spread * 2;
      raycaster.ray.direction.y += (Math.random() - 0.5) * WEAPON.pistol.spread * 2;
      raycaster.ray.direction.normalize();
      // Collect hittable meshes: cops, pedestrians, cars, helicopter.
      const targets = [];
      for (const cop of G.police.cops) if (cop.alive) targets.push(cop.mesh);
      for (const ped of G.peds) if (ped.alive) targets.push(ped.mesh);
      for (const car of G.cars) targets.push(car.mesh);
      if (G.police.heli) targets.push(G.police.heli.group);
      const hits = raycaster.intersectObjects(targets, true);
      const origin = raycaster.ray.origin.clone();
      let end = origin.clone().addScaledVector(raycaster.ray.direction, WEAPON.pistol.range);
      if (hits.length > 0) {
        const hit = hits[0];
        end = hit.point.clone();
        this.applyHit(hit.object, hit.point);
      }
      // Tracer + muzzle flash + sound.
      const posAttr = tracer.geometry.attributes.position;
      posAttr.setXYZ(0, origin.x, origin.y, origin.z);
      posAttr.setXYZ(1, end.x, end.y, end.z);
      posAttr.needsUpdate = true;
      tracer.material.opacity = 0.9;
      this.tracerUntil = performance.now() + 60;
      const muzzle = origin.clone().addScaledVector(raycaster.ray.direction, 1.2);
      G.effects.muzzleFlash(muzzle.x, muzzle.y, muzzle.z);
      G.audio.gunshot();
      G.effects.addShake(0.06);
      this.shotsRecently = 2;
      this.lastShotPos.copy(G.player.pos);
      G.police.addHeat(WEAPON.pistol.damage > 0 ? 12 : 0, 'fired a gun');
      G.stats.shotsFired++;
      if (this.ammo === 0) this.startReload();
    },

    applyHit(object, point) {
      // Walk up to the named parent (cop / ped / car / heli).
      let node = object;
      while (node && !node.userData.hitKind) node = node.parent;
      if (!node) return;
      const kind = node.userData.hitKind;
      if (kind === 'cop') {
        const cop = node.userData.ref;
        cop.health -= WEAPON.pistol.damage;
        G.effects.blood(point.x, point.y, point.z);
        if (cop.health <= 0) {
          G.police.killCop(cop);
          G.police.addHeat(30, 'took down an officer');
        }
      } else if (kind === 'ped') {
        const ped = node.userData.ref;
        G.pedestrians.knockDownPed(G, ped);
        G.police.addHeat(26, 'shot a pedestrian');
      } else if (kind === 'car') {
        const car = node.userData.ref;
        car.health = Math.max(0, car.health - 0.08);
        G.effects.sparks(point.x, point.y, point.z, 6);
        if (car.driver === 'traffic') {
          G.police.addHeat(6, 'shot a car');
          car.route = null; // driver bails: car stops
          car.speed = 0;
          car.driver = 'parked';
        }
      } else if (kind === 'heli') {
        G.police.heli.health -= WEAPON.pistol.damage;
        G.effects.sparks(point.x, point.y, point.z, 8);
        if (G.police.heli.health <= 0) G.police.downHelicopter();
      }
    },

    // Melee punch: F key, hits the nearest cop or pedestrian in front.
    punch() {
      if (G.mode !== 'playing' || !G.player.onFoot) return;
      G.audio.punch();
      const p = G.player.pos;
      const fx = Math.sin(G.player.heading), fz = Math.cos(G.player.heading);
      let best = null, bestD = 2.2;
      for (const cop of G.police.cops) {
        if (!cop.alive) continue;
        const d = Math.hypot(cop.pos.x - p.x, cop.pos.z - p.z);
        if (d < bestD) { best = { kind: 'cop', ref: cop }; bestD = d; }
      }
      for (const ped of G.peds) {
        if (!ped.alive) continue;
        const d = Math.hypot(ped.pos.x - p.x, ped.pos.z - p.z);
        if (d < bestD) { best = { kind: 'ped', ref: ped }; bestD = d; }
      }
      if (!best) return;
      if (best.kind === 'cop') {
        const cop = best.ref;
        cop.health -= 25;
        cop.pos.x += fx * 1.5; cop.pos.z += fz * 1.5;
        if (cop.health <= 0) { G.police.killCop(cop); G.police.addHeat(30, 'took down an officer'); }
        else G.police.addHeat(10, 'assaulted an officer');
      } else {
        G.pedestrians.knockDownPed(G, best.ref);
        G.police.addHeat(20, 'assaulted a pedestrian');
      }
      G.stats.punches++;
    },

    startReload() {
      if (this.reloading) return;
      this.reloading = true;
      this.reloadUntil = performance.now() + WEAPON.pistol.reloadMs;
      G.hud.toast('Reloading…');
    },

    // Police return fire: a cop within range and line of sight chips the player.
    copFire(dt) {
      for (const cop of G.police.cops) {
        if (!cop.alive || cop.shootCooldown > 0) { cop.shootCooldown -= dt; continue; }
        const d = cop.pos.distanceTo(G.player.pos);
        if (d < 32 && G.police.stars >= 1) {
          cop.shootCooldown = 1.1 + Math.random() * 0.8;
          // Hit chance falls with distance and player speed.
          const hitChance = Math.max(0.08, 0.45 - d * 0.01 - G.player.speed * 0.012);
          if (Math.random() < hitChance) {
            G.player.health -= 7 + Math.random() * 6;
            G.audio.gunshot();
            G.hud.flashDamage();
            G.effects.addShake(0.2);
            if (G.player.health <= 0) G.police.wasted();
          } else {
            G.audio.gunshot();
          }
        }
      }
    },

    update(dt) {
      this.shotsRecently = Math.max(0, this.shotsRecently - dt);
      if (this.reloading && performance.now() >= this.reloadUntil) {
        this.reloading = false;
        this.ammo = WEAPON.pistol.magSize;
      }
      if (tracer.material.opacity > 0 && performance.now() > this.tracerUntil) {
        tracer.material.opacity = 0;
      }
      this.copFire(dt);
    },
  };
  return C;
}
