// missions.js — The data-driven story engine: 91 missions, 5 chapters,
// Lucia & Jason. One job: play the STORY entries through ten archetypes
// (drive, steal, delivery, fetch, tail, escape, heist, combat, chase, timed)
// with markers, payouts, the Chapter 2 ankle monitor, and the finale.

import * as THREE from 'three';
import { STORY, CHAPTERS, ZONES, MONITOR_ZONE, MONITOR_GRACE_SECS } from './story.js';
import { PLACES, nearestRoad } from './config.js';
import { makeCar } from './vehicles.js';

export function createMissions(G) {
  // 3D beacon: a glowing column + a bobbing diamond over the current target.
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0.28, depthWrite: false });
  const beacon = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 30, 16, 1, true), beaconMat);
  beacon.position.y = 15;
  beacon.visible = false;
  G.scene.add(beacon);
  const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(1.1),
    new THREE.MeshBasicMaterial({ color: 0xffd23f }));
  diamond.visible = false;
  G.scene.add(diamond);

  const M = {
    index: 0,               // current mission (0..90); 91 = story complete
    completed: new Array(STORY.length).fill(false),
    marker: null,           // {x, z, label}
    timer: 0,
    stage: 0,
    tailTime: 0,
    spottedTimer: 0,
    lostTimer: 0,
    targetCar: null,
    chaseTarget: null,
    chaseRams: 0,
    drops: [],
    dropIndex: 0,
    reachedThreeStars: false,
    hasPackage: false,
    active: false,
    bobPhase: 0,
    startCopsDown: 0,
    stealDelivered: 0,
    monitorOutsideSecs: 0,
    monitorWarned: false,
    endingShown: false,

    get current() { return STORY[this.index] || null; },
    get storyComplete() { return this.index >= STORY.length; },

    reset() {
      this.index = 0;
      this.completed = new Array(STORY.length).fill(false);
      this.active = false;
      this.marker = null;
      this.endingShown = false;
      this.cleanupTargets();
    },

    cleanupTargets() {
      for (const car of [this.targetCar, this.chaseTarget]) {
        if (car) { car.driver = 'parked'; car.speed = 0; }
      }
      this.targetCar = null;
      this.chaseTarget = null;
    },

    start() {
      if (this.storyComplete) return;
      // Any pending auto-start from a previous mission's complete()/fail()
      // is cancelled by bumping this token: a manual start (the test
      // jumping missions, the player restarting) must not be undone 2.5 s
      // later by a stale timer re-starting the wrong mission.
      this._autoToken = (this._autoToken || 0) + 1;
      const m = this.current;
      this.active = true;
      this.stage = 0;
      this.timer = m.timeLimit || 0;
      this.tailTime = 0;
      this.spottedTimer = 0;
      this.lostTimer = 0;
      this.dropIndex = 0;
      this.drops = [];
      this.reachedThreeStars = false;
      this.hasPackage = false;
      this.startCopsDown = G.stats.copsDown;
      this.stealDelivered = 0;
      this.chaseRams = 0;
      this.monitorOutsideSecs = 0;
      this.monitorWarned = false;
      this.cleanupTargets();
      // The mission's playable protagonist takes the wheel.
      G.setCharacter(m.who);
      // Chapter 2 starts at home in Port Gellhorn — Lucia lives there, and
      // the ankle monitor only gives 30 s outside the zone, so a mission
      // must never begin with the player stranded across town.
      if (m.ch === 2) {
        if (G.player.car) G.driving.exitCar();
        G.player.pos.set(320, 0, -80);
        G.player.heading = Math.PI;
        G.player.camYaw = 0;
      }
      G.hud.showDialog(m.contact.toUpperCase(), m.beat, 9000);
      G.hud.toast(`Mission ${m.id}: ${m.title} — $${m.reward.toLocaleString()}`);
      G.audio.pickup();
      if (m.type === 'delivery') this.drops = this.makeDrops(m);
      if (m.type === 'tail') this.spawnTargetCar(m);
      if (m.type === 'chase') this.spawnChaseTarget(m);
      if (m.type === 'combat') {
        // The fight comes to the player: heat spawns the officers.
        G.police.addHeat(30, 'started a fight');
      }
      this.placeMarkerForStage();
    },

    // Where a fetch/heist returns to: the Gellhorn home in Chapter 2
    // (inside the monitor zone), the safehouse everywhere else.
    homePoint(m) {
      return m.ch === 2 ? { x: 320, z: -80 } : { x: PLACES.safehouseDoor.x, z: PLACES.safehouseDoor.z };
    },

    placeMarkerForStage() {
      const m = this.current;
      if (!m) { this.marker = null; return; }
      const at = (x, z, label) => { this.marker = { x, z, label }; };
      switch (m.type) {
        case 'drive': case 'timed': case 'combat':
          at(m.x, m.z, m.title); break;
        case 'steal':
          at(m.x, m.z, 'Deliver the car'); break;
        case 'delivery':
          if (this.drops[this.dropIndex]) at(this.drops[this.dropIndex].x, this.drops[this.dropIndex].z, `Drop ${this.dropIndex + 1} of ${this.drops.length}`); break;
        case 'fetch':
          if (this.stage === 0) at(m.x, m.z, 'Pick up the package');
          else { const h = this.homePoint(m); at(h.x, h.z, 'Bring it home'); } break;
        case 'tail':
          this.marker = this.targetCar ? { x: this.targetCar.pos.x, z: this.targetCar.pos.z, label: 'Tail the target' } : null; break;
        case 'escape':
          this.marker = null; break;
        case 'heist':
          if (this.stage === 0) at(m.x, m.z, 'Grab the package');
          else { const h = this.homePoint(m); at(h.x, h.z, 'Escape to safety'); } break;
        case 'chase':
          this.marker = this.chaseTarget ? { x: this.chaseTarget.pos.x, z: this.chaseTarget.pos.z, label: 'Stop that car' } : null; break;
        default: at(m.x, m.z, m.title);
      }
    },

    // Three drop points inside the mission's zone, deterministic from the id.
    makeDrops(m) {
      const zone = ZONES[m.zone];
      const roads = [-320, -240, -160, -80, 0, 80, 160, 240, 320].filter((r) => r >= zone.x0 && r <= zone.x1);
      const zs = [-320, -240, -160, -80, 0, 80, 160, 240, 320].filter((r) => r >= zone.z0 && r <= zone.z1);
      const drops = [];
      for (let i = 0; i < 3; i++) {
        const x = roads[(m.id * 7 + i * 5) % roads.length];
        const z = zs[(m.id * 3 + i * 4) % zs.length];
        drops.push({ x, z });
      }
      return drops;
    },

    // The tail target: an orange coupe driving a 160 m loop around the
    // mission target, starting at the loop point nearest the player.
    spawnTargetCar(m) {
      const s = 80;
      const loop = [
        { x: m.x - s, z: m.z - s }, { x: m.x + s, z: m.z - s },
        { x: m.x + s, z: m.z + s }, { x: m.x - s, z: m.z + s },
      ].map((p) => ({
        x: THREE.MathUtils.clamp(p.x, -320, 320),
        z: THREE.MathUtils.clamp(p.z, -320, 320),
      }));
      let bestIdx = 0, bestD = 1e9;
      loop.forEach((wp, i) => {
        const d = Math.hypot(wp.x - G.player.pos.x, wp.z - G.player.pos.z);
        if (d < bestD) { bestD = d; bestIdx = i; }
      });
      const start = loop[bestIdx];
      const car = makeCar(G, 'coupe', start.x, start.z, Math.PI / 2, 'target');
      car.colorHex = 0xff7a1a;
      car.mesh.children[0].material = new THREE.MeshLambertMaterial({ color: 0xff7a1a });
      car.route = { loop, loopIdx: bestIdx, targetSpeed: 11 };
      car.speed = 11;
      this.targetCar = car;
      G.hud.showDialog(m.contact.toUpperCase(), 'That\'s him — orange coupe. Don\'t let him see you.', 6000);
    },

    // The chase target: a car that flees from the player until rammed to a stop.
    spawnChaseTarget(m) {
      const car = makeCar(G, 'sedan', m.x, m.z, 0, 'flee');
      car.colorHex = 0xcc2222;
      car.mesh.children[0].material = new THREE.MeshLambertMaterial({ color: 0xcc2222 });
      car.health = 1.0;
      car.speed = 12;
      this.chaseTarget = car;
    },

    onTargetCarStolen() {
      if (this.active && this.current && this.current.type === 'tail') {
        this.fail('You stole the target car — the job is blown.');
      }
    },

    near(x, z, r) {
      return Math.hypot(G.player.pos.x - x, G.player.pos.z - z) < r;
    },

    update(dt) {
      // Beacon + diamond hover over the current marker.
      this.bobPhase += dt;
      if (this.marker && this.active) {
        beacon.visible = true;
        diamond.visible = true;
        beacon.position.set(this.marker.x, 15, this.marker.z);
        diamond.position.set(this.marker.x, 6 + Math.sin(this.bobPhase * 2.5) * 0.6, this.marker.z);
        diamond.rotation.y += dt * 1.5;
      } else {
        beacon.visible = false;
        diamond.visible = false;
      }
      if (!this.active || this.storyComplete) return;
      const m = this.current;

      // ---- Ankle monitor (Chapter 2, missions 23–32; mission 33 lifts it) ----
      if (m.ch === 2 && m.id !== 33) this.updateMonitor(dt);
      else G.hud.setMonitor(null);

      // ---- Timers (timed + delivery missions) ----
      if ((m.type === 'timed' || m.type === 'delivery') && this.timer > 0) {
        this.timer -= dt;
        if (this.timer <= 0) { this.fail('Out of time.'); return; }
      }

      switch (m.type) {
        case 'drive': case 'timed': {
          const r = m.type === 'timed' ? 10 : 9;
          if (this.near(m.x, m.z, r)) this.complete();
          break;
        }
        case 'steal': {
          // Stage 0: get in a car (any stolen street car). Stage 1: deliver it.
          if (this.stage === 0 && !G.player.onFoot) {
            this.stage = 1;
            G.hud.toast('Now deliver it to the garage on Marina Row.');
          }
          if (this.stage === 1 && G.player.inCar && this.near(m.x, m.z, 9) && G.player.speed < 3) {
            this.stealDelivered++;
            const need = m.count || 1;
            if (this.stealDelivered >= need) this.complete();
            else {
              // More cars to steal: drop this one, go find another.
              G.driving.exitCar();
              this.stage = 0;
              G.hud.toast(`Car ${this.stealDelivered} of ${need} delivered — steal another.`);
            }
          }
          break;
        }
        case 'delivery': {
          const d = this.drops[this.dropIndex];
          if (d && this.near(d.x, d.z, 8)) {
            this.dropIndex++;
            G.audio.cash();
            if (this.dropIndex >= this.drops.length) this.complete();
            else { this.placeMarkerForStage(); G.hud.toast(`Drop ${this.dropIndex} done — ${this.drops.length - this.dropIndex} to go.`); }
          }
          break;
        }
        case 'fetch': {
          if (this.stage === 0) {
            if (G.player.onFoot && this.near(m.x, m.z, 6)) {
              this.hasPackage = true;
              this.stage = 1;
              G.audio.pickup();
              G.hud.toast('Package picked up — bring it home.');
              this.placeMarkerForStage();
            }
          } else {
            const h = this.homePoint(m);
            if (this.near(h.x, h.z, 10)) this.complete();
          }
          break;
        }
        case 'tail': {
          if (!this.targetCar) this.spawnTargetCar(m);
          const t = this.targetCar;
          if (this.spottedTimer > 0) {
            this.spottedTimer -= dt;
            t.route.targetSpeed = 24;
          } else {
            t.route.targetSpeed = 11;
          }
          const d = Math.hypot(G.player.pos.x - t.pos.x, G.player.pos.z - t.pos.z);
          if (d < 12 && this.spottedTimer <= 0) {
            this.spottedTimer = 10;
            this.tailTime = 0;
            G.hud.toast('SPOTTED! He made you — back off!');
            G.audio.blip(140, 0.5, 'sawtooth', 0.2);
          }
          if (d > 90) {
            this.lostTimer += dt;
            if (this.lostTimer > 30) { this.fail('You lost the target.'); return; }
          } else this.lostTimer = 0;
          if (d >= 15 && d <= 60 && this.spottedTimer <= 0) {
            this.tailTime += dt;
            if (this.tailTime >= 45) this.complete();
          }
          this.placeMarkerForStage();
          break;
        }
        case 'escape': {
          if (!this.reachedThreeStars && G.police.stars >= 3) {
            this.reachedThreeStars = true;
            this.stage = 1;
            G.hud.toast('Three stars! Now lose them all.');
            G.hud.showDialog(m.contact.toUpperCase(), 'Beautiful chaos. Now vanish — ditch the car, the helicopter can\'t track you on foot. Break line of sight and stay hidden.', 6000);
          }
          if (this.reachedThreeStars && G.police.stars === 0 && G.police.heat === 0) this.complete();
          break;
        }
        case 'heist': {
          if (this.stage === 0) {
            if (G.player.onFoot && this.near(m.x, m.z, 5)) {
              this.hasPackage = true;
              this.stage = 1;
              G.audio.pickup();
              G.police.addHeat(38, 'grabbed the package');
              G.hud.toast('Package secured! Get back to safety — the bay is hunting you.');
              this.placeMarkerForStage();
            }
          } else {
            const h = this.homePoint(m);
            if (this.near(h.x, h.z, 10)) this.complete();
          }
          break;
        }
        case 'combat': {
          const down = G.stats.copsDown - this.startCopsDown;
          const need = m.count || 4;
          if (down >= need) this.complete();
          break;
        }
        case 'chase': {
          const t = this.chaseTarget;
          if (!t) break;
          // The target flees directly away from the player.
          const dx = t.pos.x - G.player.pos.x, dz = t.pos.z - G.player.pos.z;
          const d = Math.hypot(dx, dz) || 1;
          const want = Math.atan2(dx / d, dz / d);
          let dh = want - t.heading;
          while (dh > Math.PI) dh -= Math.PI * 2;
          while (dh < -Math.PI) dh += Math.PI * 2;
          t.heading += THREE.MathUtils.clamp(dh, -2.2 * dt, 2.2 * dt);
          t.speed = t.health > 0.2 ? 15 : 0;
          t.pos.x += Math.sin(t.heading) * t.speed * dt;
          t.pos.z += Math.cos(t.heading) * t.speed * dt;
          t.mesh.position.copy(t.pos);
          t.mesh.rotation.y = t.heading;
          // A hard ram (player car, fast, close) damages the target.
          if (G.player.inCar && G.player.speed > 5 && d < 4.5) {
            this.chaseRams++;
            t.health -= 0.25;
            G.effects.sparks(t.pos.x, 1, t.pos.z, 8);
            G.effects.addShake(0.3);
            G.audio.crash(0.6);
            // Push the target a little so the next ram needs a fresh approach.
            t.pos.x += Math.sin(t.heading) * 2;
            t.pos.z += Math.cos(t.heading) * 2;
          }
          if (t.health <= 0.2) this.complete();
          this.placeMarkerForStage();
          break;
        }
      }
    },

    // ---- Ankle monitor: outside Port Gellhorn the countdown runs. ----
    updateMonitor(dt) {
      const p = G.player.pos;
      const inside = p.x >= MONITOR_ZONE.x0 && p.x <= MONITOR_ZONE.x1 &&
        p.z >= MONITOR_ZONE.z0 && p.z <= MONITOR_ZONE.z1;
      if (inside) {
        this.monitorOutsideSecs = 0;
        this.monitorWarned = false;
        G.hud.setMonitor({ inside: true });
        return;
      }
      this.monitorOutsideSecs += dt;
      const left = Math.max(0, MONITOR_GRACE_SECS - this.monitorOutsideSecs);
      G.hud.setMonitor({ inside: false, secondsLeft: Math.ceil(left) });
      if (!this.monitorWarned) {
        this.monitorWarned = true;
        G.hud.toast('ANKLE MONITOR: you left Port Gellhorn — get back inside the zone!');
        G.audio.blip(220, 0.4, 'sawtooth', 0.2);
      }
      // Wanted rises while the monitor is violated.
      G.police.addHeat(6 * dt, 'ankle monitor violation');
      if (this.monitorOutsideSecs >= MONITOR_GRACE_SECS) {
        this.fail('The ankle monitor reported you — the job is blown.');
      }
    },

    complete() {
      const m = this.current;
      this.completed[this.index] = true;
      G.money += m.reward;
      G.stats.missionsDone++;
      // The duo's bond grows when they work together across missions.
      if (G.stats.lastMissionWho && G.stats.lastMissionWho !== m.who) {
        G.stats.relationship = Math.min(100, (G.stats.relationship || 40) + 2);
      }
      G.stats.lastMissionWho = m.who;
      G.audio.cash();
      G.hud.cashPopup(`+$${m.reward.toLocaleString()}`);
      G.hud.showDialog(m.contact.toUpperCase(), `Clean work. $${m.reward.toLocaleString()} is in your pocket.`, 6000);
      // Wanted cools off between jobs.
      G.police.heat = 0;
      G.police.stars = 0;
      if (G.player.car) G.player.car.health = 1;
      this.cleanupTargets();
      this.active = false;
      this.marker = null;
      G.hud.setMonitor(null);
      const wasFinale = this.index === STORY.length - 1;
      this.index++;
      G.saveGame();
      if (wasFinale) {
        this.showEnding();
        return;
      }
      G.hud.toast(`Mission complete — ${STORY[this.index].title} is next.`);
      const token = this._autoToken;
      setTimeout(() => { if (G.mode === 'playing' && this._autoToken === token && !this.active) this.start(); }, 2500);
    },

    fail(reason) {
      const m = this.current;
      this.active = false;
      this.marker = null;
      G.hud.setMonitor(null);
      this.cleanupTargets();
      G.hud.showDialog(m ? m.contact.toUpperCase() : 'CREW', `That went sideways — ${reason} Shake it off, we run it again.`, 6000);
      G.hud.toast(`Mission failed: ${reason}`);
      const token = this._autoToken;
      setTimeout(() => { if (G.mode === 'playing' && this._autoToken === token && !this.active) this.start(); }, 2500);
    },

    // ---- The ending: organic, from four factors across the whole game ----
    // BuckMe savings (G.money), the Jason–Lucia relationship, the criminal
    // profile (lethal vs non-lethal play), and mission choices (tracked in
    // G.stats.choices by key missions; neutral until those moments exist).
    criminalProfile() {
      const kills = G.stats.copsDown || 0;
      const stuns = G.stats.stuns || 0;
      const civ = G.stats.civiliansHurt || 0;
      if (G.stats.psycho) return 'Psycho';
      if (kills >= 25 || civ >= 15) return 'Psycho';
      if (kills >= 8 || civ >= 5) return 'Violent & Dangerous';
      if (stuns >= 5 && kills <= 2) return 'Professional';
      return 'Hardened';
    },

    computeEnding() {
      const savings = G.money;
      const rel = G.stats.relationship || 40;
      const profile = this.criminalProfile();
      const choices = G.stats.choices || {};
      // A Psycho run ends the Bonnie & Clyde way, whatever the money says.
      if (profile === 'Psycho') return { key: 'bad2', name: 'No Surrender', desc: 'No surrender. The last stand on the bridge, guns out, together to the end.' };
      if (savings >= 40000 && rel >= 60) return { key: 'good1', name: 'Top of the World', desc: 'Both of them alive, both of them free — the money, the plan, and the road out of Leonida.' };
      if (rel >= 60 && profile === 'Professional') return { key: 'good2', name: 'Swim For It', desc: 'Jason gives himself up so Lucia walks free. One of them pays, so the other can start over.' };
      if (choices.armed) return { key: 'bad1', name: 'Swim For It — Armed', desc: 'The swim, with guns drawn. The bridge, the sirens, and no way out.' };
      return { key: 'bad1', name: 'Swim For It — Armed', desc: 'The escape fails on the bridge. The money was never enough to buy a way out.' };
    },

    showEnding() {
      const e = this.computeEnding();
      this.endingShown = true;
      G.hud.showEndCard(`THE END — ${e.name}`, `${e.desc} — Story complete: 91 missions. The game rewinds to before the final mission; free roam is yours, or run it again for another ending.`);
      G.hud.toast('Story complete — 91 missions. Free roam unlocked.');
      // Post-game rewind: back to before the final mission, so another
      // ending can be chased without losing the story.
      this.index = STORY.length - 1;
      this.completed[this.index] = false;
      G.saveGame();
    },

    // HUD objective line for the current mission.
    objectiveText() {
      if (this.storyComplete) return 'Story complete — free roam Azura Bay';
      const m = this.current;
      if (!this.active) return `${m.title}: starting…`;
      if (m.ch === 2 && m.id !== 33 && this.monitorOutsideSecs > 0) {
        return `ANKLE MONITOR: return to Port Gellhorn! ${Math.ceil(MONITOR_GRACE_SECS - this.monitorOutsideSecs)}s`;
      }
      switch (m.type) {
        case 'drive': return `${m.title}: ${m.objective}`;
        case 'timed': return `${m.title}: ${m.objective} — ${Math.max(0, Math.ceil(this.timer))}s left`;
        case 'steal': return this.stage === 0 ? 'Steal a car (walk up, press E)' : `Deliver the car to the marker${(m.count || 1) > 1 ? ` (${this.stealDelivered}/${m.count})` : ''}`;
        case 'delivery': return `${m.title}: drop ${this.dropIndex + 1} of ${this.drops.length} — ${Math.max(0, Math.ceil(this.timer))}s left`;
        case 'fetch': return this.stage === 0 ? 'Go to the marker and pick up the package (on foot)' : 'Bring the package home to the safehouse';
        case 'tail': return `Tail the orange coupe: ${Math.floor(this.tailTime)}/45s — stay 15–60m, never under 12m`;
        case 'escape': return this.reachedThreeStars ? 'Lose the cops — break line of sight and hide' : 'Reach 3 wanted stars (steal, crash, shoot)';
        case 'heist': return this.stage === 0 ? 'Go to the marker and grab the package (on foot)' : 'Escape to the safehouse with the package';
        case 'combat': return `${m.title}: officers down ${G.stats.copsDown - this.startCopsDown}/${m.count || 4}`;
        case 'chase': return 'Ram the fleeing car until it stops';
        default: return m.objective;
      }
    },
  };
  return M;
}
