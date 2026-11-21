// combat.js — Shooting, melee and drive-by combat. Hitscan with a raycaster,
// muzzle flash, tracers, and police who shoot back. The weapon itself (damage,
// range, spread, recoil, stun) comes from the active weapon in weapons.js;
// this file only does the raycast and applies the hit.
// Bab 21: hit-markers — white = hit, yellow = incapacitated (non-lethal),
// red = killed. Bab 17/24: limb shots incapacitate without killing;
// a hand shot disarms; a warning shot panics without hurting.
// Bab 25: free-aim from a car window via Focus can hit the driver, a tire,
// the engine block or the fuel tank, each with a different effect.
// Round 5: the raycaster and tracer are renamed for clarity
// (hitRay / tracerLine) and the internal helpers are reordered.
// Behaviour unchanged.

import * as THREE from 'three';

export function createCombat(Game) {
  const hitRay = new THREE.Raycaster();
  // Visible tracerLine line, reused.
  const tracerGeom = new THREE.BufferGeometry();
  tracerGeom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
  const tracerLine = new THREE.Line(tracerGeom,
    new THREE.LineBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0 }));
  tracerLine.frustumCulled = false;
  Game.scene.add(tracerLine);

  const C = {
    shotsRecently: 0,          // counts down; pedestrians flee while > 0
    lastShotPos: new THREE.Vector3(),
    tracerUntil: 0,
    projectiles: [],           // flying shells / spears / thrown explosives
    firePools: [],             // molotov ground fire {pos, radius, until, mesh}
    smokeClouds: [],           // smoke grenade clouds {pos, radius, until, mesh}
    stickies: [],              // placed sticky bombs {pos, mesh, car}
    lastHitMarker: null,       // 'white' | 'yellow' | 'red' (Bab 21)
    killCam: null,             // {until, kind} — slow-mo replay hook (Bab 21)

    // ---- Explosive projectiles (launchers, speargun, firework) ----
    fireProjectile(w) {
      if (Game.mode !== 'playing') return;
      const dir = new THREE.Vector3();
      Game.camera.getWorldDirection(dir);
      const origin = Game.camera.position.clone();
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(w.id === 'speargun' ? 0.12 : 0.28, 8, 6),
        new THREE.MeshBasicMaterial({ color: w.tracerLine || 0xff9a3c })
      );
      mesh.position.copy(origin);
      Game.scene.add(mesh);
      this.projectiles.push({
        mesh, w, kind: w.id === 'speargun' ? 'spear' : 'shell',
        vel: dir.clone().multiplyScalar(w.projSpeed || 50),
        age: 0,
      });
      Game.audio.gunshot(w.kind);
      Game.effects.addShake(0.15 + w.recoil * 0.08);
      this.shotsRecently = 2;
      this.lastShotPos.copy(Game.player.pos);
      Game.police.addHeat(14, 'fired a heavy weapon');
      Game.stats.shotsFired++;
    },
    updateProjectiles(dt) {
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const pr = this.projectiles[i];
        pr.age += dt;
        pr.vel.y -= (pr.w.projGravity || 4) * dt;
        pr.mesh.position.addScaledVector(pr.vel, dt);
        const p = pr.mesh.position;
        let hit = null;
        if (p.y <= 0.3) hit = { point: p.clone(), ground: true };
        if (!hit) {
          for (const cop of Game.police.cops) {
            if (cop.alive && cop.pos.distanceTo(p) < 2) { hit = { point: p.clone(), ref: cop, kind: 'cop' }; break; }
          }
        }
        if (!hit) {
          for (const ped of Game.peds) {
            if (ped.alive && ped.pos.distanceTo(p) < 2) { hit = { point: p.clone(), ref: ped, kind: 'ped' }; break; }
          }
        }
        if (!hit) {
          for (const car of Game.cars) {
            if (car.pos.distanceTo(p) < 2.5) { hit = { point: p.clone(), ref: car, kind: 'car' }; break; }
          }
        }
        if (hit || pr.age > 4) {
          Game.scene.remove(pr.mesh);
          this.projectiles.splice(i, 1);
          if (!hit) continue;
          if (pr.kind === 'spear') {
            // Speargun: one heavy direct hit, no blast.
            if (hit.kind === 'cop') {
              hit.ref.health -= pr.w.damage;
              Game.effects.blood(hit.point.x, hit.point.y, hit.point.z);
              this.showHitMarker(hit.ref.health <= 0 ? 'red' : 'white');
              if (hit.ref.health <= 0) { Game.police.killCop(hit.ref); Game.police.addHeat(30, 'took down an officer'); }
            } else if (hit.kind === 'ped') {
              Game.pedestrians.knockDownPed(Game, hit.ref);
              Game.police.addHeat(26, 'speared a pedestrian');
            } else if (hit.kind === 'car') {
              hit.ref.health = Math.max(0, hit.ref.health - pr.w.damage / 200);
              Game.effects.sparks(hit.point.x, hit.point.y, hit.point.z, 8);
            }
          } else if (pr.kind === 'thrown') {
            // Thrown explosives land and do their thing.
            const w = pr.w;
            const pos = hit.point.clone();
            pos.y = Math.max(0.3, pos.y);
            if (w.id === 'frag') {
              // Fuse: beeps, then blows after w.fuse seconds.
              const fuseMesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.22, 8, 6),
                new THREE.MeshBasicMaterial({ color: 0x3a3a3a })
              );
              fuseMesh.position.copy(pos);
              Game.scene.add(fuseMesh);
              this.projectiles.push({ mesh: fuseMesh, w, kind: 'fuse', vel: new THREE.Vector3(), age: 0, fuseUntil: Game.elapsed + (w.fuse || 2.5) });
              Game.audio.blip?.(1200, 0.1, 'square', 0.15);
            } else if (w.id === 'sticky') {
              // Sticks where it lands (on a car if it hit one) until Game detonates.
              const stickMesh = new THREE.Mesh(
                new THREE.BoxGeometry(0.4, 0.2, 0.4),
                new THREE.MeshBasicMaterial({ color: 0xff2222 })
              );
              stickMesh.position.copy(pos);
              Game.scene.add(stickMesh);
              this.stickies.push({ pos, mesh: stickMesh, w, car: hit.kind === 'car' ? hit.ref : null });
              Game.hud.toast('Sticky bomb placed — press Game to detonate.');
            } else if (w.id === 'molotov') {
              // Shatters into a burning pool on the ground.
              const poolMesh = new THREE.Mesh(
                new THREE.CircleGeometry(w.firePool || 6, 20),
                new THREE.MeshBasicMaterial({ color: 0xff6a00, transparent: true, opacity: 0.55 })
              );
              poolMesh.rotation.x = -Math.PI / 2;
              poolMesh.position.set(pos.x, 0.05, pos.z);
              Game.scene.add(poolMesh);
              this.firePools.push({ pos, radius: w.firePool || 6, until: Game.elapsed + (w.burnSecs || 5), mesh: poolMesh });
              Game.effects.smoke(pos.x, 0.5, pos.z, 6);
              Game.audio.flame?.();
              Game.police.addHeat(20, 'started a fire');
            } else if (w.id === 'smokeflash') {
              if (pr.thrownMode === 'flash') {
                // Blinding burst: screen flash + nearby enemies stunned.
                Game.hud.flashbang();
                for (const cop of Game.police.cops) {
                  if (cop.alive && cop.pos.distanceTo(pos) < 25) Game.police.stunCop(cop, 3);
                }
                for (const ped of Game.peds) {
                  if (ped.alive && ped.pos.distanceTo(pos) < 25) Game.pedestrians.stunPed(Game, ped, 3);
                }
                Game.audio.zap();
              } else {
                // Smoke cloud: blocks police sight for 20 s.
                const cloudMesh = new THREE.Mesh(
                  new THREE.SphereGeometry(8, 12, 10),
                  new THREE.MeshBasicMaterial({ color: 0x9aa0a8, transparent: true, opacity: 0.35 })
                );
                cloudMesh.position.set(pos.x, 2, pos.z);
                Game.scene.add(cloudMesh);
                this.smokeClouds.push({ pos, radius: 8, until: Game.elapsed + 20, mesh: cloudMesh });
                Game.hud.toast('Smoke out — police can’t see through it.');
              }
            }
          } else {
            this.explode(hit.point, pr.w);
          }
        }
        // Fuse countdown: a landed frag blows when its fuse runs out.
        if (pr.kind === 'fuse' && Game.elapsed >= pr.fuseUntil) {
          const pos = pr.mesh.position.clone();
          Game.scene.remove(pr.mesh);
          this.projectiles.splice(i, 1);
          this.explode(pos, pr.w);
        }
      }
    },
    // AoE explosion: damage falls with distance; the player takes it too if
    // close (self-damage), and cars take heavy damage (anti-vehicle).
    explode(pos, w) {
      const R = w.blast || 8;
      const base = w.blastDamage || 120;
      Game.effects.smoke(pos.x, pos.y + 0.5, pos.z, 14);
      Game.effects.sparks(pos.x, pos.y + 0.5, pos.z, 24);
      Game.effects.addShake(0.7);
      Game.audio.explosion?.();
      Game.police.addHeat(40, 'caused an explosion');
      const dmgAt = (d) => base * Math.max(0.25, 1 - d / R);
      for (const cop of Game.police.cops) {
        if (!cop.alive) continue;
        const d = cop.pos.distanceTo(pos);
        if (d < R) {
          cop.health -= dmgAt(d);
          if (cop.health <= 0) Game.police.killCop(cop);
        }
      }
      for (const ped of Game.peds) {
        if (!ped.alive) continue;
        if (ped.pos.distanceTo(pos) < R) Game.pedestrians.knockDownPed(Game, ped);
      }
      for (const car of Game.cars) {
        const d = car.pos.distanceTo(pos);
        if (d < R) {
          const mult = w.antiVehicle ? 2 : 1;
          car.health = Math.max(0, car.health - (dmgAt(d) / 200) * mult);
          Game.effects.sparks(car.pos.x, 1, car.pos.z, 6);
        }
      }
      if (Game.police.heli && Game.police.heli.pos.distanceTo(pos) < R) {
        Game.police.heli.health -= dmgAt(Game.police.heli.pos.distanceTo(pos));
        if (Game.police.heli.health <= 0) Game.police.downHelicopter();
      }
      // Self-damage: standing in your own blast hurts.
      if (w.selfDamage) {
        const d = Game.player.pos.distanceTo(pos);
        if (d < R) {
          Game.player.health -= dmgAt(d) * 0.6;
          Game.hud.flashDamage();
          if (Game.player.health <= 0) Game.police.wasted();
        }
      }
    },

    // Bab 21 hit-marker: white = hit, yellow = incapacitated, red = killed.
    showHitMarker(color) {
      this.lastHitMarker = color;
      if (Game.hud && Game.hud.showHitMarker) Game.hud.showHitMarker(color);
    },
    // Bab 21 Kill Cam / Crash Cam: a short slow-mo beat after a kill or a
    // high-speed crash. Disabled in settings if the player turns it off.
    triggerKillCam(kind) {
      if (Game.settings && Game.settings.killCam === false) return;
      this.killCam = { until: Game.elapsed + 1.2, kind };
      Game.hud.toast(kind === 'crash' ? 'CRASH CAM' : 'KILL CAM');
    },

    // Bab 17/24 non-lethal: a limb shot incapacitates (yellow marker) without
    // killing — the Professional profile stays clean.
    incapacitateCop(cop) {
      cop.health = Math.min(cop.health, 30);
      cop.stunned = true;
      cop.stunnedUntil = Game.elapsed + 8;
      cop.mesh.rotation.x = -Math.PI / 2;
      cop.mesh.position.y = 0.3;
      this.showHitMarker('yellow');
      Game.stats.stuns = (Game.stats.stuns || 0) + 1;
      Game.hud.toast('Target incapacitated — non-lethal.');
    },
    // Bab 24 disarm: shoot the enemy's hand and their weapon drops.
    disarmCop(cop) {
      cop.disarmed = true;
      cop.shootCooldown = 6;
      this.showHitMarker('white');
      Game.hud.toast('Disarmed! His weapon is on the ground.');
      Game.effects.sparks(cop.pos.x, 1.2, cop.pos.z, 8);
    },
    // Bab 17 suppressing fire: a warning shot near (not at) a target makes
    // NPCs / enemies hit the dirt without anyone getting hurt.
    warningShot(point) {
      for (const cop of Game.police.cops) {
        if (cop.alive && cop.pos.distanceTo(point) < 12) cop.cowerUntil = Game.elapsed + 3;
      }
      for (const ped of Game.peds) {
        if (ped.alive && ped.pos.distanceTo(point) < 12) ped.fleeing = 3;
      }
      Game.hud.toast('Warning shot — they hit the dirt.');
    },

    // One shot from the camera centre toward the crosshair, with weapon w.
    // `charge` (0.15–1) scales a railgun charge shot. Pellets (shotguns) fire
    // N rays; rifles lose damage with distance (falloff); the railgun pierces
    // every target along the ray. Bloom (Bab 21) widens the spread while
    // firing; short bursts stay accurate (Bab 25 AR recoil).
    fireShot(w, charge) {
      if (Game.mode !== 'playing') return;
      const cam = Game.camera;
      const bloom = Game.world ? Game.world.bloom() : 0;
      const spread = w.spread * (1.3 - w.handling * 0.6) * (1 + bloom);
      const pellets = w.pellets || 1;
      // Damage falloff for rifles/SMGs: full up to falloffStart, then down to
      // falloffMin at falloffEnd. (Weapons without falloff fields stay flat.)
      const falloffAt = (dist) => {
        if (!w.falloffStart) return 1;
        if (dist <= w.falloffStart) return 1;
        if (dist >= w.falloffEnd) return w.falloffMin;
        const f = (dist - w.falloffStart) / (w.falloffEnd - w.falloffStart);
        return 1 - f * (1 - w.falloffMin);
      };
      let tracerEnd = null;
      for (let p = 0; p < pellets; p++) {
        hitRay.setFromCamera(new THREE.Vector2(0, 0), cam);
        hitRay.far = w.range;
        hitRay.ray.direction.x += (Math.random() - 0.5) * spread * 2;
        hitRay.ray.direction.y += (Math.random() - 0.5) * spread * 2;
        hitRay.ray.direction.normalize();
        const targets = [];
        for (const cop of Game.police.cops) if (cop.alive) targets.push(cop.mesh);
        for (const ped of Game.peds) if (ped.alive) targets.push(ped.mesh);
        for (const car of Game.cars) targets.push(car.mesh);
        if (Game.police.heli) targets.push(Game.police.heli.group);
        const origin = hitRay.ray.origin.clone();
        let end = origin.clone().addScaledVector(hitRay.ray.direction, w.range);
        if (w.penetrate) {
          // Railgun: every target along the ray takes the (charge-scaled) hit.
          const hits = hitRay.intersectObjects(targets, true);
          const dmg = w.damage * (0.5 + 0.5 * (charge ?? 1));
          const seen = new Set();
          for (const hit of hits) {
            end = hit.point.clone();
            const node = this.hitNode(hit.object);
            if (node && !seen.has(node)) { seen.add(node); this.applyHit(hit.object, hit.point, w, dmg); }
          }
        } else {
          const hits = hitRay.intersectObjects(targets, true);
          if (hits.length > 0) {
            const hit = hits[0];
            end = hit.point.clone();
            const dist = hit.distance;
            this.applyHit(hit.object, hit.point, w, w.damage * falloffAt(dist));
          } else if (Game.world && Game.world.warningShots) {
            // No hit: a deliberate warning shot near the crosshair point.
            this.warningShot(end);
          }
        }
        if (p === 0) tracerEnd = end;
      }
      // Tracer in the weapon's colour + muzzle flash + sound.
      tracerLine.material.color.setHex(w.tracerLine || 0xffe9a8);
      const posAttr = tracerLine.geometry.attributes.position;
      const origin = hitRay.ray.origin.clone();
      posAttr.setXYZ(0, origin.x, origin.y, origin.z);
      posAttr.setXYZ(1, tracerEnd.x, tracerEnd.y, tracerEnd.z);
      posAttr.needsUpdate = true;
      tracerLine.material.opacity = 0.9;
      this.tracerUntil = performance.now() + 60;
      const muzzle = origin.clone().addScaledVector(hitRay.ray.direction, 1.2);
      Game.effects.muzzleFlash(muzzle.x, muzzle.y, muzzle.z);
      if (w.stun) Game.audio.zap();
      else Game.audio.gunshot(w.kind);
      Game.effects.addShake(0.05 + w.recoil * 0.06);
      if (Game.world) Game.world.noteShotFired(w);
      this.shotsRecently = 2;
      this.lastShotPos.copy(Game.player.pos);
      if (!w.stun) Game.police.addHeat(12, 'fired a gun');
      Game.stats.shotsFired++;
    },

    // Walk up to the named parent (cop / ped / car / heli) of a hit mesh.
    hitNode(object) {
      let node = object;
      while (node && !node.userData.hitKind) node = node.parent;
      return node;
    },

    applyHit(object, point, w, dmg) {
      const node = this.hitNode(object);
      if (!node) return;
      const kind = node.userData.hitKind;
      if (kind === 'cop') {
        const cop = node.userData.ref;
        if (w.stun) {
          // Stun gun: the cop drops to the ground, unharmed, for stunSecs.
          // Non-lethal — counts toward the Professional profile.
          Game.police.stunCop(cop, w.stunSecs || 5);
          Game.stats.stuns = (Game.stats.stuns || 0) + 1;
          this.showHitMarker('yellow');
          Game.effects.sparks(point.x, point.y, point.z, 10);
          Game.hud.toast('Target stunned — non-lethal.');
          return;
        }
        // Bab 17/24: a low hit (legs/arms, below y 1.1) incapacitates
        // instead of killing when the player is playing it clean.
        const lowHit = point.y < 1.1;
        if (lowHit && (Game.missions.criminalProfile() === 'Professional' || Game.world?.nonLethalMode)) {
          this.incapacitateCop(cop);
          Game.effects.blood(point.x, point.y, point.z);
          return;
        }
        cop.health -= dmg;
        Game.effects.blood(point.x, point.y, point.z);
        if (cop.health <= 0) {
          Game.police.killCop(cop);
          this.showHitMarker('red');
          this.triggerKillCam('kill');
          Game.police.addHeat(30, 'took down an officer');
        } else {
          this.showHitMarker('white');
        }
      } else if (kind === 'ped') {
        const ped = node.userData.ref;
        if (w.stun) {
          Game.pedestrians.stunPed(Game, ped, w.stunSecs || 5);
          Game.stats.stuns = (Game.stats.stuns || 0) + 1;
          this.showHitMarker('yellow');
          Game.effects.sparks(point.x, point.y, point.z, 10);
          return;
        }
        Game.pedestrians.knockDownPed(Game, ped);
        this.showHitMarker('red');
        Game.stats.civiliansHurt = (Game.stats.civiliansHurt || 0) + 1;
        Game.police.addHeat(26, 'shot a pedestrian');
      } else if (kind === 'car') {
        const car = node.userData.ref;
        if (w.stun) { Game.effects.sparks(point.x, point.y, point.z, 6); return; }
        // Bab 25 free-aim from a car window: aim at a part, get that effect.
        // Front third = engine block (stalls it), low sides = tires (flat),
        // rear = fuel tank (fire). A hit on the driver seat area stops a
        // fleeing driver cold.
        if (Game.world) {
          const part = Game.world.carHitPart(car, point);
          if (part === 'tire') { car.flatTire = Math.random() < 0.5 ? 'left' : 'right'; Game.hud.toast('Tire shot out!'); }
          else if (part === 'engine') { car.health = Math.max(0, car.health - 0.4); Game.hud.toast('Engine block hit — it is stalling.'); }
          else if (part === 'tank') { car.health = Math.max(0, car.health - 0.3); Game.effects.smoke(car.pos.x, 1, car.pos.z, 6); Game.hud.toast('Fuel tank hit!'); }
          else if (part === 'driver' && car.driver === 'flee') { car.health = 0.2; Game.hud.toast('Driver hit — the car stops.'); }
        }
        car.health = Math.max(0, car.health - dmg / 400);
        this.showHitMarker('white');
        Game.effects.sparks(point.x, point.y, point.z, 6);
        if (car.driver === 'traffic') {
          Game.police.addHeat(6, 'shot a car');
          car.route = null; // driver bails: car stops
          car.speed = 0;
          car.driver = 'parked';
        }
      } else if (kind === 'heli') {
        if (w.stun) { Game.effects.sparks(point.x, point.y, point.z, 6); return; }
        Game.police.heli.health -= dmg;
        this.showHitMarker('white');
        Game.effects.sparks(point.x, point.y, point.z, 8);
        if (Game.police.heli.health <= 0) Game.police.downHelicopter();
      }
    },

    // ---- Flamethrower: a short cone that sets targets burning ----
    fireFlame(w) {
      if (Game.mode !== 'playing') return;
      const dir = new THREE.Vector3();
      Game.camera.getWorldDirection(dir);
      const origin = Game.camera.position.clone();
      const burn = (pos) => {
        Game.effects.smoke(pos.x, pos.y + 0.5, pos.z, 3);
        Game.effects.sparks(pos.x, pos.y + 0.5, pos.z, 4);
      };
      const inCone = (pos) => {
        const to = new THREE.Vector3().subVectors(pos, origin);
        const d = to.length();
        if (d > w.range) return false;
        to.normalize();
        return to.dot(dir) > 0.86; // ~30° cone
      };
      for (const cop of Game.police.cops) {
        if (cop.alive && inCone(cop.pos)) {
          cop.burnUntil = Game.elapsed + (w.burnSecs || 4);
          cop.burnDps = w.burnDps || 12;
          burn(cop.pos);
        }
      }
      for (const ped of Game.peds) {
        if (ped.alive && inCone(ped.pos)) {
          ped.burnUntil = Game.elapsed + (w.burnSecs || 4);
          ped.burnDps = w.burnDps || 12;
          burn(ped.pos);
        }
      }
      for (const car of Game.cars) {
        if (inCone(car.pos)) {
          car.health = Math.max(0, car.health - 0.02);
          burn(car.pos);
        }
      }
      // Flame cone visual: a burst of smoke + sparks from the muzzle.
      const tip = origin.clone().addScaledVector(dir, 2);
      Game.effects.smoke(tip.x, tip.y, tip.z, 6);
      Game.audio.flame?.();
      Game.effects.addShake(0.08);
      this.shotsRecently = 2;
      this.lastShotPos.copy(Game.player.pos);
      Game.police.addHeat(10, 'used a flamethrower');
      Game.stats.shotsFired++;
    },

    // ---- Melee swing: an arc in front of the player ----
    // Bab 24: Lucia fights kickboxing/MMA (fast, technical), Jason fights
    // street-style (slower, harder). The style is the character's, not the weapon's.
    meleeSwing(w) {
      if (Game.mode !== 'playing' || !Game.player.onFoot) return;
      Game.audio.swing?.();
      const p = Game.player.pos;
      const fx = Math.sin(Game.player.heading), fz = Math.cos(Game.player.heading);
      const style = Game.player.who === 'lucia' ? { dmgMul: 0.9, speedMul: 1.25 } : { dmgMul: 1.25, speedMul: 0.9 };
      const inArc = (pos) => {
        const dx = pos.x - p.x, dz = pos.z - p.z;
        const d = Math.hypot(dx, dz);
        if (d > w.range) return false;
        const dot = (dx * fx + dz * fz) / (d || 1);
        return dot > 0.35; // ~70° arc
      };
      let hitAny = false;
      for (const cop of Game.police.cops) {
        if (!cop.alive || !inArc(cop.pos)) continue;
        hitAny = true;
        cop.health -= w.damage * style.dmgMul;
        cop.pos.x += fx * (w.knockback || 2);
        cop.pos.z += fz * (w.knockback || 2);
        Game.effects.blood(cop.pos.x, 1, cop.pos.z);
        if (cop.health <= 0) { Game.police.killCop(cop); this.showHitMarker('red'); Game.police.addHeat(30, 'took down an officer'); }
        else { this.showHitMarker('white'); Game.police.addHeat(10, 'assaulted an officer'); }
      }
      for (const ped of Game.peds) {
        if (!ped.alive || !inArc(ped.pos)) continue;
        hitAny = true;
        Game.pedestrians.knockDownPed(Game, ped);
        Game.police.addHeat(20, 'assaulted a pedestrian');
      }
      for (const car of Game.cars) {
        if (inArc(car.pos)) {
          hitAny = true;
          car.health = Math.max(0, car.health - w.damage / 300);
          Game.effects.sparks(car.pos.x, 1, car.pos.z, 4);
        }
      }
      if (hitAny) { Game.audio.punch(); Game.effects.addShake(0.12); }
      Game.stats.punches++;
    },

    // Bab 24 stealth takedown: from behind, unseen (dark / tall grass),
    // hold the aim and tap the melee key — silent, non-lethal by default.
    stealthTakedown() {
      if (!Game.player.onFoot) return false;
      const p = Game.player.pos;
      for (const cop of Game.police.cops) {
        if (!cop.alive || cop.stunned) continue;
        const d = Math.hypot(cop.pos.x - p.x, cop.pos.z - p.z);
        if (d > 3) continue;
        // Behind the target: the cop's heading points away from the player.
        const dx = p.x - cop.pos.x, dz = p.z - cop.pos.z;
        const facing = (dx * Math.sin(cop.heading) + dz * Math.cos(cop.heading)) / (d || 1);
        if (facing > 0.3) continue; // cop is facing the player — no takedown
        Game.police.stunCop(cop, 10);
        Game.stats.stuns = (Game.stats.stuns || 0) + 1;
        this.showHitMarker('yellow');
        Game.hud.toast('Stealth takedown — silent.');
        return true;
      }
      return false;
    },

    // ---- Thrown explosives: frag / sticky / molotov / smoke-flash ----
    throwWeapon(w, mode) {
      if (Game.mode !== 'playing') return;
      const dir = new THREE.Vector3();
      Game.camera.getWorldDirection(dir);
      const origin = Game.camera.position.clone().addScaledVector(dir, 1);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 8, 6),
        new THREE.MeshBasicMaterial({ color: w.id === 'molotov' ? 0x2a7a1a : 0x3a3a3a })
      );
      mesh.position.copy(origin);
      Game.scene.add(mesh);
      const vel = dir.clone().multiplyScalar(16);
      vel.y += 7; // lobbed arc
      this.projectiles.push({
        mesh, w, kind: 'thrown',
        vel, age: 0,
        fuse: w.fuse || 0,
        thrownMode: mode || 'smoke',
        stuck: false,
      });
      Game.audio.throwSnd?.();
      this.shotsRecently = 2;
      Game.police.addHeat(8, 'threw an explosive');
    },
    // Sticky bombs: Game detonates every placed one.
    detonateStickies() {
      if (this.stickies.length === 0) { Game.hud.toast('No sticky bombs placed.'); return; }
      for (const s of this.stickies) {
        const pos = s.car ? s.car.pos.clone() : s.pos.clone();
        Game.scene.remove(s.mesh);
        this.explode(pos, s.w);
      }
      this.stickies = [];
    },

    // ---- Burn over time (flamethrower / molotov) + fire pools ----
    updateBurn(dt) {
      const applyBurn = (ref, isPlayer) => {
        if (!ref.burnUntil || ref.burnUntil <= Game.elapsed) return;
        const dps = ref.burnDps || 12;
        if (isPlayer) {
          Game.player.health -= dps * dt;
          Game.hud.flashDamage();
          if (Game.player.health <= 0) Game.police.wasted();
        } else if (ref.health !== undefined) {
          ref.health -= dps * dt;
          if (ref.health <= 0 && ref.alive) {
            if (Game.police.cops.includes(ref)) Game.police.killCop(ref);
            else Game.pedestrians.knockDownPed(Game, ref);
          }
        }
      };
      for (const cop of Game.police.cops) if (cop.alive) applyBurn(cop);
      for (const ped of Game.peds) if (ped.alive) applyBurn(ped);
      applyBurn(Game.player, true);
      // Fire pools: anyone standing in one burns.
      for (let i = this.firePools.length - 1; i >= 0; i--) {
        const pool = this.firePools[i];
        if (Game.elapsed > pool.until) {
          Game.scene.remove(pool.mesh);
          this.firePools.splice(i, 1);
          continue;
        }
        if (Math.random() < dt * 6) {
          Game.effects.smoke(pool.pos.x + (Math.random() - 0.5) * pool.radius, 0.5, pool.pos.z + (Math.random() - 0.5) * pool.radius, 2);
        }
        const burnInPool = (pos, ref, isPlayer) => {
          if (Math.hypot(pos.x - pool.pos.x, pos.z - pool.pos.z) < pool.radius) {
            ref.burnUntil = Game.elapsed + 0.5;
            ref.burnDps = 15;
          }
        };
        for (const cop of Game.police.cops) if (cop.alive) burnInPool(cop.pos, cop);
        for (const ped of Game.peds) if (ped.alive) burnInPool(ped.pos, ped);
        burnInPool(Game.player.pos, Game.player, true);
      }
      // Smoke clouds: expire (police sight reads them live).
      for (let i = this.smokeClouds.length - 1; i >= 0; i--) {
        if (Game.elapsed > this.smokeClouds[i].until) {
          Game.scene.remove(this.smokeClouds[i].mesh);
          this.smokeClouds.splice(i, 1);
        }
      }
    },

    // Melee punch: F key, hits the nearest cop or pedestrian in front.
    punch() {
      if (Game.mode !== 'playing' || !Game.player.onFoot) return;
      // Stealth takedown first: behind an unaware cop, F is silent.
      if (this.stealthTakedown()) return;
      Game.audio.punch();
      const p = Game.player.pos;
      const fx = Math.sin(Game.player.heading), fz = Math.cos(Game.player.heading);
      let best = null, bestD = 2.2;
      for (const cop of Game.police.cops) {
        if (!cop.alive) continue;
        const d = Math.hypot(cop.pos.x - p.x, cop.pos.z - p.z);
        if (d < bestD) { best = { kind: 'cop', ref: cop }; bestD = d; }
      }
      for (const ped of Game.peds) {
        if (!ped.alive) continue;
        const d = Math.hypot(ped.pos.x - p.x, ped.pos.z - p.z);
        if (d < bestD) { best = { kind: 'ped', ref: ped }; bestD = d; }
      }
      if (!best) return;
      if (best.kind === 'cop') {
        const cop = best.ref;
        cop.health -= 25;
        cop.pos.x += fx * 1.5; cop.pos.z += fz * 1.5;
        if (cop.health <= 0) { Game.police.killCop(cop); this.showHitMarker('red'); Game.police.addHeat(30, 'took down an officer'); }
        else { this.showHitMarker('white'); Game.police.addHeat(10, 'assaulted an officer'); }
      } else {
        Game.pedestrians.knockDownPed(Game, best.ref);
        Game.police.addHeat(20, 'assaulted a pedestrian');
      }
      Game.stats.punches++;
    },

    update(dt) {
      this.shotsRecently = Math.max(0, this.shotsRecently - dt);
      if (tracerLine.material.opacity > 0 && performance.now() > this.tracerUntil) {
        tracerLine.material.opacity = 0;
      }
      this.copFire(dt);
      this.updateProjectiles(dt);
      this.updateBurn(dt);
    },

    // Police return fire: a cop within range and line of sight chips the player.
    copFire(dt) {
      for (const cop of Game.police.cops) {
        if (!cop.alive || cop.shootCooldown > 0) { cop.shootCooldown -= dt; continue; }
        if (cop.stunnedUntil && cop.stunnedUntil > Game.elapsed) continue; // stunned: cannot shoot
        if (cop.cowerUntil && cop.cowerUntil > Game.elapsed) continue;     // suppressing fire: cowering
        if (cop.disarmed) continue; // disarmed: no weapon to shoot with
        const d = cop.pos.distanceTo(Game.player.pos);
        if (d < 32 && Game.police.stars >= 1) {
          cop.shootCooldown = 1.1 + Math.random() * 0.8;
          // Hit chance falls with distance and player speed.
          const hitChance = hitChanceAt(d, Game.player.speed);
          if (Math.random() < hitChance) {
            Game.player.health -= 7 + Math.random() * 6;
            Game.audio.gunshot();
            Game.hud.flashDamage();
            Game.effects.addShake(0.2);
            if (Game.player.health <= 0) Game.police.wasted();
          } else {
            Game.audio.gunshot();
          }
        }
      }
    },
  };
  return C;
}

// ---- Round 3: cop hit chance (distance + player speed), shared by the
// self-test so the formula is tested in one place, not two ----
export function hitChanceAt(distance, playerSpeed) {
  return Math.max(0.08, 0.45 - distance * 0.01 - playerSpeed * 0.012);
}
