// attributes.js — The 3 attributes (SPEC Bab 10).
// Strength / Health (pink heart), Cardio / Stamina (green lightning),
// Focus (purple eye). 4 standard levels each, plus Level 5 in the late
// game once the story level cap opens. Level-ups are permanent and apply
// to the CURRENT character (Jason & Lucia train separately).
// Strength: gym sessions (bench, squat, deadlift, chest fly, pull-up) +
// protein shake / bar + sleep. Cardio: treadmill, static bike, punching
// bag, running, swimming, cycling, kayaking. Focus: basketball, fishing,
// meditation spots; headshots (Violent/Psycho profiles) or non-lethal
// takedowns.
// Round 5: Game replaces G; the attribute model is unchanged.

export const ATTRIBUTE_DEFS = {
  strength: { name: 'Strength / Health', icon: '♥', color: '#ff7fa8', xpPerLevel: [0, 100, 250, 500, 900], maxHealthBonus: [0, 10, 20, 35, 50], meleeBonus: [0, 0.1, 0.2, 0.35, 0.5] },
  cardio: { name: 'Cardio / Stamina', icon: '⚡', color: '#7dff9a', xpPerLevel: [0, 100, 250, 500, 900], staminaBonus: [0, 20, 40, 70, 100] },
  focus: { name: 'Focus', icon: '👁', color: '#b78cff', xpPerLevel: [0, 100, 250, 500, 900], focusBonus: [0, 2, 4, 7, 10] },
};

export function createAttributes(Game) {
  const A = {
    // who -> { strength: {level, xp}, cardio: {...}, focus: {...}, weight }
    chars: {},
    _ensure(who) {
      if (!this.chars[who]) {
        this.chars[who] = {
          strength: { level: 1, xp: 0 },
          cardio: { level: 1, xp: 0 },
          focus: { level: 1, xp: 0 },
          weight: 0, // -5 skinny .. +5 heavy; 0 = normal
          muscle: 0, // 0..100
        };
      }
      return this.chars[who];
    },
    get(who, attr) {
      return this._ensure(who || Game.player.who)[attr];
    },
    level(who, attr) { return this.get(who, attr).level; },
    // Level 5 opens only in the late game (Chapter 5 / story done).
    levelCap() { return (Game.missions.storyComplete || (Game.missions.current && Game.missions.current.ch >= 5)) ? 5 : 4; },
    addXp(who, attr, amount, reason) {
      const c = this._ensure(who);
      const a = c[attr];
      const cap = this.levelCap();
      a.xp += amount;
      const def = ATTRIBUTE_DEFS[attr];
      while (a.level < cap && a.xp >= def.xpPerLevel[a.level]) {
        a.xp -= def.xpPerLevel[a.level];
        a.level++;
        Game.hud.toast(`${def.name} — Level ${a.level}! (${reason || ''})`);
        Game.audio.pickup();
        if (attr === 'strength') Game.player.maxHealth = 100 + def.maxHealthBonus[a.level - 1];
      }
    },
    // ---- Gym (Strength) ----
    gymSession(who, exercise) {
      const valid = ['bench press', 'squat', 'deadlift', 'chest fly', 'pull-up'];
      if (!valid.includes(exercise)) return { ok: false, reason: 'Unknown exercise.' };
      this.addXp(who, 'strength', 25, exercise);
      const c = this._ensure(who);
      c.muscle = Math.min(100, c.muscle + 4);
      c.weight = Math.max(-5, c.weight - 0.2);
      return { ok: true, exercise };
    },
    proteinShake(who) {
      this.addXp(who, 'strength', 10, 'protein shake');
      return { ok: true };
    },
    // ---- Cardio ----
    cardioActivity(who, activity, minutes) {
      const valid = ['treadmill', 'static bike', 'punching bag', 'running', 'swimming', 'cycling', 'kayaking'];
      if (!valid.includes(activity)) return { ok: false, reason: 'Unknown activity.' };
      this.addXp(who, 'cardio', 5 * (minutes || 1), activity);
      const c = this._ensure(who);
      c.weight = Math.max(-5, c.weight - 0.1 * (minutes || 1));
      return { ok: true, activity };
    },
    // ---- Focus ----
    focusActivity(who, activity) {
      const valid = ['basketball', 'fishing', 'meditation', 'headshot', 'non-lethal', 'kindness'];
      if (!valid.includes(activity)) return { ok: false, reason: 'Unknown activity.' };
      this.addXp(who, 'focus', 15, activity);
      return { ok: true, activity };
    },
    meditate() {
      this.focusActivity(Game.player.who, 'meditation');
      Game.hud.toast('Meditation — Focus grows. The city goes quiet for a moment.');
    },
    // ---- Dynamic weight (Bab 17) ----
    eat(who, calories) {
      const c = this._ensure(who);
      c.weight = Math.min(5, c.weight + (calories > 800 ? 0.5 : 0.2));
      return { weight: c.weight };
    },
    // Weight shifts: heavy = slower sprint, harder melee; skinny = faster, weaker.
    weightModifiers(who) {
      const c = this._ensure(who);
      return {
        speedMul: 1 - c.weight * 0.03,
        meleeMul: 1 + c.weight * 0.04 + (c.muscle / 100) * 0.2,
      };
    },
    // ---- Derived stats for the current character ----
    maxHealth(who) {
      const lvl = this.level(who, 'strength');
      return 100 + ATTRIBUTE_DEFS.strength.maxHealthBonus[lvl - 1];
    },
    maxStamina(who) {
      const lvl = this.level(who, 'cardio');
      return 100 + ATTRIBUTE_DEFS.cardio.staminaBonus[lvl - 1];
    },
    // Called by pedestrians.js when the player pets an animal.
    gainFocus(amount) {
      this.addXp(Game.player.who, 'focus', amount, 'kindness');
    },
    // ---- Save / load ----
    serialize() {
      return { chars: this.chars };
    },
    restore(data) {
      if (data.chars) this.chars = data.chars;
    },
    focusSeconds(who) {
      const lvl = this.level(who, 'focus');
      return 5 + ATTRIBUTE_DEFS.focus.focusBonus[lvl - 1];
    },
    // Round 3: all three attribute levels for one character, at a glance.
    summary(who) {
      const out = {};
      for (const attr of Object.keys(ATTRIBUTE_DEFS)) out[attr] = this.level(who, attr);
      return out;
    },
  };
  return A;
}
