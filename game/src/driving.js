// driving.js — Arcade car physics for the player's car: acceleration, braking,
// steering, off-road handling, building crashes, and entering/exiting cars.
// Bab 18/21/24/26: flat tires pull to one side, Auto-Drive follows the GPS,
// double-tap E leaves the engine running, X slams the door into a side car,
// and the DualSense-style speed limiter holds a steady cruise speed.
// lastExitAt is the double-tap E clock — two quick E presses leave the
// engine running on exit (Bab 24).
// Round 5: Game replaces G; the physics are unchanged.

import { resolveCollision } from './player.js';
import { onRoad } from './config.js';
import * as THREE from 'three';

export function createDriving(Game) {
  const D = {
    autoDrive: false,     // Bab 18: car drives itself to the GPS target
    autoTarget: null,     // {x, z}
    speedLimiter: false,  // Bab 26: hold a steady speed with the flow
    limiterSpeed: 0,
    lastExitAt: 0,        // double-tap E detection (Bab 24)
    engineLeftOn: false,

    // Nearest car the player could enter (within 4.5 m), or null.
    // A wrecked car (health near 0) is not enterable: its engine is dead,
    // and re-entering it after bailing out just strands the player again.
    nearestEnterable() {
      if (!Game.player.onFoot) return null;
      let best = null, bestD = 4.5;
      for (const car of Game.cars) {
        if (car.driver === 'player') continue;
        if ((car.health ?? 1) < 0.15) continue;
        const d = Math.hypot(car.pos.x - Game.player.pos.x, car.pos.z - Game.player.pos.z);
        if (d < bestD) { best = car; bestD = d; }
      }
      return best;
    },

    enterCar(car) {
      if (!car || !Game.player.onFoot) return false;
      const wasParkedOrTraffic = car.driver === 'parked' || car.driver === 'traffic';
      const wasTarget = car.driver === 'target';
      car.driver = 'player';
      Game.player.car = car;
      Game.player.onFoot = false;
      Game.player.mesh.visible = false;
      Game.player.camYaw = car.heading + Math.PI;
      if (wasParkedOrTraffic) {
        Game.police.addHeat(18, 'stole a car');
        Game.hud.toast('Car stolen — the owner called it in!');
        Game.audio.blip(220, 0.15, 'square', 0.15);
      }
      if (wasTarget) Game.missions.onTargetCarStolen();
      Game.stats.carsStolen++;
      return true;
    },

    // E to exit. Double-tap E (within 400 ms) leaves the engine running
    // (Bab 24) — the car keeps idling for a fast getaway.
    exitCar() {
      if (Game.player.onFoot || !Game.player.car) return;
      const now = performance.now();
      this.engineLeftOn = (now - this.lastExitAt) < 400;
      this.lastExitAt = now;
      Game.player.exitCar();
      Game.audio.blip(330, 0.08, 'square', 0.12);
      if (this.engineLeftOn) Game.hud.toast('Engine left running — quick getaway ready.');
    },

    // Bab 18 Auto-Drive: hold Down + Cinematic Camera in the old spec; here
    // the Quick GPS / Auto-Drive button (KeyT) toggles it toward the marker.
    setAutoDrive(on, target) {
      this.autoDrive = on;
      this.autoTarget = target || (Game.missions.marker ? { x: Game.missions.marker.x, z: Game.missions.marker.z } : null);
      if (on && this.autoTarget) Game.hud.toast('Auto-Drive on — following the GPS.');
      else if (on) { this.autoDrive = false; Game.hud.toast('Auto-Drive needs a destination first.'); }
    },

    // Bab 24 side attack: X while driving slams the door into the car
    // beside you (a side kick on a bike).
    sideAttack() {
      const player = Game.player;
      if (player.onFoot || !player.car) return false;
      const car = player.car;
      const sideX = Math.cos(car.heading), sideZ = -Math.sin(car.heading);
      let hit = false;
      for (const other of Game.cars) {
        if (other === car) continue;
        const dx = other.pos.x - car.pos.x, dz = other.pos.z - car.pos.z;
        const side = dx * sideX + dz * sideZ;
        const ahead = dx * Math.sin(car.heading) + dz * Math.cos(car.heading);
        if (Math.abs(side) < 5 && Math.abs(ahead) < 5) {
          other.health = Math.max(0, other.health - 0.05);
          other.speed *= 0.5;
          Game.effects.sparks(other.pos.x, 1, other.pos.z, 10);
          Game.audio.crash(0.5);
          hit = true;
        }
      }
      if (hit) Game.hud.toast('Door slam!');
      return hit;
    },

    update(dt) {
      const player = Game.player;
      if (player.onFoot || !player.car) return;
      const car = player.car;
      const k = Game.input.keys;
      const cls = car.cls;
      const offRoad = !onRoad(car.pos.x, car.pos.z);
      const gripMul = offRoad ? 0.55 : 1;
      const maxSpd = cls.maxSpeed * (offRoad ? 0.6 : 1);
      // A wrecked car (health 0) has a dead engine: no throttle, it just
      // coasts to a stop. The player has to bail out and steal a fresh car.
      const engineDead = (car.health ?? 1) <= 0;

      // Flat tire (Bab 21): the car pulls hard to one side and is easy to
      // lose on a pothole / speed bump. Set car.flatTire = 'left'|'right'.
      let flatPull = 0;
      if (car.flatTire) {
        flatPull = car.flatTire === 'left' ? 0.9 : -0.9;
        car.speed *= (1 - 0.12 * dt);
      }

      // Auto-Drive steers itself toward the GPS target and obeys the road.
      if (this.autoDrive && this.autoTarget) {
        const dx = this.autoTarget.x - car.pos.x, dz = this.autoTarget.z - car.pos.z;
        const d = Math.hypot(dx, dz);
        if (d < 8) { this.autoDrive = false; Game.hud.toast('Auto-Drive: arrived.'); }
        else {
          const want = Math.atan2(dx, dz);
          let dh = want - car.heading;
          while (dh > Math.PI) dh -= Math.PI * 2;
          while (dh < -Math.PI) dh += Math.PI * 2;
          car.steer = THREE.MathUtils.clamp(dh * 1.5, -cls.turn, cls.turn);
          if (!engineDead) car.speed += cls.accel * 0.6 * dt;
          car.speed = THREE.MathUtils.clamp(car.speed, -cls.maxReverse, Math.min(maxSpd, 18));
        }
      } else {
        // Throttle / brake / reverse.
        if (!engineDead && (k['KeyW'] || k['ArrowUp'])) car.speed += cls.accel * gripMul * dt;
        else if (k['KeyS'] || k['ArrowDown']) {
          if (car.speed > 0.5) car.speed -= cls.brake * dt;
          else car.speed -= cls.accel * 0.6 * dt; // reverse
        } else {
          car.speed -= Math.sign(car.speed) * Math.min(Math.abs(car.speed), 8 * dt);
        }
        // Handbrake.
        if (k['Space']) car.speed -= Math.sign(car.speed) * Math.min(Math.abs(car.speed), 26 * dt);
        // Speed limiter (Bab 26): hold the cruise speed with the flow.
        if (this.speedLimiter && Math.abs(car.speed) > this.limiterSpeed) {
          car.speed -= Math.sign(car.speed) * Math.min(Math.abs(car.speed - this.limiterSpeed), 20 * dt);
        }
        car.speed = THREE.MathUtils.clamp(car.speed, -cls.maxReverse, maxSpd);
        // Steering: stronger at low speed, none at standstill; drift off-road.
        let steerIn = 0;
        if (k['KeyA'] || k['ArrowLeft']) steerIn += 1;
        if (k['KeyD'] || k['ArrowRight']) steerIn -= 1;
        const steerTarget = steerIn * cls.turn * (offRoad ? 0.7 : 1);
        car.steer += (steerTarget - car.steer) * Math.min(1, 8 * dt);
      }
      const speedFactor = THREE.MathUtils.clamp(Math.abs(car.speed) / 10, 0, 1);
      car.heading += (car.steer + flatPull * speedFactor) * speedFactor * dt * (car.speed >= 0 ? 1 : -1) * 1.0;
      // Integrate.
      const prevX = car.pos.x, prevZ = car.pos.z;
      car.pos.x += Math.sin(car.heading) * car.speed * dt;
      car.pos.z += Math.cos(car.heading) * car.speed * dt;
      // Building collision: stop, damage, sparks, shake.
      if (resolveCollision(Game, car.pos, car.radius)) {
        const impact = Math.abs(car.speed);
        car.pos.x = prevX; car.pos.z = prevZ;
        if (impact > 3) {
          car.speed *= -0.25;
          // Damage and crash effects at most once per 0.5 s: a car grinding
          // along a wall would otherwise wreck in under a second.
          const now = Game.elapsed;
          if (now - (car.lastBuildingHitAt || 0) > 0.5) {
            car.lastBuildingHitAt = now;
            const dmg = Math.min(0.12, impact * 0.006);
            car.health = Math.max(0, car.health - dmg);
            Game.effects.sparks(car.pos.x, 1, car.pos.z, Math.min(24, 4 + impact));
            Game.effects.addShake(Math.min(0.5, impact * 0.02));
            Game.audio.crash(impact / 30);
            // Only a hard crash counts as reckless driving.
            if (impact > 8) Game.police.addHeat(4, 'crashed into a building');
          }
        } else {
          car.speed *= 0.5;
        }
      }
      // City bounds.
      car.pos.x = THREE.MathUtils.clamp(car.pos.x, -360, 470);
      car.pos.z = THREE.MathUtils.clamp(car.pos.z, -360, 430);
      // Hitting pedestrians while driving.
      for (const ped of Game.peds) {
        if (!ped.alive) continue;
        const d = Math.hypot(ped.pos.x - car.pos.x, ped.pos.z - car.pos.z);
        if (d < 2.2 && Math.abs(car.speed) > 2) {
          Game.pedestrians.knockDownPed(Game, ped);
          Game.police.addHeat(26, 'hit a pedestrian');
          Game.hud.toast('You hit a pedestrian!');
          Game.effects.addShake(0.4);
          Game.audio.crash(0.4);
          car.speed *= 0.7;
        }
      }
      // Smoke + speed lines feedback.
      if (car.health < 0.35 && Math.random() < dt * 8) {
        Game.effects.smoke(car.pos.x, 1.2, car.pos.z, 1);
      }
      player.pos.copy(car.pos);
      player.speed = Math.abs(car.speed);
      player.heading = car.heading;
    },

    // Chase camera: behind and above the car, easing into place.
    updateCamera(dt) {
      const player = Game.player;
      const car = player.car;
      if (!car) return;
      const cam = Game.camera;
      const back = 9.5 + Math.abs(car.speed) * 0.08;
      const height = 3.6 + Math.abs(car.speed) * 0.02;
      const tx = car.pos.x - Math.sin(car.heading) * back;
      const tz = car.pos.z - Math.cos(car.heading) * back;
      const desired = new THREE.Vector3(tx, height, tz);
      desired.y = Math.max(desired.y, 1.4);
      cam.position.lerp(desired, Math.min(1, 6 * dt));
      const shake = Game.effects.shakeOffset();
      const look = new THREE.Vector3(
        car.pos.x + Math.sin(car.heading) * 6 + shake.x,
        1.4 + shake.y,
        car.pos.z + Math.cos(car.heading) * 6);
      cam.lookAt(look);
    },
  };
  return D;
}

// ---- Round 3: stopping math (HUD driving tips + self-test) ----
// Braking distance in metres at speed m/s, steady 18 m/s^2 deceleration.
export function brakingDistance(speed) {
  return (speed * speed) / (2 * 18);
}

export function stoppingTime(speed) {
  return speed / 18;
}
