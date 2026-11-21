// missions.js — The five story missions, the crew contact Mara, mission markers
// and payouts. One job: the story arc and its objectives, from briefing to cash.

import * as THREE from 'three';
import { MISSIONS, PLACES, nearestRoad } from './config.js';
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
    index: 0,               // current mission (0..4); 5 = story complete
    completed: [false, false, false, false, false],
    marker: null,           // {x, z, label}
    timer: 0,
    stage: 0,
    tailTime: 0,
    spottedTimer: 0,
    lostTimer: 0,
    targetCar: null,
    dropIndex: 0,
    reachedThreeStars: false,
    hasPackage: false,
    active: false,
    bobPhase: 0,

    get current() { return MISSIONS[this.index] || null; },

    start() {
      if (this.index >= MISSIONS.length) return;
      const m = this.current;
      this.active = true;
      this.stage = 0;
      this.timer = m.timeLimit || 0;
      this.tailTime = 0;
      this.spottedTimer = 0;
      this.lostTimer = 0;
      this.dropIndex = 0;
      this.reachedThreeStars = false;
      this.hasPackage = false;
      G.hud.showDialog('MARA VOSS', m.brief, 9000);
      G.hud.toast(`New mission: ${m.name} — $${m.payout.toLocaleString()}`);
      G.audio.pickup();
      this.placeMarkerForStage();
    },

    placeMarkerForStage() {
      const m = this.current;
      if (!m) { this.marker = null; return; }
      if (this.index === 0) this.marker = { x: PLACES.garage.x, z: PLACES.garage.z, label: 'Deliver the car' };
      else if (this.index === 1) {
        const d = PLACES.courierDrops[this.dropIndex];
        this.marker = { x: d.x, z: d.z, label: `Drop ${this.dropIndex + 1} of 3` };
      } else if (this.index === 2) {
        this.marker = this.targetCar ? { x: this.targetCar.pos.x, z: this.targetCar.pos.z, label: 'Tail the target' } : null;
      } else if (this.index === 3) this.marker = null; // no fixed marker: make heat, then lose it
      else if (this.index === 4) {
        this.marker = this.stage === 0
          ? { x: PLACES.harbor.x, z: PLACES.harbor.z, label: 'Grab the package' }
          : { x: PLACES.safehouseDoor.x, z: PLACES.safehouseDoor.z, label: 'Escape to the safehouse' };
      }
    },

    setMarker(x, z, label) { this.marker = { x, z, label }; },

    spawnTargetCar() {
      const loop = [
        { x: -240, z: -160 }, { x: -80, z: -160 },
        { x: -80, z: 0 }, { x: -240, z: 0 },
      ];
      // Start the target at the loop point nearest the player, so the tail
      // begins close instead of a 300 m chase across town.
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
      G.hud.showDialog('MARA VOSS', 'Dante: "That\'s him — orange coupe, Marina Row. Don\'t let him see you, Rio."', 6000);
    },

    onTargetCarStolen() {
      if (this.index === 2 && this.active) this.fail('You stole the target car — the job is blown.');
    },

    complete() {
      const m = this.current;
      if (!m) return;
      G.money += m.payout;
      this.completed[this.index] = true;
      G.stats.missionsDone++;
      // Between jobs the crew cools things down completely and fixes the car:
      // every mission starts clean, so the next job is a fresh start.
      G.police.heat = 0;
      G.police.stars = 0;
      if (G.player.car) G.player.car.health = 1;
      for (const car of G.cars) {
        if (car.driver === 'police') { car.driver = 'traffic'; car.speed = 9; car.route = { axis: 'x', road: nearestRoad(car.pos.z), dir: 1, targetSpeed: 9 }; }
      }
      G.hud.cashPopup(`+$${m.payout.toLocaleString()}`);
      G.hud.toast(`Mission complete: ${m.name}!`);
      G.hud.showDialog('MARA VOSS', `Mara: "Clean work, Rio. $${m.payout.toLocaleString()} is in your pocket. ${this.index === 4 ? 'That was the big one — Azura Bay is ours.' : 'Next job when you\'re ready.'}"`, 8000);
      G.audio.cash();
      G.saveGame();
      this.index++;
      this.active = false;
      this.marker = null;
      if (this.targetCar) {
        this.targetCar.driver = 'parked';
        this.targetCar.speed = 0;
        this.targetCar = null;
      }
      if (this.index < MISSIONS.length) {
        setTimeout(() => { if (G.mode === 'playing') this.start(); }, 2500);
      } else {
        G.hud.showDialog('MARA VOSS', 'Mara: "Five jobs, five paydays. You\'re a legend on this bay now, Rio. Free roam is yours."', 10000);
        G.hud.toast('Story complete! Free roam — keep the city yours.');
      }
    },

    fail(reason) {
      G.hud.toast(`Mission failed: ${reason}`);
      G.hud.showDialog('MARA VOSS', `Mara: "That went sideways. Shake it off — we run it again."`, 6000);
      G.audio.blip(180, 0.4, 'sawtooth', 0.15);
      if (this.targetCar) {
        this.targetCar.driver = 'parked';
        this.targetCar.speed = 0;
        this.targetCar = null;
      }
      setTimeout(() => { if (G.mode === 'playing') this.start(); }, 2500);
      this.active = false;
      this.marker = null;
    },

    near(x, z, r) {
      return Math.hypot(G.player.pos.x - x, G.player.pos.z - z) < r;
    },

    update(dt) {
      this.bobPhase += dt;
      if (this.marker) {
        beacon.visible = true;
        diamond.visible = true;
        beacon.position.set(this.marker.x, 15, this.marker.z);
        diamond.position.set(this.marker.x, 6 + Math.sin(this.bobPhase * 2.5) * 0.6, this.marker.z);
        diamond.rotation.y += dt * 1.5;
      } else {
        beacon.visible = false;
        diamond.visible = false;
      }
      if (!this.active || this.index >= MISSIONS.length || G.mode !== 'playing') return;

      if (this.index === 0) {
        // Steal a car, then deliver it to the garage.
        if (this.stage === 0 && !G.player.onFoot) { this.stage = 1; G.hud.toast('Now deliver it to the garage on Marina Row.'); }
        if (this.stage === 1 && G.player.inCar && this.near(PLACES.garage.x, PLACES.garage.z, 9) && G.player.speed < 3) {
          this.complete();
        }
      } else if (this.index === 1) {
        this.timer -= dt;
        if (this.timer <= 0) { this.fail('The courier clock ran out.'); return; }
        const d = PLACES.courierDrops[this.dropIndex];
        if (this.near(d.x, d.z, 9)) {
          G.audio.pickup();
          this.dropIndex++;
          if (this.dropIndex >= PLACES.courierDrops.length) this.complete();
          else { this.placeMarkerForStage(); G.hud.toast(`Drop ${this.dropIndex} done — ${3 - this.dropIndex} to go.`); }
        }
      } else if (this.index === 2) {
        if (!this.targetCar) this.spawnTargetCar();
        const t = this.targetCar;
        // Target drives its route (traffic AI), faster when fleeing.
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
      } else if (this.index === 3) {
        if (!this.reachedThreeStars && G.police.stars >= 3) {
          this.reachedThreeStars = true;
          this.stage = 1;
          G.hud.toast('Three stars! Now lose them all.');
          G.hud.showDialog('MARA VOSS', 'Mara: "Beautiful chaos. Now vanish — ditch the car, the helicopter can\'t track you on foot. Break line of sight and stay hidden."', 6000);
        }
        if (this.reachedThreeStars && G.police.stars === 0 && G.police.heat === 0) this.complete();
      } else if (this.index === 4) {
        if (this.stage === 0) {
          if (G.player.onFoot && this.near(PLACES.harbor.x, PLACES.harbor.z, 5)) {
            this.hasPackage = true;
            this.stage = 1;
            G.audio.pickup();
            G.police.addHeat(38, 'grabbed the harbor package');
            G.hud.toast('Package secured! Get back to the safehouse — the bay is hunting you.');
            G.hud.showDialog('MARA VOSS', 'Mara: "Package is hot, Rio. Every cop in Azura Bay just got your description. RUN."', 7000);
            this.placeMarkerForStage();
          }
        } else if (this.stage === 1 && this.near(PLACES.safehouseDoor.x, PLACES.safehouseDoor.z, 10)) {
          this.complete();
        }
      }
    },

    // HUD objective line for the current mission.
    objectiveText() {
      if (this.index >= MISSIONS.length) return 'Story complete — free roam Azura Bay';
      const m = this.current;
      if (!this.active) return `${m.name}: starting…`;
      if (this.index === 0) return this.stage === 0 ? 'Steal a car (walk up, press E)' : 'Deliver the car to the garage marker';
      if (this.index === 1) return `Courier Run: drop ${this.dropIndex + 1} of 3 — ${Math.max(0, Math.ceil(this.timer))}s left`;
      if (this.index === 2) return `Tail the orange coupe: ${Math.floor(this.tailTime)}/45s — stay 15–60m, never under 12m`;
      if (this.index === 3) return this.reachedThreeStars ? 'Lose the cops — break line of sight and hide' : 'Reach 3 wanted stars (steal, crash, shoot)';
      if (this.index === 4) return this.stage === 0 ? 'Go to the harbor and grab the package (on foot)' : 'Escape to the safehouse with the package';
      return m.objective;
    },
  };
  return M;
}
