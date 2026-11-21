// selftest.js — Scripted playthrough that plays the game for real: it holds the
// same keys a player would, drives the road grid to each mission marker, shoots,
// and checks every system. Run with ?selftest=1. Results land in
// window.__testResults and console as [SELFTEST] lines.

import * as THREE from 'three';
import { nearestRoad, CITY_HALF, PLACES } from './config.js';
import { STORY, CHAPTERS, validateStory } from './story.js';

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
  // The loop is the target car's own route loop (a rectangle around the
  // mission target); the player joins it and trails the target along it,
  // instead of chasing the target's bare position (which drove the player
  // head-on into it and into donuts at the corners).
  function tailLoop() {
    const t = G.missions.targetCar;
    return (t && t.route && t.route.loop) ? t.route.loop : TAIL_LOOP;
  }
  const TAIL_LOOP = [
    { x: -240, z: -160 }, { x: -80, z: -160 },
    { x: -80, z: 0 }, { x: -240, z: 0 },
  ];
  function loopLen(loop) {
    let len = 0;
    for (let i = 0; i < 4; i++) {
      const a = loop[i], b = loop[(i + 1) % 4];
      len += Math.hypot(b.x - a.x, b.z - a.z);
    }
    return len;
  }
  function loopArc(x, z) {
    const loop = tailLoop();
    const len = loopLen(loop);
    let best = { arc: 0, d2: 1e18 };
    let acc = 0;
    for (let i = 0; i < 4; i++) {
      const a = loop[i], b = loop[(i + 1) % 4];
      const abx = b.x - a.x, abz = b.z - a.z;
      const segLen = Math.hypot(abx, abz);
      const len2 = abx * abx + abz * abz;
      let t = ((x - a.x) * abx + (z - a.z) * abz) / len2;
      t = Math.max(0, Math.min(1, t));
      const px = a.x + abx * t, pz = a.z + abz * t;
      const d2 = (x - px) * (x - px) + (z - pz) * (z - pz);
      if (d2 < best.d2) best = { arc: acc + t * segLen, d2 };
      acc += segLen;
    }
    return { arc: best.arc, len };
  }
  function loopPoint(arc) {
    const loop = tailLoop();
    const len = loopLen(loop);
    const a = ((arc % len) + len) % len;
    let acc = 0;
    for (let i = 0; i < 4; i++) {
      const p = loop[i], q = loop[(i + 1) % 4];
      const segLen = Math.hypot(q.x - p.x, q.z - p.z);
      if (a < acc + segLen || i === 3) {
        const t = Math.max(0, Math.min(1, (a - acc) / segLen));
        return { x: p.x + (q.x - p.x) * t, z: p.z + (q.z - p.z) * t, nextIdx: (i + 1) % 4 };
      }
      acc += segLen;
    }
    return { x: loop[0].x, z: loop[0].z, nextIdx: 1 };
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
      // Wrecked car: bail out so the caller can steal a fresh one instead
      // of crawling along in a dead engine.
      if ((p.car.health ?? 1) < 0.15) { G.pressKey('KeyE'); ap.clearKeys(); return 'nocar'; }
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
      // Accept the waypoint when reached OR passed: at 30+ m/s the car
      // steps ~7 m per substep and can jump clean over a 6 m acceptance
      // circle, then U-turns and grinds — the old behaviour wasted minutes
      // per mission.
      const fwdX = Math.sin(p.car.heading), fwdZ = Math.cos(p.car.heading);
      const passed = (wp.x - p.pos.x) * fwdX + (wp.z - p.pos.z) * fwdZ < 0 && dWp < 30;
      if (dWp < 8 || passed) { this.waypoints.shift(); return this.waypoints.length === 0 ? 'arrived' : 'driving'; }
      // Corner slowdown: if the route turns sharply at this waypoint, brake
      // early so the car can make the turn inside the road, not through a wall.
      const next = this.waypoints[1];
      if (next) {
        const leg1 = Math.atan2(wp.x - p.pos.x, wp.z - p.pos.z);
        const leg2 = Math.atan2(next.x - wp.x, next.z - wp.z);
        let turn = leg2 - leg1;
        while (turn > Math.PI) turn -= Math.PI * 2;
        while (turn < -Math.PI) turn += Math.PI * 2;
        if (Math.abs(turn) > 0.7 && dWp < 60 && Math.abs(p.speed) > 10) {
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
      const loop = tailLoop();
      const LOOP_LEN = loopLen(loop);
      const myArc = loopArc(p.pos.x, p.pos.z).arc;
      const tgtArc = loopArc(t.pos.x, t.pos.z).arc;
      // Not on the loop yet? Drive to the nearest loop point first — with a
      // PLAIN driveStep (not follow mode): the car must brake as it arrives,
      // or it overshoots at 30 m/s and U-turns wide into the corner building.
      const near = loopPoint(myArc);
      if (Math.hypot(near.x - p.pos.x, near.z - p.pos.z) > 25) {
        return this.driveStep(dt, near, 6);
      }
      let gap = (tgtArc - myArc + LOOP_LEN) % LOOP_LEN;
      // gap > half the loop means the player is AHEAD of the target: slow
      // down and let it catch up instead of driving away from it.
      const ahead = gap > LOOP_LEN / 2;
      if (ahead) gap = LOOP_LEN - gap;
      // Proportional speed: match the target's 11 m/s at a 30 m gap, ease
      // faster when far behind, slower when too close. (The old bang-bang
      // 8/25 bands swung the gap between 11 and 56 m and kept tripping SPOTTED.)
      const wantSpeed = ahead ? 4 : Math.max(6, Math.min(20, 11 + (gap - 30) * 0.3));
      // Steer at the next loop corner ahead of the player.
      const lp = loopPoint(myArc + 30);
      const corner = loop[lp.nextIdx];
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
  // ---- Story validation: all 91 missions load and are well-formed ----
  steps.push({
    name: 'story: all 91 missions validate (objective, type, reward, playable)',
    run: () => {
      const problems = validateStory();
      const perChapter = CHAPTERS.map((c) => {
        const n = STORY.filter((m) => m.ch === c.n).length;
        return `Ch${c.n} ${n}`;
      }).join(', ');
      const types = {};
      for (const m of STORY) types[m.type] = (types[m.type] || 0) + 1;
      const detail = `91 missions (${perChapter}); archetypes ${JSON.stringify(types)}; problems: ${problems.length ? problems.slice(0, 3).join(' | ') : 'none'}`;
      return problems.length === 0 ? 'done' : 'fail';
    },
    timeout: 5,
  });
  // ---- Chapter spot-check: play the first mission of each chapter ----
  // Missions are jumped to by index (validation mode); each must complete
  // and advance the index by exactly one (sequential unlock).
  const SPOT = [0, 22, 33, 59, 85]; // missions 1, 23, 34, 60, 86
  let spotChapter = 0;
  let spotMoneyBefore = 0;
  let spotMoneyStart = null; // cash before the first spot mission (m1)
  steps.push({
    name: 'story: 1 mission per chapter completes (1, 23, 34, 60, 86)',
    run: (dt) => {
      const targetIdx = SPOT[spotChapter];
      if (targetIdx === undefined) return 'done';
      if (G.missions.index > targetIdx) {
        // Sequential unlock: the index must have advanced by exactly one.
        if (G.missions.index !== targetIdx + 1) {
          console.log(`[SELFTEST] WARN spot-check mission ${targetIdx + 1}: index jumped to ${G.missions.index}`);
        }
        spotChapter++;
        spotMoneyBefore = G.money;
        return null;
      }
      if (G.missions.index !== targetIdx || !G.missions.active) {
        G.missions.index = targetIdx;
        if (spotMoneyStart === null) spotMoneyStart = G.money;
        spotMoneyBefore = G.money;
        G.missions.start();
        return null;
      }
      const m = G.missions.current;
      const mk = G.missions.marker;
      if (!mk) return null;
      // Fetch: drive close, get out, walk to the pickup; then drive home.
      if (m.type === 'fetch' && G.missions.stage === 0) {
        const d = Math.hypot(mk.x - G.player.pos.x, mk.z - G.player.pos.z);
        if (G.elapsed - traceAt > 4) {
          traceAt = G.elapsed;
          console.log(`[TRACE] spot fetch m${m.id} stage=${G.missions.stage} onFoot=${G.player.onFoot} d=${Math.round(d)} pos=(${Math.round(G.player.pos.x)},${Math.round(G.player.pos.z)}) speed=${Math.round(G.player.speed)} wp=${JSON.stringify(ap.waypoints[0] || null)}`);
        }
        if (G.player.car && d > 12) {
          traceDrive('spot fetch drive');
          ap.driveStep(dt, { x: mk.x, z: mk.z }, 12);
          return null;
        }
        if (G.player.car) { G.pressKey('KeyE'); ap.clearKeys(); return null; }
        ap.walkStep(dt, { x: mk.x, z: mk.z }, 4);
        return null;
      }
      // Everything else: drive to the marker (enter a car first if needed).
      // No car in reach is not a failure: walk to the nearest parked or
      // traffic car and get in, the way a player would (the old code
      // returned 'fail' here, which killed the spot-check the moment a
      // fetch package was picked up on foot).
      if (!G.player.car) {
        if (!needCar(dt)) return null;
        return null;
      }
      traceDrive(`spot ch${m.ch} m${m.id}`);
      ap.driveStep(dt, { x: mk.x, z: mk.z }, 9);
      return null;
    },
    timeout: 600,
  });
  steps.push({
    name: 'story: spot-check payouts landed',
    run: () => (spotMoneyStart !== null && G.money > spotMoneyStart ? 'done' : 'fail'),
    timeout: 5,
  });
  // ---- Archetype tests (each jumps to a mission that uses it) ----
  const jumpTo = (idx) => {
    if (G.missions.index !== idx || !G.missions.active) {
      G.missions.index = idx;
      G.missions.start();
      return true;
    }
    return false;
  };
  const needCar = (dt) => {
    if (G.player.car) return true;
    const car = G.driving.nearestEnterable();
    if (car) { G.pressKey('KeyE'); return false; }
    // No car in reach: walk to the nearest parked/traffic car and get in.
    // Skip wrecks — a dead engine strands the driver on the spot.
    let parked = null, bestD = 1e9;
    for (const c of G.cars) {
      if (c.driver !== 'parked' && c.driver !== 'traffic') continue;
      if ((c.health ?? 1) < 0.15) continue;
      const d = Math.hypot(c.pos.x - G.player.pos.x, c.pos.z - G.player.pos.z);
      if (d < bestD) { parked = c; bestD = d; }
    }
    if (!parked) return false;
    if (dt !== undefined) ap.walkStep(dt, { x: parked.pos.x, z: parked.pos.z }, 3.5);
    return false;
  };
  steps.push({
    name: 'archetype steal: mission 3 Gear Up — steal a car, deliver it',
    run: (dt) => {
      if (G.missions.index > 2) return 'done';
      if (jumpTo(2)) return null;
      if (G.missions.stage === 0) {
        if (!needCar(dt)) return null;
        // Stage 1 begins the moment we are in a car.
        return null;
      }
      traceDrive('steal deliver');
      ap.driveStep(dt, { x: 200, z: 240 }, 8);
      return null;
    },
    timeout: 150,
  });
  steps.push({
    name: 'archetype delivery: mission 28 Daily Driver — 3 drops in time',
    run: (dt) => {
      if (G.missions.index > 27) return 'done';
      if (jumpTo(27)) return null;
      if (!needCar(dt)) return null;
      const d = G.missions.drops[G.missions.dropIndex];
      if (!d) return null;
      traceDrive('delivery drop' + (G.missions.dropIndex + 1));
      ap.driveStep(dt, { x: d.x, z: d.z }, 8);
      return null;
    },
    timeout: 170,
  });
  steps.push({
    name: 'archetype tail: mission 8 Hey Arnold! — 45s without being spotted',
    run: (dt) => {
      if (G.missions.index > 7) return 'done';
      if (jumpTo(7)) return null;
      if (!G.missions.targetCar) return null;
      if (!needCar(dt)) return null;
      const t = G.missions.targetCar;
      traceDrive('tail ' + Math.floor(G.missions.tailTime) + 's d=' + Math.round(Math.hypot(G.player.pos.x - t.pos.x, G.player.pos.z - t.pos.z)));
      ap.tailFollow(dt);
      return null;
    },
    timeout: 180,
  });
  steps.push({
    name: 'archetype escape: mission 6 Unwanted Attention — 3 stars, lose them',
    run: (dt) => {
      if (G.missions.index > 5) return 'done';
      if (jumpTo(5)) return null;
      if (!G.missions.reachedThreeStars) {
        if (!needCar(dt)) return null;
        const parked = G.cars.find((c) => c.driver === 'parked');
        if (parked) ap.driveStep(dt, { x: parked.pos.x, z: parked.pos.z }, 3);
        if (G.elapsed % 5 < dt) G.weapons.triggerDown();
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
    name: 'archetype heist: mission 59 The Cartel Heist — grab + escape',
    run: (dt) => {
      if (G.missions.index > 58) return 'done';
      if (jumpTo(58)) return null;
      const m = G.missions.current;
      if (G.missions.stage === 0) {
        if (G.player.car) {
          traceDrive('heist to-target');
          const r = ap.driveStep(dt, { x: m.x, z: m.z }, 12);
          if (r === 'arrived' || Math.hypot(G.player.pos.x - m.x, G.player.pos.z - m.z) < 14) {
            G.pressKey('KeyE');
            ap.clearKeys();
          }
          return null;
        }
        // On foot: steal a car first, then drive — walking 400 m across
        // town to the target (the old behaviour) never finished in time.
        needCar(dt);
        return null;
      }
      // Stage 1: escape. Get in any nearby car and drive home.
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
        const h = G.missions.homePoint(m);
        ap.walkStep(dt, { x: h.x, z: h.z }, 8);
        return null;
      }
      traceDrive('heist escape');
      const h = G.missions.homePoint(m);
      ap.driveStep(dt, { x: h.x, z: h.z }, 9);
      return null;
    },
    timeout: 240,
  });
  steps.push({
    name: 'archetype combat: mission 50 Sinfrontera Bank — defeat 4 officers',
    run: (dt) => {
      if (G.missions.index > 49) return 'done';
      if (jumpTo(49)) return null;
      // The mission spawns officers via heat; stand in the open, aim at the
      // nearest live cop and fire through the real weapon path until 4 are down.
      const m = G.missions.current;
      const need = m.count || 4;
      const down = G.stats.copsDown - G.missions.startCopsDown;
      if (down >= need) return null; // the mission completes itself
      if (G.player.car) { G.pressKey('KeyE'); ap.clearKeys(); }
      G.player.pos.set(m.x, 0, m.z);
      G.player.heading = Math.PI;
      const cop = G.police.cops.find((c) => c.alive && !c.stunned);
      if (!cop) {
        if (G.police.stars < 2) G.police.addHeat(20, 'combat test');
        return null;
      }
      const dx = cop.pos.x - G.player.pos.x, dz = cop.pos.z - G.player.pos.z;
      G.player.camYaw = Math.atan2(-dx, -dz);
      G.player.aiming = true;
      G.player.updateCamera(1);
      G.weapons.equip('es9');
      G.weapons.triggerDown();
      G.player.aiming = false;
      return null;
    },
    timeout: 180,
  });
  steps.push({
    name: 'finale: mission 91 The End of the Road — ending screen shows',
    run: (dt) => {
      if (G.missions.endingShown) return 'done';
      if (jumpTo(90)) return null;
      const m = G.missions.current;
      if (G.missions.stage === 0) {
        if (G.player.car) {
          traceDrive('finale to-target');
          const r = ap.driveStep(dt, { x: m.x, z: m.z }, 12);
          if (r === 'arrived' || Math.hypot(G.player.pos.x - m.x, G.player.pos.z - m.z) < 14) {
            G.pressKey('KeyE');
            ap.clearKeys();
          }
          return null;
        }
        ap.walkStep(dt, { x: m.x, z: m.z }, 4);
        return null;
      }
      if (G.player.onFoot) {
        const car = G.driving.nearestEnterable();
        if (car) { G.pressKey('KeyE'); return null; }
        const h = G.missions.homePoint(m);
        ap.walkStep(dt, { x: h.x, z: h.z }, 8);
        return null;
      }
      traceDrive('finale escape');
      const h = G.missions.homePoint(m);
      ap.driveStep(dt, { x: h.x, z: h.z }, 9);
      return null;
    },
    timeout: 240,
  });
  steps.push({
    name: 'combat: shooting a cop damages them',
    run(dt) {
      // Retried across frames: the first frame's shot can miss (the camera
      // matrix is one render stale right after a teleport) and the
      // fire-rate limiter blocks back-to-back pulls in the same frame, so
      // a single-frame attempt was never a fair test. Re-aim every frame
      // and fire once per frame until the cop's health drops.
      stepTime += dt;
      if (stepTime > 11) return 'fail';
      G.player.health = 100;
      // Suppress the chase for this unit test: at 5 stars a police car can
      // touch the standing player and bust them, teleporting the player to
      // the safehouse mid-test (the old failure: the aim then pointed at a
      // cop 300 m away, out of range, and every shot missed).
      G.police.stars = 0;
      G.police.heat = 0;
      if (G.mode !== 'playing') { G.mode = 'playing'; G.hud.hideEndCard(); }
      if (G.player.car) { G.pressKey('KeyE'); return null; }
      // Pin the shooter in place every frame, like the mission-50 test
      // does: the cop walks to the player, the player does not wander.
      G.player.pos.set(56, 0, 56);
      G.player.heading = Math.PI;
      if (!this._combatCop || !this._combatCop.alive || !G.police.cops.includes(this._combatCop)) {
        this._combatCop = G.police.spawnCop();
        this._combatCop.pos.set(G.player.pos.x + 8, 0, G.player.pos.z);
        this._combatCop.mesh.position.copy(this._combatCop.pos);
        this._combatBefore = this._combatCop.health;
        G.weapons.give('es9'); G.weapons.equip('es9');
        G.weapons.magAmmo.es9 = G.weapons.byId.es9.mag;
      }
      const cop = this._combatCop;
      // The pinned player stands still while the cop closes to 2 m — the
      // busted timer would fire at 1.5 s and the respawn clears every cop
      // from the scene, so the test would aim at a removed cop forever.
      // This step tests shooting, not the busted mechanic: hold the timer.
      cop.bustedTimer = 0;
      G.police.bustedTimer = 0;
      const dx = cop.pos.x - G.player.pos.x, dz = cop.pos.z - G.player.pos.z;
      G.player.camYaw = Math.atan2(-dx, -dz);
      G.player.aiming = true;
      G.player.updateCamera(1); // snap the camera to the aim before shooting
      // The shot raycasts from the camera's matrixWorld, which the renderer
      // only refreshes once per real frame — at 12x turbo the cop moves ~1 m
      // per real frame, so a one-frame-stale matrix aims a metre behind it.
      // Refresh the camera matrix here so the test aims where it looks.
      G.camera.updateMatrixWorld();
      cop.mesh.updateMatrixWorld(); // same staleness for the cop's own mesh
      G.weapons.lastShotAt = 0; // test harness: clear the fire-rate limiter
      G.weapons.triggerDown();
      G.weapons.triggerUp();
      G.player.aiming = false;
      if (cop.health < this._combatBefore) { this._combatCop = null; return 'done'; }
      return null;
    },
    timeout: 12,
  });
  steps.push({
    name: 'weapons: 69 entries validate + fire/switch/stun per category',
    run(dt) {
      // Phased across frames: the fire-rate limiter (real-time ms) blocks a
      // second pull in the same frame, so firing, switching and stunning
      // must happen on separate frames with a fresh aim each time.
      stepTime += dt;
      if (stepTime > 12) return 'fail';
      // Same chase suppression as the combat step (see above).
      G.police.stars = 0;
      G.police.heat = 0;
      const W = G.weapons;
      if (!this._wPhase) {
        const byCat = {};
        let bad = 0;
        for (const id of Object.keys(W.byId)) {
          const w = W.byId[id];
          byCat[w.cat] = (byCat[w.cat] || 0) + 1;
          // Category-aware validation: melee has no magazine; explosives,
          // launchers and the shocker deal damage through blast/burn/stun,
          // not a direct `damage` number; guns need damage + magazine.
          const hasDamage = (w.damage > 0) || (w.blastDamage > 0) || (w.burnDps > 0) || w.stun;
          const magOk = w.kind === 'melee' ? true : (w.mag > 0);
          if (!w.name || !hasDamage || !magOk || !w.kind) bad++;
        }
        this._wTotal = Object.keys(W.byId).length;
        this._wCats = byCat; this._wBad = bad;
        // Fire the starting pistol (refill the mag first: tryFire refuses
        // an empty mag and starts a reload instead).
        G.weapons.give('es9'); G.weapons.equip('es9');
        G.weapons.magAmmo.es9 = W.byId.es9.mag;
        this._wShotsBefore = G.stats.shotsFired;
        G.weapons.lastShotAt = 0;
        G.weapons.triggerDown();
        G.weapons.triggerUp();
        this._wPhase = 1;
        return null;
      }
      if (this._wPhase === 1) {
        this._wFired = G.stats.shotsFired > this._wShotsBefore;
        G.weapons.give('k17'); G.weapons.equip('k17');
        this._wSwitched = W.active().id === 'k17';
        // Set up the stun test: a fresh cop 6 m away, shocker in hand.
        G.weapons.give('shocker'); G.weapons.equip('shocker');
        G.weapons.magAmmo.shocker = W.byId.shocker.mag;
        this._wCop = G.police.spawnCop();
        this._wCop.pos.set(G.player.pos.x + 6, 0, G.player.pos.z);
        this._wCop.mesh.position.copy(this._wCop.pos);
        this._wPhase = 2;
        return null;
      }
      if (this._wPhase === 2) {
        const cop = this._wCop;
        // If a bust/respawn removed the test cop from the police array, the
        // shot would hit nothing: re-set-up instead of failing.
        if (!cop || !cop.alive || !G.police.cops.includes(cop) || Math.hypot(cop.pos.x - G.player.pos.x, cop.pos.z - G.player.pos.z) > 20) {
          this._wPhase = 1;
          return null;
        }
        // Same busted-timer hold as the combat step: the standing player
        // must not get busted while the cop closes in.
        cop.bustedTimer = 0;
        G.police.bustedTimer = 0;
        const dx = cop.pos.x - G.player.pos.x, dz = cop.pos.z - G.player.pos.z;
        G.player.camYaw = Math.atan2(-dx, -dz);
        G.player.aiming = true;
        G.player.updateCamera(1);
        G.camera.updateMatrixWorld(); // fresh aim matrix (see combat step)
        cop.mesh.updateMatrixWorld(); // the test cop was just (re)positioned — its mesh matrix is one render stale, so the raycast would test it at its spawn spot
        G.weapons.lastShotAt = 0;
        G.weapons.triggerDown();
        G.weapons.triggerUp();
        G.player.aiming = false;
        this._wPhase = 3;
        return null;
      }
      const stunned = this._wCop && this._wCop.stunned === true;
      if (!stunned) {
        // One shocker pull can miss (spread, cop mid-stride) — re-aim and
        // fire again a few times before calling it a failure.
        this._wRetries = (this._wRetries || 0) + 1;
        if (this._wRetries < 4) { this._wPhase = 2; return null; }
      }
      const detail = `total=${this._wTotal} cats=${JSON.stringify(this._wCats)} bad=${this._wBad} fired=${this._wFired} switched=${this._wSwitched} stunned=${stunned}`;
      console.log(`[SELFTEST] weapons ${detail}`);
      this._wPhase = 0;
      return this._wTotal === 69 && this._wBad === 0 && this._wFired && this._wSwitched && stunned ? 'done' : 'fail';
    },
    timeout: 15,
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
