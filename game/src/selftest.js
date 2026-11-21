// selftest.js — Scripted playthrough that plays the game for real: it holds the
// same keys a player would, drives the road grid to each mission marker, shoots,
// and checks every system. Run with ?selftest=1. Results land in
// window.__testResults and console as [SELFTEST] lines.

import * as THREE from 'three';
import { nearestRoad, CITY_HALF, PLACES } from './config.js';

export function createSelfTest(G) {
  const results = [];
  window.__testResults = results;
  const log = (name, ok, detail) => {
    const row = { name, ok: !!ok, detail: detail || '', at: Math.round(G.elapsed * 10) / 10 };
    results.push(row);
    console.log(`[SELFTEST] ${ok ? 'PASS' : 'FAIL'} ${name} ${detail || ''}`);
  };

  // ---- Road-following autopilot ----
  // ---- Tail-follow: drive the target's loop behind it, keeping a 30 m gap ----
  // The loop is a rectangle on the roads; the player joins it and trails the
  // target along it, instead of chasing the target's bare position (which
  // drove the player head-on into it and into donuts at the corners).
  const TAIL_LOOP = [
    { x: -240, z: -160 }, { x: -80, z: -160 },
    { x: -80, z: 0 }, { x: -240, z: 0 },
  ];
  const LOOP_LEN = 640;
  function loopArc(x, z) {
    // Arc position (0..640) of the nearest point on the loop to (x, z).
    let best = { arc: 0, d2: 1e18 };
    for (let i = 0; i < 4; i++) {
      const a = TAIL_LOOP[i], b = TAIL_LOOP[(i + 1) % 4];
      const abx = b.x - a.x, abz = b.z - a.z;
      const len2 = abx * abx + abz * abz;
      let t = ((x - a.x) * abx + (z - a.z) * abz) / len2;
      t = Math.max(0, Math.min(1, t));
      const px = a.x + abx * t, pz = a.z + abz * t;
      const d2 = (x - px) * (x - px) + (z - pz) * (z - pz);
      if (d2 < best.d2) best = { arc: i * 160 + t * 160, d2 };
    }
    return best.arc;
  }
  function loopPoint(arc) {
    const a = ((arc % LOOP_LEN) + LOOP_LEN) % LOOP_LEN;
    const i = Math.floor(a / 160) % 4;
    const t = (a - i * 160) / 160;
    const p = TAIL_LOOP[i], q = TAIL_LOOP[(i + 1) % 4];
    return { x: p.x + (q.x - p.x) * t, z: p.z + (q.z - p.z) * t, nextIdx: (i + 1) % 4 };
  }

  const ap = {
    waypoints: [], target: null, stuckTimer: 0, reverseTimer: 0, repaths: 0, lastPos: null, lastMoveAt: 0,
    plan(from, to) {
      // Close to the goal: drive straight at it, no detour via intersections.
      if (Math.hypot(to.x - from.x, to.z - from.z) < 25) {
        this.waypoints = [{ x: to.x, z: to.z }];
        return;
      }
      // Road centrelines, clamped to the city grid (never off the map edge).
      const clampRoad = (v) => THREE.MathUtils.clamp(nearestRoad(v), -CITY_HALF, CITY_HALF);
      const fx = clampRoad(from.x), fz = clampRoad(from.z);
      const tx = clampRoad(to.x), tz = clampRoad(to.z);
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
    driveStep(dt, goal, arriveR, opts = {}) {
      const p = G.player;
      if (!p.car) return 'nocar';
      const k = G.input.keys;
      // At the goal: brake to a stop and hold — unless following a moving
      // target, where the car matches speed instead of stopping.
      const dGoal0 = Math.hypot(goal.x - p.pos.x, goal.z - p.pos.z);
      if (dGoal0 < arriveR && !opts.follow) {
        k['KeyW'] = false; k['KeyA'] = false; k['KeyD'] = false;
        k['KeyS'] = Math.abs(p.speed) > 1;
        k['Space'] = Math.abs(p.speed) > 6;
        return Math.abs(p.speed) < 3 ? 'arrived' : 'driving';
      }
      // Follow mode: cap speed by distance to the target so the car trails
      // it smoothly instead of sprinting up and braking to a stop.
      const followCap = opts.follow
        ? (dGoal0 > 60 ? 30 : dGoal0 > 40 ? 18 : dGoal0 > 25 ? 12 : 9)
        : Infinity;
      const goalMoved = !this.target || Math.hypot(this.target.x - goal.x, this.target.z - goal.z) > 12;
      // Replan at most every 2 game-seconds for a moving goal, so the car
      // commits to a route instead of oscillating between fresh plans.
      if ((goalMoved && G.elapsed - (this.lastPlanAt || 0) > 2) || this.waypoints.length === 0) {
        this.plan(p.pos, goal); this.target = { ...goal }; this.repaths++;
        this.lastPlanAt = G.elapsed;
        this.goalDist = undefined;
      }
      const wp = this.waypoints[0];
      const dWp = Math.hypot(wp.x - p.pos.x, wp.z - p.pos.z);
      if (dWp < 6) { this.waypoints.shift(); return this.waypoints.length === 0 ? 'arrived' : 'driving'; }
      // Corner slowdown: if the route turns sharply at this waypoint, brake
      // early so the car can make the turn inside the road, not through a wall.
      const next = this.waypoints[1];
      if (next) {
        const leg1 = Math.atan2(wp.x - p.pos.x, wp.z - p.pos.z);
        const leg2 = Math.atan2(next.x - wp.x, next.z - wp.z);
        let turn = leg2 - leg1;
        while (turn > Math.PI) turn -= Math.PI * 2;
        while (turn < -Math.PI) turn += Math.PI * 2;
        if (Math.abs(turn) > 0.7 && dWp < 40 && Math.abs(p.speed) > 10) {
          k['KeyW'] = false; k['KeyS'] = true; k['KeyA'] = false; k['KeyD'] = false;
          return 'driving';
        }
      }
      const dGoal = Math.hypot(goal.x - p.pos.x, goal.z - p.pos.z);
      // Ease off and brake when closing on the goal (not in follow mode).
      if (!opts.follow && dGoal < 22 && Math.abs(p.speed) > 8) { k['KeyW'] = false; k['KeyS'] = true; k['KeyA'] = false; k['KeyD'] = false; return 'driving'; }
      // Brake for a pedestrian ahead — do not run people over.
      const fx = Math.sin(p.car.heading), fz = Math.cos(p.car.heading);
      for (const ped of G.peds) {
        if (!ped.alive) continue;
        const pdx = ped.pos.x - p.pos.x, pdz = ped.pos.z - p.pos.z;
        const ahead = pdx * fx + pdz * fz;
        const side = Math.abs(pdx * fz - pdz * fx);
        if (ahead > 0 && ahead < 12 && side < 3 && Math.abs(p.speed) > 3) {
          k['KeyW'] = false; k['KeyS'] = true;
          return 'driving';
        }
      }
      // Brake for a car ahead in the same lane — no rear-ending traffic.
      for (const other of G.cars) {
        if (other === p.car) continue;
        const odx = other.pos.x - p.pos.x, odz = other.pos.z - p.pos.z;
        const ahead = odx * fx + odz * fz;
        const side = Math.abs(odx * fz - odz * fx);
        if (ahead > 0 && ahead < 14 && side < 3.5 && Math.abs(p.speed) > 4) {
          k['KeyW'] = false; k['KeyS'] = true;
          return 'driving';
        }
      }
      // No progress toward the goal for 8 s? Reverse out and replan.
      if (this.goalDist === undefined || dGoal > this.goalDist - 5) {
        if (this.goalDist === undefined) { this.goalDist = dGoal; this.goalDistAt = G.elapsed; }
        else if (G.elapsed - this.goalDistAt > 8) {
          this.reverseTimer = 1.5;
          this.plan(p.pos, goal);
          this.goalDist = dGoal; this.goalDistAt = G.elapsed;
        }
      } else { this.goalDist = dGoal; this.goalDistAt = G.elapsed; }
      // Steer toward the waypoint.
      const want = Math.atan2(wp.x - p.pos.x, wp.z - p.pos.z);
      let dh = want - p.car.heading;
      while (dh > Math.PI) dh -= Math.PI * 2;
      while (dh < -Math.PI) dh += Math.PI * 2;
      k['KeyW'] = Math.abs(p.speed) < followCap;
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
    // Tail-follow: drive the loop, keeping a ~30 m arc gap behind the target.
    // Speed is set from the gap (catch up / match / let it pull away), and the
    // car steers at the next loop corner, slowing for the turn. No waypoint
    // plan: the loop itself is the route.
    tailFollow(dt) {
      const p = G.player;
      if (!p.car) return 'nocar';
      const t = G.missions.targetCar;
      const k = G.input.keys;
      const myArc = loopArc(p.pos.x, p.pos.z);
      const tgtArc = loopArc(t.pos.x, t.pos.z);
      // Not on the loop yet? Drive to the nearest loop point first.
      const near = loopPoint(myArc);
      if (Math.hypot(near.x - p.pos.x, near.z - p.pos.z) > 25) {
        return this.driveStep(dt, near, 6, { follow: true });
      }
      let gap = (tgtArc - myArc + LOOP_LEN) % LOOP_LEN;
      // gap > 320 means the player is AHEAD of the target on the loop: slow
      // down and let it catch up instead of driving away from it.
      const ahead = gap > 320;
      if (ahead) gap = LOOP_LEN - gap;
      // Proportional speed: match the target's 11 m/s at a 30 m gap, ease
      // faster when far behind, slower when too close. (The old bang-bang
      // 8/25 bands swung the gap between 11 and 56 m and kept tripping SPOTTED.)
      const wantSpeed = ahead ? 4 : Math.max(6, Math.min(20, 11 + (gap - 30) * 0.3));
      // Steer at the next loop corner ahead of the player.
      const lp = loopPoint(myArc + 30);
      const corner = TAIL_LOOP[lp.nextIdx];
      const want = Math.atan2(corner.x - p.pos.x, corner.z - p.pos.z);
      let dh = want - p.car.heading;
      while (dh > Math.PI) dh -= Math.PI * 2;
      while (dh < -Math.PI) dh += Math.PI * 2;
      const dCorner = Math.hypot(corner.x - p.pos.x, corner.z - p.pos.z);
      // Slow for the corner EARLY: at 25 m/s the turn radius is ~16 m, too
      // wide for a 16 m road — the car must be near 11 m/s to make the turn
      // without grinding the building at the corner.
      const cap = dCorner < 45 ? Math.min(wantSpeed, 11) : wantSpeed;
      k['KeyW'] = Math.abs(p.speed) < cap;
      k['KeyS'] = Math.abs(p.speed) > cap + 2;
      k['KeySpace'] = false;
      k['KeyA'] = dh > 0.08;
      k['KeyD'] = dh < -0.08;
      if (Math.abs(dh) > 1.2) k['KeyW'] = Math.abs(p.speed) < 4;
      // Stuck? Reverse out.
      if (!this.lastPos) this.lastPos = p.pos.clone();
      if (p.pos.distanceTo(this.lastPos) > 1.5) { this.lastPos.copy(p.pos); this.lastMoveAt = G.elapsed; }
      if (G.elapsed - this.lastMoveAt > 3 && p.speed < 1) {
        this.reverseTimer = 1.2;
        this.lastMoveAt = G.elapsed;
      }
      if (this.reverseTimer > 0) {
        this.reverseTimer -= dt;
        k['KeyW'] = false; k['KeyS'] = true; k['KeyA'] = false; k['KeyD'] = false;
      }
      return 'driving';
    },
    walkStep(dt, goal, arriveR) {
      const p = G.player;
      const d = Math.hypot(goal.x - p.pos.x, goal.z - p.pos.z);
      if (d < arriveR) { this.clearKeys(); return 'arrived'; }
      // Follow the road grid to the goal (straight lines run into buildings).
      const goalMoved = !this.target || Math.hypot(this.target.x - goal.x, this.target.z - goal.z) > 12;
      if (goalMoved || this.waypoints.length === 0) { this.plan(p.pos, goal); this.target = { ...goal }; }
      const wp = this.waypoints[0];
      if (Math.hypot(wp.x - p.pos.x, wp.z - p.pos.z) < 5) { this.waypoints.shift(); return 'walking'; }
      const want = Math.atan2(wp.x - p.pos.x, wp.z - p.pos.z);
      // Camera looks along -camYaw; to walk toward `want`, set camYaw = want + PI.
      p.camYaw = want + Math.PI;
      const k = G.input.keys;
      k['KeyW'] = true; k['ShiftLeft'] = true;
      k['KeyA'] = false; k['KeyD'] = false; k['KeyS'] = false;
      // Stuck against something? Sidestep for a second, alternating sides.
      if (!this.lastPos) this.lastPos = p.pos.clone();
      if (p.pos.distanceTo(this.lastPos) > 1) { this.lastPos.copy(p.pos); this.lastMoveAt = G.elapsed; }
      if (this.strafeTimer > 0) {
        this.strafeTimer -= dt;
        k[this.strafeLeft ? 'KeyA' : 'KeyD'] = true;
      } else if (G.elapsed - this.lastMoveAt > 2.5) {
        this.strafeTimer = 1.0;
        this.strafeLeft = !this.strafeLeft;
        this.lastMoveAt = G.elapsed;
      }
      return 'walking';
    },
    clearKeys() {
      for (const key of Object.keys(G.input.keys)) G.input.keys[key] = false;
    },
  };

  // Each step: {name, run(dt) -> 'done'|'fail'|null, timeout}
  let decayOrigSees = null;
  let decayHeat0 = 0;
  const steps = [];
  let stepIdx = 0;
  let stepTime = 0;
  let moneyAfterM1 = 0;
  let targetCarRef = null;
  let traceAt = 0;
  const traceDrive = (label) => {
    if (G.elapsed - traceAt < 4) return;
    traceAt = G.elapsed;
    const c = G.player.car;
    console.log(`[TRACE] ${label} t=${Math.round(G.elapsed)} pos=(${Math.round(G.player.pos.x)},${Math.round(G.player.pos.z)}) speed=${Math.round(G.player.speed)} heading=${c ? c.heading.toFixed(2) : '-'} wp=${JSON.stringify(ap.waypoints[0] || null)} wps=${ap.waypoints.length} stars=${G.police.stars} health=${c ? c.health.toFixed(2) : '-'}`);
  };

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
    name: 'enter car: walk to the nearest parked car, press E',
    run: (dt) => {
      if (G.player.onFoot) {
        const car = G.driving.nearestEnterable();
        if (car) { G.pressKey('KeyE'); return 'done'; }
        let parked = null, bestD = 1e9;
        for (const c of G.cars) {
          if (c.driver !== 'parked') continue;
          const d = Math.hypot(c.pos.x - G.player.pos.x, c.pos.z - G.player.pos.z);
          if (d < bestD) { parked = c; bestD = d; }
        }
        if (!parked) return 'fail';
        const r = ap.walkStep(dt, { x: parked.pos.x, z: parked.pos.z }, 3.5);
        if (r === 'arrived') { G.pressKey('KeyE'); return 'done'; }
        return null;
      }
      return 'done';
    },
    timeout: 90,
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
      traceDrive('m1');
      ap.driveStep(dt, { x: PLACES.garage.x, z: PLACES.garage.z }, 8);
      return null;
    },
    timeout: 150,
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
      traceDrive('m2 drop' + (G.missions.dropIndex + 1));
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
      // Follow the loop behind the target (see ap.tailFollow): it keeps the
      // player in the 15–60 m band without head-on encounters.
      const t = G.missions.targetCar;
      traceDrive('m3 tail' + Math.floor(G.missions.tailTime) + 's d=' + Math.round(Math.hypot(G.player.pos.x - t.pos.x, G.player.pos.z - t.pos.z)));
      ap.tailFollow(dt);
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
      // Stage 2: hide — ditch the car, run into the central park (off-road,
      // on foot) where the cops lose sight of you, and wait for the heat to fall.
      if (G.player.car) { G.pressKey('KeyE'); }
      ap.clearKeys();
      ap.walkStep(dt, { x: 56, z: 56 }, 6);
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
          traceDrive('m5 to-harbor');
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
        let parked = null, bestD = 1e9;
        for (const c of G.cars) {
          if (c.driver !== 'parked' && c.driver !== 'traffic') continue;
          const d = Math.hypot(c.pos.x - G.player.pos.x, c.pos.z - G.player.pos.z);
          if (d < bestD) { parked = c; bestD = d; }
        }
        if (parked) { ap.walkStep(dt, { x: parked.pos.x, z: parked.pos.z }, 3.5); return null; }
        ap.walkStep(dt, { x: PLACES.safehouseDoor.x, z: PLACES.safehouseDoor.z }, 8);
        return null;
      }
      traceDrive('m5 escape');
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
      // Make sure the shooter is alive, on foot and playing. Test in the open
      // park so no traffic car can block the shot.
      G.player.health = 100;
      if (G.mode !== 'playing') { G.mode = 'playing'; G.hud.hideEndCard(); }
      if (G.player.car) G.pressKey('KeyE');
      G.player.pos.set(56, 0, 56);
      G.player.heading = Math.PI;
      const cop = G.police.spawnCop();
      cop.pos.set(G.player.pos.x + 8, 0, G.player.pos.z);
      cop.mesh.position.copy(cop.pos);
      // Aim the camera at the cop and fire through the real raycast path.
      // Up to three tries (re-aiming between them) — a hit proves the shot path.
      const dx = cop.pos.x - G.player.pos.x, dz = cop.pos.z - G.player.pos.z;
      G.player.camYaw = Math.atan2(-dx, -dz);
      G.player.aiming = true;
      const before = cop.health;
      for (let attempt = 0; attempt < 3 && cop.health >= before; attempt++) {
        G.player.camPitch = 0.32 - attempt * 0.1;
        G.player.updateCamera(1); // snap the camera to the aim before shooting
        G.combat.shoot();
      }
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
    name: 'wanted decay: heat falls when no police can see the player',
    run: (dt) => {
      // Isolate the decay path: pretend no police unit can see the player
      // (the line-of-sight path itself is exercised by mission 4).
      if (!decayOrigSees) {
        decayOrigSees = G.police.anyPoliceSeesPlayer.bind(G.police);
        G.police.anyPoliceSeesPlayer = () => false;
        G.police.addHeat(40, 'test heat');
        G.police.lastSeen = G.elapsed - 30;
        decayHeat0 = G.police.heat;
      }
      stepTime += dt;
      if (stepTime > 12) {
        const ok = G.police.heat < decayHeat0;
        G.police.anyPoliceSeesPlayer = decayOrigSees;
        decayOrigSees = null;
        return ok ? 'done' : 'fail';
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
      // Busted / wasted: respawn at the safehouse and carry on, as a player would.
      if (G.mode === 'busted' || G.mode === 'wasted') {
        G.hud.hideEndCard();
        G.police.respawn();
        return;
      }
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
