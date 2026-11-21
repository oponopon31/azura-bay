// vehicles.js — Car meshes and traffic AI. One job: every car in Azura Bay,
// from parked sedans to police interceptors, and how traffic drives itself.

import * as THREE from 'three';
import { CAR_CLASSES, PALETTE, TRAFFIC_COUNT, PARKED_COUNT, CITY_HALF, PITCH, GRID, nearestRoad, onRoad } from './config.js';

let carId = 0;

// Build a low-poly car: body, cabin, wheels, lights. Police cars get a light bar.
export function buildCarMesh(kind, colorHex) {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshLambertMaterial({ color: colorHex });
  const glassMat = new THREE.MeshLambertMaterial({ color: 0x223344 });
  const darkMat = new THREE.MeshLambertMaterial({ color: 0x181818 });
  const isVan = kind === 'van';
  const isSuv = kind === 'suv';
  const isTruck = kind === 'truck';
  const len = isVan ? 5.6 : isTruck ? 6.4 : isSuv ? 5.0 : 4.6;
  const wid = isTruck ? 2.3 : 2.0;
  const bodyH = isVan ? 1.5 : isSuv ? 1.25 : isTruck ? 1.1 : 0.85;

  const body = new THREE.Mesh(new THREE.BoxGeometry(wid, bodyH, len), bodyMat);
  body.position.y = 0.75;
  body.castShadow = true;
  g.add(body);
  if (isTruck) {
    // Pickup: cab up front, open bed with walls at the back.
    const cab = new THREE.Mesh(new THREE.BoxGeometry(wid * 0.9, 0.85, 1.5), glassMat);
    cab.position.set(0, bodyH + 0.4, len / 2 - 1.1);
    cab.castShadow = true;
    g.add(cab);
    const bedWallMat = bodyMat;
    for (const [wx, wz, ww, wd] of [[0, -len / 2 + 0.25, wid, 0.18], [-wid / 2 + 0.09, -1.2, 0.18, 3.4], [wid / 2 - 0.09, -1.2, 0.18, 3.4]]) {
      const wall = new THREE.Mesh(new THREE.BoxGeometry(ww, 0.55, wd), bedWallMat);
      wall.position.set(wx, bodyH + 0.25, wz);
      g.add(wall);
    }
  } else {
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(wid * 0.85, isVan || isSuv ? 0.95 : 0.7, len * (isVan ? 0.75 : isSuv ? 0.62 : 0.45)), glassMat);
    cabin.position.set(0, bodyH + (isVan || isSuv ? 0.5 : 0.42), isVan ? -0.2 : isSuv ? -0.1 : -0.25);
    cabin.castShadow = true;
    g.add(cabin);
  }
  // Bumpers.
  for (const dz of [-len / 2 - 0.05, len / 2 + 0.05]) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(wid + 0.1, 0.3, 0.25), darkMat);
    b.position.set(0, 0.45, dz);
    g.add(b);
  }
  // Headlights / taillights.
  const headMat = new THREE.MeshLambertMaterial({ color: 0xfff2c0, emissive: 0x443300 });
  const tailMat = new THREE.MeshLambertMaterial({ color: 0xaa1111, emissive: 0x330000 });
  for (const dx of [-0.7, 0.7]) {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.08), headMat);
    h.position.set(dx, 0.85, len / 2 + 0.03);
    g.add(h);
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.08), tailMat);
    t.position.set(dx, 0.85, -len / 2 - 0.03);
    g.add(t);
  }
  // Wheels.
  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.3, 10);
  wheelGeo.rotateZ(Math.PI / 2);
  const wheels = [];
  for (const [dx, dz] of [[-0.95, 1.5], [0.95, 1.5], [-0.95, -1.5], [0.95, -1.5]]) {
    const w = new THREE.Mesh(wheelGeo, darkMat);
    w.position.set(dx, 0.38, dz);
    w.castShadow = true;
    g.add(w);
    wheels.push(w);
  }
  let lightBar = null;
  if (kind === 'police') {
    const bar = new THREE.Group();
    const red = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.3),
      new THREE.MeshLambertMaterial({ color: 0xff2222, emissive: 0xaa0000 }));
    red.position.x = -0.35;
    const blue = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.3),
      new THREE.MeshLambertMaterial({ color: 0x2244ff, emissive: 0x0000aa }));
    blue.position.x = 0.35;
    bar.add(red); bar.add(blue);
    bar.position.set(0, 1.55, -0.2);
    g.add(bar);
    lightBar = { red: red.material, blue: blue.material };
  }
  return { group: g, wheels, lightBar, len, wid };
}

export function makeCar(G, kind, x, z, heading, driver) {
  const cls = CAR_CLASSES[kind] || CAR_CLASSES.sedan;
  const colorHex = kind === 'police' ? 0xf2f2f2 : G.rng.pick(PALETTE.carPaint);
  const { group, wheels, lightBar, len, wid } = buildCarMesh(kind, colorHex);
  group.position.set(x, 0, z);
  group.rotation.y = heading;
  G.scene.add(group);
  const car = {
    id: ++carId,
    kind, cls, colorHex, mesh: group, wheels, lightBar,
    pos: new THREE.Vector3(x, 0, z),
    heading, speed: 0, steer: 0,
    driver: driver || 'parked', // 'traffic' | 'parked' | 'player' | 'police' | 'target' | 'none'
    health: 1, // 1 = pristine, 0 = wrecked
    stuckTimer: 0,
    route: null,
    radius: 2.4,
    sirenPhase: Math.random() * 10,
  };
  group.userData.hitKind = 'car';
  group.userData.ref = car;
  G.cars.push(car);
  return car;
}

function randomRoad(rng) {
  return -CITY_HALF + rng.int(0, GRID - 1) * PITCH;
}

export function spawnParkedCars(G) {
  for (let i = 0; i < PARKED_COUNT; i++) {
    const axis = G.rng.chance(0.5) ? 'x' : 'z';
    const road = randomRoad(G.rng);
    const along = G.rng.range(-CITY_HALF + 20, CITY_HALF - 20);
    const side = G.rng.chance(0.5) ? 1 : -1;
    const kind = G.rng.pick(['sedan', 'sedan', 'coupe', 'suv', 'van', 'truck', 'taxi']);
    let x, z, heading;
    if (axis === 'x') { x = along; z = road + side * (8 + 2.2); heading = side > 0 ? Math.PI / 2 : -Math.PI / 2; }
    else { x = road + side * (8 + 2.2); z = along; heading = side > 0 ? 0 : Math.PI; }
    makeCar(G, kind, x, z, heading, 'parked');
  }
}

export function spawnTraffic(G) {
  for (let i = 0; i < TRAFFIC_COUNT; i++) {
    const axis = G.rng.chance(0.5) ? 'x' : 'z';
    const road = randomRoad(G.rng);
    const along = G.rng.range(-CITY_HALF + 20, CITY_HALF - 20);
    const dir = G.rng.chance(0.5) ? 1 : -1;
    const kind = G.rng.pick(['sedan', 'sedan', 'coupe', 'suv', 'van', 'truck', 'taxi']);
    let x, z, heading;
    // Right-hand traffic: lane offset +4 on the right side of travel.
    if (axis === 'x') { x = along; z = road + (dir > 0 ? 4 : -4); heading = dir > 0 ? Math.PI / 2 : -Math.PI / 2; }
    else { x = road + (dir > 0 ? -4 : 4); z = along; heading = dir > 0 ? 0 : Math.PI; }
    const car = makeCar(G, kind, x, z, heading, 'traffic');
    car.speed = G.rng.range(7, 12);
    car.route = { axis, road, dir, targetSpeed: car.speed };
  }
}

// Steer a traffic car along its road; turn at intersections sometimes.
function trafficDrive(G, car, dt) {
  const r = car.route;
  if (!r) return;
  const fwdX = Math.sin(car.heading), fwdZ = Math.cos(car.heading);
  // Lane target: stay on the road centreline offset by lane.
  let laneX = car.pos.x, laneZ = car.pos.z;
  if (r.axis === 'x') laneZ = r.road + (r.dir > 0 ? 4 : -4);
  else laneX = r.road + (r.dir > 0 ? -4 : 4);
  // Desired heading from lane error + travel direction.
  let wantHeading;
  if (r.axis === 'x') {
    wantHeading = r.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
    wantHeading += Math.atan2(laneZ - car.pos.z, 30) * 0.5;
  } else {
    wantHeading = r.dir > 0 ? 0 : Math.PI;
    wantHeading += Math.atan2(-(laneX - car.pos.x), 30) * 0.5;
  }
  let dh = wantHeading - car.heading;
  while (dh > Math.PI) dh -= Math.PI * 2;
  while (dh < -Math.PI) dh += Math.PI * 2;
  car.heading += THREE.MathUtils.clamp(dh, -1.6 * dt, 1.6 * dt);

  // Slow down for a car ahead in the same lane.
  let wantSpeed = r.targetSpeed;
  for (const other of G.cars) {
    if (other === car || other.speed === 0 && other.driver === 'parked') continue;
    const dx = other.pos.x - car.pos.x, dz = other.pos.z - car.pos.z;
    const ahead = dx * fwdX + dz * fwdZ;
    const side = Math.abs(dx * fwdZ - dz * fwdX);
    if (ahead > 0 && ahead < 12 && side < 3.5) { wantSpeed = Math.min(wantSpeed, 2.5); break; }
  }
  // Also brake for the player on foot in front.
  if (G.player.onFoot) {
    const dx = G.player.pos.x - car.pos.x, dz = G.player.pos.z - car.pos.z;
    const ahead = dx * fwdX + dz * fwdZ;
    const side = Math.abs(dx * fwdZ - dz * fwdX);
    if (ahead > 0 && ahead < 9 && side < 3) wantSpeed = 0;
  }
  car.speed += THREE.MathUtils.clamp(wantSpeed - car.speed, -10 * dt, 6 * dt);
  car.pos.x += Math.sin(car.heading) * car.speed * dt;
  car.pos.z += Math.cos(car.heading) * car.speed * dt;

  // Turn at an intersection, or loop back at the city edge.
  const nearCross = Math.abs(car.pos.x - nearestRoad(car.pos.x)) < 3 && Math.abs(car.pos.z - nearestRoad(car.pos.z)) < 3;
  const outOfCity = Math.abs(car.pos.x) > CITY_HALF + 6 || Math.abs(car.pos.z) > CITY_HALF + 6;
  if ((nearCross && G.rng.chance(0.25 * dt * 10)) || outOfCity) {
    const newAxis = r.axis === 'x' ? 'z' : 'x';
    const newRoad = nearestRoad(newAxis === 'x' ? car.pos.z : car.pos.x);
    const newDir = G.rng.chance(0.5) ? 1 : -1;
    car.route = { axis: newAxis, road: newRoad, dir: newDir, targetSpeed: G.rng.range(7, 12) };
    if (outOfCity) {
      // Teleport the car to the opposite edge road so traffic never leaves town.
      if (Math.abs(car.pos.x) > CITY_HALF + 6) car.pos.x = -Math.sign(car.pos.x) * (CITY_HALF - 10);
      if (Math.abs(car.pos.z) > CITY_HALF + 6) car.pos.z = -Math.sign(car.pos.z) * (CITY_HALF - 10);
    }
  }
}

// Simple circle-vs-circle push for every pair of cars.
function collideCars(G, dt) {
  const cars = G.cars;
  for (let i = 0; i < cars.length; i++) {
    for (let j = i + 1; j < cars.length; j++) {
      const a = cars[i], b = cars[j];
      const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z;
      const d2 = dx * dx + dz * dz;
      const min = a.radius + b.radius - 0.6;
      if (d2 < min * min && d2 > 0.0001) {
        const d = Math.sqrt(d2);
        const push = (min - d) / 2;
        const nx = dx / d, nz = dz / d;
        a.pos.x -= nx * push; a.pos.z -= nz * push;
        b.pos.x += nx * push; b.pos.z += nz * push;
        const relSpeed = Math.abs(a.speed - b.speed);
        if (relSpeed > 4) {
          const dmg = Math.min(0.25, relSpeed * 0.02);
          a.health = Math.max(0, a.health - dmg);
          b.health = Math.max(0, b.health - dmg);
          const mx = (a.pos.x + b.pos.x) / 2, mz = (a.pos.z + b.pos.z) / 2;
          G.effects.sparks(mx, 1, mz, 8);
          G.effects.addShake(0.15);
          if (a.driver === 'player' || b.driver === 'player') {
            G.audio.crash(relSpeed / 30);
            G.police.addHeat(6, 'hit a car');
          }
        }
        // Traffic yields after a bump.
        if (a.driver === 'traffic') a.speed *= 0.4;
        if (b.driver === 'traffic') b.speed *= 0.4;
      }
    }
  }
}

export function updateVehicles(G, dt) {
  for (const car of G.cars) {
    if (car.driver === 'traffic') trafficDrive(G, car, dt);
    // Police cars are driven by police.js; the player's car by driving.js.
    // Sync mesh + wheels.
    car.mesh.position.set(car.pos.x, 0, car.pos.z);
    car.mesh.rotation.y = car.heading;
    const spin = car.speed * dt * 2.6;
    for (const w of car.wheels) w.rotation.x += spin;
    // Flashing light bar.
    if (car.lightBar) {
      car.sirenPhase += dt * 9;
      const on = Math.sin(car.sirenPhase) > 0;
      car.lightBar.red.emissive.setHex(on ? 0xff0000 : 0x330000);
      car.lightBar.blue.emissive.setHex(on ? 0x000033 : 0x0000ff);
    }
    // Smoking wreck.
    if (car.health < 0.35 && car.health > 0 && Math.random() < dt * 6) {
      G.effects.smoke(car.pos.x, 1.2, car.pos.z, 1);
    }
  }
  collideCars(G, dt);
}
