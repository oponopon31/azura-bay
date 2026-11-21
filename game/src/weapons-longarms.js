// AZURA BAY — longarms (round 7 re-compose).
// 37 longarms from SPEC.md section 2b.

export const LONGARM_SUBCOUNTS = { smg: 8, shotgun: 10, rifle: 8, lmg: 2, sniper: 4, heavy: 5 };
export const LONGARMS = [];

// SMG: id, name, damage, fireRate, range, handling, capacity, price, unlock
LONGARMS.push({ id: "micro-smg", name: "Micro SMG", sub: "smg", damage: 20, fireRate: 10, range: 30, handling: 85, capacity: 30, price: 1200, unlock: 10 });
LONGARMS.push({ id: "mac11", name: "MAC-11", sub: "smg", damage: 22, fireRate: 11, range: 28, handling: 78, capacity: 32, price: 1500, unlock: 15 });
LONGARMS.push({ id: "vatra", name: "BZI Vatra", sub: "smg", damage: 24, fireRate: 9, range: 32, handling: 80, capacity: 28, price: 1700, unlock: 22, desc: "Balkan SMG." });
LONGARMS.push({ id: "uw9", name: "UW9", sub: "smg", damage: 23, fireRate: 9.5, range: 34, handling: 82, capacity: 30, price: 1900, unlock: 28, desc: "Modern compact SMG." });
LONGARMS.push({ id: "peg9", name: "PEG-9", sub: "smg", damage: 21, fireRate: 10.5, range: 30, handling: 83, capacity: 32, price: 1600, unlock: 18, desc: "MP9 pattern SMG." });
LONGARMS.push({ id: "mp5", name: "MP5", sub: "smg", damage: 25, fireRate: 8.5, range: 38, handling: 86, capacity: 30, price: 2200, unlock: 30, desc: "Classic MP5, MP5K variant." });
LONGARMS.push({ id: "vom-smg", name: "Vom Feuer Military SMG", sub: "smg", damage: 26, fireRate: 8, range: 40, handling: 80, capacity: 32, price: 2400, unlock: 35, desc: "Military-issue SMG." });
LONGARMS.push({ id: "pd90", name: "ADB PD-90", sub: "smg", damage: 24, fireRate: 9, range: 36, handling: 84, capacity: 50, price: 2600, unlock: 40, desc: "High-capacity PDW." });
// ---- Shotguns (10) ----
LONGARMS.push({ id: "morland850", name: "Morland 850", sub: "shotgun", damage: 65, fireRate: 1.2, range: 18, handling: 70, capacity: 6, price: 1400, unlock: 12, desc: "Pump shotgun." });
LONGARMS.push({ id: "laird350", name: "Fortune & Son Laird 350", sub: "shotgun", damage: 70, fireRate: 1.0, range: 20, handling: 66, capacity: 5, price: 1800, unlock: 20, desc: "Double-barrel." });
LONGARMS.push({ id: "drifter", name: "Shrewsbury Drifter", sub: "shotgun", damage: 62, fireRate: 1.4, range: 16, handling: 74, capacity: 7, price: 1500, unlock: 16, desc: "Wandering pump gun." });
LONGARMS.push({ id: "hobo", name: "Shrewsbury Hobo", sub: "shotgun", damage: 58, fireRate: 1.6, range: 14, handling: 76, capacity: 6, price: 1100, unlock: 8, desc: "Backdoor Hobo variant." });
LONGARMS.push({ id: "longshot", name: "Mason & Keen Longshot", sub: "shotgun", damage: 68, fireRate: 1.1, range: 24, handling: 68, capacity: 6, price: 2100, unlock: 28, desc: "Long-barrel precision." });
LONGARMS.push({ id: "shortstraw", name: "Mason & Keen Shortstraw", sub: "shotgun", damage: 72, fireRate: 0.9, range: 12, handling: 62, capacity: 4, price: 2300, unlock: 32, desc: "Sawed-off power." });
LONGARMS.push({ id: "az1200", name: "Girardi AZ1200", sub: "shotgun", damage: 66, fireRate: 1.3, range: 18, handling: 72, capacity: 8, price: 2000, unlock: 26, desc: "Semi-auto shotgun." });
LONGARMS.push({ id: "super400", name: "Girardi Super400", sub: "shotgun", damage: 64, fireRate: 1.5, range: 18, handling: 75, capacity: 8, price: 1900, unlock: 24, desc: "Reliable semi-auto." });
LONGARMS.push({ id: "comshot", name: "Godwin Comshot 12", sub: "shotgun", damage: 60, fireRate: 1.8, range: 16, handling: 78, capacity: 10, price: 1700, unlock: 22, desc: "Combat shotgun." });
LONGARMS.push({ id: "kvga12", name: "Kozlov KVGA-12", sub: "shotgun", damage: 63, fireRate: 1.7, range: 16, handling: 73, capacity: 10, price: 1750, unlock: 30, desc: "Full-auto shotgun." });
// ---- Assault Rifles (8) ----
LONGARMS.push({ id: "kz59", name: "Kozlov KZ-59", sub: "rifle", damage: 38, fireRate: 6, range: 60, handling: 70, capacity: 30, price: 2600, unlock: 30, desc: "AK-47 pattern." });
LONGARMS.push({ id: "da556", name: "Duke Arms 556", sub: "rifle", damage: 36, fireRate: 6.5, range: 65, handling: 76, capacity: 30, price: 2800, unlock: 32, desc: "M4A1/M16 pattern." });
LONGARMS.push({ id: "compact-ar", name: "Compact Assault Rifle", sub: "rifle", damage: 34, fireRate: 7, range: 55, handling: 80, capacity: 30, price: 2400, unlock: 28, desc: "Short carbine." });
LONGARMS.push({ id: "heathen", name: "Hillinger Heathen", sub: "rifle", damage: 40, fireRate: 5.5, range: 62, handling: 72, capacity: 28, price: 3200, unlock: 38, desc: "Bullpup rifle." });
LONGARMS.push({ id: "fra", name: "ADB FRA", sub: "rifle", damage: 37, fireRate: 6.2, range: 64, handling: 74, capacity: 30, price: 2900, unlock: 36, desc: "Full-auto rifle." });
LONGARMS.push({ id: "vfg1", name: "Vom Feuer VF-G1", sub: "rifle", damage: 39, fireRate: 5.8, range: 66, handling: 75, capacity: 30, price: 3100, unlock: 40, desc: "Precision carbine." });
LONGARMS.push({ id: "w14", name: "Wortham W-14", sub: "rifle", damage: 42, fireRate: 5, range: 70, handling: 68, capacity: 25, price: 3500, unlock: 44, desc: "Heavy marksman rifle." });
LONGARMS.push({ id: "tmr", name: "Tactical Marksman Rifle", sub: "rifle", damage: 44, fireRate: 4.5, range: 75, handling: 70, capacity: 20, price: 3800, unlock: 46, desc: "Tactical DMR." });
// ---- LMG (2) ----
LONGARMS.push({ id: "cmg", name: "Combat Machine Gun", sub: "lmg", damage: 35, fireRate: 7.5, range: 58, handling: 55, capacity: 100, price: 4200, unlock: 48, desc: "Squad LMG." });
LONGARMS.push({ id: "m350", name: "ADB M350", sub: "lmg", damage: 37, fireRate: 7, range: 60, handling: 58, capacity: 100, price: 4500, unlock: 50, desc: "Heavy LMG." });
// ---- Sniper Rifles (4) ----
LONGARMS.push({ id: "ffsr", name: "Fairview FF-SR", sub: "sniper", damage: 90, fireRate: 0.8, range: 120, handling: 60, capacity: 5, price: 5000, unlock: 45, desc: "Bolt-action sniper." });
LONGARMS.push({ id: "hunt-sniper", name: "Hunting Sniper Rifle", sub: "sniper", damage: 85, fireRate: 0.9, range: 110, handling: 65, capacity: 5, price: 4200, unlock: 40, desc: "Hunting bolt-action." });
LONGARMS.push({ id: "duke-sniper", name: "Duke Assault Sniper", sub: "sniper", damage: 88, fireRate: 1.0, range: 115, handling: 62, capacity: 10, price: 5500, unlock: 48, desc: "Semi-auto sniper." });
LONGARMS.push({ id: "ff50", name: "Fairview FF-50", sub: "sniper", damage: 120, fireRate: 0.6, range: 140, capacity: 5, handling: 45, price: 8000, unlock: 55, desc: ".50 anti-materiel." });
// ---- Heavy Weapons (5) ----
LONGARMS.push({ id: "boomer", name: "Hillinger Boomer", sub: "heavy", damage: 100, fireRate: 0.7, range: 50, handling: 40, capacity: 4, price: 6000, unlock: 50, desc: "Grenade launcher." });
LONGARMS.push({ id: "glr40", name: "Deever Tech GLR40", sub: "heavy", damage: 110, fireRate: 0.6, range: 55, handling: 42, capacity: 6, price: 6500, unlock: 52, desc: "Advanced launcher." });
LONGARMS.push({ id: "hat", name: "Hauners H-AT", sub: "heavy", damage: 150, fireRate: 0.5, range: 80, handling: 35, capacity: 1, price: 9000, unlock: 58, desc: "RPG anti-vehicle." });
LONGARMS.push({ id: "flamethrower", name: "Flamethrower", sub: "heavy", damage: 45, fireRate: 8, range: 12, handling: 60, capacity: 100, price: 5000, unlock: 54, desc: "Fire stream." });
LONGARMS.push({ id: "speargun", name: "Speargun", sub: "heavy", damage: 70, fireRate: 1.0, range: 25, handling: 65, capacity: 1, price: 3000, unlock: 46, desc: "Underwater spear." });

export function longarmById(id) { return LONGARMS.find((w) => w.id === id) || null; }
export function longarmsBySub(sub) { return LONGARMS.filter((w) => w.sub === sub); }
export function longarmDps(w) { return Math.round(w.damage * w.fireRate); }
export function totalLongarms() { return LONGARMS.length; }
