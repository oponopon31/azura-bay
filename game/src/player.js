// AZURA BAY — player (round 7 re-compose, written fresh under r7).
// Switch between Jason and Lucia. Health/stamina/focus/oxygen, damage,
// regen, and the Criminal Profile per character (SPEC.md Bab 10).

import { newAttributes, maxHealth, maxStamina, maxFocus } from "./attributes.js";
import { PROFILE_LEVELS } from "./config.js";
import { newHudState, onTakeDamage, onDamageDealt, onKill } from "./hud.js";

export const PROTAGONISTS = ["jason", "lucia"];

export function newPlayerState() {
  return {
    active: "jason",
    jason: {
      name: "Jason Duval", x: -296, z: 749, health: 100, stamina: 100,
      focus: 100, oxygen: 100, attrs: newAttributes(), profile: "Professional",
      profileScore: 0, weapons: ["es9"], currentWeapon: "es9",
    },
    lucia: {
      name: "Lucia Caminos", x: -296, z: 749, health: 100, stamina: 100,
      focus: 100, oxygen: 100, attrs: newAttributes(), profile: "Professional",
      profileScore: 0, weapons: ["k17"], currentWeapon: "k17",
    },
    hud: newHudState(),
    relationship: 50,
  };
}

export function activePlayer(state) { return state[state.active]; }
export function switchPlayer(state) {
  state.active = state.active === "jason" ? "lucia" : "jason";
  return state.active;
}
export function takeDamage(state, amount, now) {
  const p = activePlayer(state);
  p.health = Math.max(0, p.health - amount);
  onTakeDamage(state.hud, amount, now);
  return p.health;
}
export function dealDamage(state, amount) {
  onDamageDealt(state.hud, amount);
  return state.hud.adrenaline;
}
export function killEnemy(state) { onKill(state.hud); return state.hud.adrenaline; }

// Criminal Profile (SPEC Bab 11): Professional / Hardened / Violent &
// Dangerous / Psycho. Psycho is permanent once the logo breaks.
export function updateProfile(state, action) {
  const p = activePlayer(state);
  const delta = {
    "clean-job": -5, "kind-act": -3, "violent-kill": 8, "civilian-kill": 15,
    "heist": 10, "police-kill": 12, "logo-break": 100,
  }[action] || 0;
  p.profileScore = Math.max(0, Math.min(100, p.profileScore + delta));
  if (p.profileScore >= 95 || action === "breaking-point") {
    p.profile = "Irredeemable";
    p.profilePermanent = true;
  } else if (action === "logo-break" || p.profileScore >= 90) {
    p.profile = "Psycho";
    p.profilePermanent = true;
  } else if (p.profilePermanent) {
    p.profile = p.profileScore >= 95 ? "Irredeemable" : "Psycho";
  } else if (p.profileScore >= 60) {
    p.profile = "Violent & Dangerous";
  } else if (p.profileScore >= 30) {
    p.profile = "Hardened";
  } else {
    p.profile = "Professional";
  }
  return p.profile;
}
export function profileLevels() { return PROFILE_LEVELS; }
export function maxHealthFor(state) { return maxHealth(activePlayer(state).attrs); }
export function maxStaminaFor(state) { return maxStamina(activePlayer(state).attrs); }
export function maxFocusFor(state) { return maxFocus(activePlayer(state).attrs); }
export function giveWeapon(state, weaponId) {
  const p = activePlayer(state);
  if (!p.weapons.includes(weaponId)) p.weapons.push(weaponId);
  p.currentWeapon = weaponId;
  return p.weapons;
}
