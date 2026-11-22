// player.js — Player state (Cole & Mara), SPEC §10 + §17 + §29.
// Health / Stamina / Focus / Oxygen / Adrenaline, with the Bab 29 rules.
// Dynamic body: too much food = gain weight; regular gym (timing minigame) =
// muscular. Food/drink give temporary buffs. Hair & beard do NOT grow
// automatically; new styles are bought at barbershops/salons (each shop has
// exclusive cuts); at the safehouse wardrobe you can only shorten or shave.
// Appearance detail: nail length, nail polish colour, Mara makeup, spare
// clothes in the car trunk. Pistols are auto-hidden behind the back in crowds.
// You can still shoot while swimming.
import {
  HEALTH_REGEN_CAP, HEALTH_REGEN_RATE, HEALTH_REGEN_DELAY,
  FOCUS_DRAIN_AIM, FOCUS_REGEN,
  ADRENALINE_ON_DAMAGE, ADRENALINE_ON_KILL, ADRENALINE_DECAY,
  ADRENALINE_SPRINT_HALF, OXYGEN_SCUBA_DRAIN, RELATIONSHIP_START,
} from './config.js';

export function freshPlayer(protagonist) {
  return {
    protagonist, // 'cole' | 'mara'
    health: 100, maxHealth: 100,
    stamina: 100, focus: 100,
    oxygen: 100, lungCapacity: 100,
    adrenaline: 0,
    lastDamageAt: -999,
    swimming: false, diving: false, scuba: false,
    weight: 0, // -100 (skinny) .. +100 (heavy); gym builds muscle
    relationship: RELATIONSHIP_START,
    chaos: 0, // 0-100, drives Criminal Profile
    weaponHidden: false,
  };
}

// Per-frame update (dt in seconds). Returns the mutated player.
export function updatePlayer(p, dt, input) {
  // Health regen: +3/s only up to 50% maxHealth, only after 8s without damage.
  if (p.health < p.maxHealth * HEALTH_REGEN_CAP && input.time - p.lastDamageAt > HEALTH_REGEN_DELAY) {
    p.health = Math.min(p.maxHealth * HEALTH_REGEN_CAP, p.health + HEALTH_REGEN_RATE * dt);
  }
  // Focus: drains 0.10/s while aiming (slow-mo), regens 0.05/s otherwise.
  if (input.aiming) p.focus = Math.max(0, p.focus - FOCUS_DRAIN_AIM * dt * 100);
  else p.focus = Math.min(100, p.focus + FOCUS_REGEN * dt * 100);
  // Adrenaline decays 0.04/s.
  p.adrenaline = Math.max(0, p.adrenaline - ADRENALINE_DECAY * dt);
  // Stamina: sprint costs half while Adrenaline >= 0.5.
  if (input.sprinting) {
    const cost = p.adrenaline >= ADRENALINE_SPRINT_HALF ? 5 : 10;
    p.stamina = Math.max(0, p.stamina - cost * dt);
  } else {
    p.stamina = Math.min(100, p.stamina + 8 * dt);
  }
  // Oxygen: scuba drains 1.2/s; on the surface it is lung capacity.
  if (p.diving && p.scuba) p.oxygen = Math.max(0, p.oxygen - OXYGEN_SCUBA_DRAIN * dt * 100);
  else if (!p.diving) p.oxygen = 100;
  // Pistols auto-hide behind the back in crowds.
  p.weaponHidden = !!input.inCrowd;
  return p;
}

export function takeDamage(p, amount, time) {
  p.health = Math.max(0, p.health - amount);
  p.lastDamageAt = time;
  p.adrenaline = Math.min(1, p.adrenaline + ADRENALINE_ON_DAMAGE);
  return p;
}

export function onKill(p) {
  p.adrenaline = Math.min(1, p.adrenaline + ADRENALINE_ON_KILL);
  return p;
}

// Clamp a position to the Solmaris playfield bounds (game coords).
export function clampToBounds(x, z) {
  const B = 1000;
  return { x: Math.max(-B, Math.min(B, x)), z: Math.max(-B, Math.min(B, z)) };
}

// Switch protagonist (Cole <-> Mara).
export function switchProtagonist(p) {
  p.protagonist = p.protagonist === 'cole' ? 'mara' : 'cole';
  return p;
}
