// AZURA BAY — selftest (round 7 re-compose, written fresh under r7).
// 42 tests. Run: node game/src/selftest.js  (or import { run } and call it).
// Asserts the SPEC counts: 91 missions, 69 weapons, 245 vehicles, 61 cheats,
// plus HUD corners, Good 1 BuckMe logic, wallet cap, cheat gating.

import { MISSIONS, totalMissions, missionsInChapter, protagonist, missionById } from "./story.js";
import { SIDEARMS, sidearmById } from "./weapons.js";
import { LONGARMS, LONGARM_SUBCOUNTS, totalLongarms } from "./weapons-longarms.js";
import { MELEE, totalMelee } from "./weapons-melee.js";
import { EXPLOSIVES, totalExplosives } from "./weapons-explosives.js";
import { SPECIAL, totalSpecial, totalWeapons } from "./weapons-special.js";
import { totalVehicles, NAMED } from "./vehicles-data.js";
import { totalCheats, CHEATS, cheatsByCategory, activateCheat, cheatsUnlocked } from "./cheats.js";
import { totalStrangers } from "./strangers.js";
import { totalStations, nextStation, stationById } from "./radio.js";
import { totalMapPoints, pointByName } from "./leonidamap.js";
import { totalCharacters } from "./characters.js";
import { totalCollectibles, totalCards, CARD_SETS } from "./collectibles.js";
import { totalStunts, totalRobberies } from "./stunts.js";
import { totalEvents } from "./events.js";
import { totalMysteries, ufoVisible } from "./mysteries.js";
import { totalFish } from "./fishing.js";
import { totalChallenges } from "./activities.js";
import { totalGunShops, expandedCount } from "./gunshops.js";
import { totalGoldVariants, totalVariants } from "./variants.js";
import { ENDINGS, resolveEnding, canReachGood1, completeMission, newMissionState } from "./missions.js";
import { newEconomy, enforceWalletCap, WALLET_MAX, BUCKME_GOOD1_MIN } from "./economy.js";
import { hudCorners, newHudState, relationshipBand } from "./hud.js";
import { PROFILE_LEVELS, STAR_STATES } from "./config.js";
import { newPhoneState, totalApps } from "./phone.js";
import { totalSafehouses, totalGarages, SAFEHOUSES, GARAGES } from "./properties.js";
import { XP_PER_LEVEL, levelForXp } from "./attributes.js";
import { newGame, gameStats } from "./main.js";

const results = [];
function test(name, fn) {
  try {
    fn();
    results.push({ name, ok: true });
  } catch (e) {
    results.push({ name, ok: false, error: e.message });
  }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || "assertion failed"); }
function eq(a, b, msg) { if (a !== b) throw new Error((msg || "") + " expected " + b + " got " + a); }

// ---- Missions (5) ----
test("missions total 91", () => eq(totalMissions(), 91));
test("missions per chapter 22/11/26/25/7", () => {
  eq(missionsInChapter(1).length, 22, "ch1 "); eq(missionsInChapter(2).length, 11, "ch2 ");
  eq(missionsInChapter(3).length, 26, "ch3 "); eq(missionsInChapter(4).length, 25, "ch4 ");
  eq(missionsInChapter(5).length, 7, "ch5 ");
});
test("missions unique titles", () => {
  const titles = new Set(MISSIONS.map((m) => m.title));
  eq(titles.size, 91);
});
test("missions reward total 385350", () => {
  const total = MISSIONS.reduce((s, m) => s + m.reward, 0);
  eq(total, 385350);
});
test("missions Lucia 43 Jason 48", () => {
  eq(MISSIONS.filter((m) => protagonist(m) === "Lucia").length, 43);
  eq(MISSIONS.filter((m) => protagonist(m) === "Jason").length, 48);
});

// ---- Weapons (7) ----
test("weapons total 69", () => eq(totalWeapons(), 69));
test("sidearms 16", () => eq(SIDEARMS.length, 16));
test("longarms 37", () => eq(totalLongarms(), 37));
test("melee 9", () => eq(totalMelee(), 9));
test("explosives 4", () => eq(totalExplosives(), 4));
test("sidearm exact names", () => {
  const names = SIDEARMS.map((w) => w.name);
  for (const n of ["Girardi ES9", "Klose K17", "Scorpio Nipper .38", "Fairview Kalinga .50", "Scorpio Akulus", "Girardi ES18", "Klose K17 MCD", "Coil Shocker", "Duke Mustang .357", "Hawk & Little Morgan"]) {
    assert(names.includes(n), "missing sidearm " + n);
  }
});
test("ES9 Jason start, K17 Lucia standard, damage", () => {
  const es9 = sidearmById("es9");
  const k17 = sidearmById("k17");
  eq(es9.name, "Girardi ES9");
  eq(k17.name, "Klose K17");
  assert(k17.desc.includes("Lucia"), "K17 is Lucia's standard");
  eq(sidearmById("kalinga50").damage, 55);
  eq(sidearmById("akulus").damage, 58);
  eq(LONGARM_SUBCOUNTS.smg, 8);
  eq(LONGARM_SUBCOUNTS.shotgun, 10);
  eq(LONGARM_SUBCOUNTS.rifle, 8);
  eq(LONGARM_SUBCOUNTS.lmg, 2);
  eq(LONGARM_SUBCOUNTS.sniper, 4);
  eq(LONGARM_SUBCOUNTS.heavy, 5);
});

// ---- Vehicles (2) ----
test("vehicles total 245", () => eq(totalVehicles(), 245));
test("vehicles named 122", () => eq(NAMED.length, 122));

// ---- Cheats (3) ----
test("cheats total 61", () => eq(totalCheats(), 61));
test("cheats per category 17/11/14/3/16", () => {
  eq(cheatsByCategory("player").length, 17);
  eq(cheatsByCategory("combat").length, 11);
  eq(cheatsByCategory("vehicle").length, 14);
  eq(cheatsByCategory("environment").length, 3);
  eq(cheatsByCategory("filter").length, 16);
});
test("cheat gating + disables trophies/save", () => {
  const locked = { storyDone: false };
  eq(activateCheat(locked, "money-250k").ok, false);
  const open = { storyDone: true };
  eq(activateCheat(open, "money-250k").ok, true);
  eq(open.trophiesDisabled, true);
  eq(open.saveDisabled, true);
});

// ---- Content counts (10) ----
test("strangers 13", () => eq(totalStrangers(), 13));
test("radio stations 24", () => eq(totalStations(), 24));
test("map points 27", () => eq(totalMapPoints(), 27));
test("characters 27", () => eq(totalCharacters(), 27));
test("collectibles 1242, cards 480, sets 18", () => {
  eq(totalCollectibles(), 1242);
  eq(totalCards(), 480);
  eq(CARD_SETS.length, 18);
});
test("stunts 397", () => eq(totalStunts(), 397));
test("events 500+", () => assert(totalEvents() >= 500, "events " + totalEvents()));
test("mysteries 20", () => eq(totalMysteries(), 20));
test("fish 35", () => eq(totalFish(), 35));
test("challenges 32", () => eq(totalChallenges(), 32));

// ---- Shops & variants (2) ----
test("gun shops 24, expanded 6", () => {
  eq(totalGunShops(), 24);
  eq(expandedCount(), 6);
});
test("variants 130+ (gold 69 + finishes)", () => {
  eq(totalGoldVariants(), 69);
  assert(totalVariants() >= 130, "variants " + totalVariants());
});

// ---- Endings & economy (5) ----
test("endings 4", () => eq(ENDINGS.length, 4));
test("Good 1 reads BuckMe not cash", () => {
  const econ = { cash: 20000, buckme: 40000, bank: 0 };
  eq(canReachGood1(econ), true);
  const ending = resolveEnding({}, econ, 60, "Professional", "escape");
  eq(ending.id, "good1");
});
test("Good 1 fails when BuckMe low even with max cash", () => {
  const econ = { cash: 20000, buckme: 10000, bank: 0 };
  eq(canReachGood1(econ), false);
  const ending = resolveEnding({}, econ, 60, "Professional", "escape");
  assert(ending.id !== "good1", "should not be good1");
});
test("wallet cap sweeps excess to BuckMe", () => {
  const e2 = newEconomy();
  e2.cash = 25000; e2.buckme = 1000;
  const s2 = enforceWalletCap(e2);
  eq(s2, 5000);
  eq(e2.cash, 20000);
  eq(e2.buckme, 6000);
});
test("mission reward sweeps wallet excess", () => {
  const econ = newEconomy();
  econ.cash = 19500; econ.buckme = 0;
  const ms = newMissionState();
  const m = MISSIONS[0];
  const r = completeMission(ms, econ, m.id);
  assert(r.ok, "complete ok");
  assert(econ.cash <= WALLET_MAX, "cash capped");
  assert(econ.buckme > 0, "excess went to BuckMe");
});

// ---- HUD (2) ----
test("HUD has 4 corners", () => {
  const g = newGame();
  const corners = hudCorners(g);
  assert(corners.topLeft && corners.bottomLeft && corners.topRight && corners.bottomRight, "4 corners");
  assert(corners.topLeft.health != null && corners.topLeft.stamina != null, "top-left health/stamina");
  assert(corners.topLeft.focus != null && corners.topLeft.oxygen != null, "top-left focus/oxygen");
  assert(corners.topLeft.adrenaline != null, "top-left adrenaline");
  assert(corners.bottomLeft.minimap === "rounded", "minimap rounded");
  assert(corners.bottomLeft.gpsRoute === "pink", "GPS pink");
  assert(corners.topRight.cash != null && corners.topRight.buckme != null, "top-right cash/BuckMe");
  assert(corners.topRight.walletCap === 20000, "wallet cap 20000");
  assert(corners.bottomRight.profile != null && corners.bottomRight.relationship != null, "bottom-right profile/relationship");
});
test("relationship bands", () => {
  eq(relationshipBand(10), "Strained");
  eq(relationshipBand(40), "Partners");
  eq(relationshipBand(70), "In Sync");
  eq(relationshipBand(90), "Bonnie & Clyde");
});

// ---- Profile / police / phone / properties / attributes (5) ----
test("Criminal Profile 5 levels", () => {
  eq(PROFILE_LEVELS.length, 5);
  assert(PROFILE_LEVELS.includes("Professional") && PROFILE_LEVELS.includes("Hardened"), "profile levels");
  assert(PROFILE_LEVELS.includes("Violent & Dangerous") && PROFILE_LEVELS.includes("Psycho"), "profile levels");
  assert(PROFILE_LEVELS.includes("Irredeemable"), "Irredeemable is the highest permanent level");
});
test("star states 5", () => {
  eq(STAR_STATES.length, 5);
  assert(STAR_STATES.includes("hollow") && STAR_STATES.includes("manhunt"), "star states");
});
test("phone apps 10", () => eq(totalApps(), 10));
test("safehouses 4 not purchasable, garages 15", () => {
  eq(totalSafehouses(), 4);
  assert(SAFEHOUSES.every((s) => s.price === 0), "safehouses free");
  eq(totalGarages(), 15);
  eq(GARAGES.filter((g) => g.price > 0).length, 8);
  eq(GARAGES.filter((g) => g.price === 0).length, 7);
});
test("attributes 4 levels + Level 5, xpPerLevel", () => {
  eq(XP_PER_LEVEL.length, 5);
  eq(XP_PER_LEVEL[0], 0); eq(XP_PER_LEVEL[4], 900);
  eq(levelForXp(0), 1); eq(levelForXp(900), 5); eq(levelForXp(250), 3);
});

// ---- Map coords (2) ----
test("Breakwater Quarry corrected coords", () => {
  const p = pointByName("Breakwater Quarry");
  eq(p.gx, -4462); eq(p.gy, -922);
});
test("Goose Key airfield separate from VCIA", () => {
  const g = pointByName("Goose Key");
  const v = pointByName("Vice City International Airport (VCIA)");
  assert(g.gx !== v.gx || g.gy !== v.gy, "Goose Key != VCIA");
});

// ---- Misc (2) ----
test("radio wheel cycles", () => {
  const next = nextStation("flash", 1);
  assert(next && next.id !== "flash", "next station");
  const prev = nextStation("flash", -1);
  assert(prev && prev.id === "wktt", "prev wraps to wktt");
});
test("UFO after 02:00 only", () => {
  assert(ufoVisible(150) === true, "02:30 visible");
  assert(ufoVisible(600) === false, "10:00 not visible");
  assert(ufoVisible(60) === false, "01:00 not visible");
});

// ---- Game boots (1) ----
test("game boots + stats", () => {
  const g = newGame();
  const s = gameStats(g);
  eq(s.missions, 91); eq(s.weapons, 69); eq(s.vehicles, 245); eq(s.cheats, 61);
  eq(s.mapPoints, 27);
});

export function run() {
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);
  for (const r of results) {
    console.log((r.ok ? "PASS" : "FAIL") + "  " + r.name + (r.ok ? "" : " — " + r.error));
  }
  console.log("---");
  console.log(passed + "/" + results.length + " passed");
  if (failed.length > 0) {
    console.log("FAILED: " + failed.map((f) => f.name).join(", "));
  }
  return { passed, total: results.length, failed: failed.map((f) => f.name) };
}

if (typeof process !== "undefined" && process.argv[1] && process.argv[1].endsWith("selftest.js")) {
  const { passed, total } = run();
  process.exit(passed === total ? 0 : 1);
}
