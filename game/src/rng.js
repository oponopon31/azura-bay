// rng.js — Deterministic random numbers, so the city, the traffic and the
// screenshots all come out the same from one seed (the ?seed= query).
// The same seed always rebuilds the same city — screenshots, traffic and
// collectible placement all read from this one PRNG family.
// mulberry32: a small, fast, well-behaved PRNG. The seed is a 32-bit int;
// every call advances the state and returns a float in [0, 1).
// Round 5: the seed parameter is renamed for clarity; the streams are identical.

export function mulberry32(seedValue) {
  let a = seedValue >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A convenience wrapper with the helpers the world builders actually use.
export function makeRng(seedValue) {
  const next = mulberry32(seedValue);
  return {
    next,
    range(min, max) { return min + next() * (max - min); },
    int(min, max) { return Math.floor(this.range(min, max + 1)); },
    pick(arr) { return arr[Math.floor(next() * arr.length)]; },
    // Round 3: Fisher-Yates shuffle that consumes the same stream, so the
    // same seed always shuffles the same way (screenshots stay stable).
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
      }
      return a;
    },
    chance(p) { return next() < p; },
  };
}

// ---- Round 3: hash a string seed (e.g. a place name) to a 32-bit int ----
// FNV-1a; the same string always yields the same stream.
export function hashSeed(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
