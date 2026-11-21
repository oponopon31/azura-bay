// combat.js — Shooting, melee and drive-by combat. Hitscan with a raycaster,
// muzzle flash, tracers, and police who shoot back. The weapon itself (damage,
// range, spread, recoil, stun) comes from the active weapon in weapons.js;
// this file only does the raycast and applies the hit.

import * as THREE from 'three';

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
    shotsRecently: 0,          // counts down; pedestrians flee while > 0
    lastShotPos: new THREE.Vector3(),
    tracerUntil: 0,
    projectiles: [],           // flying shells / spears / thrown explosives
    firePools: [],             // molotov ground fire {pos, radius, until, mesh}
    smokeClouds: [],           // smoke grenade clouds {pos, radius, until, mesh}
    stickies: [],              // placed sticky bombs {pos, mesh, car}

    // ---- Explosive projectiles (launchers, speargun, firework) ----
    fireProjectile(w) {
      if (G.mode !== 'playing') return;
      const dir = new THREE.Vector3();
      G.camera.getWorldDirection(dir);
      const origin = G.camera.position.clone();
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(w.id === 'speargun' ? 0.12 : 0.28, 8, 6),
        new THREE.MeshBasicMaterial({ color: w.tracer || 0xff9a3c })
      );
      mesh.position.copy(origin);
      G.scene.add(mesh);
      this.projectiles.push({
        mesh, w, kind: w.id === 'speargun' ? 'spear' : 'shell',
        vel: dir.clone().multiplyScalar(w.projSpeed || 50),
        age: 0,
      });
      G.audio.gunshot(w.kind);
      G.effects.addShake(0.15 + w.recoil * 0.08);
      this.shotsRecently = 2;
      this.lastShotPos.copy(G.player.pos);
      G.police.addHeat(14, 'fired a heavy weapon');
      G.stats.shotsFired++;
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
          for (const cop of G.police.cops) {
            if (cop.alive && cop.pos.distanceTo(p) < 2) { hit = { point: p.clone(), ref: cop, kind: 'cop' }; break; }
          }
        }
        if (!hit) {
          for (const ped of G.peds) {
            if (ped.alive && ped.pos.distanceTo(p) < 2) { hit = { point: p.clone(), ref: ped, kind: 'ped' }; break; }
          }
        }
        if (!hit) {
          for (const car of G.cars) {
            if (car.pos.distanceTo(p) < 2.5) { hit = { point: p.clone(), ref: car, kind: 'car' }; break; }
          }
        }
        if (hit || pr.age > 4) {
          G.scene.remove(pr.mesh);
          this.projectiles.splice(i, 1);
          if (!hit) continue;
          if (pr.kind === 'spear') {
            // Speargun: one heavy direct hit, no blast.
            if (hit.kind === 'cop') {
              hit.ref.health -= pr.w.damage;
              G.effects.blood(hit.point.x, hit.point.y, hit.point.z);
              if (hit.ref.health <= 0) { G.police.killCop(hit.ref); G.police.addHeat(30, 'took down an officer'); }
            } else if (hit.kind === 'ped') {
              G.pedestrians.knockDownPed(G, hit.ref);
              G.police.addHeat(26, 'speared a pedestrian');
            } else if (hit.kind === 'car') {
              hit.ref.health = Math.max(0, hit.ref.health - pr.w.damage / 200);
              G.effects.sparks(hit.point.x, hit.point.y, hit.point.z, 8);
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
              G.scene.add(fuseMesh);
              this.projectiles.push({ mesh: fuseMesh, w, kind: 'fuse', vel: new THREE.Vector3(), age: 0, fuseUntil: G.elapsed + (w.fuse || 2.5) });
              G.audio.blip?.(1200, 0.1, 'square', 0.15);
            } else if (w.id === 'sticky') {
              // Sticks where it lands (on a car if it hit one) until G detonates.
              const stickMesh = new THREE.Mesh(
                new THREE.BoxGeometry(0.4, 0.2, 0.4),
                new THREE.MeshBasicMaterial({ color: 0xff2222 })
              );
              stickMesh.position.copy(pos);
              G.scene.add(stickMesh);
              this.stickies.push({ pos, mesh: stickMesh, w, car: hit.kind === 'car' ? hit.ref : null });
              G.hud.toast('Sticky bomb placed — press G to detonate.');
            } else if (w.id === 'molotov') {
              // Shatters into a burning pool on the ground.
              const poolMesh = new THREE.Mesh(
                new THREE.CircleGeometry(w.firePool || 6, 20),
                new THREE.MeshBasicMaterial({ color: 0xff6a00, transparent: true, opacity: 0.55 })
              );
              poolMesh.rotation.x = -Math.PI / 2;
              poolMesh.position.set(pos.x, 0.05, pos.z);
              G.scene.add(poolMesh);
              this.firePools.push({ pos, radius: w.firePool || 6, until: G.elapsed + (w.burnSecs || 5), mesh: poolMesh });
              G.effects.smoke(pos.x, 0.5, pos.z, 6);
              G.audio.flame?.();
              G.police.addHeat(20, 'started a fire');
            } else if (w.id === 'smokeflash') {
              if (pr.thrownMode === 'flash') {
                // Blinding burst: screen flash + nearby enemies stunned.
                G.hud.flashbang();
                for (const cop of G.police.cops) {
                  if (cop.alive && cop.pos.distanceTo(pos) < 25) G.police.stunCop(cop, 3);
                }
                for (const ped of G.peds) {
                  if (ped.alive && ped.pos.distanceTo(pos) < 25) G.pedestrians.stunPed(G, ped, 3);
                }
                G.audio.zap();
              } else {
                // Smoke cloud: blocks police sight for 20 s.
                const cloudMesh = new THREE.Mesh(
                  new THREE.SphereGeometry(8, 12, 10),
                  new THREE.MeshBasicMaterial({ color: 0x9aa0a8, transparent: true, opacity: 0.35 })
                );
                cloudMesh.position.set(pos.x, 2, pos.z);
                G.scene.add(cloudMesh);
                this.smokeClouds.push({ pos, radius: 8, until: G.elapsed + 20, mesh: cloudMesh });
                G.hud.toast('Smoke out — police can’t see through it.');
              }
            }
          } else {
            this.explode(hit.point, pr.w);
          }
        }
        // Fuse countdown: a landed frag blows when its fuse runs out.
        if (pr.kind === 'fuse' && G.elapsed >= pr.fuseUntil) {
          const pos = pr.mesh.position.clone();
          G.scene.remove(pr.mesh);
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
      G.effects.smoke(pos.x, pos.y + 0.5, pos.z, 14);
      G.effects.sparks(pos.x, pos.y + 0.5, pos.z, 24);
      G.effects.addShake(0.7);
      G.audio.explosion?.();
      G.police.addHeat(40, 'caused an explosion');
      const dmgAt = (d) => base * Math.max(0.25, 1 - d / R);
      for (const cop of G.police.cops) {
        if (!cop.alive) continue;
        const d = cop.pos.distanceTo(pos);
        if (d < R) {
          cop.health -= dmgAt(d);
          if (cop.health <= 0) G.police.killCop(cop);
        }
      }
      for (const ped of G.peds) {
        if (!ped.alive) continue;
        if (ped.pos.distanceTo(pos) < R) G.pedestrians.knockDownPed(G, ped);
      }
      for (const car of G.cars) {
        const d = car.pos.distanceTo(pos);
        if (d < R) {
          const mult = w.antiVehicle ? 2 : 1;
          car.health = Math.max(0, car.health - (dmgAt(d) / 200) * mult);
          G.effects.sparks(car.pos.x, 1, car.pos.z, 6);
        }
      }
      if (G.police.heli && G.police.heli.pos.distanceTo(pos) < R) {
        G.police.heli.health -= dmgAt(G.police.heli.pos.distanceTo(pos));
        if (G.police.heli.health <= 0) G.police.downHelicopter();
      }
      // Self-damage: standing in your own blast hurts.
      if (w.selfDamage) {
        const d = G.player.pos.distanceTo(pos);
        if (d < R) {
          G.player.health -= dmgAt(d) * 0.6;
          G.hud.flashDamage();
          if (G.player.health <= 0) G.police.wasted();
        }
      }
    },

    // One shot from the camera centre toward the crosshair, with weapon w.
    // `charge` (0.15–1) scales a railgun charge shot. Pellets (shotguns) fire
    // N rays; rifles lose damage with distance (falloff); the railgun pierces
    // every target along the ray.
    fireShot(w, charge) {
      if (G.mode !== 'playing') return;
      const cam = G.camera;
      const spread = w.spread * (1.3 - w.handling * 0.6);
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
        raycaster.setFromCamera(new THREE.Vector2(0, 0), cam);
        raycaster.far = w.range;
        raycaster.ray.direction.x += (Math.random() - 0.5) * spread * 2;
        raycaster.ray.direction.y += (Math.random() - 0.5) * spread * 2;
        raycaster.ray.direction.normalize();
        const targets = [];
        for (const cop of G.police.cops) if (cop.alive) targets.push(cop.mesh);
        for (const ped of G.peds) if (ped.alive) targets.push(ped.mesh);
        for (const car of G.cars) targets.push(car.mesh);
        if (G.police.heli) targets.push(G.police.heli.group);
        const origin = raycaster.ray.origin.clone();
        let end = origin.clone().addScaledVector(raycaster.ray.direction, w.range);
        if (w.penetrate) {
          // Railgun: every target along the ray takes the (charge-scaled) hit.
          const hits = raycaster.intersectObjects(targets, true);
          const dmg = w.damage * (0.5 + 0.5 * (charge ?? 1));
          const seen = new Set();
          for (const hit of hits) {
            end = hit.point.clone();
            const node = this.hitNode(hit.object);
            if (node && !seen.has(node)) { seen.add(node); this.applyHit(hit.object, hit.point, w, dmg); }
          }
        } else {
          const hits = raycaster.intersectObjects(targets, true);
          if (hits.length > 0) {
            const hit = hits[0];
            end = hit.point.clone();
            const dist = hit.distance;
            this.applyHit(hit.object, hit.point, w, w.damage * falloffAt(dist));
          }
        }
        if (p === 0) tracerEnd = end;
      }
      // Tracer in the weapon's colour + muzzle flash + sound.
      tracer.material.color.setHex(w.tracer || 0xffe9a8);
      const posAttr = tracer.geometry.attributes.position;
      const origin = raycaster.ray.origin.clone();
      posAttr.setXYZ(0, origin.x, origin.y, origin.z);
      posAttr.setXYZ(1, tracerEnd.x, tracerEnd.y, tracerEnd.z);
      posAttr.needsUpdate = true;
      tracer.material.opacity = 0.9;
      this.tracerUntil = performance.now() + 60;
      const muzzle = origin.clone().addScaledVector(raycaster.ray.direction, 1.2);
      G.effects.muzzleFlash(muzzle.x, muzzle.y, muzzle.z);
      if (w.stun) G.audio.zap();
      else G.audio.gunshot(w.kind);
      G.effects.addShake(0.05 + w.recoil * 0.06);
      this.shotsRecently = 2;
      this.lastShotPos.copy(G.player.pos);
      if (!w.stun) G.police.addHeat(12, 'fired a gun');
      G.stats.shotsFired++;
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
          G.police.stunCop(cop, w.stunSecs || 5);
          G.stats.stuns = (G.stats.stuns || 0) + 1;
          G.effects.sparks(point.x, point.y, point.z, 10);
          G.hud.toast('Target stunned — non-lethal.');
          return;
        }
        cop.health -= dmg;
        G.effects.blood(point.x, point.y, point.z);
        if (cop.health <= 0) {
          G.police.killCop(cop);
          G.police.addHeat(30, 'took down an officer');
        }
      } else if (kind === 'ped') {
        const ped = node.userData.ref;
        if (w.stun) {
          G.pedestrians.stunPed(G, ped, w.stunSecs || 5);
          G.stats.stuns = (G.stats.stuns || 0) + 1;
          G.effects.sparks(point.x, point.y, point.z, 10);
          return;
        }
        G.pedestrians.knockDownPed(G, ped);
        G.stats.civiliansHurt = (G.stats.civiliansHurt || 0) + 1;
        G.police.addHeat(26, 'shot a pedestrian');
      } else if (kind === 'car') {
        const car = node.userData.ref;
        if (w.stun) { G.effects.sparks(point.x, point.y, point.z, 6); return; }
        car.health = Math.max(0, car.health - dmg / 400);
        G.effects.sparks(point.x, point.y, point.z, 6);
        if (car.driver === 'traffic') {
          G.police.addHeat(6, 'shot a car');
          car.route = null; // driver bails: car stops
          car.speed = 0;
          car.driver = 'parked';
        }
      } else if (kind === 'heli') {
        if (w.stun) { G.effects.sparks(point.x, point.y, point.z, 6); return; }
        G.police.heli.health -= dmg;
        G.effects.sparks(point.x, point.y, point.z, 8);
        if (G.police.heli.health <= 0) G.police.downHelicopter();
      }
    },

    // ---- Flamethrower: a short cone that sets targets burning ----
    fireFlame(w) {
      if (G.mode !== 'playing') return;
      const dir = new THREE.Vector3();
      G.camera.getWorldDirection(dir);
      const origin = G.camera.position.clone();
      const burn = (pos) => {
        G.effects.smoke(pos.x, pos.y + 0.5, pos.z, 3);
        G.effects.sparks(pos.x, pos.y + 0.5, pos.z, 4);
      };
      const inCone = (pos) => {
        const to = new THREE.Vector3().subVectors(pos, origin);
        const d = to.length();
        if (d > w.range) return false;
        to.normalize();
        return to.dot(dir) > 0.86; // ~30° cone
      };
      for (const cop of G.police.cops) {
        if (cop.alive && inCone(cop.pos)) {
          cop.burnUntil = G.elapsed + (w.burnSecs || 4);
          cop.burnDps = w.burnDps || 12;
          burn(cop.pos);
        }
      }
      for (const ped of G.peds) {
        if (ped.alive && inCone(ped.pos)) {
          ped.burnUntil = G.elapsed + (w.burnSecs || 4);
          ped.burnDps = w.burnDps || 12;
          burn(ped.pos);
        }
      }
      for (const car of G.cars) {
        if (inCone(car.pos)) {
          car.health = Math.max(0, car.health - 0.02);
          burn(car.pos);
        }
      }
      // Flame cone visual: a burst of smoke + sparks from the muzzle.
      const tip = origin.clone().addScaledVector(dir, 2);
      G.effects.smoke(tip.x, tip.y, tip.z, 6);
      G.audio.flame?.();
      G.effects.addShake(0.08);
      this.shotsRecently = 2;
      this.lastShotPos.copy(G.player.pos);
      G.police.addHeat(10, 'used a flamethrower');
      G.stats.shotsFired++;
    },

    // ---- Melee swing: an arc in front of the player ----
    meleeSwing(w) {
      if (G.mode !== 'playing' || !G.player.onFoot) return;
      G.audio.swing?.();
      const p = G.player.pos;
      const fx = Math.sin(G.player.heading), fz = Math.cos(G.player.heading);
      const inArc = (pos) => {
        const dx = pos.x - p.x, dz = pos.z - p.z;
        const d = Math.hypot(dx, dz);
        if (d > w.range) return false;
        const dot = (dx * fx + dz * fz) / (d || 1);
        return dot > 0.35; // ~70° arc
      };
      let hitAny = false;
      for (const cop of G.police.cops) {
        if (!cop.alive || !inArc(cop.pos)) continue;
        hitAny = true;
        cop.health -= w.damage;
        cop.pos.x += fx * (w.knockback || 2);
        cop.pos.z += fz * (w.knockback || 2);
        G.effects.blood(cop.pos.x, 1, cop.pos.z);
        if (cop.health <= 0) { G.police.killCop(cop); G.police.addHeat(30, 'took down an officer'); }
        else G.police.addHeat(10, 'assaulted an officer');
      }
      for (const ped of G.peds) {
        if (!ped.alive || !inArc(ped.pos)) continue;
        hitAny = true;
        G.pedestrians.knockDownPed(G, ped);
        G.police.addHeat(20, 'assaulted a pedestrian');
      }
      for (const car of G.cars) {
        if (inArc(car.pos)) {
          hitAny = true;
          car.health = Math.max(0, car.health - w.damage / 300);
          G.effects.sparks(car.pos.x, 1, car.pos.z, 4);
        }
      }
      if (hitAny) { G.audio.punch(); G.effects.addShake(0.12); }
      G.stats.punches++;
    },

    // ---- Thrown explosives: frag / sticky / molotov / smoke-flash ----
    throwWeapon(w, mode) {
      if (G.mode !== 'playing') return;
      const dir = new THREE.Vector3();
      G.camera.getWorldDirection(dir);
      const origin = G.camera.position.clone().addScaledVector(dir, 1);
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 8, 6),
        new THREE.MeshBasicMaterial({ color: w.id === 'molotov' ? 0x2a7a1a : 0x3a3a3a })
      );
      mesh.position.copy(origin);
      G.scene.add(mesh);
      const vel = dir.clone().multiplyScalar(16);
      vel.y += 7; // lobbed arc
      this.projectiles.push({
        mesh, w, kind: 'thrown',
        vel, age: 0,
        fuse: w.fuse || 0,
        thrownMode: mode || 'smoke',
        stuck: false,
      });
      G.audio.throwSnd?.();
      this.shotsRecently = 2;
      G.police.addHeat(8, 'threw an explosive');
    },
    // Sticky bombs: G detonates every placed one.
    detonateStickies() {
      if (this.stickies.length === 0) { G.hud.toast('No sticky bombs placed.'); return; }
      for (const s of this.stickies) {
        const pos = s.car ? s.car.pos.clone() : s.pos.clone();
        G.scene.remove(s.mesh);
        this.explode(pos, s.w);
      }
      this.stickies = [];
    },

    // ---- Burn over time (flamethrower / molotov) + fire pools ----
    updateBurn(dt) {
      const applyBurn = (ref, isPlayer) => {
        if (!ref.burnUntil || ref.burnUntil <= G.elapsed) return;
        const dps = ref.burnDps || 12;
        if (isPlayer) {
          G.player.health -= dps * dt;
          G.hud.flashDamage();
          if (G.player.health <= 0) G.police.wasted();
        } else if (ref.health !== undefined) {
          ref.health -= dps * dt;
          if (ref.health <= 0 && ref.alive) {
            if (G.police.cops.includes(ref)) G.police.killCop(ref);
            else G.pedestrians.knockDownPed(G, ref);
          }
        }
      };
      for (const cop of G.police.cops) if (cop.alive) applyBurn(cop);
      for (const ped of G.peds) if (ped.alive) applyBurn(ped);
      applyBurn(G.player, true);
      // Fire pools: anyone standing in one burns.
      for (let i = this.firePools.length - 1; i >= 0; i--) {
        const pool = this.firePools[i];
        if (G.elapsed > pool.until) {
          G.scene.remove(pool.mesh);
          this.firePools.splice(i, 1);
          continue;
        }
        if (Math.random() < dt * 6) {
          G.effects.smoke(pool.pos.x + (Math.random() - 0.5) * pool.radius, 0.5, pool.pos.z + (Math.random() - 0.5) * pool.radius, 2);
        }
        const burnInPool = (pos, ref, isPlayer) => {
          if (Math.hypot(pos.x - pool.pos.x, pos.z - pool.pos.z) < pool.radius) {
            ref.burnUntil = G.elapsed + 0.5;
            ref.burnDps = 15;
          }
        };
        for (const cop of G.police.cops) if (cop.alive) burnInPool(cop.pos, cop);
        for (const ped of G.peds) if (ped.alive) burnInPool(ped.pos, ped);
        burnInPool(G.player.pos, G.player, true);
      }
      // Smoke clouds: expire (police sight reads them live).
      for (let i = this.smokeClouds.length - 1; i >= 0; i--) {
        if (G.elapsed > this.smokeClouds[i].until) {
          G.scene.remove(this.smokeClouds[i].mesh);
          this.smokeClouds.splice(i, 1);
        }
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

    update(dt) {
      this.shotsRecently = Math.max(0, this.shotsRecently - dt);
      if (tracer.material.opacity > 0 && performance.now() > this.tracerUntil) {
        tracer.material.opacity = 0;
      }
      this.copFire(dt);
      this.updateProjectiles(dt);
      this.updateBurn(dt);
    },

    // Police return fire: a cop within range and line of sight chips the player.
    copFire(dt) {
      for (const cop of G.police.cops) {
        if (!cop.alive || cop.shootCooldown > 0) { cop.shootCooldown -= dt; continue; }
        if (cop.stunnedUntil && cop.stunnedUntil > G.elapsed) continue; // stunned: cannot shoot
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
  };
  return C;
}
