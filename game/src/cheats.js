// AZURA BAY — cheats (round 7 re-compose, written fresh under r7).
// 61 cheats, SPEC.md Bab 3 + 22. Gated on finishing all 91 missions
// (storyDone). Each has a D-pad combo, an unlock challenge, and an effect.
// Activating a cheat disables Trophy/Achievement + Save. $250,000 is the
// ONLY money cheat. Categories: Player 17, Combat 11, Vehicle Spawn 14,
// Environment 3, Screen Filters 16.

export const CHEAT_CATEGORIES = { player: 17, combat: 11, vehicle: 14, environment: 3, filter: 16 };

// combo uses U/D/L/R (D-pad). Unlock is the challenge that gates the cheat.
export const CHEATS = [
  // ---- Player (17) ----
  { id: "max-ammo", name: "Max Ammo", cat: "player", combo: ["D","U","R","D","L","L","U","U","D","L"], unlock: "25 Bronze medals, Shooting Range", effect: "Full ammo for all weapons." },
  { id: "inf-ammo", name: "Infinite Ammo", cat: "player", combo: ["D","U","R","D","L","L","U","U","D","D","D"], unlock: "25 Silver medals, Shooting Range", effect: "Ammo never depletes." },
  { id: "no-reload", name: "No Reload", cat: "player", combo: ["D","U","R","D","L","L","U","U","D","D","U"], unlock: "25 Gold medals, Shooting Range", effect: "Never reload." },
  { id: "body-armor", name: "Body Armor", cat: "player", combo: ["D","U","L","U","U","U","U","U","D","D"], unlock: "100x Workout", effect: "Full body armor." },
  { id: "unlim-focus", name: "Unlimited Focus", cat: "player", combo: ["D","U","U","D","U","D","U","D","U","R"], unlock: "Finish the story (91 missions)", effect: "Focus never drains." },
  { id: "no-fall", name: "No Fall Damage", cat: "player", combo: ["U","D","L","R","U","D","L","R"], unlock: "Survive a 40ft fall 20x", effect: "No damage from falls." },
  { id: "parachute", name: "Parachute", cat: "player", combo: ["U","U","D","D","L","R","L","R"], unlock: "50 jumps from height", effect: "Always carry a parachute." },
  { id: "super-jump", name: "Super Jump", cat: "player", combo: ["U","U","U","D","D","D","L","R"], unlock: "Finish the story (91 missions)", effect: "Jump three times higher." },
  { id: "fast-run", name: "Fast Run", cat: "player", combo: ["L","L","R","R","U","D","U","D"], unlock: "Win 20 races", effect: "Sprint speed doubled." },
  { id: "slow-mo", name: "Slow Motion", cat: "player", combo: ["D","D","U","U","L","R","L","R"], unlock: "Finish the story (91 missions)", effect: "World runs at half speed." },
  { id: "invincible", name: "Invincibility", cat: "player", combo: ["U","D","U","D","U","D","U","D"], unlock: "Finish the story (91 missions)", effect: "Cannot take damage." },
  { id: "attack-force", name: "Attack Force", cat: "player", combo: ["D","U","L","R","D","D","U","D"], unlock: "Finish the story (91 missions)", effect: "Bullets and punches knock enemies back." },
  { id: "exploding-balls", name: "Exploding Balls", cat: "player", combo: ["D","U","L","L","R","D","D","U","R"], unlock: "Hit 20 enemies with explosions", effect: "Sports balls explode." },
  { id: "money-250k", name: "Money $250,000", cat: "player", combo: ["R","R","L","L","U","D","U","D"], unlock: "A specific financial challenge", effect: "Gain $250,000. The ONLY money cheat." },
  { id: "time-forward", name: "Move Time Forward", cat: "player", combo: ["R","U","R","D","L","U","R"], unlock: "Find 10 Luxury Watches", effect: "Advance the clock." },
  { id: "time-pause", name: "Pause Time", cat: "player", combo: ["L","D","L","U","R","D","L"], unlock: "Find 20 Luxury Watches", effect: "Freeze the clock." },
  { id: "health-regen", name: "Health Regen Boost", cat: "player", combo: ["U","U","D","D","D","U","U","D"], unlock: "Reach Focus level 5", effect: "Health regenerates faster." },

];
  // ---- Combat (11) ----
CHEATS.push(
  { id: "incendiary", name: "Incendiary Ammo", cat: "combat", combo: ["U","R","D","L","U","R","D","L"], unlock: "Burn 100 enemies", effect: "Bullets set enemies on fire." },
  { id: "explosive-shotgun", name: "Explosive Shotgun", cat: "combat", combo: ["D","R","U","L","D","R","U","L"], unlock: "Hit 100 enemies with explosive damage", effect: "Shotgun shells explode." },
  { id: "raise-heat", name: "Raise Heat Level", cat: "combat", combo: ["L","D","R","D","U","D","U"], unlock: "Escape 3-star police 25x", effect: "Raise wanted level by one star." },
  { id: "explosive-melee", name: "Explosive Melee", cat: "combat", combo: ["R","U","L","D","R","U","L","D"], unlock: "Finish the story (91 missions)", effect: "Melee hits explode." },
  { id: "one-hit", name: "One-Hit Kill", cat: "combat", combo: ["U","U","R","R","D","D","L","L"], unlock: "Finish the story (91 missions)", effect: "Every hit is lethal." },
  { id: "bullet-time", name: "Bullet Time", cat: "combat", combo: ["D","D","R","R","U","U","L","L"], unlock: "Reach Focus level 5", effect: "Slow motion while aiming." },
  { id: "dmg-up", name: "Weapon Damage Up", cat: "combat", combo: ["R","R","U","U","D","D","L","L"], unlock: "Win 10 combat challenges", effect: "Double weapon damage." },
  { id: "armor-pierce", name: "Armor Piercing", cat: "combat", combo: ["U","L","D","R","U","L","D","R"], unlock: "Finish the story (91 missions)", effect: "Bullets ignore armor." },
  { id: "rapid-fire", name: "Rapid Fire", cat: "combat", combo: ["R","L","R","L","U","U","D","D"], unlock: "Win 15 combat challenges", effect: "Fire rate doubled." },
  { id: "no-recoil", name: "No Recoil", cat: "combat", combo: ["D","U","D","U","R","L","R","L"], unlock: "Win 5 combat challenges", effect: "No weapon recoil." },
  { id: "infinite-focus-combat", name: "Combat Focus", cat: "combat", combo: ["L","U","R","D","L","U","R","D"], unlock: "Reach Focus level 4", effect: "Focus refills on every kill." },
);
  // ---- Vehicle Spawn (14) ----
CHEATS.push(
  { id: "spawn-tank", name: "Spawn Tank", cat: "vehicle", combo: ["U","D","L","R","U","D","L","R"], unlock: "Destroy 100 vehicles", effect: "Spawn a Rhino tank." },
  { id: "spawn-banshee", name: "Spawn Bravado Banshee", cat: "vehicle", combo: ["R","U","D","L","R","U","D","L"], unlock: "Finish all Combat Challenges", effect: "Spawn a Bravado Banshee." },
  { id: "spawn-airboat", name: "Spawn Airboat 09", cat: "vehicle", combo: ["D","L","U","R","D","L","U","R"], unlock: "Finish 5 Survival Challenges", effect: "Spawn an Airboat 09." },
  { id: "spawn-bmx", name: "Spawn Tuff BMX", cat: "vehicle", combo: ["L","R","U","D","L","R","U","D"], unlock: "Finish 5 Fitness Challenges", effect: "Spawn a Tuff BMX." },
  { id: "spawn-rhino", name: "Spawn Rhino", cat: "vehicle", combo: ["U","U","L","L","D","D","R","R"], unlock: "Destroy 50 vehicles", effect: "Spawn a Rhino tank." },
  { id: "spawn-comet", name: "Spawn Comet", cat: "vehicle", combo: ["R","R","D","D","L","L","U","U"], unlock: "Drive 100 vehicle types", effect: "Spawn a Pfister Comet." },
  { id: "spawn-zorrusso", name: "Spawn Zorrusso", cat: "vehicle", combo: ["U","R","R","D","L","L","U","D"], unlock: "Steal the Zorrusso for Randy", effect: "Spawn a Pegassi Zorrusso." },
  { id: "spawn-sanchez", name: "Spawn Sanchez", cat: "vehicle", combo: ["D","D","U","U","R","L","R","L"], unlock: "Win 5 off-road races", effect: "Spawn a Maibatsu Sanchez." },
  { id: "spawn-buzzard", name: "Spawn Buzzard", cat: "vehicle", combo: ["L","L","U","U","R","R","D","D"], unlock: "Finish the story (91 missions)", effect: "Spawn a Nagasaki Buzzard." },
  { id: "spawn-dodo", name: "Spawn Dodo", cat: "vehicle", combo: ["R","L","U","D","R","L","U","D"], unlock: "Finish the story (91 missions)", effect: "Spawn a Mammoth Dodo." },
  { id: "spawn-seashark", name: "Spawn Seashark", cat: "vehicle", combo: ["D","U","R","L","D","U","R","L"], unlock: "Catch 50 fish", effect: "Spawn a Speedophile Seashark." },
  { id: "spawn-faggio", name: "Spawn Faggio", cat: "vehicle", combo: ["U","D","R","L","U","D","R","L"], unlock: "Ride 10 scooters", effect: "Spawn a Pegassi Faggio." },
  { id: "spawn-bison", name: "Spawn Bison", cat: "vehicle", combo: ["L","U","D","R","L","U","D","R"], unlock: "Drive 50 vehicle types", effect: "Spawn a Bravado Bison." },
  { id: "spawn-ambulance", name: "Spawn Ambulance", cat: "vehicle", combo: ["R","D","L","U","R","D","L","U"], unlock: "Finish the story (91 missions)", effect: "Spawn an ambulance." },
);

  // ---- Environment (3) ----
CHEATS.push(
  { id: "cycle-weather", name: "Cycle Weather", cat: "environment", combo: ["D","R","U","D","R","U","R"], unlock: "Open the entire map", effect: "Cycle to the next weather." },
  { id: "clear-weather", name: "Clear Weather", cat: "environment", combo: ["U","R","U","L","D","R","U"], unlock: "Open the entire map", effect: "Clear sunny weather." },
  { id: "rain-weather", name: "Rainy Weather", cat: "environment", combo: ["D","L","D","R","U","L","D"], unlock: "Open the entire map", effect: "Heavy rain." },
);
  // ---- Screen Filters (16) ----
CHEATS.push(
  { id: "filter-sugar", name: "Powdered Sugar", cat: "filter", combo: ["U","U","D","L","R","U","D"], unlock: "Scan all space debris with WAiNK", effect: "Powdered Sugar screen filter." },
  { id: "filter-pinhole", name: "Pinhole", cat: "filter", combo: ["D","D","U","R","L","D","U"], unlock: "Clear 25 gang HQs with your partner", effect: "Pinhole screen filter." },
  { id: "filter-neon", name: "Neon Jungle", cat: "filter", combo: ["R","R","U","D","L","U","R"], unlock: "Find 16 Girlypop vehicles", effect: "Neon Jungle screen filter." },
  { id: "filter-fisheye", name: "Fisheye", cat: "filter", combo: ["L","L","D","U","R","D","L"], unlock: "Catch 100 fish", effect: "Fisheye screen filter." },
  { id: "filter-pixel", name: "Pixel Art", cat: "filter", combo: ["U","D","U","D","R","R","L","L"], unlock: "Earn $250,000 selling collectibles", effect: "Pixel Art screen filter." },
  { id: "filter-hell", name: "Hellscape", cat: "filter", combo: ["D","U","D","U","L","R","L","R"], unlock: "Steal 100 police cars", effect: "Hellscape screen filter." },
  { id: "filter-sepia", name: "Sepia", cat: "filter", combo: ["R","U","L","D","R","U","L"], unlock: "Finish the story (91 missions)", effect: "Sepia screen filter." },
  { id: "filter-noir", name: "Noir", cat: "filter", combo: ["L","D","R","U","L","D","R"], unlock: "Finish the story (91 missions)", effect: "Noir screen filter." },
  { id: "filter-vhs", name: "VHS", cat: "filter", combo: ["U","L","D","R","U","L","D"], unlock: "Finish the story (91 missions)", effect: "VHS screen filter." },
  { id: "filter-sunset", name: "Sunset", cat: "filter", combo: ["D","R","U","L","D","R","U"], unlock: "Watch 10 sunsets", effect: "Sunset screen filter." },
  { id: "filter-arctic", name: "Arctic", cat: "filter", combo: ["U","U","U","D","L","R","D"], unlock: "Finish the story (91 missions)", effect: "Arctic screen filter." },
  { id: "filter-desert", name: "Desert", cat: "filter", combo: ["D","D","D","U","R","L","U"], unlock: "Finish the story (91 missions)", effect: "Desert screen filter." },
  { id: "filter-jungle", name: "Jungle", cat: "filter", combo: ["R","L","R","L","U","D","U"], unlock: "Finish the story (91 missions)", effect: "Jungle screen filter." },
  { id: "filter-mono", name: "Mono", cat: "filter", combo: ["L","R","L","R","D","U","D"], unlock: "Finish the story (91 missions)", effect: "Monochrome screen filter." },
  { id: "filter-invert", name: "Invert", cat: "filter", combo: ["U","D","L","R","R","L","D"], unlock: "Finish the story (91 missions)", effect: "Inverted colors screen filter." },
  { id: "filter-neon2", name: "Neon Nights", cat: "filter", combo: ["R","U","U","D","D","L","R"], unlock: "Finish the story (91 missions)", effect: "Neon Nights screen filter." },
);

export function cheatById(id) { return CHEATS.find((c) => c.id === id) || null; }
export function cheatsByCategory(cat) { return CHEATS.filter((c) => c.cat === cat); }
export function totalCheats() { return CHEATS.length; }
export function comboParts(cheat) { return cheat.combo.join("-"); }
// Cheats only work after finishing all 91 missions; activating one disables
// trophies and saving (SPEC Bab 3).
export function cheatsUnlocked(state) { return state && state.storyDone === true; }
export function activateCheat(state, id) {
  const cheat = cheatById(id);
  if (!cheat) return { ok: false, reason: "unknown cheat" };
  if (!cheatsUnlocked(state)) return { ok: false, reason: "finish the story first" };
  state.cheatsActive = state.cheatsActive || {};
  state.cheatsActive[id] = true;
  state.trophiesDisabled = true;
  state.saveDisabled = true;
  return { ok: true, cheat };
}
export function hasSave(state) { return !state.saveDisabled; }
