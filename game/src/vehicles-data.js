// vehicles-data.js — 245 vehicles, SPEC §23 + §24 + §27.
// [name, category, topSpeed km/h, price $]
// Bab 23 named 96, Bab 24 adds 26, Bab 27 brands add 123 = 245.
const RAW = [
  // ---- Bab 23: Supercars (4) ----
  ['Velluto Furia', 'supercar', 342, 2680000], ['Aurelion Tempest', 'supercar', 338, 2420000],
  ['Aurelion Zephyr', 'supercar', 350, 2950000], ['Cassian Trax', 'supercar', 345, 2750000],
  // ---- Bab 23: Sports (12) ----
  ['Aldara Requiem Retro', 'sports', 310, 950000], ['Vantrell Wailer', 'sports', 305, 565000],
  ['Creado', 'sports', 298, 720000], ['Velluto Carbon', 'sports', 312, 1180000],
  ['Velluto Italia GTO', 'sports', 330, 1980000], ['Vantico Flirt D10', 'sports', 315, 1320000],
  ['Kavella Drift', 'sports', 285, 320000], ['Kavella Regent', 'sports', 290, 380000],
  ['Ostrum Octane Drafter', 'sports', 308, 890000], ['Prestivo Meteor S2 Cabrio', 'sports', 318, 1450000],
  ['PMX 700', 'sports', 302, 780000], ['Alpenwerk Cipher', 'sports', 300, 690000],
  // ---- Bab 23: Sports Classics (5) ----
  ['Aldermoor Sunset', 'classic', 220, 120000], ['Cascavel Anaconda', 'classic', 265, 450000],
  ['Velluto Gepardo Classic', 'classic', 275, 620000], ['Serpent GT', 'classic', 270, 480000],
  ['Aurelion Inferno Classic', 'classic', 280, 720000],
  // ---- Bab 23: Muscle (13) ----
  ['Aldermoor Corsair', 'muscle', 250, 180000], ['Vantrell Bison STX', 'muscle', 272, 420000],
  ['Vantrell Knuckle', 'muscle', 268, 380000], ['Cascavel Lancer LX', 'muscle', 262, 340000],
  ['Cascavel Lancer SZ', 'muscle', 270, 410000], ['Cascavel Cutlass Turbo', 'muscle', 258, 310000],
  ['Cascavel Rosa', 'muscle', 248, 260000], ['Cascavel Rosa M-100', 'muscle', 255, 290000],
  ['Cascavel Vigor', 'muscle', 252, 240000], ['Imperio Fenix', 'muscle', 260, 320000],
  ['Imperio Wrecker', 'muscle', 254, 280000], ['Vantara Dominion 1967', 'muscle', 250, 300000],
  ['Vantara Dominion GTX', 'muscle', 275, 460000],
  // ---- Bab 23: Sedans & Coupes (5) ----
  ['Aldermoor Sovereign', 'sedan', 230, 150000], ['Kavella Aster GZ', 'sedan', 235, 170000],
  ['Kavella Interloper', 'sedan', 232, 160000], ['Alpenwerk Sion', 'sedan', 245, 210000],
  ['Volterra Bullion', 'sedan', 215, 90000],
  // ---- Bab 23: SUVs (3) ----
  ['Vantrell Northwind', 'suv', 240, 380000], ['Galvano Highball', 'suv', 238, 350000],
  ['Luminari Nova', 'suv', 242, 410000],
  // ---- Bab 23: Off-Road & Pickups (11) ----
  ['Aldara Demon', 'offroad', 225, 280000], ['Vantrell Bisonte', 'offroad', 210, 140000],
  ['Cantera Kodiak', 'offroad', 228, 260000], ['Cantera Meseta', 'offroad', 218, 190000],
  ['Cantera Cypress', 'offroad', 205, 120000], ['Kavella Renegade', 'offroad', 215, 150000],
  ['Kazan Dune Runner', 'offroad', 190, 90000], ['Coast Blazer', 'offroad', 195, 110000],
  ['Vantara Cara', 'offroad', 232, 320000], ['Vantara Lariat Classic', 'offroad', 208, 160000],
  ['Vantara Dune King', 'offroad', 230, 300000],
  // ---- Bab 23: Motorcycles & Cycles (13) ----
  ['Alvino V1', 'motorcycle', 260, 180000], ['Denkai Twin-T', 'motorcycle', 275, 220000],
  ['Matsubara Ridge Runner', 'motorcycle', 240, 140000], ['Matsubara Dirt Fox', 'motorcycle', 235, 120000],
  ['Kazan Corsa RS', 'motorcycle', 290, 320000], ['Aurelion Città 50', 'motorcycle', 150, 25000],
  ['Westfield Revenant', 'motorcycle', 250, 190000], ['Westfield Nightfang', 'motorcycle', 262, 210000],
  ['Westfield Regent', 'motorcycle', 255, 200000], ['Westfield Reaper', 'motorcycle', 248, 170000],
  ['BMX', 'motorcycle', 60, 800], ['Cruiser', 'motorcycle', 65, 1200], ['LomBike', 'motorcycle', 70, 1500],
  // ---- Bab 23: Boats & Watercraft (6) ----
  ['Airboat 09', 'boat', 120, 180000], ['Costa Delmar', 'boat', 140, 320000],
  ['Kazan Tender', 'boat', 110, 90000], ['Aquajet Dart', 'boat', 130, 150000],
  ['Sailing Yacht', 'boat', 90, 1200000], ['PWC Trailer', 'boat', 100, 45000],
  // ---- Bab 23: Planes & Helicopters (7) ----
  ['Kingsley Falcon', 'aircraft', 320, 1800000], ['Kingsley Sirocco', 'aircraft', 950, 8500000],
  ['Titan Pelican', 'aircraft', 280, 950000], ['Kazan Kestrel', 'aircraft', 310, 2200000],
  ['Tethered Aerostat', 'aircraft', 60, 400000], ['Solmaris News Helicopter', 'aircraft', 300, 1600000],
  ['Westfield Cropmaster', 'aircraft', 260, 750000],
  // ---- Bab 23: Trains (4) ----
  ['DF8-90 Train', 'train', 180, 0], ['Freight Train', 'train', 160, 0],
  ['ABIA Tram', 'train', 90, 0], ['ABMM Metro', 'train', 120, 0],
  // ---- Bab 23: Commercial / Service / Utility / Emergency (13) ----
  ['Bruton Excavator', 'commercial', 60, 0], ['Bruton Debris', 'commercial', 90, 0],
  ['Bruton Vault', 'commercial', 110, 0], ['Vantrell Bison STX Pursuit', 'commercial', 280, 0],
  ['Solmaris City Bus', 'commercial', 110, 0], ['Cascavel Cargo Van', 'commercial', 130, 45000],
  ['Jovik Hauler', 'commercial', 100, 0], ['Jovik Ghost', 'commercial', 120, 0],
  ['ABPD Riot Van', 'commercial', 130, 0], ['Vantara Boxer', 'commercial', 115, 0],
  ['Vantara Camper', 'commercial', 105, 60000], ['Vantara Specter', 'commercial', 240, 0],
  ['Vantara Tow Truck', 'commercial', 110, 0],
  // ---- Bab 24: Sport & Supercar (3) ----
  ['Velluto Gepardo', 'supercar', 335, 2300000], ['Vantico Flirt', 'sports', 310, 1100000],
  ['Paragon Eos', 'supercar', 348, 2850000],
  // ---- Bab 24: Muscle (8) ----
  ['Aldermoor Laredo', 'muscle', 245, 220000], ['Vantrell Knuckle Classic Custom', 'muscle', 272, 480000],
  ['Vantrell Knuckle Hellfire', 'muscle', 278, 520000], ['Cascavel Lancer', 'muscle', 258, 300000],
  ['Cascavel Slammer', 'muscle', 240, 260000], ['Cascavel Vigor ZX Convertible', 'muscle', 265, 390000],
  ['Vantara Dominion ASP', 'muscle', 280, 510000], ['Vantara Dominion GT', 'muscle', 282, 540000],
  // ---- Bab 24: Sedan & Hatchback (6) ----
  ['Denkai Vista Compact', 'sedan', 225, 130000], ['Kavella Strata', 'sedan', 228, 145000],
  ['Ostrum Tourer', 'sedan', 240, 190000], ['Aldermoor Primero', 'sedan', 222, 125000],
  ['Aldermoor Primero Custom', 'sedan', 232, 170000], ['Aldermoor V-Sport', 'sedan', 248, 230000],
  // ---- Bab 24: SUV & New (9) ----
  ['Prestivo Astro', 'suv', 245, 420000], ['Galvano Highball ST', 'suv', 248, 460000],
  ['Vantrell Dorada', 'suv', 238, 360000], ['Ganado', 'suv', 235, 340000],
  ['Vantrell Bisonte 1800', 'offroad', 212, 150000], ['Vantrell Bisonte 3800', 'offroad', 215, 165000],
  ["'95 Bisonte 900", 'offroad', 205, 130000], ["'82 Crawler", 'offroad', 200, 140000],
  ["'70 Reclaimer", 'offroad', 198, 150000],
  // ---- Bab 27: Benavente (8) ----
  ['Benavente Chauffeur', 'sedan', 250, 320000], ['Benavente Chauffeur V12', 'sedan', 265, 480000],
  ['Benavente Chauffeur LWB', 'sedan', 245, 380000], ['Benavente Brutus', 'suv', 235, 340000],
  ['Benavente Brutus 6x6', 'offroad', 225, 520000], ['Benavente Sevillano', 'suv', 230, 280000],
  ['Benavente Strider', 'sports', 275, 420000], ['Benavente XL', 'suv', 232, 300000],
  // ---- Bab 27: Denkai (8) ----
  ['Denkai Vista', 'sedan', 220, 110000], ['Denkai Vista R', 'sports', 250, 210000],
  ['Denkai Joker', 'sports', 305, 680000], ['Denkai Joker RR', 'sports', 315, 820000],
  ['Denkai Sugo', 'sports', 295, 540000], ['Denkai Veritas', 'offroad', 215, 240000],
  ['Denkai Enduro', 'motorcycle', 245, 150000], ['Denkai Throttle', 'motorcycle', 280, 260000],
  // ---- Bab 27: Regalis (4) ----
  ['Regalis Veloce R1', 'supercar', 340, 2600000], ['Regalis Poblano', 'suv', 228, 260000],
  ['Regalis Strada', 'sports', 300, 720000], ['Regalis Corvo', 'sports', 290, 610000],
  // ---- Bab 27: Luminari (8) ----
  ['Luminari Elmo', 'classic', 255, 380000], ['Luminari Cinque', 'sedan', 248, 360000],
  ['Luminari Corsa', 'sports', 320, 1450000], ['Luminari Bandit', 'sedan', 242, 240000],
  ['Luminari Bandit GT', 'sports', 255, 310000], ['Luminari Furia GT', 'sports', 300, 680000],
  ['Luminari Michel GT', 'classic', 260, 420000], ['Luminari Orca', 'boat', 150, 480000],
  // ---- Bab 27: Ostrum (8) ----
  ['Ostrum R9', 'sports', 312, 980000], ['Ostrum R9 Cabrio', 'sports', 308, 1050000],
  ['Ostrum Atlas', 'sports', 298, 720000], ['Ostrum Atlas e-GT', 'sports', 305, 890000],
  ['Ostrum Rocca', 'suv', 232, 280000], ['Ostrum Tourer S', 'sedan', 248, 260000],
  ['Ostrum E-Wagen', 'suv', 240, 380000], ['Ostrum Draft GT', 'sports', 302, 760000],
  // ---- Bab 27: Oncilla (8) ----
  ['Oncilla Blaze', 'classic', 270, 520000], ['Oncilla F6', 'sports', 295, 640000],
  ['Oncilla Lobo', 'sports', 290, 580000], ['Oncilla Puma', 'sports', 305, 780000],
  ['Oncilla Outcast', 'sports', 330, 1250000], ['Oncilla Piercer', 'supercar', 335, 2100000],
  ['Oncilla X-21', 'supercar', 342, 2450000], ['Oncilla Fang', 'sports', 308, 820000],
  // ---- Bab 27: Matsubara (8) ----
  ['Matsubara Treefrog', 'aircraft', 295, 1400000], ['Matsubara Burro', 'commercial', 105, 55000],
  ['Matsubara Eclipse', 'sports', 292, 540000], ['Matsubara Eclipse FF', 'sports', 300, 680000],
  ['Matsubara Kuru', 'sports', 288, 520000], ['Matsubara Ridge Runner Scout', 'motorcycle', 242, 150000],
  ['Matsubara Bigfoot', 'offroad', 220, 280000], ['Matsubara Desperado', 'offroad', 232, 320000],
  // ---- Bab 27: Prestivo (8) ----
  ['Prestivo Octane', 'supercar', 338, 2300000], ['Prestivo Astro Custom', 'suv', 250, 480000],
  ['Prestivo Meteor', 'sports', 310, 920000], ['Prestivo Meteor S2', 'sports', 318, 1150000],
  ['Prestivo Meteor Safari', 'offroad', 285, 780000], ['Prestivo Howler', 'sports', 312, 980000],
  ['Prestivo Volt', 'sports', 300, 720000], ['Prestivo Bull', 'supercar', 325, 1800000],
  // ---- Bab 27: Alpenwerk (8) ----
  ['Alpenwerk Kessel', 'sedan', 235, 200000], ['Alpenwerk Seher', 'sedan', 245, 260000],
  ['Alpenwerk Seher XS', 'sedan', 250, 310000], ['Alpenwerk Rebell GTS', 'suv', 242, 400000],
  ['Alpenwerk Rhein', 'sedan', 238, 280000], ['Alpenwerk S1', 'supercar', 335, 2200000],
  ['Alpenwerk Warden', 'sedan', 240, 220000], ['Alpenwerk Sion Classic', 'classic', 250, 300000],
  // ---- Bab 27: Cascavel (10) ----
  ['Cascavel Brisa', 'sedan', 215, 90000], ['Cascavel Ranchero XL', 'suv', 220, 160000],
  ['Cascavel Drift GT', 'muscle', 270, 420000], ['Cascavel Grange', 'suv', 225, 220000],
  ['Cascavel Lunara', 'classic', 210, 110000], ['Cascavel Primera', 'sedan', 220, 120000],
  ['Cascavel Cutlass Turbo Custom', 'muscle', 268, 380000], ['Cascavel Palomino', 'muscle', 258, 300000],
  ['Cascavel Hoodoo', 'classic', 240, 260000], ['Cascavel Sequoia', 'muscle', 250, 280000],
  // ---- Bab 27: Sable (6) ----
  ['Sable Defiant', 'muscle', 272, 420000], ['Sable Era', 'sports', 295, 680000],
  ['Sable Barrage', 'sports', 290, 620000], ['Sable PMX 600', 'sports', 300, 720000],
  ['Sable Strata', 'sedan', 230, 160000],
  // ---- Bab 27: Vantara (10) ----
  ['Vantara Razor', 'muscle', 255, 280000], ['Vantara Cruiser', 'classic', 245, 240000],
  ['Vantara Crew', 'muscle', 252, 260000], ['Vantara Grinder', 'muscle', 248, 250000],
  ['Vantara Elle', 'muscle', 262, 340000], ['Vantara Flare GT', 'sports', 295, 620000],
  ['Vantara Jacket', 'supercar', 330, 1950000], ['Vantara Cactus', 'classic', 235, 220000],
  ['Vantara Saddle', 'offroad', 205, 130000], ['Vantara Stanley', 'sedan', 222, 140000],
  // ---- Bab 27: Vantrell (10) ----
  ['Vantrell Wailer 900R', 'sports', 315, 780000], ['Vantrell Bison', 'muscle', 265, 360000],
  ['Vantrell Bison S', 'muscle', 270, 400000], ['Vantrell Knuckle Classic', 'muscle', 262, 340000],
  ['Vantrell Greystone', 'suv', 230, 280000], ['Vantrell Greenfield', 'sedan', 232, 200000],
  ['Vantrell Rat Rod', 'muscle', 240, 220000], ['Vantrell Rumba', 'commercial', 125, 50000],
  ['Vantrell Yuga', 'commercial', 120, 45000], ['Vantrell Veloce', 'sports', 300, 720000],
  // ---- Bab 27: Maxfield (4) ----
  ['Maxfield Riff', 'sedan', 210, 80000], ['Maxfield Vagabond', 'offroad', 225, 260000],
  ['Maxfield Badger', 'offroad', 218, 240000],
  // ---- Bab 27: Kazan (6) ----
  ['Kazan RF400', 'motorcycle', 270, 210000], ['Kazan Hydra', 'motorcycle', 255, 180000],
  ['Kazan Ronin', 'motorcycle', 285, 290000], ['Kazan Shogun', 'motorcycle', 295, 340000],
  ['Kazan Coast Blazer', 'offroad', 198, 120000], ['Kazan Lifeguard', 'offroad', 192, 130000],
  // ---- Bab 27: Boats & Yachts (11) ----
  ['Vela 42', 'boat', 155, 520000], ['Marlin 35', 'boat', 145, 420000],
  ['Crestline 280', 'boat', 135, 380000], ['Azura 77', 'boat', 110, 2400000],
  ['Lumina 95', 'boat', 105, 4200000], ['Riviera 68', 'boat', 120, 1800000],
  ['Mako', 'boat', 150, 460000], ['Sun Chaser', 'boat', 125, 280000],
  ['Tropica', 'boat', 115, 220000], ['Monarch', 'boat', 100, 900000],
  ['Jetstream', 'boat', 160, 580000],
];

export const VEHICLES = RAW.map(([name, category, topSpeed, price], i) => ({
  id: 'v' + (i + 1), name, category, topSpeed, price,
}));

export function vehiclesByCategory(category) {
  return VEHICLES.filter((v) => v.category === category);
}

export function fastestInCategory(category) {
  const list = vehiclesByCategory(category);
  return list.reduce((best, v) => (v.topSpeed > best.topSpeed ? v : best), list[0]);
}

export function cheapestInCategory(category) {
  const list = vehiclesByCategory(category).filter((v) => v.price > 0);
  return list.reduce((best, v) => (v.price < best.price ? v : best), list[0]);
}

export function vehicleById(id) {
  return VEHICLES.find((v) => v.id === id) || null;
}
