// radio.js — The 24 radio stations (SPEC Bab 8).
// Station names, genres and hosts are TEXT labels from the user spec — the
// hosts are credited by name only (no recordings, no cloned voices, no
// licensed music). The audio itself is ORIGINAL generative WebAudio synth:
// each station has a profile (tempo, root, scale, wave, bass, pattern) that
// audio.js plays as chords + bass + hats; talk stations get sparse blips
// that sound like a voice without being one.
// Listen in a car, or on foot with the phone's headphone mode (Music app).

export const RADIO_STATIONS = [
  { id: 'flashfm', name: 'Flash FM', genre: 'Pop', hosts: ['Robyn', 'Alex Consani'], talk: false, tempo: 116, root: 60, wave: 'sawtooth', bass: 'square', scale: 'major', energy: 0.8, desc: 'Pop hits for the Ocean Drive cruise.' },
  { id: 'cocoteo', name: 'Cocoteo FM', genre: 'Latin / Reggaeton', hosts: ['Bad Bunny', 'RaiNao'], talk: false, tempo: 96, root: 57, wave: 'sawtooth', bass: 'sine', scale: 'minor', energy: 0.85, desc: 'Reggaeton dembow — the sound of the Keys at night.' },
  { id: 'dirtysouth', name: 'Dirty South Classics', genre: 'Southern Rap / Hip-Hop', hosts: ['Trick Daddy', 'Trina'], talk: false, tempo: 88, root: 45, wave: 'square', bass: 'sine', scale: 'minor', energy: 0.7, desc: 'Southern rap classics — bass that shakes the trunk.' },
  { id: 'vcrr', name: 'VCRR', genre: 'Modern Rap', hosts: ['JT', 'DJ Stevie J'], talk: false, tempo: 100, root: 48, wave: 'sawtooth', bass: 'sine', scale: 'minor', energy: 0.8, desc: 'Modern rap — Vice City\'s new school.' },
  { id: 'honeyfm', name: 'Honey FM', genre: '90s R&B & Soul', hosts: ['Chilli', 'T-Boz', 'Craig Robinson'], talk: false, tempo: 84, root: 58, wave: 'triangle', bass: 'sine', scale: 'major', energy: 0.5, desc: 'Smooth 90s R&B and soul for the slow lane.' },
  { id: 'backcountry', name: 'Back Country Radio', genre: 'Country', hosts: ['Morgan Wallen', 'Lana Del Rey', 'Jeremy Dufrene'], talk: false, tempo: 104, root: 55, wave: 'triangle', bass: 'triangle', scale: 'major', energy: 0.55, desc: 'Country from the Leonida backroads.' },
  { id: 'chamber', name: 'The Chamber 106.6', genre: 'Metal', hosts: ['Kerry King', 'Tom Araya'], talk: false, tempo: 150, root: 40, wave: 'sawtooth', bass: 'sawtooth', scale: 'phrygian', energy: 0.95, desc: 'Metal — loud, fast, and unapologetic.' },
  { id: 'vrock', name: 'V-Rock', genre: 'Hard Rock / Heavy Metal', hosts: ['Lindsey Buckingham', 'Michael McDonald'], talk: false, tempo: 132, root: 43, wave: 'sawtooth', bass: 'square', scale: 'minor', energy: 0.9, desc: 'Hard rock anthems for the highway.' },
  { id: 'vicecityfm', name: 'Vice City FM', genre: '80s Pop / Hits', hosts: ['"Weird Al" Yankovic', 'Brigitte Nielsen'], talk: false, tempo: 120, root: 62, wave: 'square', bass: 'square', scale: 'major', energy: 0.75, desc: '80s pop hits — neon nostalgia, all day.' },
  { id: 'emotion', name: 'Emotion 98.3', genre: 'Soft Rock / Ballads', hosts: ['Doug Stanhope'], talk: false, tempo: 76, root: 60, wave: 'sine', bass: 'sine', scale: 'major', energy: 0.4, desc: 'Soft rock ballads for the long drive home.' },
  { id: 'afrobank', name: 'AfroBank FM', genre: 'African / Afrobeats', hosts: ['Burna Boy', 'Palms Trax'], talk: false, tempo: 108, root: 50, wave: 'triangle', bass: 'sine', scale: 'major', energy: 0.8, desc: 'Afrobeats — the pulse of the bay.' },
  { id: 'stockyard', name: 'Stockyard FM', genre: 'Indie / Dance', hosts: ['PinkPantheress', 'The Dare'], talk: false, tempo: 124, root: 64, wave: 'square', bass: 'square', scale: 'major', energy: 0.7, desc: 'Indie dance — jangly guitars over a four-on-the-floor.' },
  { id: 'circoloco', name: 'CircoLoco Records Radio', genre: 'Electronic / Dance', hosts: ['Seth Troxler', 'Antonio Carbonaro'], talk: false, tempo: 126, root: 52, wave: 'sawtooth', bass: 'sawtooth', scale: 'minor', energy: 0.85, desc: 'Electronic dance — warehouse hours, every hour.' },
  { id: 'kaleidoscope', name: 'Kaleidoscope FM', genre: 'Dance', hosts: ['Jeremy Irons'], talk: false, tempo: 122, root: 57, wave: 'square', bass: 'sine', scale: 'major', energy: 0.75, desc: 'Dance — glitter, synths, and four-on-the-floor.' },
  { id: 'gloriana', name: 'Gloriana Blues Radio', genre: 'Blues', hosts: ['Buddy Guy', 'Keith Richards'], talk: false, tempo: 72, root: 48, wave: 'triangle', bass: 'triangle', scale: 'blues', energy: 0.45, desc: 'Blues — slow, bent notes from the Delta to Leonida.' },
  { id: 'leonidajazz', name: 'Leonida Jazz', genre: 'Jazz', hosts: ['Randy Brecker', 'Stanley Clarke', 'Yussef Dayes'], talk: false, tempo: 92, root: 55, wave: 'sine', bass: 'sine', scale: 'dorian', energy: 0.5, desc: 'Jazz — late-night horns over a walking bass.' },
  { id: 'laola', name: 'Radio La Ola', genre: 'Latin Classics', hosts: ['Gloria Estefan', 'Emilio Estefan'], talk: false, tempo: 98, root: 59, wave: 'triangle', bass: 'sine', scale: 'major', energy: 0.6, desc: 'Latin classics — salsa and ballads from the old Vice City.' },
  { id: 'onu', name: 'Radio On-U', genre: 'Reggae / Dub', hosts: ['Adrian Sherwood'], talk: false, tempo: 78, root: 45, wave: 'triangle', bass: 'sine', scale: 'major', energy: 0.5, desc: 'Reggae and dub — slow skank, deep bass.' },
  { id: 'symphony', name: 'Symphony FM', genre: 'Classical', hosts: ['Yuja Wang'], talk: false, tempo: 66, root: 60, wave: 'sine', bass: 'sine', scale: 'major', energy: 0.35, desc: 'Classical — strings and piano for the quiet hours.' },
  { id: 'worldwide', name: 'Worldwide FM', genre: 'House / Jazz / Worldbeat', hosts: ['Gilles Peterson'], talk: false, tempo: 118, root: 53, wave: 'sawtooth', bass: 'sine', scale: 'dorian', energy: 0.7, desc: 'House, jazz and worldbeat — the world in one dial.' },
  { id: 'wipe', name: 'The Wipe', genre: 'Pop / Latin', hosts: ['Anitta'], talk: false, tempo: 112, root: 62, wave: 'square', bass: 'sine', scale: 'minor', energy: 0.8, desc: 'Pop with a Latin pulse — the Wipe wipes the floor.' },
  { id: 'laperla', name: 'La Perla Sniper', genre: 'Trap / Rap', hosts: ['Kodak Black'], talk: false, tempo: 140, root: 41, wave: 'sawtooth', bass: 'sine', scale: 'minor', energy: 0.85, desc: 'Trap — hi-hats like gunfire over a low 808.' },
  { id: 'earlycareer', name: 'Early Career AF Radio', genre: 'Talk / Hip-Hop', hosts: ['Charlamagne tha God', 'Ivy Rivera'], talk: true, tempo: 90, root: 50, wave: 'square', bass: 'sine', scale: 'minor', energy: 0.5, desc: 'Talk radio with a hip-hop heart — callers, chaos, and hot takes.' },
  { id: 'wktt', name: 'WKTT', genre: 'Talk Radio', hosts: ['Jason Sudeikis', 'Stavros Halkias'], talk: true, tempo: 80, root: 48, wave: 'triangle', bass: 'sine', scale: 'major', energy: 0.4, desc: 'Talk radio — Leonida\'s loudest opinions, all day.' },
];

export const RADIO_BY_ID = {};
for (const s of RADIO_STATIONS) RADIO_BY_ID[s.id] = s;

// Scales as semitone offsets from the root (used by the synth).
export const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  blues: [0, 3, 5, 6, 7, 10],
};

export function createRadio(G) {
  const R = {
    stations: RADIO_STATIONS,
    index: 0,
    get current() { return RADIO_STATIONS[this.index]; },
    // Next station (V key / radio wheel). Wraps around the dial.
    next() {
      this.index = (this.index + 1) % RADIO_STATIONS.length;
      this.apply();
      return this.current;
    },
    prev() {
      this.index = (this.index - 1 + RADIO_STATIONS.length) % RADIO_STATIONS.length;
      this.apply();
      return this.current;
    },
    setById(id) {
      const i = RADIO_STATIONS.findIndex((s) => s.id === id);
      if (i >= 0) { this.index = i; this.apply(); return true; }
      return false;
    },
    // setStation(index, silent): what save.js calls on load.
    setStation(index, silent) {
      if (index < 0 || index >= RADIO_STATIONS.length) return false;
      this.index = index;
      if (!silent) this.apply();
      else if (G.audio && G.audio.setStationProfile) G.audio.setStationProfile(this.current);
      return true;
    },
    // Push the station's generative profile into the audio engine.
    apply() {
      const s = this.current;
      if (G.audio && G.audio.setStationProfile) G.audio.setStationProfile(s);
      G.hud.toast(`📻 ${s.name} — ${s.genre}`);
      return s;
    },
    // The radio wheel (slow-motion while open, per spec): list all stations.
    listHtml() {
      return RADIO_STATIONS.map((s, i) =>
        `<div data-station="${s.id}" style="padding:6px 8px;cursor:pointer;background:${i === this.index ? 'rgba(255,210,63,0.2)' : 'transparent'};border-radius:6px;"><b>${s.name}</b> <span style="color:#9fb8c8">${s.genre}</span><br><span style="font-size:11px;color:#c8d4de">${s.hosts.join(', ')}</span></div>`).join('');
    },
  };
  return R;
}
