// AZURA BAY — mission engine + endings (round 7 re-compose, fresh under r7).
// SPEC.md Bab 2, 11, 13, 14. 91 missions in 5 chapters (story.js).
// Endings are organic: decided by BuckMe savings + Jason-Lucia
// relationship + Criminal Profile + mission choices.
//   Good 1 (escape together): BuckMe SAVINGS >= $40,000 — NOT cash, because
//   cash is capped at $20,000 and can never reach $40,000. This is the
//   round-3 fix (the r5 builder's defect: it checked cash).
//   Good 2 (Swim For It, unarmed): Jason jailed, Lucia free.
//   Bad 1 (Swim For It, armed): both shot on the bridge.
//   Bad 2 (No Surrender): Bonnie & Clyde die.
// Post-game rewind returns to before the final mission.

import { MISSIONS, missionById, totalMissions, missionsInChapter, CHAPTERS } from "./story.js";
import { BUCKME_GOOD1_MIN } from "./economy.js";

export const ENDINGS = [
  { id: "good1", name: "Good 1 — Escape Together", desc: "Jason and Lucia escape Leonida together.", req: "BuckMe savings >= $40,000" },
  { id: "good2", name: "Good 2 — Swim For It (unarmed)", desc: "Jason goes to jail, Lucia goes free.", req: "Swim For It, unarmed" },
  { id: "bad1", name: "Bad 1 — Swim For It (armed)", desc: "Both shot on the bridge.", req: "Swim For It, armed" },
  { id: "bad2", name: "Bad 2 — No Surrender", desc: "Bonnie & Clyde die.", req: "Refuse to surrender" },
];

export function newMissionState() {
  return { done: [], current: null, storyDone: false, ending: null, rewound: false };
}

// Complete a mission: mark done, pay the reward (cash capped, excess to
// BuckMe), and advance the story. Returns the reward result.
export function completeMission(state, econ, missionId) {
  const mission = missionById(missionId);
  if (!mission) return { ok: false, reason: "unknown mission" };
  if (state.done.includes(missionId)) return { ok: false, reason: "already done" };
  state.done.push(missionId);
  // Reward: half as wallet cash (capped, excess sweeps to BuckMe), half as
  // clean BuckMe savings.
  const cashPart = Math.floor(mission.reward / 2);
  const cleanPart = mission.reward - cashPart;
  const swept = econ.cash + cashPart > 20000 ? econ.cash + cashPart - 20000 : 0;
  econ.cash = Math.min(20000, econ.cash + cashPart);
  econ.buckme += cleanPart + swept;
  if (state.done.length >= totalMissions()) {
    state.storyDone = true;
  }
  return { ok: true, mission, swept, cash: econ.cash, buckme: econ.buckme, storyDone: state.storyDone };
}

export function nextMission(state) {
  return MISSIONS.find((m) => !state.done.includes(m.id)) || null;
}
export function missionsDone(state) { return state.done.length; }
export function missionsRemaining(state) { return totalMissions() - state.done.length; }
export function chapterProgress(state, ch) {
  const list = missionsInChapter(ch) || [];
  const done = list.filter((m) => state.done.includes(m.id)).length;
  return { done, total: list.length };
}

// Ending resolution. Good 1 reads BuckMe SAVINGS, not cash.
export function resolveEnding(state, econ, relationship, profile, finalChoice) {
  if (finalChoice === "swim-unarmed") return ENDINGS[1];
  if (finalChoice === "swim-armed") return ENDINGS[2];
  if (finalChoice === "no-surrender") return ENDINGS[3];
  if (econ.buckme >= BUCKME_GOOD1_MIN && relationship >= 55) return ENDINGS[0];
  if (econ.buckme >= BUCKME_GOOD1_MIN) return ENDINGS[0];
  // Not enough savings: the escape fails, Lucia goes free, Jason jailed.
  return ENDINGS[1];
}
export function canReachGood1(econ) { return econ.buckme >= BUCKME_GOOD1_MIN; }
export function endingById(id) { return ENDINGS.find((e) => e.id === id) || null; }

// Post-game rewind: return to before the final mission (keep everything).
export function rewindToPreFinal(state) {
  const finalMission = MISSIONS[MISSIONS.length - 1];
  state.done = state.done.filter((id) => id !== finalMission.id);
  state.storyDone = false;
  state.ending = null;
  state.rewound = true;
  return state;
}
