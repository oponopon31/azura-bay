// AZURA BAY — audio (round 7 re-compose, written fresh under r7).
// WebAudio synth radio per station (SPEC.md Bab 8). NO licensed music —
// every station is an original generative synth loop (tempo, root, scale,
// wave). Sound effects are also synthesized (gunshots, engine, siren).

export const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  blues: [0, 3, 5, 6, 7, 10],
};

export function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
export function scaleNotes(root, scaleName, octaves) {
  const scale = SCALES[scaleName] || SCALES.major;
  const notes = [];
  for (let o = 0; o < (octaves || 2); o++) {
    for (const step of scale) {
      notes.push(root + o * 12 + step);
    }
  }
  return notes;
}
// Generate a bar of notes for a station (deterministic per station+bar).
export function stationBar(station, barIndex, seedFn) {
  const notes = scaleNotes(station.root, station.scale, 2);
  const rand = seedFn ? seedFn(station.id + "-" + barIndex) : Math.random;
  const beats = 8;
  const out = [];
  for (let i = 0; i < beats; i++) {
    const note = notes[Math.floor(rand() * notes.length)];
    out.push({ beat: i, midi: note, freq: Math.round(midiToFreq(note)), wave: station.wave, dur: 60 / station.tempo / 2 });
  }
  return out;
}
export function sfx(name) {
  // Synthesized SFX descriptors (frequency envelope, duration, wave).
  const table = {
    gunshot: { freq: 800, dur: 0.15, wave: "square", slide: -600 },
    shotgun: { freq: 400, dur: 0.3, wave: "sawtooth", slide: -300 },
    explosion: { freq: 100, dur: 1.0, wave: "sawtooth", slide: -80 },
    siren: { freq: 1200, dur: 1.0, wave: "sine", slide: 400 },
    engine: { freq: 80, dur: 0.5, wave: "sawtooth", slide: 40 },
    phone: { freq: 880, dur: 0.2, wave: "sine", slide: 0 },
    cash: { freq: 1320, dur: 0.1, wave: "sine", slide: 200 },
    mission: { freq: 660, dur: 0.4, wave: "triangle", slide: 220 },
  };
  return table[name] || { freq: 440, dur: 0.2, wave: "sine", slide: 0 };
}
export function totalSfx() { return 8; }
