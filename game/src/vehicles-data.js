// vehicles-data.js — 245 vehicles, SPEC §23 + §24 + §27.
// [name, category, topSpeed km/h, price $]
// Bab 23 named 96, Bab 24 adds 26, Bab 27 brands add 123 = 245.
const RAW = [
  // ---- Bab 23: Supercars (4) ----
  ['Grotti Furia', 'supercar', 342, 2680000], ['Pegassi Tempesta', 'supercar', 338, 2420000],
  ['Pegassi Zorrusso', 'supercar', 350, 2950000], ['Truffade Thrax', 'supercar', 345, 2750000],
  // ---- Bab 23: Sports (12) ----
  ['Annis Elegy Retro', 'sports', 310, 950000], ['Bravado Banshee', 'sports', 305, 565000],
  ['Creado', 'sports', 298, 720000], ['Grotti Carbonizzare', 'sports', 312, 1180000],
  ['Grotti Itali GTO', 'sports', 330, 1980000], ['Invetero Coquette D10', 'sports', 315, 1320000],
  ['Karin Futo', 'sports', 285, 320000], ['Karin Sultan', 'sports', 290, 380000],
  ['Obey 8F Drafter', 'sports', 308, 890000], ['Pfister Comet S2 Cabrio', 'sports', 318, 1450000],
  ['PMP 700', 'sports', 302, 780000], ['Ubermacht Cypher', 'sports', 300, 690000],
  // ---- Bab 23: Sports Classics (5) ----
  ['Albany Manana', 'classic', 220, 120000], ['Declasse Mamba', 'classic', 265, 450000],
  ['Grotti Cheetah Classic', 'classic', 275, 620000], ['Mamba GT', 'classic', 270, 480000],
  ['Pegassi Infernus Classic', 'classic', 280, 720000],
  // ---- Bab 23: Muscle (13) ----
  ['Albany Buccaneer', 'muscle', 250, 180000], ['Bravado Buffalo STX', 'muscle', 272, 420000],
  ['Bravado Gauntlet', 'muscle', 268, 380000], ['Declasse Impaler LX', 'muscle', 262, 340000],
  ['Declasse Impaler SZ', 'muscle', 270, 410000], ['Declasse Sabre Turbo', 'muscle', 258, 310000],
  ['Declasse Tulip', 'muscle', 248, 260000], ['Declasse Tulip M-100', 'muscle', 255, 290000],
  ['Declasse Vigero', 'muscle', 252, 240000], ['Imponte Phoenix', 'muscle', 260, 320000],
  ['Imponte Ruiner', 'muscle', 254, 280000], ['Vapid Dominator 1967', 'muscle', 250, 300000],
  ['Vapid Dominator GTX', 'muscle', 275, 460000],
  // ---- Bab 23: Sedans & Coupes (5) ----
  ['Albany Emperor', 'sedan', 230, 150000], ['Karin Asterope GZ', 'sedan', 235, 170000],
  ['Karin Intruder', 'sedan', 232, 160000], ['Ubermacht Zion', 'sedan', 245, 210000],
  ['Vulcar Ingot', 'sedan', 215, 90000],
  // ---- Bab 23: SUVs (3) ----
  ['Bravado Aleutian', 'suv', 240, 380000], ['Gallivanter Baller', 'suv', 238, 350000],
  ['Lampadati Novak', 'suv', 242, 410000],
  // ---- Bab 23: Off-Road & Pickups (11) ----
  ['Annis Hellion', 'offroad', 225, 280000], ['Bravado Bison', 'offroad', 210, 140000],
  ['Canis Kamacho', 'offroad', 228, 260000], ['Canis Mesa', 'offroad', 218, 190000],
  ['Canis Seminole', 'offroad', 205, 120000], ['Karin Rebel', 'offroad', 215, 150000],
  ['Nagasaki Blazer', 'offroad', 190, 90000], ['Street Blazer', 'offroad', 195, 110000],
  ['Vapid Caracara', 'offroad', 232, 320000], ['Vapid Riata Classic', 'offroad', 208, 160000],
  ['Vapid Sandking', 'offroad', 230, 300000],
  // ---- Bab 23: Motorcycles & Cycles (13) ----
  ['Alvino V1', 'motorcycle', 260, 180000], ['Dinka Double-T', 'motorcycle', 275, 220000],
  ['Maibatsu Manchez', 'motorcycle', 240, 140000], ['Maibatsu Sanchez', 'motorcycle', 235, 120000],
  ['Nagasaki Carbon RS', 'motorcycle', 290, 320000], ['Pegassi Faggio', 'motorcycle', 150, 25000],
  ['Western Avarus', 'motorcycle', 250, 190000], ['Western Nightblade', 'motorcycle', 262, 210000],
  ['Western Sovereign', 'motorcycle', 255, 200000], ['Western Zombie', 'motorcycle', 248, 170000],
  ['BMX', 'motorcycle', 60, 800], ['Cruiser', 'motorcycle', 65, 1200], ['LomBike', 'motorcycle', 70, 1500],
  // ---- Bab 23: Boats & Watercraft (6) ----
  ['Airboat 09', 'boat', 120, 180000], ['BTN Delmar', 'boat', 140, 320000],
  ['Nagasaki Dinghy', 'boat', 110, 90000], ['Speedophile Seashark', 'boat', 130, 150000],
  ['Sailing Yacht', 'boat', 90, 1200000], ['Jet Ski Trailer', 'boat', 100, 45000],
  // ---- Bab 23: Planes & Helicopters (7) ----
  ['Buckingham Maverick', 'aircraft', 320, 1800000], ['Buckingham Shamal', 'aircraft', 950, 8500000],
  ['Mammoth Dodo', 'aircraft', 280, 950000], ['Nagasaki Buzzard', 'aircraft', 310, 2200000],
  ['Tethered Aerostat', 'aircraft', 60, 400000], ['Weazel News Helicopter', 'aircraft', 300, 1600000],
  ['Western Duster', 'aircraft', 260, 750000],
  // ---- Bab 23: Trains (4) ----
  ['DF8-90 Train', 'train', 180, 0], ['Freight Train', 'train', 160, 0],
  ['VCIA Tram', 'train', 90, 0], ['VCMM Metro', 'train', 120, 0],
  // ---- Bab 23: Commercial / Service / Utility / Emergency (13) ----
  ['Brute Excavator', 'commercial', 60, 0], ['Brute Rubble', 'commercial', 90, 0],
  ['Brute Stockade', 'commercial', 110, 0], ['Buffalo STX Pursuit', 'commercial', 280, 0],
  ['Dashound Bus', 'commercial', 110, 0], ['Declasse Burrito', 'commercial', 130, 45000],
  ['JoBuilt Packer', 'commercial', 100, 0], ['JoBuilt Phantom', 'commercial', 120, 0],
  ['Police Riot', 'commercial', 130, 0], ['Vapid Benson', 'commercial', 115, 0],
  ['Vapid Camper', 'commercial', 105, 60000], ['Vapid Ghost Car', 'commercial', 240, 0],
  ['Vapid Tow Truck', 'commercial', 110, 0],
  // ---- Bab 24: Sport & Supercar (3) ----
  ['Grotti Cheetah', 'supercar', 335, 2300000], ['Invetero Coquette', 'sports', 310, 1100000],
  ['Progen Emerus', 'supercar', 348, 2850000],
  // ---- Bab 24: Muscle (8) ----
  ['Albany Chino', 'muscle', 245, 220000], ['Bravado Gauntlet Classic Custom', 'muscle', 272, 480000],
  ['Bravado Gauntlet Hellfire', 'muscle', 278, 520000], ['Declasse Impaler', 'muscle', 258, 300000],
  ['Declasse Slamvan', 'muscle', 240, 260000], ['Declasse Vigero ZX Convertible', 'muscle', 265, 390000],
  ['Vapid Dominator ASP', 'muscle', 280, 510000], ['Vapid Dominator GT', 'muscle', 282, 540000],
  // ---- Bab 24: Sedan & Hatchback (6) ----
  ['Dinka Blista Compact', 'sedan', 225, 130000], ['Karin Stratum', 'sedan', 228, 145000],
  ['Obey Tailgater', 'sedan', 240, 190000], ['Albany Primo', 'sedan', 222, 125000],
  ['Albany Primo Custom', 'sedan', 232, 170000], ['Albany V-STR', 'sedan', 248, 230000],
  // ---- Bab 24: SUV & New (9) ----
  ['Pfister Astron', 'suv', 245, 420000], ['Gallivanter Baller ST', 'suv', 248, 460000],
  ['Bravado Dorado', 'suv', 238, 360000], ['Ganado', 'suv', 235, 340000],
  ['Bison 1800', 'offroad', 212, 150000], ['Bison 3800', 'offroad', 215, 165000],
  ["'95 Bison 900", 'offroad', 205, 130000], ["'82 Crawler", 'offroad', 200, 140000],
  ["'70 Reclaimer", 'offroad', 198, 150000],
  // ---- Bab 27: Benefactor (8) ----
  ['Benefactor Schafter', 'sedan', 250, 320000], ['Benefactor Schafter V12', 'sedan', 265, 480000],
  ['Benefactor Schafter LWB', 'sedan', 245, 380000], ['Benefactor Dubsta', 'suv', 235, 340000],
  ['Benefactor Dubsta 6x6', 'offroad', 225, 520000], ['Benefactor Serrano', 'suv', 230, 280000],
  ['Benefactor Streiter', 'sports', 275, 420000], ['Benefactor XLS', 'suv', 232, 300000],
  // ---- Bab 27: Dinka (8) ----
  ['Dinka Blista', 'sedan', 220, 110000], ['Dinka Blista Kanjo', 'sports', 250, 210000],
  ['Dinka Jester', 'sports', 305, 680000], ['Dinka Jester RR', 'sports', 315, 820000],
  ['Dinka Sugoi', 'sports', 295, 540000], ['Dinka Verus', 'offroad', 215, 240000],
  ['Dinka Enduro', 'motorcycle', 245, 150000], ['Dinka Thrust', 'motorcycle', 280, 260000],
  // ---- Bab 27: Emperor (4) ----
  ['Emperor ETR1', 'supercar', 340, 2600000], ['Emperor Habanero', 'suv', 228, 260000],
  ['Emperor Vectre', 'sports', 300, 720000], ['Emperor Raven', 'sports', 290, 610000],
  // ---- Bab 27: Lampadati (8) ----
  ['Lampadati Casco', 'classic', 255, 380000], ['Lampadati Cinquemila', 'sedan', 248, 360000],
  ['Lampadati Corsita', 'sports', 320, 1450000], ['Lampadati Felon', 'sedan', 242, 240000],
  ['Lampadati Felon GT', 'sports', 255, 310000], ['Lampadati Furore GT', 'sports', 300, 680000],
  ['Lampadati Michelli GT', 'classic', 260, 420000], ['Lampadati Toro', 'boat', 150, 480000],
  // ---- Bab 27: Obey (8) ----
  ['Obey 9F', 'sports', 312, 980000], ['Obey 9F Cabrio', 'sports', 308, 1050000],
  ['Obey Omnis', 'sports', 298, 720000], ['Obey Omnis e-GT', 'sports', 305, 890000],
  ['Obey Rocoto', 'suv', 232, 280000], ['Obey Tailgater S', 'sedan', 248, 260000],
  ['Obey I-Wagen', 'suv', 240, 380000], ['Obey Drafter', 'sports', 302, 760000],
  // ---- Bab 27: Ocelot (8) ----
  ['Ocelot Ardent', 'classic', 270, 520000], ['Ocelot F620', 'sports', 295, 640000],
  ['Ocelot Jackal', 'sports', 290, 580000], ['Ocelot Lynx', 'sports', 305, 780000],
  ['Ocelot Pariah', 'sports', 330, 1250000], ['Ocelot Penetrator', 'supercar', 335, 2100000],
  ['Ocelot XA-21', 'supercar', 342, 2450000], ['Ocelot Jugular', 'sports', 308, 820000],
  // ---- Bab 27: Maibatsu (8) ----
  ['Maibatsu Frogger', 'aircraft', 295, 1400000], ['Maibatsu Mule', 'commercial', 105, 55000],
  ['Maibatsu Penumbra', 'sports', 292, 540000], ['Maibatsu Penumbra FF', 'sports', 300, 680000],
  ['Maibatsu Kuruma', 'sports', 288, 520000], ['Maibatsu Manchez Scout', 'motorcycle', 242, 150000],
  ['Maibatsu MonstroCiti', 'offroad', 220, 280000], ['Maibatsu Outlaw', 'offroad', 232, 320000],
  // ---- Bab 27: Pfister (8) ----
  ['Pfister 811', 'supercar', 338, 2300000], ['Pfister Astron Custom', 'suv', 250, 480000],
  ['Pfister Comet', 'sports', 310, 920000], ['Pfister Comet S2', 'sports', 318, 1150000],
  ['Pfister Comet Safari', 'offroad', 285, 780000], ['Pfister Growler', 'sports', 312, 980000],
  ['Pfister Neon', 'sports', 300, 720000], ['Pfister Vacca', 'supercar', 325, 1800000],
  // ---- Bab 27: Ubermacht (8) ----
  ['Ubermacht Cylinder', 'sedan', 235, 200000], ['Ubermacht Oracle', 'sedan', 245, 260000],
  ['Ubermacht Oracle XS', 'sedan', 250, 310000], ['Ubermacht Rebla GTS', 'suv', 242, 400000],
  ['Ubermacht Rhinehart', 'sedan', 238, 280000], ['Ubermacht SC1', 'supercar', 335, 2200000],
  ['Ubermacht Sentinel', 'sedan', 240, 220000], ['Ubermacht Zion Classic', 'classic', 250, 300000],
  // ---- Bab 27: Declasse (10) ----
  ['Declasse Asea', 'sedan', 215, 90000], ['Declasse Rancher XL', 'suv', 220, 160000],
  ['Declasse Drift Tampa', 'muscle', 270, 420000], ['Declasse Granger', 'suv', 225, 220000],
  ['Declasse Moonbeam', 'classic', 210, 110000], ['Declasse Premier', 'sedan', 220, 120000],
  ['Declasse Sabre Turbo Custom', 'muscle', 268, 380000], ['Declasse Stallion', 'muscle', 258, 300000],
  ['Declasse Voodoo', 'classic', 240, 260000], ['Declasse Yosemite', 'muscle', 250, 280000],
  // ---- Bab 27: Schyster (6) ----
  ['Schyster Deviant', 'muscle', 272, 420000], ['Schyster Eon', 'sports', 295, 680000],
  ['Schyster Fusilade', 'sports', 290, 620000], ['Schyster PMP 600', 'sports', 300, 720000],
  ['Schyster Stratum', 'sedan', 230, 160000],
  // ---- Bab 27: Vapid (10) ----
  ['Vapid Blade', 'muscle', 255, 280000], ['Vapid Chino', 'classic', 245, 240000],
  ['Vapid Clique', 'muscle', 252, 260000], ['Vapid Hustler', 'muscle', 248, 250000],
  ['Vapid Ellie', 'muscle', 262, 340000], ['Vapid Flash GT', 'sports', 295, 620000],
  ['Vapid FMJ', 'supercar', 330, 1950000], ['Vapid Peyote', 'classic', 235, 220000],
  ['Vapid Sadler', 'offroad', 205, 130000], ['Vapid Stanier', 'sedan', 222, 140000],
  // ---- Bab 27: Bravado (10) ----
  ['Bravado Banshee 900R', 'sports', 315, 780000], ['Bravado Buffalo', 'muscle', 265, 360000],
  ['Bravado Buffalo S', 'muscle', 270, 400000], ['Bravado Gauntlet Classic', 'muscle', 262, 340000],
  ['Bravado Gresley', 'suv', 230, 280000], ['Bravado Greenwood', 'sedan', 232, 200000],
  ['Bravado Rat-Loader', 'muscle', 240, 220000], ['Bravado Rumpo', 'commercial', 125, 50000],
  ['Bravado Youga', 'commercial', 120, 45000], ['Bravado Verlierer', 'sports', 300, 720000],
  // ---- Bab 27: Maxwell (4) ----
  ['Maxwell Asbo', 'sedan', 210, 80000], ['Maxwell Vagrant', 'offroad', 225, 260000],
  ['Maxwell Ratel', 'offroad', 218, 240000],
  // ---- Bab 27: Nagasaki (6) ----
  ['Nagasaki BF400', 'motorcycle', 270, 210000], ['Nagasaki Chimera', 'motorcycle', 255, 180000],
  ['Nagasaki Shinobi', 'motorcycle', 285, 290000], ['Nagasaki Shotaro', 'motorcycle', 295, 340000],
  ['Nagasaki Street Blazer', 'offroad', 198, 120000], ['Nagasaki Blazer Lifeguard', 'offroad', 192, 130000],
  // ---- Bab 27: Boats & Yachts (11) ----
  ['Cigarette 42', 'boat', 155, 520000], ['Contender 35', 'boat', 145, 420000],
  ['Crownline 280', 'boat', 135, 380000], ['Azimut 77', 'boat', 110, 2400000],
  ['Lürssen 95', 'boat', 105, 4200000], ['Riva 68', 'boat', 120, 1800000],
  ['Squalo', 'boat', 150, 460000], ['Suntrap', 'boat', 125, 280000],
  ['Tropic', 'boat', 115, 220000], ['Marquis', 'boat', 100, 900000],
  ['Jetmax', 'boat', 160, 580000],
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
