// audio.js — Generative WebAudio synth radio, SPEC §8.
// Music is ORIGINAL generative synth — NO licensed songs. Each station genre
// gets its own synth voice (waveform, tempo, scale); the track names in the
// radio module are the in-fiction album, the audio here is synthesised.
export const GENRES = {
  Pop: { wave: 'triangle', bpm: 118, scale: [0, 2, 4, 7, 9] },
  'Latin/Reggaeton': { wave: 'sawtooth', bpm: 96, scale: [0, 3, 5, 7, 10] },
  'Southern Rap/Hip-Hop': { wave: 'square', bpm: 88, scale: [0, 3, 5, 6, 10] },
  'Modern Rap': { wave: 'square', bpm: 92, scale: [0, 2, 3, 7, 8] },
  '90s R&B & Soul': { wave: 'sine', bpm: 82, scale: [0, 3, 5, 7, 10] },
  Country: { wave: 'triangle', bpm: 104, scale: [0, 2, 4, 7, 9] },
  Metal: { wave: 'sawtooth', bpm: 140, scale: [0, 1, 3, 5, 6, 8, 10] },
  'Hard Rock/Heavy Metal': { wave: 'sawtooth', bpm: 132, scale: [0, 2, 3, 5, 7, 8, 10] },
  '80s Pop/Hits': { wave: 'square', bpm: 112, scale: [0, 2, 4, 5, 7, 9, 11] },
  'Soft Rock/Ballads': { wave: 'sine', bpm: 76, scale: [0, 2, 4, 7, 9] },
  'African/Afrobeats': { wave: 'triangle', bpm: 108, scale: [0, 2, 3, 5, 7, 8, 10] },
  'Indie/Dance': { wave: 'square', bpm: 122, scale: [0, 2, 4, 7, 9] },
  'Electronic/Dance': { wave: 'sawtooth', bpm: 126, scale: [0, 2, 3, 5, 7, 8, 10] },
  Dance: { wave: 'sawtooth', bpm: 124, scale: [0, 2, 4, 7, 9] },
  Blues: { wave: 'triangle', bpm: 72, scale: [0, 3, 5, 6, 7, 10] },
  Jazz: { wave: 'sine', bpm: 96, scale: [0, 2, 3, 5, 6, 8, 10] },
  'Latin Classics': { wave: 'triangle', bpm: 100, scale: [0, 2, 4, 5, 7, 9, 11] },
  'Reggae/Dub': { wave: 'sine', bpm: 78, scale: [0, 2, 4, 7, 9] },
  Classical: { wave: 'sine', bpm: 66, scale: [0, 2, 4, 5, 7, 9, 11] },
  'House/Jazz/Worldbeat': { wave: 'triangle', bpm: 120, scale: [0, 2, 3, 5, 7, 8, 10] },
  'Talk/Pop': { wave: 'sine', bpm: 90, scale: [0, 2, 4, 7, 9] },
  'Hip-Hop': { wave: 'square', bpm: 94, scale: [0, 3, 5, 7, 10] },
  'Talk/Hip-Hop': { wave: 'square', bpm: 90, scale: [0, 2, 3, 7, 8] },
  'Talk Radio': { wave: 'sine', bpm: 80, scale: [0, 2, 4, 7, 9] },
};

// MIDI note number -> frequency (Hz).
export function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Build a synth voice descriptor for a station genre.
export function voiceForGenre(genre) {
  const g = GENRES[genre] || GENRES.Pop;
  return { wave: g.wave, bpm: g.bpm, scale: g.scale };
}
