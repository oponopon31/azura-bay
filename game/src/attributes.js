// AZURA BAY — attributes (round 7 re-compose, written fresh under r7).
// SPEC.md Bab 10. Jason & Lucia each have Strength/Health, Cardio/Stamina,
// Focus. 4 standard levels + Level 5 late-game. xpPerLevel [0,100,250,500,900].
// Strength via gym, Cardio via running/swimming/cycling/kayaking, Focus via
// basketball/fishing/meditation/headshots/non-lethal/kind acts.

export const ATTRIBUTE_LEVELS = ["Novice", "Trained", "Skilled", "Expert", "Master"];
export const XP_PER_LEVEL = [0, 100, 250, 500, 900]; // cumulative XP to reach level 1..5

export function levelForXp(xp) {
  let level = 1;
  for (let i = 1; i < XP_PER_LEVEL.length; i++) {
    if (xp >= XP_PER_LEVEL[i]) level = i + 1;
    else break;
  }
  return level;
}
export function xpForNextLevel(xp) {
  const lvl = levelForXp(xp);
  if (lvl >= 5) return null;
  return XP_PER_LEVEL[lvl] - xp;
}
export function levelName(level) { return ATTRIBUTE_LEVELS[level - 1] || "Novice"; }

export function newAttributes() {
  return {
    strength: { xp: 0, level: 1 },
    cardio: { xp: 0, level: 1 },
    focus: { xp: 0, level: 1 },
  };
}
export function gainXp(attrs, key, amount) {
  const a = attrs[key];
  if (!a) return null;
  a.xp += amount;
  const newLevel = levelForXp(a.xp);
  const leveledUp = newLevel > a.level;
  a.level = newLevel;
  return { leveledUp, level: a.level, name: levelName(a.level) };
}
// Attribute bonuses at each level (applied to health/stamina/focus).
export function healthBonus(attrs) { return (attrs.strength.level - 1) * 10; }
export function staminaBonus(attrs) { return (attrs.cardio.level - 1) * 15; }
export function focusBonus(attrs) { return (attrs.focus.level - 1) * 20; }
export function maxHealth(attrs) { return 100 + healthBonus(attrs); }
export function maxStamina(attrs) { return 100 + staminaBonus(attrs); }
export function maxFocus(attrs) { return 100 + focusBonus(attrs); }
