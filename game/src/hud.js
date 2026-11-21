// AZURA BAY — HUD (round 7 re-compose, written fresh under r7).
// SPEC.md Bab 29. Four corners:
//   Top-left: Health (regen +3/s to 50% cap after 8s no damage), Stamina,
//     Focus (drain 0.10/s aiming, regen 0.05/s), Oxygen, Buff/Adrenaline
//     (+0.08 damage / +0.25 kill, decay 0.04/s).
//   Bottom-left: minimap (rounded + pink GPS route), vehicle warnings.
//   Top-right: Wanted/Heat, weapon/ammo, cash (cap $20,000) + BuckMe.
//   Bottom-right: Criminal Profile (Bab 10) + Relationship Status.

export const HUD_CORNERS = ["top-left", "bottom-left", "top-right", "bottom-right"];

export const HEALTH_REGEN_RATE = 3; // per second
export const HEALTH_REGEN_CAP = 0.5; // 50% of max
export const HEALTH_REGEN_DELAY = 8; // seconds without damage
export const FOCUS_DRAIN_AIM = 0.10; // per second
export const FOCUS_REGEN = 0.05; // per second
export const ADRENALINE_DAMAGE = 0.08; // per damage dealt
export const ADRENALINE_KILL = 0.25; // per kill
export const ADRENALINE_DECAY = 0.04; // per second

export const RELATIONSHIP_BANDS = [
  { min: 0, max: 29, label: "Strained" },
  { min: 30, max: 54, label: "Partners" },
  { min: 55, max: 79, label: "In Sync" },
  { min: 80, max: 100, label: "Bonnie & Clyde" },
];

export function relationshipBand(score) {
  const band = RELATIONSHIP_BANDS.find((b) => score >= b.min && score <= b.max);
  return band ? band.label : "Partners";
}

export function newHudState() {
  return {
    health: 100, maxHealth: 100, stamina: 100, focus: 100, oxygen: 100,
    adrenaline: 0, lastDamageAt: -9999, aiming: false, inVehicle: false,
    fuel: 100, engineHealth: 100,
  };
}

// Per-frame HUD update. dt in seconds, now in seconds.
export function updateHudCorners(hud, dt, now) {
  // Health regen: +3/s to 50% cap after 8s without damage.
  if (now - hud.lastDamageAt >= HEALTH_REGEN_DELAY) {
    const cap = hud.maxHealth * HEALTH_REGEN_CAP;
    if (hud.health < cap) {
      hud.health = Math.min(cap, hud.health + HEALTH_REGEN_RATE * dt);
    }
  }
  // Focus: drain while aiming, regen otherwise.
  if (hud.aiming) {
    hud.focus = Math.max(0, hud.focus - FOCUS_DRAIN_AIM * dt * 100);
  } else {
    hud.focus = Math.min(100, hud.focus + FOCUS_REGEN * dt * 100);
  }
  // Adrenaline decays.
  hud.adrenaline = Math.max(0, hud.adrenaline - ADRENALINE_DECAY * dt);
  return hud;
}

export function onDamageDealt(hud, amount) {
  hud.adrenaline = Math.min(1, hud.adrenaline + ADRENALINE_DAMAGE * amount);
  return hud;
}
export function onKill(hud) {
  hud.adrenaline = Math.min(1, hud.adrenaline + ADRENALINE_KILL);
  return hud;
}
export function onTakeDamage(hud, amount, now) {
  hud.health = Math.max(0, hud.health - amount);
  hud.lastDamageAt = now;
  return hud;
}

// Snapshot of the four HUD corners for rendering / selftest.
export function hudCorners(state) {
  const hud = state.hud || newHudState();
  const econ = state.econ || { cash: 0, buckme: 0 };
  const police = state.police || { stars: 0, state: "none", heat: 0 };
  const profile = state.profile || { level: "Professional" };
  const rel = state.relationship != null ? state.relationship : 50;
  return {
    topLeft: {
      health: Math.round(hud.health), maxHealth: hud.maxHealth,
      stamina: Math.round(hud.stamina), focus: Math.round(hud.focus),
      oxygen: Math.round(hud.oxygen), adrenaline: Math.round(hud.adrenaline * 100) / 100,
    },
    bottomLeft: {
      minimap: "rounded", gpsRoute: "pink",
      inVehicle: !!hud.inVehicle,
      fuel: Math.round(hud.fuel), engineHealth: Math.round(hud.engineHealth),
      fuelWarning: hud.fuel < 20, engineWarning: hud.engineHealth < 30,
    },
    topRight: {
      stars: police.stars, starState: police.state, heat: Math.round(police.heat),
      weapon: state.weapon || null, ammo: state.ammo != null ? state.ammo : 0,
      cash: econ.cash, walletCap: 20000, buckme: econ.buckme,
    },
    bottomRight: {
      profile: profile.level, relationship: relationshipBand(rel), relationshipScore: rel,
    },
  };
}
