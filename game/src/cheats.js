// cheats.js — 61 cheats, SPEC §3 + §22.
// Rules (Bab 3): usable ONLY after finishing the main story (91 missions);
// each cheat must be unlocked first via a challenge; activation is
// phone (D-Pad Up) + hold L1+R1 / LB+RB + D-Pad combo; activating a cheat
// disables Trophies/Achievements AND the Save feature.
// Categories: Player 20, Combat 11, Vehicle Spawn 11, Environment 3,
// Screen Filters 16 = 61. Money $250,000 is the ONLY money cheat.
export const CHEATS = [
  // ---- Player (20) ----
  { id: 'maxammo', name: 'Max Ammo', category: 'Player', combo: ['Down', 'Up', 'Right', 'Down', 'Left', 'Left', 'Up', 'Up', 'Down', 'Left'], unlock: '25 Bronze Shooting Range medals', effect: 'Full ammo for all weapons' },
  { id: 'infammo', name: 'Infinite Ammo', category: 'Player', combo: ['Down', 'Up', 'Right', 'Down', 'Left', 'Left', 'Up', 'Up', 'Down', 'Down', 'Down'], unlock: '25 Silver Shooting Range medals', effect: 'Ammo never runs out' },
  { id: 'noreload', name: 'No Reload', category: 'Player', combo: ['Down', 'Up', 'Right', 'Down', 'Left', 'Left', 'Up', 'Up', 'Down', 'Down', 'Up'], unlock: '25 Gold Shooting Range medals', effect: 'Never reload' },
  { id: 'bodyarmor', name: 'Body Armor', category: 'Player', combo: ['Down', 'Up', 'Left', 'Up', 'Up', 'Up', 'Up', 'Up', 'Down', 'Down'], unlock: '100x Workout', effect: 'Full body armor' },
  { id: 'unlfocus', name: 'Unlimited Focus', category: 'Player', combo: ['Down', 'Up', 'Up', 'Down', 'Up', 'Down', 'Up', 'Down', 'Up', 'Right'], unlock: 'Finish the story', effect: 'Focus never drains' },
  { id: 'nofall', name: 'No Fall Damage', category: 'Player', combo: ['Up', 'Down', 'Up', 'Down', 'Left', 'Right', 'Up', 'Down'], unlock: 'Survive a 40 ft fall 20x', effect: 'No damage from falls' },
  { id: 'parachute', name: 'Parachute', category: 'Player', combo: ['Up', 'Up', 'Down', 'Down', 'Left', 'Right', 'Left', 'Right'], unlock: '50 jumps from height', effect: 'Always carry a parachute' },
  { id: 'superjump', name: 'Super Jump', category: 'Player', combo: ['Up', 'Up', 'Up', 'Down', 'Down', 'Left', 'Right', 'Up'], unlock: 'Complete 10 Stunt Jumps', effect: 'Jump much higher' },
  { id: 'fastrun', name: 'Fast Run', category: 'Player', combo: ['Right', 'Right', 'Left', 'Left', 'Up', 'Down', 'Up', 'Down'], unlock: 'Sprint 10 km total', effect: 'Run at double speed' },
  { id: 'slowmo', name: 'Slow Motion', category: 'Player', combo: ['Left', 'Right', 'Left', 'Right', 'Down', 'Up', 'Down', 'Up'], unlock: 'Finish the story', effect: 'World runs in slow motion' },
  { id: 'invincible', name: 'Invincibility', category: 'Player', combo: ['Up', 'Down', 'Left', 'Right', 'Up', 'Down', 'Left', 'Right', 'Up', 'Up'], unlock: 'Finish the story', effect: 'Cannot take damage' },
  { id: 'healthregen', name: 'Health Regen', category: 'Player', combo: ['Down', 'Down', 'Up', 'Up', 'Left', 'Right', 'Left', 'Right'], unlock: 'Reach Level 5 Strength', effect: 'Health regenerates fast' },
  { id: 'stamina', name: 'Stamina Boost', category: 'Player', combo: ['Up', 'Up', 'Right', 'Right', 'Down', 'Down', 'Left', 'Left'], unlock: 'Reach Level 5 Cardio', effect: 'Stamina never drains' },
  { id: 'adrenaline', name: 'Adrenaline Rush', category: 'Player', combo: ['Down', 'Up', 'Down', 'Up', 'Right', 'Left', 'Right', 'Left'], unlock: 'Reach Level 5 Focus', effect: 'Adrenaline always full' },
  { id: 'doublejump', name: 'Double Jump', category: 'Player', combo: ['Up', 'Up', 'Down', 'Up', 'Up', 'Down', 'Left', 'Right'], unlock: 'Complete 25 Stunt Jumps', effect: 'Jump twice in mid-air' },
  { id: 'moongravity', name: 'Moon Gravity', category: 'Player', combo: ['Down', 'Down', 'Down', 'Up', 'Up', 'Up', 'Left', 'Right'], unlock: 'Complete 5 Base Jumps', effect: 'Low gravity' },
  { id: 'raiseheat', name: 'Raise Heat Level', category: 'Player', combo: ['Left', 'Down', 'Right', 'Down', 'Up', 'Down', 'Up'], unlock: 'Escape 3-star police 25x', effect: 'Raise wanted level by 1 star' },
  { id: 'lowerwanted', name: 'Lower Wanted', category: 'Player', combo: ['Right', 'Up', 'Left', 'Up', 'Down', 'Up', 'Right'], unlock: 'Escape 4-star police 10x', effect: 'Lower wanted level by 1 star' },
  { id: 'neverwanted', name: 'Never Wanted', category: 'Player', combo: ['Up', 'Right', 'Down', 'Left', 'Up', 'Right', 'Down', 'Left'], unlock: 'Finish the story', effect: 'Police never pursue you' },
  { id: 'money250k', name: 'Money $250,000', category: 'Player', combo: ['Down', 'Right', 'Up', 'Left', 'Down', 'Right', 'Up', 'Left', 'Down', 'Up'], unlock: 'Complete a set financial challenge', effect: 'Adds $250,000 — the ONLY money cheat' },
  // ---- Combat (11) ----
  { id: 'attackforce', name: 'Attack Force', category: 'Combat', combo: ['Down', 'Up', 'Left', 'Right', 'Down', 'Down', 'Up', 'Down'], unlock: 'Finish the story', effect: 'Bullets and punches knock enemies flying' },
  { id: 'explodingballs', name: 'Exploding Balls', category: 'Combat', combo: ['Down', 'Up', 'Left', 'Left', 'Right', 'Down', 'Down', 'Up', 'Right'], unlock: 'Hit 20 enemies with explosions', effect: 'Sports balls explode' },
  { id: 'incendiary', name: 'Incendiary Ammo', category: 'Combat', combo: ['Up', 'Down', 'Right', 'Left', 'Up', 'Down', 'Right', 'Left'], unlock: 'Burn 100 enemies', effect: 'Bullets set enemies on fire' },
  { id: 'exploshotgun', name: 'Explosive Shotgun', category: 'Combat', combo: ['Left', 'Left', 'Right', 'Right', 'Up', 'Down', 'Up', 'Down'], unlock: 'Hit 100 enemies with explosive damage', effect: 'Shotgun shells explode' },
  { id: 'explomelee', name: 'Explosive Melee', category: 'Combat', combo: ['Down', 'Left', 'Up', 'Right', 'Down', 'Left', 'Up', 'Right'], unlock: '100 melee knockouts', effect: 'Melee hits explode' },
  { id: 'onehit', name: 'One-Hit Kill', category: 'Combat', combo: ['Up', 'Up', 'Up', 'Down', 'Down', 'Down', 'Left', 'Right'], unlock: 'Finish the story', effect: 'Every hit is lethal' },
  { id: 'norecoil', name: 'No Recoil', category: 'Combat', combo: ['Right', 'Left', 'Right', 'Left', 'Up', 'Up', 'Down', 'Down'], unlock: '25 Gold Shooting Range medals', effect: 'Weapons have no recoil' },
  { id: 'rapidfire', name: 'Rapid Fire', category: 'Combat', combo: ['Up', 'Down', 'Up', 'Down', 'Right', 'Right', 'Left', 'Left'], unlock: '25 Silver Shooting Range medals', effect: 'All weapons fire faster' },
  { id: 'bighead', name: 'Big Head Mode', category: 'Combat', combo: ['Down', 'Down', 'Left', 'Left', 'Up', 'Up', 'Right', 'Right'], unlock: 'Complete 10 Strangers & Freaks jobs', effect: 'Everyone has a big head' },
  { id: 'tinyplayer', name: 'Tiny Player', category: 'Combat', combo: ['Up', 'Left', 'Down', 'Right', 'Up', 'Left', 'Down', 'Right'], unlock: 'Complete 20 Stunt Jumps', effect: 'Player shrinks to half size' },
  { id: 'bullettime', name: 'Bullet Time', category: 'Combat', combo: ['Left', 'Up', 'Right', 'Down', 'Left', 'Up', 'Right', 'Down'], unlock: 'Reach Level 5 Focus', effect: 'Time slows when aiming' },
  // ---- Vehicle Spawn (11) ----
  { id: 'spawntank', name: 'Spawn Tank', category: 'Vehicle Spawn', combo: ['Up', 'Down', 'Left', 'Right', 'Up', 'Up', 'Down', 'Down'], unlock: 'Destroy 100 vehicles', effect: 'Spawns a Rhino tank (Hauners H-AT)' },
  { id: 'spawnbanshee', name: 'Spawn Bravado Banshee', category: 'Vehicle Spawn', combo: ['Right', 'Right', 'Up', 'Down', 'Left', 'Left', 'Up', 'Up'], unlock: 'Complete all Combat Challenges', effect: 'Spawns a Bravado Banshee' },
  { id: 'spawnairboat', name: 'Spawn Airboat 09', category: 'Vehicle Spawn', combo: ['Down', 'Up', 'Down', 'Up', 'Left', 'Left', 'Right', 'Right'], unlock: 'Complete 5 Survival Challenges', effect: 'Spawns an Airboat 09' },
  { id: 'spawnbmx', name: 'Spawn Tuff BMX', category: 'Vehicle Spawn', combo: ['Left', 'Right', 'Down', 'Up', 'Left', 'Right', 'Down', 'Up'], unlock: 'Complete 5 Fitness Challenges', effect: 'Spawns a Tuff BMX' },
  { id: 'spawnsuper', name: 'Spawn Supercar', category: 'Vehicle Spawn', combo: ['Up', 'Right', 'Up', 'Right', 'Down', 'Left', 'Down', 'Left'], unlock: 'Steal 50 Standout Vehicles', effect: 'Spawns a random supercar' },
  { id: 'spawnheli', name: 'Spawn Helicopter', category: 'Vehicle Spawn', combo: ['Down', 'Left', 'Up', 'Right', 'Down', 'Left', 'Up', 'Right'], unlock: 'Complete 10 Base Jumps', effect: 'Spawns a Buckingham Maverick' },
  { id: 'spawnboat', name: 'Spawn Boat', category: 'Vehicle Spawn', combo: ['Right', 'Down', 'Left', 'Up', 'Right', 'Down', 'Left', 'Up'], unlock: 'Catch 25 fish', effect: 'Spawns a Speedophile Seashark' },
  { id: 'spawnbike', name: 'Spawn Motorcycle', category: 'Vehicle Spawn', combo: ['Up', 'Left', 'Up', 'Left', 'Down', 'Right', 'Down', 'Right'], unlock: 'Win 10 street races', effect: 'Spawns a Western Nightblade' },
  { id: 'spawnrhino', name: 'Spawn Rhino', category: 'Vehicle Spawn', combo: ['Left', 'Down', 'Left', 'Down', 'Right', 'Up', 'Right', 'Up'], unlock: 'Destroy 100 vehicles', effect: 'Spawns a Rhino tank' },
  { id: 'spawnjet', name: 'Spawn Jet', category: 'Vehicle Spawn', combo: ['Down', 'Right', 'Down', 'Right', 'Up', 'Left', 'Up', 'Left'], unlock: 'Complete the ABIA Takedown mission', effect: 'Spawns a Buckingham Shamal' },
  { id: 'spawnlimo', name: 'Spawn Limousine', category: 'Vehicle Spawn', combo: ['Right', 'Up', 'Right', 'Up', 'Left', 'Down', 'Left', 'Down'], unlock: 'Reach 100% completion in any chapter', effect: 'Spawns a stretch limousine' },
  // ---- Environment (3) ----
  { id: 'cycleweather', name: 'Cycle Weather', category: 'Environment', combo: ['Down', 'Right', 'Up', 'Down', 'Right', 'Up', 'Right'], unlock: 'Open the entire map', effect: 'Cycles to the next weather' },
  { id: 'movetime', name: 'Move Time Forward', category: 'Environment', combo: ['Up', 'Up', 'Right', 'Down', 'Left', 'Up', 'Right', 'Down'], unlock: 'Find 10 Luxury Watches', effect: 'Advances time by 6 hours' },
  { id: 'pausetime', name: 'Pause Time', category: 'Environment', combo: ['Down', 'Down', 'Left', 'Up', 'Right', 'Down', 'Left', 'Up'], unlock: 'Find 20 Luxury Watches', effect: 'Freezes time' },
  // ---- Screen Filters (16) ----
  { id: 'filter-powder', name: 'Powdered Sugar', category: 'Screen Filters', combo: ['Up', 'Down', 'Left', 'Right', 'Up', 'Up', 'Down', 'Down'], unlock: 'Scan all space debris with WAiNK', effect: 'Powdered-sugar white filter' },
  { id: 'filter-pinhole', name: 'Pinhole', category: 'Screen Filters', combo: ['Left', 'Up', 'Right', 'Down', 'Left', 'Up', 'Right', 'Down'], unlock: 'Clear 25 gang hideouts with your partner', effect: 'Pinhole vignette filter' },
  { id: 'filter-neon', name: 'Neon Jungle', category: 'Screen Filters', combo: ['Right', 'Down', 'Left', 'Up', 'Right', 'Down', 'Left', 'Up'], unlock: 'Find 16 Girlypop vehicles', effect: 'Neon jungle filter' },
  { id: 'filter-fisheye', name: 'Fisheye', category: 'Screen Filters', combo: ['Down', 'Up', 'Down', 'Up', 'Right', 'Right', 'Left', 'Left'], unlock: 'Catch 100 fish', effect: 'Fisheye lens filter' },
  { id: 'filter-pixel', name: 'Pixel Art', category: 'Screen Filters', combo: ['Up', 'Right', 'Down', 'Left', 'Up', 'Right', 'Down', 'Left'], unlock: 'Earn $250,000 from selling collectibles', effect: 'Pixel-art filter' },
  { id: 'filter-hell', name: 'Hellscape', category: 'Screen Filters', combo: ['Left', 'Left', 'Down', 'Down', 'Right', 'Right', 'Up', 'Up'], unlock: 'Steal 100 police cars', effect: 'Hellscape red filter' },
  { id: 'filter-sepia', name: 'Sepia', category: 'Screen Filters', combo: ['Up', 'Up', 'Down', 'Left', 'Right', 'Down', 'Up', 'Left'], unlock: 'Find 10 WAiNK Landmarks', effect: 'Sepia tone filter' },
  { id: 'filter-noir', name: 'Noir', category: 'Screen Filters', combo: ['Down', 'Left', 'Down', 'Right', 'Up', 'Left', 'Down', 'Right'], unlock: 'Complete 5 Strangers & Freaks jobs', effect: 'Black-and-white noir filter' },
  { id: 'filter-vintage', name: 'Vintage', category: 'Screen Filters', combo: ['Right', 'Up', 'Left', 'Down', 'Right', 'Up', 'Left', 'Down'], unlock: 'Find 15 WAiNK Curiosities', effect: 'Vintage film filter' },
  { id: 'filter-vhs', name: 'VHS', category: 'Screen Filters', combo: ['Left', 'Down', 'Right', 'Up', 'Left', 'Down', 'Right', 'Up'], unlock: 'Watch 5 in-game TV shows', effect: 'VHS tracking filter' },
  { id: 'filter-neon2', name: 'Neon', category: 'Screen Filters', combo: ['Up', 'Down', 'Right', 'Right', 'Left', 'Left', 'Up', 'Down'], unlock: 'Visit 10 nightclubs', effect: 'Neon glow filter' },
  { id: 'filter-thermal', name: 'Thermal', category: 'Screen Filters', combo: ['Down', 'Right', 'Up', 'Left', 'Down', 'Right', 'Up', 'Left'], unlock: 'Complete 5 hunting challenges', effect: 'Thermal vision filter' },
  { id: 'filter-xray', name: 'X-Ray', category: 'Screen Filters', combo: ['Right', 'Right', 'Down', 'Down', 'Left', 'Left', 'Up', 'Up'], unlock: 'Find 5 Underwater Discoveries', effect: 'X-ray filter' },
  { id: 'filter-comic', name: 'Comic', category: 'Screen Filters', combo: ['Left', 'Up', 'Left', 'Down', 'Right', 'Up', 'Right', 'Down'], unlock: 'Collect 20 comic books', effect: 'Comic-book filter' },
  { id: 'filter-water', name: 'Watercolor', category: 'Screen Filters', combo: ['Up', 'Left', 'Down', 'Right', 'Down', 'Up', 'Left', 'Right'], unlock: 'Find 10 WAiNK Sculptures', effect: 'Watercolor filter' },
  { id: 'filter-dream', name: 'Dream', category: 'Screen Filters', combo: ['Down', 'Down', 'Up', 'Right', 'Left', 'Up', 'Down', 'Right'], unlock: 'Meditate at all 18 Meditation Spots', effect: 'Dream haze filter' },
];

// Categories and their counts: Player 20, Combat 11, Vehicle Spawn 11,
// Environment 3, Screen Filters 16 = 61.
export const CHEAT_CATEGORIES = {
  Player: 20,
  Combat: 11,
  'Vehicle Spawn': 11,
  Environment: 3,
  'Screen Filters': 16,
};

export function cheatsInCategory(category) {
  return CHEATS.filter((c) => c.category === category);
}

export function cheatById(id) {
  return CHEATS.find((c) => c.id === id) || null;
}

// Cheats only work after the story is finished, and each needs its unlock.
export function canUseCheat(cheat, storyFinished, unlockedIds) {
  if (!storyFinished) return false;
  return (unlockedIds || []).includes(cheat.id);
}

// Activating any cheat disables trophies and saving (Bab 3).
export function cheatSideEffects() {
  return { trophiesDisabled: true, savingDisabled: true };
}
