// combat.js — Combat mechanics, SPEC §17 + §21 + §24 + §25.
// Non-lethal: shoot an enemy's leg/arm to incapacitate without killing
// (keeps the Professional profile). Suppressing fire (warning shots) makes
// civilians/enemies afraid and prone. Carrying a longarm openly on the street
// makes NPCs panic and report to police.
// NO full auto-aim lock-on: realistic aim assist + weapon bloom
// (bullet spread) + Shoulder Switch. Hit markers: white = hit, yellow =
// target incapacitated (cannot get up again without being killed), red =
// target killed. Kill Cam & Crash Cam on high-speed crashes / eliminations
// (both can be turned off in settings). Surrender at 1–2 stars.
// Free-aim from a car window via Focus Mode (driver, tyre, engine block,
// fuel tank). Pistol fire rate is uncapped (as fast as you pull R2/RT).
// Realistic AR recoil: short bursts are far more accurate than holding the
// trigger. Cole & Mara hand weapons to each other in the field.
// First-person via scope/optic (R3) — NOT full first-person on foot.
// Shoot an enemy's hand = their weapon drops. Warning shots to the air =
// enemies & civilians panic without being hurt. Shoot from a pickup truck
// bed and while swimming. Inventory: 16 slots (8 weapons + 8 gear).
export const HIT_MARKERS = {
  white: 'hit',
  yellow: 'incapacitated (cannot get up again without being killed)',
  red: 'killed',
};

export const LOCK_ON_SETTINGS = ['Partial Lock-On', 'Full Lock-On', 'Free Aim'];
export const DEFAULT_LOCK_ON = 'Partial Lock-On';

// Limb shot: incapacitate without killing (keeps Professional profile).
export function limbShot(target) {
  return { ...target, incapacitated: true, alive: true, profileSafe: true };
}

// Suppressing fire: warning shots make NPCs afraid and prone.
export function suppressingFire(npcs) {
  return (npcs || []).map((n) => ({ ...n, prone: true, afraid: true }));
}

// Disarm: shoot the hand, the weapon drops.
export function disarm(target) {
  return { ...target, weapon: null, disarmed: true };
}

// Weapon bloom (bullet spread) grows with sustained fire; short bursts stay accurate.
export function bloomAfterShots(shotsFired, baseBloom) {
  return Math.min(1, baseBloom + shotsFired * 0.04);
}

// AR recoil: short bursts are far more accurate than holding the trigger.
export function burstAccuracy(shotsInBurst) {
  if (shotsInBurst <= 3) return 0.95;
  if (shotsInBurst <= 6) return 0.8;
  return 0.55;
}

// Inventory: 16 slots — 8 weapons + 8 gear/support items.
export const INVENTORY_SLOTS = { weapons: 8, gear: 8, total: 16 };

// Hand-to-hand style differs per character (Bab 24).
export const FIGHTING_STYLES = {
  mara: 'kickboxing & MMA (technical, trained)',
  cole: 'street fighting (rough, brutal)',
};

// Stealth takedown: approach from behind unseen (dark shadow / tall grass),
// hold R2/RT + press Square/X repeatedly. Prone was REMOVED — replaced by a
// more responsive crouch.
export const STEALTH = { takedown: 'R2/RT hold + Square/X repeatedly from behind', prone: false, crouch: true };
