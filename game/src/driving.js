// driving.js — Arcade car physics for the player's car: acceleration, braking,
// steering, off-road handling, building crashes, and entering/exiting cars.

import * as THREE from 'three';
import { onRoad } from './config.js';
import { resolveCollision } from './player.js';

export function createDriving(G) {
  const D = {
    // Nearest car the player could enter (within 4.5 m), or null.
    nearestEnterable() {
      if (!G.player.onFoot) return null;
      let best = null, bestD = 4.5;
      for (const car of G.cars) {
        if (car.driver === 'player') continue;
        const d = Math.hypot(car.pos.x - G.player.pos.x, car.pos.z - G.player.pos.z);
        if (d < bestD) { best = car; bestD = d; }
      }
      return best;
    },

    enterCar(car) {
      if (!car || !G.player.onFoot) return false;
      const wasParkedOrTraffic = car.driver === 'parked' || car.driver === 'traffic';
      const wasTarget = car.driver === 'target';
      car.driver = 'player';
      G.player.car = car;
      G.player.onFoot = false;
      G.player.mesh.visible = false;
      G.player.camYaw = car.heading + Math.PI;
      if (wasParkedOrTraffic) {
        G.police.addHeat(18, 'stole a car');
        G.hud.toast('Car stolen — the owner called it in!');
        G.audio.blip(220, 0.15, 'square', 0.15);
      }
      if (wasTarget) G.missions.onTargetCarStolen();
      G.stats.carsStolen++;
      return true;
    },

    exitCar() {
      if (G.player.onFoot || !G.player.car) return;
      G.player.exitCar();
      G.audio.blip(330, 0.08, 'square', 0.12);
    },

    update(dt) {
      const player = G.player;
      if (player.onFoot || !player.car) return;
      const car = player.car;
      const k = G.input.keys;
      const cls = car.cls;
      const offRoad = !onRoad(car.pos.x, car.pos.z);
      const gripMul = offRoad ? 0.55 : 1;
      const maxSpd = cls.maxSpeed * (offRoad ? 0.6 : 1);

      // Throttle / brake / reverse.
      if (k['KeyW'] || k['ArrowUp']) car.speed += cls.accel * gripMul * dt;
      else if (k['KeyS'] || k['ArrowDown']) {
        if (car.speed > 0.5) car.speed -= cls.brake * dt;
        else car.speed -= cls.accel * 0.6 * dt; // reverse
      } else {
        car.speed -= Math.sign(car.speed) * Math.min(Math.abs(car.speed), 8 * dt);
      }
      // Handbrake.
      if (k['Space']) car.speed -= Math.sign(car.speed) * Math.min(Math.abs(car.speed), 26 * dt);
      car.speed = THREE.MathUtils.clamp(car.speed, -cls.maxReverse, maxSpd);
      // Steering: stronger at low speed, none at standstill; drift off-road.
      let steerIn = 0;
      if (k['KeyA'] || k['ArrowLeft']) steerIn += 1;
      if (k['KeyD'] || k['ArrowRight']) steerIn -= 1;
      const steerTarget = steerIn * cls.turn * (offRoad ? 0.7 : 1);
      car.steer += (steerTarget - car.steer) * Math.min(1, 8 * dt);
      const speedFactor = THREE.MathUtils.clamp(Math.abs(car.speed) / 10, 0, 1);
      car.heading += car.steer * speedFactor * dt * (car.speed >= 0 ? 1 : -1) * 1.0;
      // Integrate.
      const prevX = car.pos.x, prevZ = car.pos.z;
      car.pos.x += Math.sin(car.heading) * car.speed * dt;
      car.pos.z += Math.cos(car.heading) * car.speed * dt;
      // Building collision: stop, damage, sparks, shake.
      if (resolveCollision(G, car.pos, car.radius)) {
        const impact = Math.abs(car.speed);
        car.pos.x = prevX; car.pos.z = prevZ;
        if (impact > 3) {
          car.speed *= -0.25;
          // Damage and crash effects at most once per 0.5 s: a car grinding
          // along a wall would otherwise wreck in under a second.
          const now = G.elapsed;
          if (now - (car.lastBuildingHitAt || 0) > 0.5) {
            car.lastBuildingHitAt = now;
            const dmg = Math.min(0.12, impact * 0.006);
            car.health = Math.max(0, car.health - dmg);
            G.effects.sparks(car.pos.x, 1, car.pos.z, Math.min(24, 4 + impact));
            G.effects.addShake(Math.min(0.5, impact * 0.02));
            G.audio.crash(impact / 30);
            // Only a hard crash counts as reckless driving.
            if (impact > 8) G.police.addHeat(4, 'crashed into a building');
          }
        } else {
          car.speed *= 0.5;
        }
      }
      // City bounds.
      car.pos.x = THREE.MathUtils.clamp(car.pos.x, -360, 470);
      car.pos.z = THREE.MathUtils.clamp(car.pos.z, -360, 430);
      // Hitting pedestrians while driving.
      for (const ped of G.peds) {
        if (!ped.alive) continue;
        const d = Math.hypot(ped.pos.x - car.pos.x, ped.pos.z - car.pos.z);
        if (d < 2.2 && Math.abs(car.speed) > 2) {
          G.pedestrians.knockDownPed(G, ped);
          G.police.addHeat(26, 'hit a pedestrian');
          G.hud.toast('You hit a pedestrian!');
          G.effects.addShake(0.4);
          G.audio.crash(0.4);
          car.speed *= 0.7;
        }
      }
      // Smoke + speed lines feedback.
      if (car.health < 0.35 && Math.random() < dt * 8) {
        G.effects.smoke(car.pos.x, 1.2, car.pos.z, 1);
      }
      player.pos.copy(car.pos);
      player.speed = Math.abs(car.speed);
      player.heading = car.heading;
    },

    // Chase camera: behind and above the car, easing into place.
    updateCamera(dt) {
      const player = G.player;
      const car = player.car;
      if (!car) return;
      const cam = G.camera;
      const back = 9.5 + Math.abs(car.speed) * 0.08;
      const height = 3.6 + Math.abs(car.speed) * 0.02;
      const tx = car.pos.x - Math.sin(car.heading) * back;
      const tz = car.pos.z - Math.cos(car.heading) * back;
      const desired = new THREE.Vector3(tx, height, tz);
      desired.y = Math.max(desired.y, 1.4);
      cam.position.lerp(desired, Math.min(1, 6 * dt));
      const shake = G.effects.shakeOffset();
      const look = new THREE.Vector3(
        car.pos.x + Math.sin(car.heading) * 6 + shake.x,
        1.4 + shake.y,
        car.pos.z + Math.cos(car.heading) * 6);
      cam.lookAt(look);
    },
  };
  return D;
}
