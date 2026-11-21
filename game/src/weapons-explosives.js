// weapons-explosives.js — Explosives / throwables (4), SPEC §2d.
export const EXPLOSIVES = [
  { id: 'frag', name: 'Frag Grenade', kind: 'explosive', damage: 160, range: 8, radius: 7, capacity: 5, unlock: 'm21', variants: ['Standard Frag', 'Impact Frag'] },
  { id: 'sticky', name: 'Sticky Bomb', kind: 'explosive', damage: 190, range: 6, radius: 8, capacity: 5, unlock: 'm28', note: 'sticks to surfaces and vehicles' },
  { id: 'molotov', name: 'Molotov Cocktail', kind: 'explosive', damage: 90, range: 10, radius: 5, capacity: 5, unlock: 'm9', variants: ['Classic Molotov', 'Napalm Molotov'], note: 'also called Fire Bottle' },
  { id: 'smoke', name: 'Smoke Grenade', kind: 'explosive', damage: 0, range: 12, radius: 10, capacity: 5, unlock: 'm19', note: 'Smoke / Flashbang — blinds and conceals' },
];

export function explosiveById(id) {
  return EXPLOSIVES.find((e) => e.id === id) || null;
}
