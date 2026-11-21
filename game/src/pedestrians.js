// pedestrians.js — NPCs / pedestrians, SPEC §14 + §17.
// NPCs panic and report to police when they see a longarm carried openly.
// Eavesdropping: approach a crowd of NPCs to overhear conversations that leak
// valuable-item locations, secret room codes, or random events.
export const NPC_TYPES = ['civilian', 'tourist', 'worker', 'police', 'gang', 'homeless', 'jogger', 'driver'];

export function freshPedestrian(id, area, seed) {
  return { id, area, type: NPC_TYPES[seed % NPC_TYPES.length], panic: false, prone: false, afraid: false, fleeing: false };
}

// NPCs flee when a longarm is carried openly or shots are fired nearby.
export function fleeingCount(npcs) {
  return (npcs || []).filter((n) => n.fleeing).length;
}

export function panicCrowd(npcs, cause) {
  return (npcs || []).map((n) => ({ ...n, panic: true, fleeing: cause === 'longarm-open' || cause === 'gunfire' }));
}

// Eavesdropping: overhear a crowd for a tip (location, code or event).
export function eavesdrop(crowd) {
  if (!crowd || crowd.length < 2) return null;
  const tips = [
    'a valuable item stashed nearby',
    'a secret room code',
    'a random event location',
    'a fence buying marked bills',
  ];
  return tips[crowd.length % tips.length];
}
