// selftest.js — 46 checks against SPEC.md + MAP-DATA.md.
// Run with node (ES modules): node --experimental-default-type=module game/src/selftest.js
// Also exposed as runSelfTest() for the browser console (window.AZURA_BAY).
import { MISSIONS, missionsInChapter } from './missions.js';
import { CHAPTERS, PROFILES, ENDINGS, decideEnding, profileFromChaos, breakingPoint } from './story.js';
import { SIDEARMS, sidearmById, weaponDps } from './weapons.js';
import { LONGARMS, LONGARM_SUBCOUNTS, longarmsInSub } from './weapons-longarms.js';
import { MELEE } from './weapons-melee.js';
import { EXPLOSIVES } from './weapons-explosives.js';
import { SPECIALS } from './weapons-special.js';
import { CHEATS, CHEAT_CATEGORIES, cheatsInCategory, canUseCheat, cheatSideEffects } from './cheats.js';
import { CHARACTERS } from './characters.js';
import { STRANGERS } from './strangers.js';
import { STATIONS } from './radio.js';
import { MAP_POINTS, REGIONS, COUNTIES, MAP_ICONS, pointById, gooseKeyVsVciaDistance } from './leonidamap.js';
import { CARD_SETS, COLLECTIBLE_GROUPS, totalCards, totalCollectibles, progressPct } from './collectibles.js';
import { STUNT_KINDS, ROBBERY_KINDS, totalStunts, totalRobberies } from './stunts.js';
import { MYSTERIES, ufoVisible } from './mysteries.js';
import { SAFEHOUSES, GARAGES, buyableGarages, bonusGarages } from './properties.js';
import { ATTRIBUTES, MAX_LEVEL, levelFromXp } from './attributes.js';
import { STAR_STATES, heatPerStar, hitChanceAt, canSurrender } from './police.js';
import { APPS } from './phone.js';
import { MONEY_TYPES, FENCES, MISSION_MIN_BALANCE, enforceWalletCap, totalWealth, launderMarked } from './economy.js';
import { VEHICLES } from './vehicles-data.js';
import { FISH } from './fishing.js';
import { VARIANTS } from './variants.js';
import { ACHIEVEMENTS } from './activities.js';
import { EVENT_TYPES, EVENT_LOCATIONS, totalEventCombinations } from './events.js';
import { SHOPS, ATTACHMENT_CATEGORIES, expandedCount } from './gunshops.js';
import { WALLET_MAX, BUCKME_GOOD1, COUNTS } from './config.js';
import { hudCorners, relationshipLabel } from './hud.js';

const checks = [];
function check(name, ok, detail) {
  checks.push({ name, ok: !!ok, detail: detail || '' });
}

export function runSelfTest() {
  checks.length = 0;

  // 1-3. Missions.
  check('missions: 91 total', MISSIONS.length === 91, `got ${MISSIONS.length}`);
  check('chapters: 22/11/26/25/7', [22, 11, 26, 25, 7].every((n, i) => missionsInChapter(i + 1).length === n),
    [1, 2, 3, 4, 5].map((c) => missionsInChapter(c).length).join('/'));
  check('mission names unique', new Set(MISSIONS.map((m) => m.name)).size === 91);

  // 4-9. Weapons.
  const totalWeapons = SIDEARMS.length + LONGARMS.length + MELEE.length + EXPLOSIVES.length + SPECIALS.length;
  check('weapons: 69 total (16+37+9+4+3)', totalWeapons === 69,
    `${SIDEARMS.length}+${LONGARMS.length}+${MELEE.length}+${EXPLOSIVES.length}+${SPECIALS.length}`);
  const sidearmNames = SIDEARMS.map((w) => w.name);
  check('sidearms: exact user names',
    ['Girardi ES9', 'Klose K17', 'Scorpio Nipper .38', 'Fairview Kalinga .50', 'Scorpio Akulus', 'Beretta-style Service Pistol', 'Coil Shocker', 'Wortham WCR-1'].every((n) => sidearmNames.includes(n)));
  check('ES9 = Jason start, K17 = Lucia standard',
    sidearmById('es9').role === 'jason-start' && sidearmById('k17').role === 'lucia-standard');
  const pistols = SIDEARMS.filter((w) => !['nipper', 'wcr1', 'hawk38', 'mustang357', 'morgan', 'akulus'].includes(w.id));
  const revolvers = SIDEARMS.filter((w) => ['nipper', 'wcr1', 'hawk38', 'mustang357', 'morgan', 'akulus'].includes(w.id));
  check('Kalinga .50 damage 55 (highest pistol); Akulus 58 (highest revolver)',
    sidearmById('kalinga50').damage === 55 && Math.max(...pistols.map((w) => w.damage)) === 55 &&
    sidearmById('akulus').damage === 58 && Math.max(...revolvers.map((w) => w.damage)) === 58);
  check('ES18 burst-fire 3 rounds', sidearmById('es18').burst === 3);
  check('longarm subcounts 8/10/8/2/4/5',
    Object.entries(LONGARM_SUBCOUNTS).every(([k, v]) => longarmsInSub(k).length === v),
    Object.entries(LONGARM_SUBCOUNTS).map(([k, v]) => `${k}:${longarmsInSub(k).length}/${v}`).join(' '));

  // 10-11. Vehicles.
  check('vehicles: 245 total', VEHICLES.length === 245, `got ${VEHICLES.length}`);
  check('vehicle names unique', new Set(VEHICLES.map((v) => v.name)).size === VEHICLES.length);

  // 12-16. Cheats.
  check('cheats: 61 total', CHEATS.length === 61, `got ${CHEATS.length}`);
  check('cheat categories 20/11/11/3/16',
    Object.entries(CHEAT_CATEGORIES).every(([k, v]) => cheatsInCategory(k).length === v));
  const moneyCheats = CHEATS.filter((c) => /money|\$250/i.test(c.name));
  check('only ONE money cheat ($250,000)', moneyCheats.length === 1 && moneyCheats[0].id === 'money250k');
  const maxAmmo = CHEATS.find((c) => c.id === 'maxammo');
  check('cheats gated on story completion',
    canUseCheat(maxAmmo, false, ['maxammo']) === false && canUseCheat(maxAmmo, true, ['maxammo']) === true);
  check('cheats disable trophy + save', (() => { const s = cheatSideEffects(); return s.trophiesDisabled && s.savingDisabled; })());

  // 17-19. People & radio.
  check('strangers: 13', STRANGERS.length === 13);
  check('radio: 24 stations', STATIONS.length === 24);
  check('characters: 27', CHARACTERS.length === 27);

  // 20-22. Map.
  check('map points: 27', MAP_POINTS.length === 27);
  const bq = pointById('breakwater');
  check('Breakwater Quarry corrected -4462/-922', bq && bq.gx === -4462 && bq.gy === -922);
  check('Goose Key airfield separate from VCIA (~7100 apart)', (() => { const d = gooseKeyVsVciaDistance(); return d > 7000 && d < 7200; })(), `distance ${gooseKeyVsVciaDistance()}`);

  // 23-26. Collections, stunts, robberies.
  check('cards: 480 in 18 sets', totalCards() === 480 && CARD_SETS.length === 18);
  check('collectibles itemized total 1242', totalCollectibles() === 1242, `got ${totalCollectibles()}`);
  check('stunts: 397 (130/202/40/25)', totalStunts() === 397 &&
    STUNT_KINDS.map((s) => s.total).join('/') === '130/202/40/25');
  // Note: SPEC §6 labels the total "175" but its own breakdown sums to 173
  // (72+23+22+20+15+14+7) — the user's arithmetic. The selftest asserts the
  // actual sum of the breakdown (173), not the label.
  check('robberies: 173 actual (72/23/22/20/15/14/7; spec label 175 is user arithmetic)', totalRobberies() === 173 &&
    ROBBERY_KINDS.map((r) => r.total).join('/') === '72/23/22/20/15/14/7');

  // 27-30. Fish, variants, achievements, phone.
  check('fish: 35 species', FISH.length === 35);
  check('weapon variants >= 130', VARIANTS.length >= 130, `got ${VARIANTS.length}`);
  check('achievements: 32', ACHIEVEMENTS.length === 32);
  check('phone: 10 apps', APPS.length === 10);

  // 31-33. Properties, profile, endings.
  check('safehouses 4; garages 15 (8 buy + 4 free + 3 bonus)',
    SAFEHOUSES.length === 4 && GARAGES.length === 15 &&
    buyableGarages().length === 8 && bonusGarages().length === 3 &&
    GARAGES.filter((g) => !g.buyable && !g.bonus).length === 4);
  check('criminal profile: 5 levels, Bab 10 names',
    PROFILES.length === 5 &&
    PROFILES.map((p) => p.name).join('|') === 'Professional|Hardened|Violent & Dangerous|Psycho|Irredeemable');
  check('endings: 4', ENDINGS.length === 4);

  // 34-35. Ending Good 1 + wallet cap.
  const good1 = decideEnding({ savings: 40000, relationship: 60, profileLevel: 2 });
  const notGood1 = decideEnding({ savings: 0, relationship: 60, profileLevel: 2 });
  check('Good Ending 1 reads BuckMe savings >= $40,000 (not cash)',
    good1.id === 'good1' && notGood1.id !== 'good1', `savings 40000 -> ${good1.id}; savings 0 -> ${notGood1.id}`);
  const swept = enforceWalletCap(25000, 0);
  check('wallet cap $20,000; excess sweeps to BuckMe',
    WALLET_MAX === 20000 && swept.cash === 20000 && swept.buckme === 5000 && swept.swept === 5000);

  // 36-37. HUD.
  const hud = hudCorners({
    player: { health: 80, maxHealth: 100, stamina: 60, focus: 70, oxygen: 100, diving: false, swimming: false, adrenaline: 0.6, relationship: 65 },
    economy: { cash: 15000, buckme: 30000 },
    police: { stars: 2, starState: 'White Solid', memory: { cctv: true, outfit: false, vehicle: true }, seenNow: true },
    weapon: { name: 'Girardi ES9', mag: 12, reserve: 30 },
    vehicle: { fuel: 20, health: 0.3 },
    profileName: 'Hardened',
    breakingPoint: false,
    cheatsActive: ['bodyarmor'],
  });
  check('HUD: four corners wired to live state',
    hud.health.regenCap === 50 && hud.vehicle.lowFuel === true && hud.vehicle.engineFailing === true &&
    hud.clues.cctv === true && hud.clues.face === true && hud.profile === 'Hardened' &&
    hud.buffs.bodyArmor === true && hud.cash === 15000 && hud.buckme === 30000);
  check('relationship labels Strained/Partners/In Sync/Bonnie & Clyde',
    relationshipLabel(20) === 'Strained' && relationshipLabel(40) === 'Partners' &&
    relationshipLabel(70) === 'In Sync' && relationshipLabel(90) === 'Bonnie & Clyde');

  // 38-39. Police & economy.
  check('police: star states 0-6; heatPerStar(3)=60; hitChanceAt bounded',
    STAR_STATES.length === 7 && heatPerStar(3) === 60 &&
    hitChanceAt(10, 3) >= 0.05 && hitChanceAt(10, 3) <= 0.9 && canSurrender(2) === true);
  check('economy: 3 money types, 5 fences, Yasmani launders 85%',
    MONEY_TYPES.length === 3 && FENCES.length === 5 &&
    launderMarked(1000, 'yasmani').clean === 850 && totalWealth({ cash: 100, buckme: 200, marked: 50 }) === 350);

  // 40-42. Events, gunshops, attributes.
  check('random events: 500+ combinations', totalEventCombinations() >= 500, `got ${totalEventCombinations()}`);
  check('gunshops: 24 shops, 6 expanded, 8 attachment categories',
    SHOPS.length === 24 && expandedCount() === 6 && ATTACHMENT_CATEGORIES.length === 8);
  check('attributes: 3, max level 5', ATTRIBUTES.length === 3 && MAX_LEVEL === 5 && levelFromXp(900) === 5);

  // 43-44. Mysteries & map meta.
  check('mysteries: 18 entries; UFO visible 02:00-05:00 only',
    MYSTERIES.length === 18 && ufoVisible(3) === true && ufoVisible(12) === false);
  check('map: 6 regions, 5 counties, 23 icons',
    REGIONS.length === 6 && COUNTIES.length === 5 && MAP_ICONS.length === 23);

  // 45-46. Totals + profile-name guard.
  check('content totals match COUNTS (91/69/245/61)',
    COUNTS.missions === 91 && COUNTS.weapons === 69 && COUNTS.vehicles === 245 && COUNTS.cheats === 61 &&
    MISSIONS.length === COUNTS.missions && VEHICLES.length === COUNTS.vehicles && CHEATS.length === COUNTS.cheats);
  check('profile names are Bab 10 (no Good/Neutral/Aggressive)',
    !PROFILES.some((p) => /^(Good|Neutral|Aggressive)$/.test(p.name)) &&
    profileFromChaos(10).name === 'Professional' && profileFromChaos(96).name === 'Irredeemable' &&
    breakingPoint(92) === true);

  const passed = checks.filter((c) => c.ok).length;
  const failed = checks.filter((c) => !c.ok);
  return { passed, failed: failed.length, total: checks.length, checks, failedNames: failed.map((f) => f.name) };
}

// Auto-run under node (window is undefined); in the browser main.js calls it.
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  const r = runSelfTest();
  for (const c of r.checks) console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? ` — ${c.detail}` : ''}`);
  console.log(`\nselftest: ${r.passed}/${r.total} passed`);
  if (r.failed > 0) console.log(`FAILED: ${r.failedNames.join('; ')}`);
  process.exitCode = r.failed > 0 ? 1 : 0;
}
