// rng.js — seeded RNG for deterministic world generation.
// mulberry32 is small, fast and stable across engines; hashSeed turns any
// string (a mission id, a street name) into a reproducible seed.

// FNV-1a string hash -> unsigned 32-bit seed.
export function hashSeed(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// mulberry32 PRNG: returns a function yielding [0, 1).
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fisher-Yates shuffle that does not mutate the input.
export function shuffle(arr, rand) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Integer in [min, max] inclusive from a rand function.
export function randInt(rand, min, max) {
  return min + Math.floor(rand() * (max - min + 1));
}

// Pick one element from an array with a rand function.
export function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)];
}
