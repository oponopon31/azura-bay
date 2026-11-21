// AZURA BAY — radio (round 7 re-compose, written fresh under r7).
// 24 stations, SPEC.md Bab 8. Playable in vehicles AND on foot via phone
// headphones (Radio Wheel). Audio is original generative WebAudio synth
// per station (tempo/root/scale/wave) — no licensed music.

export const STATIONS = [
  { id: "flash", name: "Flash FM", genre: "Pop", tempo: 122, root: 60, scale: "major", wave: "sawtooth", desc: "Pop hits." },
  { id: "cocoteo", name: "Cocoteo FM", genre: "Latin/Reggaeton", tempo: 96, root: 57, scale: "minor", wave: "square", desc: "Latin and reggaeton." },
  { id: "dirty-south", name: "Dirty South Classics", genre: "Southern Rap/Hip-Hop", tempo: 88, root: 55, scale: "minor", wave: "sawtooth", desc: "Southern rap classics." },
  { id: "vcrr", name: "VCRR", genre: "Modern Rap", tempo: 100, root: 58, scale: "minor", wave: "square", desc: "Modern rap." },
  { id: "honey", name: "Honey FM", genre: "90s R&B & Soul", tempo: 84, root: 62, scale: "major", wave: "sine", desc: "90s R&B and soul." },
  { id: "back-country", name: "Back Country Radio", genre: "Country", tempo: 110, root: 64, scale: "major", wave: "triangle", desc: "Country." },
  { id: "chamber", name: "The Chamber 106.6", genre: "Metal", tempo: 140, root: 52, scale: "phrygian", wave: "sawtooth", desc: "Metal." },
  { id: "vrock", name: "V-Rock", genre: "Hard Rock/Heavy Metal", tempo: 132, root: 54, scale: "minor", wave: "sawtooth", desc: "Hard rock and heavy metal." },
  { id: "vcfm", name: "Vice City FM", genre: "80s Pop/Hits", tempo: 118, root: 61, scale: "major", wave: "square", desc: "80s pop hits." },
  { id: "emotion", name: "Emotion 98.3", genre: "Soft Rock/Ballads", tempo: 76, root: 63, scale: "major", wave: "sine", desc: "Soft rock and ballads." },
  { id: "afrobank", name: "AfroBank FM", genre: "African/Afrobeats", tempo: 104, root: 59, scale: "major", wave: "triangle", desc: "African and afrobeats." },
  { id: "stockyard", name: "Stockyard FM", genre: "Indie/Dance", tempo: 116, root: 60, scale: "minor", wave: "square", desc: "Indie and dance." },
  { id: "circoloco", name: "CircoLoco Records Radio", genre: "Electronic/Dance", tempo: 126, root: 56, scale: "minor", wave: "sawtooth", desc: "Electronic and dance." },
  { id: "kaleidoscope", name: "Kaleidoscope FM", genre: "Dance", tempo: 124, root: 58, scale: "major", wave: "square", desc: "Dance." },
  { id: "gloriana-blues", name: "Gloriana Blues Radio", genre: "Blues", tempo: 72, root: 53, scale: "blues", wave: "triangle", desc: "Blues." },
  { id: "leonida-jazz", name: "Leonida Jazz", genre: "Jazz", tempo: 92, root: 61, scale: "dorian", wave: "sine", desc: "Jazz." },
  { id: "la-ola", name: "Radio La Ola", genre: "Latin Classics", tempo: 98, root: 60, scale: "major", wave: "triangle", desc: "Latin classics." },
  { id: "on-u", name: "Radio On-U", genre: "Reggae/Dub", tempo: 80, root: 55, scale: "major", wave: "sine", desc: "Reggae and dub." },
  { id: "symphony", name: "Symphony FM", genre: "Classical", tempo: 66, root: 64, scale: "major", wave: "sine", desc: "Classical." },
  { id: "worldwide", name: "Worldwide FM", genre: "House/Jazz/Worldbeat", tempo: 112, root: 59, scale: "dorian", wave: "triangle", desc: "House, jazz, worldbeat." },
  { id: "wipe", name: "The Wipe", genre: "Pop", tempo: 120, root: 62, scale: "major", wave: "square", desc: "Pop and talk." },
  { id: "la-perla", name: "La Perla Sniper", genre: "Hip-Hop", tempo: 94, root: 56, scale: "minor", wave: "sawtooth", desc: "Hip-hop." },
  { id: "early-career", name: "Early Career AF Radio", genre: "Talk/Hip-Hop", tempo: 90, root: 58, scale: "minor", wave: "square", desc: "Talk and hip-hop." },
  { id: "wktt", name: "WKTT", genre: "Talk Radio", tempo: 70, root: 60, scale: "major", wave: "sine", desc: "Talk radio." },
];

export function stationById(id) { return STATIONS.find((s) => s.id === id) || null; }
export function stationByGenre(genre) { return STATIONS.filter((s) => s.genre === genre); }
export function totalStations() { return STATIONS.length; }
// Radio wheel: cycle stations forward/back.
export function nextStation(currentId, dir) {
  const i = STATIONS.findIndex((s) => s.id === currentId);
  const n = STATIONS.length;
  const j = ((i + dir) % n + n) % n;
  return STATIONS[j];
}
