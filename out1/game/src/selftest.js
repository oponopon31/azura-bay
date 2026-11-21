// selftest.js — Scripted playthrough that plays the game for real: it holds the
// same keys a player would, drives the road grid to each mission marker, shoots,
// and checks every system. Run with ?selftest=1. Results land in
// window.__testResults and console as [SELFTEST] lines.

import * as THREE from 'three';
import { nearestRoad, PLACES } from './config.js';

export function createSelfTest(G) {
  const results = [];
  window.__testResults = results;
  const log = (name, ok, detail) => {
    const row = { name, ok: !!ok, detail: detail || '', at: Math.round(G.elapsed * 10) / 10 };
    results.push(row);
    console.log(`[SELFTEST] ${ok ? 'PASS' : 'FAIL'} ${name} ${detail || ''}`);
  };

  // ---- Road-following autopilot ----
  const ap = {
    waypoints: [], target: null, stuckTimer: 0, reverseTimer: 0, repaths: 0, lastPos: null, lastMoveAt: 0,
    plan(from, to) {
      const fx = nearestRoad(from.x), fz = nearestRoad(from.z);
      const tx = nearestRoad(to.x), tz = nearestRoad(to.z);
      const wps = [];
      const push = (x, z) => {
        const last = wps[wps.length - 1];
        if (!last || Math.hypot(last.x - x, last.z - z) > 5) wps.push({ x, z });
      };
      push(fx, fz);
      if (tx !== fx) push(tx, fz);
      if (tz !== fz) push(tx, tz);
      push(to.x, to.z);
      this.waypoints = wps;
    },
    driveStep(dt, goal, arriveR) {
      const p = G.player;
      if (!p.car) return 'nocar';
      const goalMoved = !this.target || Math.hypot(this.target.x - goal.x, this.target.z - goal.z) > 12;
      if (goalMoved || this.waypoints.length === 0) { this.plan(p.pos, goal); this.target = { ...goal }; this.repaths++; }
      const wp = this.waypoints[0];
      const dWp = Math.hypot(wp.x - p.pos.x, wp.z - p.pos.z);
      if (dWp < 6) { this.waypoints.shift(); return this.waypoints.length === 0 ? 'arrived' : 'driving'; }
      const dGoal = Math.hypot(goal.x - p.pos.x, goal.z - p.pos.z);
      const k = G.input.keys;
      if (dGoal < arriveR) {
        // At the goal: brake to a stop and hold.
        k['KeyW'] = false; k['KeyA'] = false; k['KeyD'] = false;
        k['KeyS'] = Math.abs(p.speed) > 1;
        k['Space'] = Math.abs(p.speed) > 6;
        return Math.abs(p.speed) < 3 ? 'arrived' : 'driving';
      }
      // Ease off and brake when closing on the goal.
      if (dGoal < 22 && Math.abs(p.speed) > 8) { k['KeyW'] = false; k['KeyS'] = true; k['KeyA'] = false; k['KeyD'] = false; return 'driving'; }
      // Steer toward the waypoint.
      const want = Math.atan2(wp.x - p.pos.x, wp.z - p.pos.z);
      let dh = want - p.car.heading;
      while (dh > Math.PI) dh -= Math.PI * 2;
      while (dh < -Math.PI) dh += Math.PI * 2;
      k['KeyW'] = true;
      k['KeyS'] = false;
      if (this.reverseTimer > 0) {
        this.reverseTimer -= dt;
        k['KeyW'] = false; k['KeyS'] = true; k['KeyA'] = false; k['KeyD'] = false;
        return 'driving';
      }
      k['KeyA'] = dh > 0.08;
      k['KeyD'] = dh < -0.08;
      if (Math.abs(dh) > 1.2) k['KeyW'] = Math.abs(p.speed) < 4; // slow down for sharp turns
      // Stuck? Reverse out and replan.
      if (!this.lastPos) this.lastPos = p.pos.clone();
      if (p.pos.distanceTo(this.lastPos) > 1.5) { this.lastPos.copy(p.pos); this.lastMoveAt = G.elapsed; }
      if (G.elapsed - this.lastMoveAt > 3 && p.speed < 1) {
        this.reverseTimer = 1.2;
        this.lastMoveAt = G.elapsed;
        this.plan(p.pos, goal);
      }
      return 'driving';
    },
    walkStep(dt, goal, arriveR) {
      const p = G.player;
      const d = Math.hypot(goal.x - p.pos.x, goal.z - p.pos.z);
      if (d < arriveR) return 'arrived';
      const want = Math.atan2(goal.x - p.pos.x, goal.z - p.pos.z);
      // Camera looks along -camYaw; to walk toward `want`, set camYaw = want + PI.
      p.camYaw = want + Math.PI;
      const k = G.input.keys;
      k['KeyW'] = true; k['ShiftLeft'] = true;
      k['KeyA'] = false; k['KeyD'] = false; k['KeyS'] = false;
      if (!this.lastPos) this.lastPos = p.pos.clone();
      if (p.pos.distanceTo(this.lastPos) > 1) { this.lastPos.copy(p.pos); this.lastMoveAt = G.elapsed; }
      if (G.elapsed - this.lastMoveAt > 3) {
        // Sidestep around whatever blocks us.
        k['KeyA'] = true; k['KeyW'] = true;
        this.lastMoveAt = G.elapsed;
        setTimeout(() => { G.input.keys['KeyA'] = false; }, 700);
      }
      return 'walking';
    },
    clearKeys() {
      for (const key of Object.keys(G.input.keys)) G.input.keys[key] = false;
    },
  };

  // Each step: {name, run(dt) -> 'done'|'fail'|null, timeout}
  const steps = [];
  let stepIdx = 0;
  let stepTime = 0;
  let moneyAfterM1 = 0;
  let targetCarRef = null;

  const wait = (seconds, fn) => ({ name: `wait`, run: (dt) => { stepTime += dt; return stepTime >= seconds ? 'done' : null; }, timeout: seconds + 5 });

  steps.push({
    name: 'boot: game running, HUD present',
    run: () => {
      const ok = G.mode === 'playing' && !!document.getElementById('minimap') && G.cars.length > 20 && G.peds.length > 20;
      return ok ? 'done' : 'fail';
    },
    timeout: 5,
  });
  steps.push({
    name: 'walk: W moves the player on foot',
    run: (dt) => {
      G.input.keys['KeyW'] = true;
      stepTime += dt;
      if (stepTime > 2) {
        G.input.keys['KeyW'] = false;
        return G.player.pos.distanceTo(new THREE.Vector3(-40, 0, 250)) > 5 ? 'done' : 'fail';
      }
      return null;
    },
    timeout: 8,
  });
  steps.push({
    name: 'enter car: walk to a parked car, press E',
    run: (dt) => {
      if (G.player.onFoot) {
        const car = G.driving.nearestEnterable();
        if (car) { G.pressKey('KeyE'); return 'done'; }
        const parked = G.cars.find((c) => c.driver === 'parked');
        if (!parked) return 'fail';
        const r = ap.walkStep(dt, { x: parked.pos.x, z: parked.pos.z }, 3.5);
        if (r === 'arrived') { G.pressKey('KeyE'); return 'done'; }
        return null;
      }
      return 'done';
    },
    timeout: 60,
  });
  steps.push({
    name: 'steal raises wanted (mission 1 stage 1)',
    run: () => (G.police.stars >= 1 && !G.player.onFoot ? 'done' : 'fail'),
    timeout: 5,
  });
  steps.push({
    name: 'mission 1: deliver the stolen car to the garage',
    run: (dt) => {
      if (G.missions.index > 0) { moneyAfterM1 = G.money; return 'done'; }
      if (!G.player.car) return 'fail';
      return ap.driveStep(dt, { x: PLACES.garage.x, z: PLACES.garage.z }, 8) === 'arrived' ? null : null;
    },
    timeout: 120,
  });
  steps.push({
    name: 'mission 1 payout landed',
    run: () => (moneyAfterM1 >= 800 ? 'done' : 'fail'),
    timeout: 5,
  });
  steps.push({
    name: 'mission 2: courier run, 3 drops in time',
    run: (dt) => {
      if (G.missions.index > 1) return 'done';
      if (G.missions.index < 1) return null; // waiting for mission 2 to start
      if (!G.player.car) {
        const car = G.driving.nearestEnterable();
        if (car) { G.pressKey('KeyE'); return null; }
        return 'fail';
      }
      const d = PLACES.courierDrops[G.missions.dropIndex];
      if (!d) return null;
      ap.driveStep(dt, { x: d.x, z: d.z }, 8);
      return null;
    },
    timeout: 170,
  });
  steps.push({
    name: 'mission 3: tail the target 45s without being spotted',
    run: (dt) => {
      if (G.missions.index > 2) return 'done';
      if (G.missions.index < 2) return null;
      if (!G.missions.targetCar) return null;
      targetCarRef = G.missions.targetCar;
      if (!G.player.car) {
        const car = G.driving.nearestEnterable();
        if (car) { G.pressKey('KeyE'); return null; }
        return 'fail';
      }
      // Follow point: 30m behind the target car.
      const t = G.missions.targetCar;
      const follow = {
        x: t.pos.x - Math.sin(t.heading) * 30,
        z: t.pos.z - Math.cos(t.heading) * 30,
      };
      ap.driveStep(dt, follow, 25);
      return null;
    },
    timeout: 180,
  });
  steps.push({
    name: 'mission 4: reach 3 stars then lose the cops',
    run: (dt) => {
      if (G.missions.index > 3) return 'done';
      if (G.missions.index < 3) return null;
      if (!G.missions.reachedThreeStars) {
        // Commit crimes the real way: ram parked cars + add heat from the chase.
        if (!G.player.car) {
          const car = G.driving.nearestEnterable();
          if (car) G.pressKey('KeyE');
          return null;
        }
        const parked = G.cars.find((c) => c.driver === 'parked');
        if (parked) ap.driveStep(dt, { x: parked.pos.x, z: parked.pos.z }, 3);
        // Top up with gunfire heat if ramming is slow (still a real crime path).
        if (G.elapsed % 5 < dt) G.combat.shoot();
        if (G.police.stars >= 3) return null;
        return null;
      }
      // Stage 2: hide — stop, get out, wait out of sight.
      if (G.player.car) { G.pressKey('KeyE'); }
      ap.clearKeys();
      // Hide in the park block.
      const r = ap.walkStep(dt, { x: 0, z: 0 }, 6);
      return null;
    },
    timeout: 240,
  });
  steps.push({
    name: 'mission 5: harbor heist — grab the package, escape to the safehouse',
    run: (dt) => {
      if (G.missions.index > 4) return 'done';
      if (G.missions.index < 4) return null;
      if (G.missions.stage === 0) {
        if (G.player.car) {
          // Drive to the harbor edge, then get out.
          const r = ap.driveStep(dt, { x: 330, z: 40 }, 12);
          if (r === 'arrived' || Math.hypot(G.player.pos.x - 330, G.player.pos.z - 40) < 14) {
            G.pressKey('KeyE');
            ap.clearKeys();
          }
          return null;
        }
        const r = ap.walkStep(dt, { x: PLACES.harbor.x, z: PLACES.harbor.z }, 4);
        return null;
      }
      // Stage 1: escape. Get in any nearby car and drive to the safehouse door.
      if (G.player.onFoot) {
        const car = G.driving.nearestEnterable();
        if (car) { G.pressKey('KeyE'); return null; }
        const parked = G.cars.find((c) => c.driver === 'parked' || c.driver === 'traffic');
        if (parked) { ap.walkStep(dt, { x: parked.pos.x, z: parked.pos.z }, 3.5); return null; }
        ap.walkStep(dt, { x: PLACES.safehouseDoor.x, z: PLACES.safehouseDoor.z }, 8);
        return null;
      }
      ap.driveStep(dt, { x: PLACES.safehouseDoor.x, z: PLACES.safehouseDoor.z }, 9);
      return null;
    },
    timeout: 240,
  });
  steps.push({
    name: 'story complete: all 5 missions paid',
    run: () => (G.missions.index >= 5 && G.money >= 250 + 800 + 1200 + 1500 + 2000 + 5000 ? 'done' : 'fail'),
    timeout: 5,
  });
  steps.push({
    name: 'combat: shooting a cop damages them',
    run: () => {
      const cop = G.police.spawnCop();
      cop.pos.set(G.player.pos.x + 8, 0, G.player.pos.z);
      cop.mesh.position.copy(cop.pos);
      // Aim the camera at the cop and fire through the real raycast path.
      const dx = cop.pos.x - G.player.pos.x, dz = cop.pos.z - G.player.pos.z;
      G.player.camYaw = Math.atan2(-dx, -dz);
      G.player.aiming = true;
      const before = cop.health;
      G.combat.shoot();
      G.player.aiming = false;
      return cop.health < before ? 'done' : 'fail';
    },
    timeout: 10,
  });
  steps.push({
    name: 'save/load: progress survives a reload of the save',
    run: () => {
      const cash = G.money;
      G.saveGame();
      G.money = 0;
      const ok = G.save.load() && G.money === cash;
      return ok ? 'done' : 'fail';
    },
    timeout: 5,
  });
  steps.push({
    name: 'wanted decay: heat falls when hidden',
    run: (dt) => {
      G.police.addHeat(40, 'test heat');
      G.police.lastSeen = G.elapsed - 30;
      stepTime += dt;
      if (stepTime > 12) {
        return G.police.heat < 40 ? 'done' : 'fail';
      }
      return null;
    },
    timeout: 20,
  });

  let done = false;
  return {
    results,
    get done() { return done; },
    update(dt) {
      if (done) return;
      const step = steps[stepIdx];
      if (!step) {
        done = true;
        const passed = results.filter((r) => r.ok).length;
        console.log(`[SELFTEST] FINISHED ${passed}/${results.length} passed`);
        document.title = 'SELFTEST DONE';
        window.__selftestDone = true;
        return;
      }
      stepTime += 0; // per-step timers accumulate inside run()
      let outcome = null;
      try {
        outcome = step.run(dt);
      } catch (e) {
        log(step.name, false, 'exception: ' + e.message);
        outcome = 'fail';
      }
      if (outcome === 'done') {
        log(step.name, true, '');
        stepIdx++;
        stepTime = 0;
        ap.clearKeys();
        ap.waypoints = [];
        ap.target = null;
      } else if (outcome === 'fail') {
        log(step.name, false, `step ${stepIdx} failed at t=${Math.round(G.elapsed)}s, mission=${G.missions.index}, pos=(${Math.round(G.player.pos.x)},${Math.round(G.player.pos.z)})`);
        stepIdx++;
        stepTime = 0;
        ap.clearKeys();
        ap.waypoints = [];
        ap.target = null;
      }
      // Per-step timeout: track elapsed in this step via G.elapsed marker.
      if (step._start === undefined) step._start = G.elapsed;
      if (G.elapsed - step._start > step.timeout) {
        log(step.name, false, `timeout after ${step.timeout}s (mission=${G.missions.index}, stars=${G.police.stars})`);
        stepIdx++;
        stepTime = 0;
        ap.clearKeys();
        ap.waypoints = [];
        ap.target = null;
      }
    },
  };
}
