// AZURA BAY — smartphone (round 7 re-compose, written fresh under r7).
// SPEC.md Bab 13. 10 apps. BuckMe (joint savings, decides Ending Good 1),
// WhatUp!, Lifeinvader, Eyefind (buy vehicles, crime news), Music/Radio,
// Camera & Wildlife Logbook (170+ species / 35 fish), RydeMe, Wink App,
// Scooter Bros, Snapmatic.

export const PHONE_APPS = [
  { id: "buckme", name: "BuckMe", desc: "Joint savings. Decides Ending Good 1.", icon: "bank" },
  { id: "whatup", name: "WhatUp!", desc: "Messaging with contacts.", icon: "chat" },
  { id: "lifeinvader", name: "Lifeinvader", desc: "Social feed.", icon: "social" },
  { id: "eyefind", name: "Eyefind", desc: "Buy vehicles, read crime news about yourself.", icon: "web" },
  { id: "music", name: "Music/Radio", desc: "Radio on foot via phone headphones.", icon: "music" },
  { id: "camera", name: "Camera & Wildlife Logbook", desc: "170+ species to photograph, 35 fish.", icon: "camera" },
  { id: "rydeme", name: "RydeMe", desc: "Call a ride.", icon: "car" },
  { id: "wink", name: "Wink App", desc: "Dating and contacts.", icon: "heart" },
  { id: "scooter", name: "Scooter Bros", desc: "Rent a scooter.", icon: "scooter" },
  { id: "snapmatic", name: "Snapmatic", desc: "Photo sharing.", icon: "photo" },
];

export const WILDLIFE_SPECIES = 170;
export const FISH_SPECIES = 35;

export function newPhoneState() {
  return {
    open: false, app: null, messages: [], photos: [],
    wildlifeFound: [], fishCaught: [],
  };
}
export function openApp(phone, appId) {
  const app = PHONE_APPS.find((a) => a.id === appId);
  if (!app) return null;
  phone.open = true;
  phone.app = appId;
  return app;
}
export function closePhone(phone) { phone.open = false; phone.app = null; return phone; }
export function appById(id) { return PHONE_APPS.find((a) => a.id === id) || null; }
export function totalApps() { return PHONE_APPS.length; }
export function logWildlife(phone, species) {
  if (!phone.wildlifeFound.includes(species)) phone.wildlifeFound.push(species);
  return phone.wildlifeFound.length;
}
export function catchFish(phone, species) {
  if (!phone.fishCaught.includes(species)) phone.fishCaught.push(species);
  return phone.fishCaught.length;
}
export function wildlifeProgress(phone) {
  return Math.round((phone.wildlifeFound.length / WILDLIFE_SPECIES) * 100);
}
export function fishProgress(phone) {
  return Math.round((phone.fishCaught.length / FISH_SPECIES) * 100);
}
