// effects.js — Visual & physical effects, SPEC §18 + §20.
// Beach sand sticks to shoes/clothes, sweat shows after running, physical
// wounds persist for a while. Kill Cam & Crash Cam (can be turned off).
export const EFFECTS = {
  sand: 'beach sand sticks to shoes and clothes',
  sweat: 'sweat visible after running',
  wounds: 'physical wounds persist for a while',
  killCam: 'Kill Cam on eliminations (toggleable)',
  crashCam: 'Crash Cam on high-speed crashes (toggleable)',
};

// A spark burst (muzzle flash, impact sparks, welding).
export function sparks(x, z, count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push({ x: x + (Math.random() - 0.5) * 2, z: z + (Math.random() - 0.5) * 2, life: 0.3 + Math.random() * 0.4 });
  }
  return out;
}

// Blood pool that persists for several in-game days (Bab 26).
export function bloodStain(x, z, size) {
  return { x, z, size, persistsDays: 3 };
}
