// pedestrians.js — People on the sidewalks: they stroll, cross at corners,
// and run away from gunfire, speeding cars and police chases.
// Bab 24: a longarm carried openly makes them panic and call the police;
// Bab 26: L2/LT near a dog or animal offers pet / scold (tracked reputation).

import * as THREE from 'three';
import { PED_COUNT, CITY_HALF, PITCH, nearestRoad } from './config.js';

const SHIRTS = [0xe74c3c, 0x3498db, 0xf1c40f, 0x2ecc71, 0x9b59b6, 0xecf0f1, 0xe67e22, 0x1abc9c];
const PANTS = [0x2c3e50, 0x34495e, 0x7f8c8d, 0x5d4037];

function buildPedMesh(G, shirt, pants) {
  const g = new THREE.Group();
  const shirtMat = new THREE.MeshLambertMaterial({ color: shirt });
  const pantsMat = new THREE.MeshLambertMaterial({ color: pants });
  const skinMat = new THREE.MeshLambertMaterial({ color: 0xd9a066 });
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.32), shirtMat);
  torso.position.y = 1.15;
  torso.castShadow = true;
  g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), skinMat);
  head.position.y = 1.72;
  head.castShadow = true;
  g.add(head);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.22), pantsMat);
  legL.position.set(-0.14, 0.4, 0);
  g.add(legL);
  const legR = legL.clone();
  legR.position.x = 0.14;
  g.add(legR);
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.65, 0.18), shirtMat);
  armL.position.set(-0.36, 1.15, 0);
  g.add(armL);
  const armR = armL.clone();
  armR.position.x = 0.36;
  g.add(armR);
  return { group: g, legL, legR, armL, armR };
}

export function spawnPedestrians(G) {
  G.peds = [];
  for (let i = 0; i < PED_COUNT; i++) {
    const { group, legL, legR, armL, armR } = buildPedMesh(
      G, G.rng.pick(SHIRTS), G.rng.pick(PANTS));
    // Start on a sidewalk: just off a road centreline.
    const road = -CITY_HALF + G.rng.int(0, 8) * PITCH;
    const along = G.rng.range(-CITY_HALF + 10, CITY_HALF - 10);
    const side = G.rng.chance(0.5) ? 1 : -1;
    const onXRoad = G.rng.chance(0.5);
    const x = onXRoad ? along : road + side * 10.5;
    const z = onXRoad ? road + side * 10.5 : along;
    group.position.set(x, 0, z);
    G.scene.add(group);
    const ped = {
      mesh: group, legL, legR, armL, armR,
      pos: new THREE.Vector3(x, 0, z),
      heading: G.rng.range(0, Math.PI * 2),
      speed: G.rng.range(1.2, 2.2),
      walkPhase: G.rng.range(0, 6),
      target: null,
      fleeing: 0,
      alive: true,
      isDog: false,
    };
    group.userData.hitKind = 'ped';
    group.userData.ref = ped;
    G.peds.push(ped);
  }
  // A few street dogs (Bab 20/25/26): pet them (L2/LT) or scold them.
  for (let i = 0; i < 3; i++) {
    const { group, legL, legR, armL, armR } = buildPedMesh(G, 0x8a6a4a, 0x5d4037);
    const x = G.rng.range(-200, 200), z = G.rng.range(-200, 300);
    group.position.set(x, 0, z);
    group.scale.set(0.8, 0.55, 1.1);
    G.scene.add(group);
    const dog = {
      mesh: group, legL, legR, armL, armR,
      pos: new THREE.Vector3(x, 0, z),
      heading: G.rng.range(0, Math.PI * 2),
      speed: 2.5, walkPhase: 0, target: null, fleeing: 0, alive: true, isDog: true,
    };
    group.userData.hitKind = 'ped';
    group.userData.ref = dog;
    G.peds.push(dog);
  }
}

function pickSidewalkTarget(G, ped) {
  // Next corner along the nearest road, on the sidewalk.
  const roadX = nearestRoad(ped.pos.x);
  const roadZ = nearestRoad(ped.pos.z);
  const onX = Math.abs(ped.pos.z - roadZ) < Math.abs(ped.pos.x - roadX);
  const dir = G.rng.chance(0.5) ? 1 : -1;
  const step = PITCH * G.rng.int(1, 3) * dir;
  if (onX) {
    return new THREE.Vector3(
      THREE.MathUtils.clamp(ped.pos.x + step, -CITY_HALF, CITY_HALF),
      0,
      roadZ + (ped.pos.z > roadZ ? 10.5 : -10.5));
  }
  return new THREE.Vector3(
    roadX + (ped.pos.x > roadX ? 10.5 : -10.5),
    0,
    THREE.MathUtils.clamp(ped.pos.z + step, -CITY_HALF, CITY_HALF));
}

export function updatePedestrians(G, dt) {
  const playerPos = G.player.pos;
  // Bab 17: an openly carried longarm panics NPCs, who call the police.
  const openLongarm = !!(G.weapons && G.weapons.active() &&
    ['longarms', 'special'].includes(G.weapons.active().cat) && G.player.onFoot);
  for (const ped of G.peds) {
    if (!ped.alive) continue;
    // Stunned: stays down until the stun expires, then gets back up.
    if (ped.stunned) {
      if (G.elapsed >= ped.stunnedUntil) {
        ped.stunned = false;
        ped.mesh.rotation.x = 0;
        ped.mesh.position.y = 0;
      } else {
        continue;
      }
    }
    // Flee from gunfire, fast cars and the wanted player.
    let danger = null;
    if (G.combat.shotsRecently > 0) {
      const d = ped.pos.distanceTo(G.combat.lastShotPos);
      if (d < 40) danger = G.combat.lastShotPos;
    }
    const dp = ped.pos.distanceTo(playerPos);
    if (G.player.inCar && G.player.speed > 8 && dp < 18) danger = playerPos;
    if (G.police.stars >= 2 && dp < 10) danger = playerPos;
    if (openLongarm && dp < 25 && !ped.isDog) {
      danger = playerPos;
      if (!ped.reported) { ped.reported = true; G.police.addHeat(8, 'seen carrying a longarm openly'); }
    } else if (!openLongarm) ped.reported = false;
    if (danger) ped.fleeing = 2.5;
    ped.fleeing = Math.max(0, ped.fleeing - dt);

    if (!ped.target || ped.pos.distanceTo(ped.target) < 2) {
      ped.target = pickSidewalkTarget(G, ped);
    }
    let dest = ped.target;
    let speed = ped.speed;
    if (ped.fleeing > 0 && danger) {
      // Run directly away from the danger.
      const away = new THREE.Vector3().subVectors(ped.pos, danger).setY(0).normalize();
      dest = new THREE.Vector3().addVectors(ped.pos, away.multiplyScalar(20));
      speed = 5.5;
    }
    const dx = dest.x - ped.pos.x, dz = dest.z - ped.pos.z;
    const dist = Math.hypot(dx, dz);
    if (dist > 0.05) {
      const want = Math.atan2(dx, dz);
      let dh = want - ped.heading;
      while (dh > Math.PI) dh -= Math.PI * 2;
      while (dh < -Math.PI) dh += Math.PI * 2;
      ped.heading += THREE.MathUtils.clamp(dh, -4 * dt, 4 * dt);
      ped.pos.x += Math.sin(ped.heading) * speed * dt;
      ped.pos.z += Math.cos(ped.heading) * speed * dt;
      ped.walkPhase += dt * speed * 3.2;
    }
    // Walk-cycle swing.
    const swing = Math.sin(ped.walkPhase) * 0.55;
    ped.legL.rotation.x = swing;
    ped.legR.rotation.x = -swing;
    ped.armL.rotation.x = -swing * 0.7;
    ped.armR.rotation.x = swing * 0.7;
    ped.mesh.position.copy(ped.pos);
    ped.mesh.rotation.y = ped.heading;
  }
}

// A pedestrian hit by a car or a bullet: falls and stays down.
export function knockDownPed(G, ped) {
  if (!ped.alive) return;
  ped.alive = false;
  ped.mesh.rotation.x = -Math.PI / 2;
  ped.mesh.position.y = 0.3;
  G.effects.blood(ped.pos.x, 1, ped.pos.z);
}

// Stunned (Coil Shocker / flashbang): falls, stays down for `secs`,
// then gets back up. Non-lethal — does not count as a kill.
export function stunPed(G, ped, secs) {
  if (!ped.alive || ped.stunned) return;
  ped.stunned = true;
  ped.stunnedUntil = G.elapsed + secs;
  ped.mesh.rotation.x = -Math.PI / 2;
  ped.mesh.position.y = 0.3;
  G.effects.sparks(ped.pos.x, 1, ped.pos.z, 8);
}

// Bab 25/26 animal reputation: pet (kind) or scold (mean) a nearby dog.
// Recorded in G.stats.animalRep (positive = kind, negative = mean).
export function interactAnimal(G, kind) {
  let best = null, bestD = 4;
  for (const ped of G.peds) {
    if (!ped.alive || !ped.isDog) continue;
    const d = Math.hypot(ped.pos.x - G.player.pos.x, ped.pos.z - G.player.pos.z);
    if (d < bestD) { best = ped; bestD = d; }
  }
  if (!best) { G.hud.toast('No animal nearby.'); return false; }
  G.stats.animalRep = (G.stats.animalRep || 0) + (kind === 'pet' ? 1 : -1);
  if (kind === 'pet') {
    G.hud.toast('You pet the dog. It wags its tail.');
    if (G.attributes) G.attributes.gainFocus(2);
  } else {
    G.hud.toast('You scold the dog. It skulks away.');
    best.fleeing = 3;
  }
  return true;
}

// Bab 17: an open longarm on the street makes nearby NPCs panic and
// report to the police.
export function panicNearby(G, radius) {
  for (const ped of G.peds) {
    if (!ped.alive) continue;
    if (ped.pos.distanceTo(G.player.pos) < radius) ped.fleeing = 3;
  }
  G.police.addHeat(4, 'someone reported an open longarm');
}
