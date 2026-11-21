// city.js — Builds Azura Bay: road grid, buildings, sidewalks, beach, sea,
// harbor docks, palms, streetlights and the safehouse. One job: the world itself.

import * as THREE from 'three';
import { BLOCK, ROAD, PITCH, GRID, CITY_HALF, BEACH_Z, WATER_Z, HARBOR_X, PALETTE, PLACES } from './config.js';

function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Facade texture: warm wall with a grid of windows, some lit gold.
function facadeTexture(baseColor, rng) {
  return canvasTexture(128, 256, (g, w, h) => {
    g.fillStyle = baseColor; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(0,0,0,0.08)';
    for (let y = 0; y < h; y += 16) g.fillRect(0, y, w, 2);
    for (let x = 8; x < w; x += 20) {
      for (let y = 12; y < h - 8; y += 26) {
        const lit = rng.chance(0.35);
        g.fillStyle = lit ? '#ffd98a' : '#2c4258';
        g.fillRect(x, y, 12, 16);
        g.fillStyle = 'rgba(255,255,255,0.25)';
        g.fillRect(x, y, 12, 2);
      }
    }
  });
}

function roadTexture() {
  return canvasTexture(64, 256, (g, w, h) => {
    g.fillStyle = '#2e2e33'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#d8c86a';
    for (let y = 8; y < h; y += 42) g.fillRect(w / 2 - 2, y, 4, 22);
    g.fillStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i < 40; i++) g.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  });
}

export function buildCity(G) {
  const { scene, rng } = G;
  const colliders = [];
  const lamps = [];

  // ---- Ground base ----
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1100, 1100),
    new THREE.MeshLambertMaterial({ color: 0x8a9a6a })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(40, -0.15, 40);
  ground.receiveShadow = true;
  scene.add(ground);

  // City slab (pavement under the grid).
  const slab = new THREE.Mesh(
    new THREE.PlaneGeometry(CITY_HALF * 2 + ROAD, CITY_HALF * 2 + ROAD),
    new THREE.MeshLambertMaterial({ color: 0x8f8a80 })
  );
  slab.rotation.x = -Math.PI / 2;
  slab.position.y = -0.05;
  slab.receiveShadow = true;
  scene.add(slab);

  // ---- Roads (textured strips, dashed centre line) ----
  const roadTex = roadTexture();
  roadTex.wrapS = roadTex.wrapT = THREE.RepeatWrapping;
  const roadLen = CITY_HALF * 2 + ROAD;
  for (let i = 0; i < GRID; i++) {
    const c = -CITY_HALF + i * PITCH;
    const texV = roadTex.clone();
    texV.needsUpdate = true;
    texV.repeat.set(1, roadLen / 32);
    const stripV = new THREE.Mesh(new THREE.PlaneGeometry(ROAD, roadLen), new THREE.MeshLambertMaterial({ map: texV }));
    stripV.rotation.x = -Math.PI / 2;
    stripV.position.set(c, 0.02, 0);
    stripV.receiveShadow = true;
    scene.add(stripV);
    const texH = roadTex.clone();
    texH.needsUpdate = true;
    texH.repeat.set(1, roadLen / 32);
    const stripH = new THREE.Mesh(new THREE.PlaneGeometry(ROAD, roadLen), new THREE.MeshLambertMaterial({ map: texH }));
    stripH.rotation.x = -Math.PI / 2;
    stripH.rotation.z = Math.PI / 2;
    stripH.position.set(0, 0.02, c);
    stripH.receiveShadow = true;
    scene.add(stripH);
  }

  // ---- Buildings ----
  const boxGeo = new THREE.BoxGeometry(1, 1, 1);
  const roofMat = new THREE.MeshLambertMaterial({ color: 0x5a5148 });
  const towers = []; // tall buildings, for neon signs + rooftop props
  const facadeMats = PALETTE.building.map((hex) => {
    const css = '#' + hex.toString(16).padStart(6, '0');
    const tex = facadeTexture(css, rng);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return new THREE.MeshLambertMaterial({ map: tex });
  });

  function addBuilding(cx, cz, w, d, hgt, mat) {
    const m = new THREE.Mesh(boxGeo, [mat, mat, roofMat, roofMat, mat, mat]);
    m.scale.set(w, hgt, d);
    m.position.set(cx, hgt / 2, cz);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    colliders.push({ minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2 });
    // Rooftop props: AC units and the odd water tower.
    const roofY = hgt;
    const nAc = rng.int(1, 3);
    for (let a = 0; a < nAc; a++) {
      const ac = new THREE.Mesh(boxGeo, new THREE.MeshLambertMaterial({ color: 0x6a6a6a }));
      ac.scale.set(rng.range(1.5, 3), 1, rng.range(1.5, 3));
      ac.position.set(cx + rng.range(-w / 4, w / 4), roofY + 0.5, cz + rng.range(-d / 4, d / 4));
      ac.castShadow = true;
      scene.add(ac);
    }
    if (hgt > 22 && rng.chance(0.4)) {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 3.4, 10),
        new THREE.MeshLambertMaterial({ color: 0x7a5a3a }));
      tank.position.set(cx + w / 4, roofY + 2.6, cz - d / 4);
      tank.castShadow = true;
      scene.add(tank);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.6, 10),
        new THREE.MeshLambertMaterial({ color: 0x5a4030 }));
      cone.position.set(cx + w / 4, roofY + 5, cz - d / 4);
      scene.add(cone);
    }
    if (hgt > 24) towers.push({ x: cx, z: cz, w, d, h: hgt });
    return m;
  }

  const safeBlock = { i: 3, j: 7 }; // safehouse block
  const parkBlock = { i: 4, j: 4 }; // central park
  for (let i = 0; i < GRID - 1; i++) {
    for (let j = 0; j < GRID - 1; j++) {
      const cx = -CITY_HALF + PITCH / 2 + i * PITCH;
      const cz = -CITY_HALF + PITCH / 2 + j * PITCH;
      const distCentre = Math.hypot(cx, cz) / CITY_HALF;
      if (i === safeBlock.i && j === safeBlock.j) continue; // safehouse below
      if (i === parkBlock.i && j === parkBlock.j) {
        // Central park: lawn, palms, fountain basin.
        const lawn = new THREE.Mesh(new THREE.PlaneGeometry(BLOCK - 4, BLOCK - 4),
          new THREE.MeshLambertMaterial({ color: 0x5d8a4a }));
        lawn.rotation.x = -Math.PI / 2;
        lawn.position.set(cx, 0.03, cz);
        lawn.receiveShadow = true;
        scene.add(lawn);
        const basin = new THREE.Mesh(new THREE.CylinderGeometry(7, 8, 1.2, 20),
          new THREE.MeshLambertMaterial({ color: 0x9fb8c8 }));
        basin.position.set(cx, 0.6, cz);
        basin.castShadow = true;
        scene.add(basin);
        colliders.push({ minX: cx - 8, maxX: cx + 8, minZ: cz - 8, maxZ: cz + 8 });
        continue;
      }
      // NOTE: the facade pick MUST stay here, before the tower chance roll:
      // the seeded city (buildings, parked cars, traffic, peds) is laid out
      // from one shared rng stream, and moving this pick changes every
      // downstream draw — round 2 moved it once and the whole city shifted.
      const mat = rng.pick(facadeMats);
      const downtown = 1 - distCentre;
      if (rng.chance(0.28 + downtown * 0.3)) {
        // One tall tower.
        addBuilding(cx, cz, 34 + rng.range(0, 10), 34 + rng.range(0, 10),
          26 + rng.range(0, 26) + downtown * 22, mat);
      } else {
        // Two to four smaller buildings.
        const n = rng.int(2, 4);
        for (let k = 0; k < n; k++) {
          const w = rng.range(14, 24), d = rng.range(14, 24);
          const ox = rng.range(-14, 14), oz = rng.range(-14, 14);
          if (Math.abs(ox) + w / 2 > 28 || Math.abs(oz) + d / 2 > 28) continue;
          addBuilding(cx + ox, cz + oz, w, d, rng.range(7, 18) + downtown * 10, rng.pick(facadeMats));
        }
      }
    }
  }

  // ---- Safehouse: a low villa with a garage, distinct terracotta walls ----
  const sh = PLACES.safehouse;
  const shMat = new THREE.MeshLambertMaterial({ color: 0xd98f6a });
  addBuilding(sh.x, sh.z, 26, 18, 9, shMat);
  const shRoof = new THREE.Mesh(new THREE.ConeGeometry(20, 5, 4),
    new THREE.MeshLambertMaterial({ color: 0x8a4a3a }));
  shRoof.position.set(sh.x, 11.5, sh.z);
  shRoof.rotation.y = Math.PI / 4;
  shRoof.castShadow = true;
  scene.add(shRoof);
  const shSign = new THREE.Mesh(new THREE.BoxGeometry(10, 2, 0.6),
    new THREE.MeshLambertMaterial({ color: 0x2e6f8e, emissive: 0x1a4a5e }));
  shSign.position.set(sh.x, 7, sh.z - 9.4);
  scene.add(shSign);

  // ---- Neon signs on the downtown towers (glowing canvas text, original names) ----
  const neonDefs = [
    ['AZURA', '#ff2d95'], ['NEON BAR', '#00e5ff'], ['HOTEL SOL', '#ffd23f'],
    ['CLUB MARINA', '#ff2d95'], ['TACOS', '#39ff88'], ['CASINO', '#ffd23f'],
    ['SURF SHOP', '#00e5ff'], ['PIER 9', '#39ff88'],
  ];
  function neonTexture(text, color) {
    return canvasTexture(256, 64, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      g.font = 'bold 40px Arial, sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.shadowColor = color; g.shadowBlur = 18;
      g.fillStyle = color;
      g.fillText(text, w / 2, h / 2);
      g.shadowBlur = 6;
      g.fillStyle = '#ffffff';
      g.fillText(text, w / 2, h / 2);
    });
  }
  const neonPlanes = [];
  for (let n = 0; n < Math.min(neonDefs.length, towers.length); n++) {
    const t = towers[n];
    const [text, color] = neonDefs[n];
    const tex = neonTexture(text, color);
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(13, 3.2),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    // Face the nearest road (south face).
    plane.position.set(t.x, t.h * 0.62, t.z + t.d / 2 + 0.25);
    scene.add(plane);
    neonPlanes.push(plane);
  }

  // ---- Zebra crossings at every intersection (one instanced mesh) ----
  {
    const stripeGeo = new THREE.BoxGeometry(0.9, 0.06, 3.4);
    const stripeMat = new THREE.MeshLambertMaterial({ color: 0xe8e8e8 });
    const spots = [];
    for (let i = 0; i < GRID; i++) {
      for (let j = 0; j < GRID; j++) {
        const cx = -CITY_HALF + i * PITCH;
        const cz = -CITY_HALF + j * PITCH;
        // Crossing over the east-west road, just south of the intersection.
        for (let s = -2; s <= 2; s++) spots.push([cx + s * 2.2, cz + ROAD / 2 + 2.4, 0]);
      }
    }
    const stripes = new THREE.InstancedMesh(stripeGeo, stripeMat, spots.length);
    const m4z = new THREE.Matrix4();
    spots.forEach(([x, z], idx) => {
      m4z.makeTranslation(x, 0.06, z);
      stripes.setMatrixAt(idx, m4z);
    });
    stripes.receiveShadow = true;
    scene.add(stripes);
  }

  // ---- Curbs: raised sidewalk edges along every road ----
  {
    const curbGeo = new THREE.BoxGeometry(1.4, 0.22, CITY_HALF * 2 + ROAD);
    const curbMat = new THREE.MeshLambertMaterial({ color: 0x7a756c });
    for (let i = 0; i < GRID; i++) {
      const c = -CITY_HALF + i * PITCH;
      for (const off of [-ROAD / 2 - 0.7, ROAD / 2 + 0.7]) {
        const curbV = new THREE.Mesh(curbGeo, curbMat);
        curbV.position.set(c + off, 0.08, 0);
        curbV.receiveShadow = true;
        scene.add(curbV);
        const curbH = new THREE.Mesh(curbGeo, curbMat);
        curbH.rotation.y = Math.PI / 2;
        curbH.position.set(0, 0.08, c + off);
        curbH.receiveShadow = true;
        scene.add(curbH);
      }
    }
  }

  // ---- Beach (south) and sea ----
  const sand = new THREE.Mesh(new THREE.PlaneGeometry(1100, 90),
    new THREE.MeshLambertMaterial({ color: 0xe8cf9a }));
  sand.rotation.x = -Math.PI / 2;
  sand.position.set(40, 0.0, BEACH_Z + 45);
  sand.receiveShadow = true;
  scene.add(sand);
  const seaMat = new THREE.MeshLambertMaterial({ color: PALETTE.sea, transparent: true, opacity: 0.92 });
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(1100, 420), seaMat);
  sea.rotation.x = -Math.PI / 2;
  sea.position.set(40, -0.3, WATER_Z + 210);
  scene.add(sea);
  const seaEast = new THREE.Mesh(new THREE.PlaneGeometry(420, 1100), seaMat.clone());
  seaEast.rotation.x = -Math.PI / 2;
  seaEast.position.set(HARBOR_X + 210, -0.3, 40);
  scene.add(seaEast);

  // Boardwalk strip along the beach.
  const boardwalk = new THREE.Mesh(new THREE.PlaneGeometry(700, 8),
    new THREE.MeshLambertMaterial({ color: 0xa8886a }));
  boardwalk.rotation.x = -Math.PI / 2;
  boardwalk.position.set(0, 0.05, BEACH_Z - 4);
  boardwalk.receiveShadow = true;
  scene.add(boardwalk);

  // ---- Harbor (east): piers, containers, cranes ----
  const pierMat = new THREE.MeshLambertMaterial({ color: 0x7a6a55 });
  for (let k = 0; k < 3; k++) {
    const pier = new THREE.Mesh(new THREE.BoxGeometry(60, 1.5, 10), pierMat);
    pier.position.set(HARBOR_X + 30, 0.4, -160 + k * 160);
    pier.castShadow = true; pier.receiveShadow = true;
    scene.add(pier);
    colliders.push({ minX: HARBOR_X, maxX: HARBOR_X + 60, minZ: -165 + k * 160, maxZ: -155 + k * 160 });
  }
  const containerCols = [0xc0392b, 0x2e6fb0, 0xe67e22, 0x27ae60, 0x8e44ad];
  for (let k = 0; k < 14; k++) {
    const cx = HARBOR_X - 14 + rng.range(-30, 30);
    const cz = -280 + k * 44 + rng.range(-8, 8);
    const c = new THREE.Mesh(boxGeo, new THREE.MeshLambertMaterial({ color: rng.pick(containerCols) }));
    c.scale.set(12, 3.2, 3.4);
    c.position.set(cx, 1.6, cz);
    c.castShadow = true;
    scene.add(c);
    colliders.push({ minX: cx - 6, maxX: cx + 6, minZ: cz - 1.7, maxZ: cz + 1.7 });
  }
  // Two gantry cranes.
  for (const cz of [-80, 120]) {
    const crane = new THREE.Group();
    const legMat = new THREE.MeshLambertMaterial({ color: 0xd8a020 });
    for (const dx of [-8, 8]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(2, 34, 2), legMat);
      leg.position.set(dx, 17, 0);
      leg.castShadow = true;
      crane.add(leg);
    }
    const beam = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 70), legMat);
    beam.position.set(0, 33, 10);
    beam.castShadow = true;
    crane.add(beam);
    crane.position.set(HARBOR_X + 8, 0, cz);
    scene.add(crane);
  }

  // ---- Palm trees (instanced): beach row, park, sidewalks ----
  const palmSpots = [];
  for (let x = -320; x <= 320; x += 40) palmSpots.push([x + rng.range(-6, 6), BEACH_Z + 14 + rng.range(0, 18)]);
  for (let k = 0; k < 10; k++) palmSpots.push([rng.range(-24, 24), rng.range(-24, 24)]);
  for (let k = 0; k < 24; k++) {
    const road = rng.pick([-280, -200, -120, -40, 40, 120, 200, 280]);
    palmSpots.push([road + rng.range(-6, 6), rng.pick([-280, -200, -120, -40, 40, 120, 200, 280]) + rng.range(-6, 6)]);
  }
  const trunkGeo = new THREE.CylinderGeometry(0.35, 0.55, 7, 6);
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8a6a4a });
  const frondGeo = new THREE.ConeGeometry(3.2, 4.5, 7);
  const frondMat = new THREE.MeshLambertMaterial({ color: 0x3f8a3f });
  const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, palmSpots.length);
  const fronds = new THREE.InstancedMesh(frondGeo, frondMat, palmSpots.length);
  const m4 = new THREE.Matrix4();
  palmSpots.forEach(([x, z], idx) => {
    m4.makeTranslation(x, 3.5, z);
    trunks.setMatrixAt(idx, m4);
    m4.makeTranslation(x, 8.2, z);
    fronds.setMatrixAt(idx, m4);
    if (idx % 3 === 0) colliders.push({ minX: x - 0.6, maxX: x + 0.6, minZ: z - 0.6, maxZ: z + 0.6 });
  });
  trunks.castShadow = true;
  fronds.castShadow = true;
  scene.add(trunks); scene.add(fronds);

  // ---- Streetlights (instanced poles + emissive heads) ----
  const lampSpots = [];
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      if ((i + j) % 2 === 0) lampSpots.push([-CITY_HALF + i * PITCH + 9, -CITY_HALF + j * PITCH + 9]);
    }
  }
  const poleGeo = new THREE.CylinderGeometry(0.12, 0.16, 7.5, 6);
  const poleMat = new THREE.MeshLambertMaterial({ color: 0x3a3a3a });
  const poles = new THREE.InstancedMesh(poleGeo, poleMat, lampSpots.length);
  const headGeo = new THREE.SphereGeometry(0.45, 8, 6);
  const headMat = new THREE.MeshLambertMaterial({ color: 0xffe9a8, emissive: 0x000000 });
  const heads = new THREE.InstancedMesh(headGeo, headMat, lampSpots.length);
  lampSpots.forEach(([x, z], idx) => {
    m4.makeTranslation(x, 3.75, z);
    poles.setMatrixAt(idx, m4);
    m4.makeTranslation(x, 7.6, z);
    heads.setMatrixAt(idx, m4);
    lamps.push({ x, z });
  });
  scene.add(poles); scene.add(heads);

  return {
    colliders,
    lamps,
    lampHeadMat: headMat,
    seaMat,
    // Lamps glow at dusk/night; sea shimmers slightly.
    update(dt, timeOfDay) {
      const night = timeOfDay > 18.6 || timeOfDay < 6.5;
      const dusk = timeOfDay > 17.8 && timeOfDay <= 18.6;
      const glow = night ? 0xffc860 : dusk ? 0x885500 : 0x000000;
      headMat.emissive.setHex(glow);
    },
  };
}
