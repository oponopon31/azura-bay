// AZURA BAY — combat (round 7 re-compose, written fresh under r7).
// SPEC.md Bab 17. No full lock-on (soft aim only). Non-lethal limb shots.
// Suppressing fire. Hit-markers: white (hit), yellow (critical), red (kill).

export const HIT_MARKERS = { hit: "white", critical: "yellow", kill: "red" };

// Hit chance: base 70%, modified by distance, movement, focus level,
// weapon accuracy. No full lock-on — the player must aim.
export function hitChanceAt(distance, moving, focusLevel, weaponAcc) {
  let chance = 70;
  chance -= distance * 0.15; // farther = harder
  if (moving) chance -= 10;
  chance += (focusLevel - 1) * 5;
  chance += (weaponAcc - 50) * 0.2;
  return Math.max(5, Math.min(95, Math.round(chance)));
}

export function isCriticalHit(rand) { return rand < 0.15; }
export function isKill(damage, targetHealth) { return damage >= targetHealth; }

// Non-lethal: limb shots (arms/legs) disable without killing.
export function limbShotDamage(baseDamage) {
  return Math.round(baseDamage * 0.5);
}
export function isNonLethal(zone) {
  return zone === "arm" || zone === "leg";
}
// Suppressing fire: pins enemies, reduces their accuracy.
export function suppressingFire(enemies) {
  return enemies.map((e) => ({ ...e, suppressed: true, accuracy: Math.max(10, e.accuracy - 30) }));
}
export function hitMarkerFor(damage, targetHealth, critical) {
  if (isKill(damage, targetHealth)) return HIT_MARKERS.kill;
  if (critical) return HIT_MARKERS.critical;
  return HIT_MARKERS.hit;
}
// Damage falloff with distance.
export function damageAtRange(baseDamage, range, distance) {
  if (distance <= range * 0.5) return baseDamage;
  const falloff = 1 - ((distance - range * 0.5) / (range * 0.5)) * 0.5;
  return Math.max(Math.round(baseDamage * 0.3), Math.round(baseDamage * falloff));
}
