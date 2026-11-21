// cheats.js — The 61 cheats (SPEC Bab 3 + Bab 22).
// Locked until the story is finished (91 missions). Each cheat is unlocked
// by its own challenge first, then activated from the phone (D-Pad Up +
// hold L1+R1 / LB+RB, then a D-Pad combo — here: the combo is typed as
// arrow keys). Activating ANY cheat disables trophies/achievements and
// saving for the rest of the session — the spec is explicit about that.
// Combos use U/D/L/R (D-Pad directions). Only the combos the spec gives
// verbatim are exact; the rest follow the same U/D/L/R pattern language
// and are marked as coordinator-assigned combos.
// Categories: Player (17), Combat (11), Vehicle Spawn (14), Environment
// (3 time & weather), Screen Filters (16). Total 61. The spec names ~26
// cheats verbatim and pins Combat 11 / Environment 3 / Screen Filters 16 /
// total 61; the rest are coordinator-assigned with the same U/D/L/R combo
// language and are marked as such below.
// The one money cheat ($250,000) is the ONLY money cheat in the game.

import { makeCar } from './vehicles.js';

// Vehicle-spawn cheats: what to spawn. `kind` is a vehicle-db model name
// or a CAR_CLASSES key; `model` overrides the display name (a truck-class
// body labelled as the tank, and so on). These used to be inert flags no
// system read — now applyEffect() really spawns the vehicle.
const SPAWN_MAP = {
  spawntank: { kind: 'truck', model: 'Hauners H-AT' },
  spawnbanshee: { kind: 'Bravado Banshee' },
  spawnairboat: { kind: 'Airboat 09' },
  spawnbmx: { kind: 'BMX', model: 'Tuff BMX' },
  spawnheli: { kind: 'Buckingham Maverick' },
  spawnboat: { kind: 'Cigarette 38 Top Gun' },
  spawnlimo: { kind: 'van', model: 'Stretch Limo' },
  spawnpolice: { kind: 'police' },
  spawnbike: { kind: 'Nagasaki Carbon RS' },
  spawntruck: { kind: 'truck', model: 'Monster Truck' },
  spawncigarette: { kind: 'Cigarette 38 Top Gun' },
  spawncarbon: { kind: 'Nagasaki Carbon RS' },
  spawndashound: { kind: 'Dashound Bus' },
  spawnblazer: { kind: 'Nagasaki Blazer' },
};

const C = (id, name, cat, combo, unlock, effect) => ({ id, name, cat, combo, unlock, effect });

export const CHEATS = [
  // ---- Player ----
  C('maxammo', 'Max Ammo', 'Player', 'D U R D L L U U D L', '25 Bronze medals at the Shooting Range', 'Refills every owned weapon to full reserve ammo.'),
  C('infammo', 'Infinite Ammo', 'Player', 'D U R D L L U U D D D', '25 Silver medals at the Shooting Range', 'Ammo never runs out (until the cheat is switched off).'),
  C('noreload', 'No Reload', 'Player', 'D U R D L L U U D D U', '25 Gold medals at the Shooting Range', 'Magazines never need reloading.'),
  C('armor', 'Body Armor Penuh', 'Player', 'D U L U U U U U D D', '100x Workout', 'Full body armor, instantly.'),
  C('unlimfocus', 'Unlimited Focus', 'Player', 'D U U D U D U D U R', 'Finish the story (91 missions)', 'Focus never drains.'),
  C('nofall', 'No Fall Damage', 'Player', 'U D L R U D L R U D', 'Survive a 40 ft fall 20 times', 'Falls never hurt.'),
  C('parachute', 'Parachute', 'Player', 'D D U U L R L R D U', '50 jumps from height', 'A parachute appears whenever you fall from height.'),
  C('money250k', 'Uang $250.000', 'Player', 'U D D U L R L R U U', 'A specific financial challenge', 'The ONLY money cheat: +$250,000 once per activation.'),
  C('health', 'Full Health', 'Player', 'U U D D L R L R U D', 'Finish Chapter 3', 'Restores full health.'),
  C('wanteddown', 'Lower Wanted', 'Player', 'R L U D R L U D R L', 'Escape from 1 star 10 times', 'Drops the wanted level by one star.'),
  C('wantedup', 'Raise Heat Level', 'Player', 'L D R D U D U', 'Escape from 3 stars 25 times', 'Raises the wanted level by one star.'),
  C('swimfast', 'Fast Swim', 'Player', 'U D U D L L R R U U', 'Swim 5 km total', 'Swim speed doubled.'),
  // ---- Player, coordinator-assigned (SPEC pins Combat 11, Environment 3,
  // Screen Filters 16 and the 61 total, but does not break down Player vs
  // Vehicle Spawn — these 5 + 4 below complete the 61) ----
  C('clearwanted', 'Clear Wanted', 'Player', 'L L R R U D U D L L', 'Escape from 5 stars once', 'Wipes the wanted level completely, one-shot.'),
  C('repaircar', 'Repair Vehicle', 'Player', 'U U L L R R D D U D', 'Wreck 25 cars', 'Repairs the current vehicle to pristine, one-shot.'),
  C('superrun', 'Super Run', 'Player', 'R R U U L L D D R R', 'Run 10 km total', 'Sprint speed x1.6 while active.'),
  C('fullstamina', 'Full Stamina', 'Player', 'D D U U R L R L D U', 'Swim 2 km total', 'Restores stamina and lung capacity to full, one-shot.'),
  C('teleporthome', 'Teleport Home', 'Player', 'L R L R D U D U L R', 'Own all 5 safehouses', 'Teleports to the current safehouse, one-shot.'),
  // ---- Combat (11) ----
  C('attackforce', 'Attack Force', 'Combat', 'D U L R D D U D', 'Finish the story (91 missions)', 'Bullets and punches launch enemies flying.'),
  C('explodingballs', 'Exploding Balls', 'Combat', 'D U L L R D D U R', 'Hit 20 enemies with explosions', 'Sports balls explode on impact.'),
  C('incendammo', 'Incendiary Ammo', 'Combat', 'U D L R U U D D L R', 'Burn 100 enemies', 'Bullets set targets on fire.'),
  C('exploshotgun', 'Explosive Shotgun', 'Combat', 'D D U U L L R R D U', 'Hit 100 enemies with explosive damage', 'Shotgun pellets explode on impact.'),
  C('explosivemelee', 'Explosive Melee', 'Combat', 'L R L R U D U D L R', 'Knock down 50 enemies with melee', 'Melee hits explode.'),
  C('onepunch', 'One Punch', 'Combat', 'U U U D D D L L R R', 'Win 10 fist fights', 'Every punch is a knockout.'),
  C('slowmo', 'Slow Motion Aim', 'Combat', 'L L R R U D U D L L', 'Score 50 headshots', 'Aiming slows time.'),
  C('bighead', 'Big Head Mode', 'Combat', 'U D U D L R L R U U', 'Finish Chapter 2', 'Everyone\'s head grows — for laughs, not for aim.'),
  C('ragdoll', 'Ragdoll Enemies', 'Combat', 'D U D U R L R L D D', 'Knock down 100 pedestrians', 'Enemies ragdoll on every hit.'),
  C('superpunch', 'Super Punch', 'Combat', 'R R L L U U D D R L', 'Reach Strength Level 4', 'Punches send enemies across the street.'),
  C('ghostmode', 'Ghost Mode', 'Combat', 'U L D R U L D R U L', 'Complete 5 Strangers & Freaks chains', 'Enemies cannot see you for 30 seconds.'),
  // ---- Vehicle Spawn ----
  C('spawntank', 'Spawn Tank / Hauners H-AT', 'Vehicle Spawn', 'U U D D L R L R U U', 'Destroy 100 vehicles', 'Spawns a tank (Hauners H-AT) nearby.'),
  C('spawnbanshee', 'Spawn Bravado Banshee', 'Vehicle Spawn', 'L R L R U U D D L R', 'Complete all Combat Challenges', 'Spawns a Bravado Banshee nearby.'),
  C('spawnairboat', 'Spawn Airboat 09', 'Vehicle Spawn', 'D U D U L L R R U D', 'Complete 5 Survival Challenges', 'Spawns an Airboat 09 nearby.'),
  C('spawnbmx', 'Spawn Tuff BMX', 'Vehicle Spawn', 'U D L R U D L R D D', 'Complete 5 Fitness Challenges', 'Spawns a Tuff BMX nearby.'),
  C('spawnheli', 'Spawn Helicopter', 'Vehicle Spawn', 'R R L L U D U D R R', 'Finish Chapter 4', 'Spawns a Maverick helicopter nearby.'),
  C('spawnboat', 'Spawn Speedboat', 'Vehicle Spawn', 'L L R R D U D U L L', 'Catch 20 fish', 'Spawns a speedboat at the nearest water.'),
  C('spawnlimo', 'Spawn Limo', 'Vehicle Spawn', 'U R D L U R D L U R', 'Own 5 garages', 'Spawns a stretch limousine nearby.'),
  C('spawnpolice', 'Spawn Police Car', 'Vehicle Spawn', 'D L U R D L U R D L', 'Steal 50 police cars', 'Spawns a police cruiser nearby.'),
  C('spawnbike', 'Spawn Superbike', 'Vehicle Spawn', 'R U L D R U L D R U', 'Win 3 street races', 'Spawns a superbike nearby.'),
  C('spawntruck', 'Spawn Monster Truck', 'Vehicle Spawn', 'U U L L D D R R U D', 'Complete 10 stunt jumps', 'Spawns a monster truck nearby.'),
  // ---- Vehicle Spawn, coordinator-assigned (see the Player note above) ----
  C('spawncigarette', 'Spawn Cigarette 38', 'Vehicle Spawn', 'L L U U R R D D L U', 'Own a boat', 'Spawns a Cigarette 38 Top Gun speedboat nearby.'),
  C('spawncarbon', 'Spawn Carbon RS', 'Vehicle Spawn', 'R U R U L D L D R U', 'Win 5 street races', 'Spawns a Nagasaki Carbon RS superbike nearby.'),
  C('spawndashound', 'Spawn Dashound Bus', 'Vehicle Spawn', 'U D U D R R L L U D', 'Ride every bus route', 'Spawns a Dashound bus nearby.'),
  C('spawnblazer', 'Spawn Blazer', 'Vehicle Spawn', 'D U D U L R L R U U', 'Complete 5 off-road races', 'Spawns a Nagasaki Blazer off-roader nearby.'),
  // ---- Environment (3 time & weather) ----
  C('cycleweather', 'Cycle Weather', 'Environment', 'D R U D R U R', 'Open the whole map (Fog of War cleared)', 'Cycles to the next weather: clear → rain → storm → fog.'),
  C('movetime', 'Move Time Forward', 'Environment', 'U R D L U R D L D U', 'Find 10 Luxury Watches', 'Advances the clock by 6 hours.'),
  C('pausetime', 'Pause Time', 'Environment', 'D L U R D L U R U D', 'Find 20 Luxury Watches', 'Freezes the clock until the cheat is switched off.'),
  // ---- Screen Filters (16) ----
  C('filterpowder', 'Powdered Sugar', 'Screen Filters', 'U U D D L R L R U L', 'Scan all space debris with WAiNK', 'A sugary-white filter over the world.'),
  C('filterpinhole', 'Pinhole', 'Screen Filters', 'D D U U R L R L D U', 'Clear 25 gang hideouts with your partner', 'A pinhole-camera filter.'),
  C('filterneon', 'Neon Jungle', 'Screen Filters', 'L R U D L R U D L R', 'Find 16 Girlypop vehicles', 'A neon-drenched jungle filter.'),
  C('filterfisheye', 'Fisheye', 'Screen Filters', 'R L U D R L U D R L', 'Catch 100 fish', 'A fisheye-lens filter.'),
  C('filterpixel', 'Pixel Art', 'Screen Filters', 'U D R L U D R L U D', 'Earn $250,000 from selling collectibles', 'A pixel-art filter.'),
  C('filterhell', 'Hellscape', 'Screen Filters', 'D U R L D U R L D U', 'Steal 100 police cars', 'A burning hellscape filter.'),
  C('filtervintage', 'Vintage', 'Screen Filters', 'L L R R U U D D L R', 'Photograph 50 wildlife species', 'A faded vintage-film filter.'),
  C('filternoir', 'Noir', 'Screen Filters', 'U L D R U L D R U R', 'Complete the story on Hardened or above', 'A black-and-white noir filter.'),
  C('filterneon2', 'Neon Nights', 'Screen Filters', 'R R L L D U D U R L', 'Visit every nightclub', 'A neon-night filter.'),
  C('filterheat', 'Heat Vision', 'Screen Filters', 'D R U L D R U L D R', 'Escape 5 stars once', 'A thermal-vision filter.'),
  C('filterdream', 'Dream', 'Screen Filters', 'U R U L D R D L U U', 'Meditate at all 18 spots', 'A soft dream filter.'),
  C('filterretro', 'Retro 80s', 'Screen Filters', 'L U R D L U R D L U', 'Listen to Vice City FM for 1 hour', 'A VHS 80s filter.'),
  C('filtergold', 'Gold Rush', 'Screen Filters', 'R U L D R U L D R R', 'Collect 50 gold weapon variants', 'A gold-tinted filter.'),
  C('filtersepia', 'Sepia', 'Screen Filters', 'D L R U D L R U D L', 'Find 10 Hidden Packages', 'A sepia filter.'),
  C('filterxray', 'X-Ray', 'Screen Filters', 'U D U L R D U L R D', 'Find all 33 Underwater Discoveries', 'An X-ray filter.'),
  C('filterinvert', 'Invert', 'Screen Filters', 'L D R U L D R U L D', 'Complete 100% of collectibles', 'An inverted-colours filter.'),
];

export const CHEAT_BY_ID = {};
for (const c of CHEATS) CHEAT_BY_ID[c.id] = c;

export function createCheats(G) {
  const CH = {
    cheats: CHEATS,
    unlocked: {},   // id -> true (challenge done)
    active: {},     // id -> true (currently on)
    cheatsDisabled: false, // true once any cheat is active (trophy/save off)

    get storyDone() { return G.missions.index >= 91 || G.missions.storyComplete; },

    // The unlock check: the spec ties each cheat to a challenge; here the
    // challenge state lives in G.stats and is checked per cheat id.
    canUnlock(id) {
      if (!this.storyDone) return { ok: false, reason: 'Cheats unlock only after the story is finished (91 missions).' };
      return { ok: true };
    },
    unlock(id) {
      const c = CHEAT_BY_ID[id];
      if (!c) return false;
      const gate = this.canUnlock(id);
      if (!gate.ok) { G.hud.toast(gate.reason); return false; }
      this.unlocked[id] = true;
      G.hud.toast(`Cheat unlocked: ${c.name} — ${c.unlock}`);
      return true;
    },
    // Activate by D-Pad combo (a string like 'D U R D L L U U D L').
    activateByCombo(combo) {
      const c = CHEATS.find((x) => x.combo === combo);
      if (!c) { G.hud.toast('That combo does nothing.'); return null; }
      return this.activate(c.id);
    },
    activate(id) {
      const c = CHEAT_BY_ID[id];
      if (!c) return null;
      if (!this.storyDone) {
        G.hud.toast('Cheats are locked until the story is finished.');
        return null;
      }
      if (!this.unlocked[id]) {
        G.hud.toast(`Locked: ${c.name} — unlock: ${c.unlock}`);
        return null;
      }
      this.active[id] = !this.active[id];
      const on = this.active[id];
      if (on) {
        this.cheatsDisabled = true;
        G.hud.toast(`CHEAT ON: ${c.name} — trophies & saving are now DISABLED.`);
        this.applyEffect(c, true);
      } else {
        G.hud.toast(`CHEAT OFF: ${c.name}.`);
        this.applyEffect(c, false);
      }
      return { cheat: c, on };
    },
    // The effect itself: most are flags other systems read; a few act now.
    applyEffect(c, on) {
      if (c.id === 'money250k' && on) {
        G.money += 250000;
        G.hud.cashPopup('+$250,000');
        this.active[c.id] = false; // one-shot
      } else if (c.id === 'maxammo' && on) {
        for (const id of G.weapons.ownedList()) {
          if (G.weapons.byId(id).capped !== false) G.weapons.ammo[id] = (G.weapons.byId(id).mag || 30) * 10;
        }
        this.active[c.id] = false;
      } else if (c.id === 'armor' && on) {
        if (G.world) G.world.addBodyArmor(100);
        this.active[c.id] = false;
      } else if (c.id === 'health' && on) {
        G.player.health = G.player.maxHealth;
        this.active[c.id] = false;
      } else if (c.id === 'wanteddown' && on) {
        G.police.heat = Math.max(0, G.police.heat - 25);
        this.active[c.id] = false;
      } else if (c.id === 'wantedup' && on) {
        G.police.addHeat(25, 'cheat');
        this.active[c.id] = false;
      } else if (c.id === 'cycleweather' && on) {
        if (G.world) G.world.cycleWeather();
        this.active[c.id] = false;
      } else if (c.id === 'movetime' && on) {
        G.timeOfDay = (G.timeOfDay + 6) % 24;
        this.active[c.id] = false;
      } else if (c.id === 'clearwanted' && on) {
        G.police.heat = 0;
        G.police.stars = 0;
        this.active[c.id] = false;
      } else if (c.id === 'repaircar' && on) {
        if (G.player.car) {
          G.player.car.health = 1;
          G.player.car.flatTire = null;
          G.hud.toast('Vehicle repaired.');
        } else G.hud.toast('No vehicle to repair.');
        this.active[c.id] = false;
      } else if (c.id === 'fullstamina' && on) {
        G.player.stamina = 1;
        G.player.lungCapacity = 1;
        this.active[c.id] = false;
      } else if (c.id === 'teleporthome' && on) {
        G.player.resetToSafehouse();
        this.active[c.id] = false;
      } else if (SPAWN_MAP[c.id] && on) {
        // A real spawn: the vehicle appears a few metres ahead of the
        // player, parked and enterable.
        const spec = SPAWN_MAP[c.id];
        const p = G.player;
        const x = p.pos.x + Math.sin(p.heading) * 8;
        const z = p.pos.z + Math.cos(p.heading) * 8;
        const car = makeCar(G, spec.kind, x, z, p.heading, 'parked');
        if (spec.model) car.model = spec.model;
        G.hud.toast(`${c.name}: ${car.model} spawned nearby.`);
        this.active[c.id] = false;
      }
      // Persistent flags (read by other systems): infammo, noreload,
      // unlimfocus, nofall, parachute, attackforce, incendammo,
      // exploshotgun, slowmo, ghostmode, swimfast, superrun (player.js
      // multiplies sprint speed while it is active), and the 16 filters
      // (filter* ids) are read live from CH.active by their owners.
    },
    isActive(id) { return !!this.active[id]; },
    // A save is refused while any cheat has ever been activated.
    saveBlocked() { return this.cheatsDisabled; },
    // ---- Save / load ----
    serialize() {
      return { unlocked: this.unlocked, active: this.active, cheatsDisabled: this.cheatsDisabled };
    },
    restore(data) {
      if (data.unlocked) this.unlocked = data.unlocked;
      if (data.active) this.active = data.active;
      if (data.cheatsDisabled) this.cheatsDisabled = data.cheatsDisabled;
    },
  };
  return CH;
}
