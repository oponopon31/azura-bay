// fishing.js — Fishing: 35 species + the minigame + the logbook
// (SPEC Bab 17 + Bab 18). The exact 35-species list is the spec's.
// Minigame (Bab 17): Focus (L3+R3) shows the school; cast (L2+R2);
// reel in slowly with the right stick; when the stick vibrates and R2
// glows white, press R2 to hook; fight the pull with the left stick
// against the fish's swim direction until it tires, then reel in with
// the right stick. Keep or release (catch & release).
// Wildlife compendium (Bab 20): 170+ species in 6 categories — Hunting 61,
// Fishing 35, Mammals 18, Cats & Dogs 34, Birds 60, Aquatic & Reptiles 24.
// The 35 fish here are the Fishing category; the other 5 categories are
// tracked in the compendium table below (sightings, not a full bestiary).

export const FISH_SPECIES = [
  { name: 'Alligator Gar', water: 'swamp', rarity: 'rare', weight: 45 },
  { name: 'Amberjack', water: 'sea', rarity: 'common', weight: 18 },
  { name: 'Black Crappie', water: 'river', rarity: 'common', weight: 1 },
  { name: 'Black Drum', water: 'sea', rarity: 'common', weight: 12 },
  { name: 'Black Grouper', water: 'sea', rarity: 'uncommon', weight: 15 },
  { name: 'Blackfin Tuna', water: 'sea', rarity: 'uncommon', weight: 22 },
  { name: 'Blue Catfish', water: 'river', rarity: 'common', weight: 8 },
  { name: 'Blue Marlin', water: 'sea', rarity: 'legendary', weight: 120 },
  { name: 'Bluegill', water: 'river', rarity: 'common', weight: 0.5 },
  { name: 'Bonefish', water: 'sea', rarity: 'uncommon', weight: 4 },
  { name: 'Bull Shark', water: 'sea', rarity: 'rare', weight: 90 },
  { name: 'Channel Catfish', water: 'river', rarity: 'common', weight: 6 },
  { name: 'Cobia', water: 'sea', rarity: 'uncommon', weight: 20 },
  { name: 'Common Snook', water: 'sea', rarity: 'common', weight: 7 },
  { name: 'Dolphin Fish (Mahi-Mahi)', water: 'sea', rarity: 'uncommon', weight: 12 },
  { name: 'Florida Gar', water: 'swamp', rarity: 'common', weight: 5 },
  { name: 'Florida Pompano', water: 'sea', rarity: 'common', weight: 2 },
  { name: 'Goliath Grouper', water: 'sea', rarity: 'legendary', weight: 180 },
  { name: 'King Mackerel', water: 'sea', rarity: 'uncommon', weight: 14 },
  { name: 'Largemouth Bass', water: 'river', rarity: 'common', weight: 4 },
  { name: 'Lionfish', water: 'sea', rarity: 'rare', weight: 1 },
  { name: 'Mutton Snapper', water: 'sea', rarity: 'common', weight: 6 },
  { name: 'Nurse Shark', water: 'sea', rarity: 'rare', weight: 60 },
  { name: 'Peacock Bass', water: 'river', rarity: 'uncommon', weight: 3 },
  { name: 'Permit', water: 'sea', rarity: 'rare', weight: 8 },
  { name: 'Red Drum (Redfish)', water: 'sea', rarity: 'common', weight: 10 },
  { name: 'Red Grouper', water: 'sea', rarity: 'common', weight: 9 },
  { name: 'Red Snapper', water: 'sea', rarity: 'uncommon', weight: 8 },
  { name: 'Sailfish', water: 'sea', rarity: 'legendary', weight: 55 },
  { name: 'Sheepshead', water: 'sea', rarity: 'common', weight: 3 },
  { name: 'Spotted Seatrout', water: 'sea', rarity: 'common', weight: 4 },
  { name: 'Striped Bass', water: 'river', rarity: 'common', weight: 6 },
  { name: 'Tarpon', water: 'sea', rarity: 'rare', weight: 35 },
  { name: 'Wahoo', water: 'sea', rarity: 'uncommon', weight: 25 },
  { name: 'Yellowfin Tuna', water: 'sea', rarity: 'rare', weight: 40 },
];

// Wildlife compendium (Bab 20): 6 categories, 170+ species total.
// The Fishing 35 are the list above; the other categories track
// sightings by name (generated from the category's habitat, not a
// hand-written bestiary — the spec gives counts, not names).
export const COMPENDIUM_CATEGORIES = [
  { id: 'hunting', name: 'Hunting', count: 61 },
  { id: 'fishing', name: 'Fishing', count: 35 },
  { id: 'mammals', name: 'Mammals', count: 18 },
  { id: 'catsdogs', name: 'Cats & Dogs', count: 34 },
  { id: 'birds', name: 'Birds', count: 60 },
  { id: 'aquatic', name: 'Aquatic & Reptiles', count: 24 },
];
export const COMPENDIUM_TOTAL = 232;

export function createFishing(G) {
  const F = {
    species: FISH_SPECIES,
    logbook: {}, // species name -> {caught, biggest, released}
    state: 'idle', // idle | casting | waiting | hooked | fighting
    hookedFish: null,
    fightStamina: 0,
    // Focus mode shows the school: which species are biting here.
    schoolHere() {
      const water = G.player.pos.z > 336 ? 'sea' : G.player.pos.x < -200 ? 'swamp' : 'river';
      return FISH_SPECIES.filter((f) => f.water === water);
    },
    cast() {
      if (this.state !== 'idle') return { ok: false, reason: 'Already fishing.' };
      this.state = 'casting';
      // A bite comes within a few seconds (seeded by the game rng).
      const school = this.schoolHere();
      const fish = school[Math.floor(G.rng.range(0, school.length))];
      this.pendingFish = fish;
      this.state = 'waiting';
      G.hud.toast(`Cast out… ${school.length} species biting here. Wait for the tug.`);
      return { ok: true };
    },
    // The bite: the stick vibrates and R2 glows — press to hook.
    bite() {
      if (this.state !== 'waiting') return false;
      this.state = 'hooked';
      this.hookedFish = this.pendingFish;
      this.fightStamina = 100;
      G.hud.toast(`BITE! ${this.hookedFish.name} — fight it!`);
      G.audio.blip(880, 0.3, 'square', 0.2);
      return true;
    },
    // Fight: reel (right stick) while the fish tires; pull against its
    // direction (left stick) to drain its stamina. Simplified: each
    // successful reel tick drains stamina; the fish escapes if the line
    // is slack too long.
    fight(reel) {
      if (this.state !== 'hooked') return null;
      if (reel) this.fightStamina -= 12 + Math.random() * 8;
      else this.fightStamina += 4; // slack line: the fish recovers
      if (this.fightStamina <= 0) {
        const fish = this.hookedFish;
        this.state = 'idle';
        this.hookedFish = null;
        return this.land(fish);
      }
      if (this.fightStamina >= 130) {
        // Line snapped / fish got away.
        this.state = 'idle';
        this.hookedFish = null;
        G.hud.toast('It got away…');
        return { ok: false, reason: 'escaped' };
      }
      return { ok: true, stamina: this.fightStamina, fish: this.hookedFish.name };
    },
    land(fish) {
      const entry = this.logbook[fish.name] || (this.logbook[fish.name] = { caught: 0, biggest: 0, released: 0 });
      const weight = Math.round(fish.weight * (0.7 + Math.random() * 0.6) * 10) / 10;
      entry.caught++;
      entry.biggest = Math.max(entry.biggest, weight);
      G.stats.fishCaught = (G.stats.fishCaught || 0) + 1;
      if (G.attributes) G.attributes.focusActivity(G.player.who, 'fishing');
      G.hud.toast(`Caught a ${fish.name} — ${weight} kg! (Keep or release.)`);
      G.audio.pickup();
      return { ok: true, fish: fish.name, weight };
    },
    release(fishName) {
      const entry = this.logbook[fishName];
      if (!entry || entry.caught < 1) return false;
      entry.released++;
      G.hud.toast(`Released the ${fishName} — catch & release.`);
      return true;
    },
    logbookCount() { return Object.keys(this.logbook).length; },
    // Compendium sightings (non-fish categories).
    sightings: {},
    sight(category, name) {
      if (!COMPENDIUM_CATEGORIES.find((c) => c.id === category)) return false;
      this.sightings[category] = this.sightings[category] || {};
      if (this.sightings[category][name]) return false;
      this.sightings[category][name] = true;
      G.hud.toast(`Wildlife logged: ${name} (${category}).`);
      return true;
    },
    compendiumCount() {
      let n = this.logbookCount();
      for (const cat of Object.keys(this.sightings)) n += Object.keys(this.sightings[cat]).length;
      return n;
    },
    // ---- Save / load ----
    serialize() {
      return { logbook: this.logbook, sightings: this.sightings };
    },
    restore(data) {
      if (data.logbook) this.logbook = data.logbook;
      if (data.sightings) this.sightings = data.sightings;
    },
  };
  return F;
}
