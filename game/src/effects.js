// effects.js — Crash sparks, exhaust smoke, muzzle flashes and camera shake.
// One job: short-lived visual feedback, all pooled, no allocations per frame.

import * as THREE from 'three';

export function createEffects(G) {
  const MAX = 420;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(MAX * 3);
  const col = new Float32Array(MAX * 3);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({ size: 0.55, vertexColors: true, transparent: true, opacity: 0.95, depthWrite: false });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  G.scene.add(points);

  const P = {
    parts: [], // {x,y,z,vx,vy,vz,life,maxLife,r,g,b,grav}
    shake: 0,

    spawn(x, y, z, opts) {
      const n = opts.count || 10;
      for (let i = 0; i < n; i++) {
        if (this.parts.length >= MAX) this.parts.shift();
        const a = Math.random() * Math.PI * 2;
        const sp = (opts.speed || 6) * (0.4 + Math.random() * 0.8);
        this.parts.push({
          x, y, z,
          vx: Math.cos(a) * sp + (opts.vx || 0),
          vy: (opts.up || 3) * (0.4 + Math.random() * 0.9),
          vz: Math.sin(a) * sp + (opts.vz || 0),
          life: 0, maxLife: (opts.life || 0.7) * (0.6 + Math.random() * 0.8),
          r: opts.r ?? 1, g: opts.g ?? 0.8, b: opts.b ?? 0.2,
          grav: opts.grav ?? -9,
        });
      }
    },
    sparks(x, y, z, n) { this.spawn(x, y, z, { count: n || 16, speed: 9, up: 4, life: 0.5, r: 1, g: 0.75, b: 0.15 }); },
    smoke(x, y, z, n) { this.spawn(x, y, z, { count: n || 6, speed: 1.5, up: 2.5, life: 1.6, r: 0.25, g: 0.25, b: 0.25, grav: 1.2 }); },
    blood(x, y, z) { this.spawn(x, y, z, { count: 10, speed: 4, up: 2, life: 0.5, r: 0.6, g: 0.05, b: 0.05 }); },
    muzzleFlash(x, y, z) {
      this.spawn(x, y, z, { count: 6, speed: 12, up: 0.5, life: 0.08, r: 1, g: 0.9, b: 0.4 });
    },
    // Persistent ground stains (Bab 26): blood / scuff marks that linger
    // for days of game time. Kept as a small list of fading decals.
    stains: [],
    addStain(x, z, kind) {
      if (this.stains.length > 40) this.stains.shift();
      this.stains.push({ x, z, kind: kind || 'blood', age: 0 });
    },
    addShake(amount) { this.shake = Math.min(1.2, this.shake + amount); },

    update(dt) {
      for (let i = this.parts.length - 1; i >= 0; i--) {
        const p = this.parts[i];
        p.life += dt;
        if (p.life >= p.maxLife) { this.parts.splice(i, 1); continue; }
        p.vy += p.grav * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        if (p.y < 0.05) { p.y = 0.05; p.vy *= -0.3; p.vx *= 0.7; p.vz *= 0.7; }
      }
      for (let i = 0; i < MAX; i++) {
        const p = this.parts[i];
        if (p) {
          const fade = 1 - p.life / p.maxLife;
          pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z;
          col[i * 3] = p.r * fade; col[i * 3 + 1] = p.g * fade; col[i * 3 + 2] = p.b * fade;
        } else {
          pos[i * 3 + 1] = -100; col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = 0;
        }
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.color.needsUpdate = true;
      this.shake = Math.max(0, this.shake - dt * 2.2);
    },

    shakeOffset() {
      if (this.shake <= 0.001) return { x: 0, y: 0 };
      const s = this.shake * this.shake * 0.35;
      return { x: (Math.random() - 0.5) * s, y: (Math.random() - 0.5) * s };
    },
  };
  return P;
}
