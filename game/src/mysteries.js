// mysteries.js — Mysteries & easter eggs (SPEC Bab 7 + Bab 20/21/26).
// Each entry: a named mystery, where it lives, when it triggers, and what
// happens. Nothing here is a mission — these are free-roam discoveries.
// References to older games and films are TEXT nods (a boat GPS showing a
// Los Santos map, a ringtone name, a TV logo) — no borrowed assets.

export const MYSTERIES = [
  { id: 'skunkape', name: 'Skunk Ape / Bigfoot', where: 'Grassrivers', trigger: 'On foot in the swamps; it runs between the trees near a deer carcass.', effect: 'Chase it too close and Jason gets dizzy, then blacks out — and wakes up somewhere else.', found: false },
  { id: 'ufo', name: 'UFO & Alien Base', where: 'Kelly County & Mount Kalaga', trigger: 'After 02:00 at night — a UFO appears; a floating van and a secret bunker hatch in Grassrivers.', effect: 'The UFO hovers, the van floats, and the bunker hatch opens a crack — enough to see the light inside.', found: false },
  { id: 'tower-egg', name: 'Communication Tower Egg', where: 'Tallest comms tower', trigger: 'Climb the tallest tower (~7 minutes); a nest holds a giant colourful egg.', effect: 'Throw the egg into the street and a secret cutscene plays.', found: false },
  { id: 'kraken', name: 'Kraken', where: 'Deep water off Vice Beach', trigger: 'Sail far out at night in a boat.', effect: 'Tentacles in the water — the boat rocks, and something very large passes underneath.', found: false },
  { id: 'underground-lab', name: 'Underground Lab', where: 'Grassrivers', trigger: 'Find the bunker hatch near the UFO site.', effect: 'A lab under the swamp — vials, cages, and a logbook that mentions the Skunk Ape.', found: false },
  { id: 'stonehenge', name: 'Stonehenge & Purple Meteor', where: 'Mount Kalaga foothills', trigger: 'Visit the stone circle at night.', effect: 'A purple meteor streaks across the sky and the stones hum.', found: false },
  { id: 'cooldog', name: 'Cool Dog', where: 'Vice Beach', trigger: 'A dog in sunglasses on the boardwalk.', effect: 'Pet the Cool Dog — he is, objectively, the coolest dog in Leonida.', found: false },
  { id: 'vespucci', name: 'Vespucci Island', where: 'Off the coast', trigger: 'Sail to the island; a 1995 Mitsubishi Eclipse sits there (a Fast & Furious nod).', effect: 'The Eclipse is drivable — a movie car, waiting on an island.', found: false },
  { id: 'dexter', name: 'Dexter', where: 'Vice City marina', trigger: 'A boat with plastic-wrapped packages at the marina at night.', effect: 'A nod to the TV killer — the packages are not what you think.', found: false },
  { id: 'arthur-hat', name: "Arthur Morgan's Hat", where: 'Mount Kalaga', trigger: 'A hat on a rock at the summit.', effect: 'Pick it up: a cowboy hat, worn and weathered. Partner, it suits you.', found: false },
  { id: 'cj-belville', name: 'CJ Belville', where: 'Grove-like street, Vice City', trigger: 'A mural and a name tag on a corner.', effect: 'A nod to the old Grove Street days.', found: false },
  { id: 'giant-crab', name: 'Giant Crab — Pelican Valley', where: 'Pelican Valley', trigger: 'A giant crab statue (Wonder Whale) — and a live one, bigger than a car, in the shallows.', effect: 'The live crab is not aggressive. It is, however, enormous.', found: false },
  { id: 'michael-boat', name: "Michael's Boat — Key Lento", where: 'Key Lento', trigger: 'A yacht at the Key Lento marina with a familiar name on the stern.', effect: 'A nod to the old Los Santos crew — the boat is called "Cutlass".', found: false },
  { id: 'radio-cameo', name: 'Radio Cameo', where: 'Any car radio', trigger: 'Listen to the talk stations late at night.', effect: 'A caller sounds very much like an old Vice City DJ. Probably a coincidence.', found: false },
  { id: 'gta7-snap', name: 'GTA 7 Snapmatic', where: 'Snapmatic app', trigger: 'Take a photo of the "GTA 7" poster in the city.', effect: 'The poster teases a game that does not exist yet. Snap it for the collection.', found: false },
  { id: 'lifeguard-dog', name: 'Lifeguard Dog Jetski', where: 'Vice Beach', trigger: 'A dog on a jetski, patrolling the shallows.', effect: 'The dog is on duty. Do not disturb the dog.', found: false },
  { id: 'parrot', name: 'Parrot — Three Sheets', where: 'Three Sheets bar', trigger: 'A parrot in the bar that repeats what you say.', effect: 'The parrot knows your name. It should not know your name.', found: false },
  { id: 'los-santos-gps', name: 'Los Santos GPS', where: "Jason's boat", trigger: 'Check the boat GPS.', effect: 'The GPS shows a map of Los Santos (GTA 5) — Jason bought the boat second-hand.', found: false },
  { id: 'windchimes', name: 'Windchimes Ringtone', where: 'Phone', trigger: 'Set the ringtone to Windchimes.', effect: 'The ringtone is the same one Michael De Santa used. A nod, nothing more.', found: false },
  { id: 'malibu-tv', name: 'Malibu Club TV', where: 'Tower near Donnie\'s trailer', trigger: 'An analogue TV in the tower shows the Malibu Club logo (GTA: Vice City).', effect: 'Static, then the logo. The tower has been broadcasting it for years.', found: false },
];

export function createMysteries(G) {
  const M = {
    list: MYSTERIES,
    found: {},
    // Mark a mystery found (called by world.js triggers / the phone).
    discover(id) {
      const m = MYSTERIES.find((x) => x.id === id);
      if (!m || this.found[id]) return false;
      this.found[id] = true;
      G.hud.toast(`Mystery found: ${m.name} — ${m.where}`);
      G.audio.pickup();
      G.stats.mysteries = (G.stats.mysteries || 0) + 1;
      if (G.stats.mysteries >= 10) G.hud.toast('Achievement progress: The Truth Is Out There.');
      G.saveGame();
      return true;
    },
    // Time-based trigger: the UFO only appears after 02:00.
    update() {
      const hour = G.timeOfDay;
      if (hour >= 2 && hour < 4 && !this.found.ufo) {
        // Near Mount Kalaga / Kelly County: the UFO is "out".
        const d = Math.hypot(G.player.pos.x - (-200), G.player.pos.z - 300);
        if (d < 120) this.discover('ufo');
      }
    },
    count() { return Object.keys(this.found).length; },
  };
  return M;
}
