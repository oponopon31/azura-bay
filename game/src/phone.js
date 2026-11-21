// phone.js — In-game smartphone, SPEC §13. 10 apps.
export const APPS = [
  { id: 'buckme', name: 'BuckMe', desc: 'Joint finance & savings (affects the ending).' },
  { id: 'whatup', name: 'WhatUp!', desc: 'Text messages & group chats with character contacts.' },
  { id: 'lifeinvader', name: 'Lifeinvader', desc: 'In-game social media: Leonida resident posts, viral clips of your actions, city livestreams.' },
  { id: 'eyefind', name: 'Eyefind', desc: 'Browser: parody sites, buy vehicles, latest news about your criminal actions.' },
  { id: 'music', name: 'Music / Radio', desc: 'Radio & podcasts anytime while walking with headphones.' },
  { id: 'camera', name: 'Camera & Wildlife Logbook', desc: 'Selfies, strange events, 170+ wildlife species.' },
  { id: 'rydeme', name: 'RydeMe', desc: 'Online rideshare / taxi = paid fast travel.' },
  { id: 'wink', name: 'Wink App', desc: 'Phone camera scans cars from afar (locked / alarm / GPS tracker).' },
  { id: 'scooterbros', name: 'Scooter Bros', desc: 'Register & manage up to 10 scooters / light motorbikes.' },
  { id: 'snapmatic', name: 'Snapmatic', desc: '10th phone photo app (linked to Camera + GTA 7 joke in the feed).' },
];

export function appNames() {
  return APPS.map((a) => a.name);
}

export function appById(id) {
  return APPS.find((a) => a.id === id) || null;
}

// Open the phone: D-Pad Up (also the cheat-entry key).
export const PHONE_KEY = 'D-Pad Up';
