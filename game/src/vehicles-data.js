// vehicles-data.js — The 240+ vehicle database (SPEC Bab 23 + Bab 24 + Bab 27).
// 122 models are NAMED in the spec (Bab 23 categories + Bab 24's 26 extra);
// Bab 27 adds vehicles per class from named brands (Benefactor, Dinka,
// Emperor, Lampadati, Obey, Ocelot, Maibatsu, Pfister, Ubermacht, Declasse,
// Schyster, Vapid, Bravado, Maxwell, Nagasaki; boats Cigarette / Contender /
// Crownline; yachts Azimut / Lürssen / Riva) — those entries are flagged
// `generated: true` because the spec gives brands, not model names.
// Each entry: id, name, brand, cat, cls (mesh/handling class from
// CAR_CLASSES), topSpeed (km/h), price ($), seats, named.
// resolve(name) is what vehicles.js calls: it accepts a model name
// ("Pegassi Tempesta") or a CAR_CLASSES key ("sedan") and returns
// {cls, name, model} — the mesh class + the display name.

const V = (id, name, brand, cat, cls, topSpeed, price, seats, named = true) =>
  ({ id, name, brand, cat, cls, topSpeed, price, seats, named });

export const VEHICLES = [
  // ---- Supercars (Bab 23, 4 named) ----
  V('furia', 'Grotti Furia', 'Grotti', 'supercar', 'coupe', 342, 1480000, 2),
  V('tempesta', 'Pegassi Tempesta', 'Pegassi', 'supercar', 'coupe', 338, 1320000, 2),
  V('zorrusso', 'Pegassi Zorrusso', 'Pegassi', 'supercar', 'coupe', 350, 1925000, 2),
  V('thrax', 'Truffade Thrax', 'Truffade', 'supercar', 'coupe', 345, 2325000, 2),
  // ---- Sports (Bab 23, 12 named) ----
  V('elegyretro', 'Annis Elegy Retro', 'Annis', 'sports', 'coupe', 298, 204000, 2),
  V('banshee', 'Bravado Banshee', 'Bravado', 'sports', 'coupe', 305, 138000, 2),
  V('creado', 'Creado', 'Creado', 'sports', 'coupe', 285, 96000, 2),
  V('carbonizzare', 'Grotti Carbonizzare', 'Grotti', 'sports', 'coupe', 312, 268000, 2),
  V('italigto', 'Grotti Itali GTO', 'Grotti', 'sports', 'coupe', 318, 289000, 2),
  V('coquetted10', 'Invetero Coquette D10', 'Invetero', 'sports', 'coupe', 310, 256000, 2),
  V('futo', 'Karin Futo', 'Karin', 'sports', 'coupe', 262, 32000, 2),
  V('sultan', 'Karin Sultan', 'Karin', 'sports', 'sedan', 278, 48000, 4),
  V('drafter', 'Obey 8F Drafter', 'Obey', 'sports', 'coupe', 302, 212000, 2),
  V('comets2', 'Pfister Comet S2 Cabrio', 'Pfister', 'sports', 'coupe', 308, 198000, 2),
  V('pmp700', 'PMP 700', 'PMP', 'sports', 'coupe', 296, 176000, 2),
  V('cypher', 'Ubermacht Cypher', 'Ubermacht', 'sports', 'coupe', 300, 184000, 2),
  // ---- Sports Classics (Bab 23, 5 named) ----
  V('manana', 'Albany Manana', 'Albany', 'sportsclassic', 'sedan', 198, 18000, 4),
  V('mamba', 'Declasse Mamba', 'Declasse', 'sportsclassic', 'coupe', 272, 86000, 2),
  V('cheetahclassic', 'Grotti Cheetah Classic', 'Grotti', 'sportsclassic', 'coupe', 288, 142000, 2),
  V('mambagt', 'Mamba GT', 'Mamba', 'sportsclassic', 'coupe', 276, 92000, 2),
  V('infernusclassic', 'Pegassi Infernus Classic', 'Pegassi', 'sportsclassic', 'coupe', 292, 168000, 2),
  // ---- Muscle Cars (Bab 23, 13 incl. both Dominators) ----
  V('buccaneer', 'Albany Buccaneer', 'Albany', 'muscle', 'coupe', 268, 42000, 2),
  V('buffalostx', 'Bravado Buffalo STX', 'Bravado', 'muscle', 'sedan', 282, 64000, 4),
  V('gauntlet', 'Bravado Gauntlet', 'Bravado', 'muscle', 'coupe', 276, 52000, 2),
  V('impalerlx', 'Declasse Impaler LX', 'Declasse', 'muscle', 'coupe', 274, 48000, 2),
  V('impalersz', 'Declasse Impaler SZ', 'Declasse', 'muscle', 'coupe', 280, 56000, 2),
  V('sabre', 'Declasse Sabre Turbo', 'Declasse', 'muscle', 'coupe', 272, 44000, 2),
  V('tulip', 'Declasse Tulip', 'Declasse', 'muscle', 'coupe', 262, 36000, 2),
  V('tulipm100', 'Declasse Tulip M-100', 'Declasse', 'muscle', 'coupe', 266, 42000, 2),
  V('vigero', 'Declasse Vigero', 'Declasse', 'muscle', 'coupe', 270, 46000, 2),
  V('phoenix', 'Imponte Phoenix', 'Imponte', 'muscle', 'coupe', 278, 54000, 2),
  V('ruiner', 'Imponte Ruiner', 'Imponte', 'muscle', 'coupe', 274, 48000, 2),
  V('dominator67', 'Vapid Dominator (1967)', 'Vapid', 'muscle', 'coupe', 272, 58000, 2),
  V('dominatorgtx', 'Vapid Dominator GTX', 'Vapid', 'muscle', 'coupe', 284, 72000, 2),
  // ---- Sedans & Coupes (Bab 23, 5 named) ----
  V('emperor', 'Albany Emperor', 'Albany', 'sedan', 'sedan', 232, 24000, 4),
  V('asteropegz', 'Karin Asterope GZ', 'Karin', 'sedan', 'sedan', 246, 34000, 4),
  V('intruder', 'Karin Intruder', 'Karin', 'sedan', 'sedan', 248, 36000, 4),
  V('zion', 'Ubermacht Zion', 'Ubermacht', 'sedan', 'coupe', 268, 52000, 2),
  V('ingot', 'Vulcar Ingot', 'Vulcar', 'sedan', 'sedan', 226, 21000, 4),
  // ---- SUVs (Bab 23, 3 named) ----
  V('aleutian', 'Bravado Aleutian', 'Bravado', 'suv', 'suv', 252, 68000, 5),
  V('baller', 'Gallivanter Baller', 'Gallivanter', 'suv', 'suv', 248, 72000, 5),
  V('novak', 'Lampadati Novak', 'Lampadati', 'suv', 'suv', 258, 88000, 5),
  // ---- Off-Road & Pickups (Bab 23, 11 named) ----
  V('hellion', 'Annis Hellion', 'Annis', 'offroad', 'suv', 242, 46000, 4),
  V('bison', 'Bravado Bison', 'Bravado', 'offroad', 'truck', 218, 32000, 3),
  V('kamacho', 'Canis Kamacho', 'Canis', 'offroad', 'truck', 236, 54000, 4),
  V('mesa', 'Canis Mesa', 'Canis', 'offroad', 'suv', 228, 42000, 4),
  V('seminole', 'Canis Seminole', 'Canis', 'offroad', 'suv', 224, 38000, 5),
  V('rebel', 'Karin Rebel', 'Karin', 'offroad', 'truck', 222, 30000, 2),
  V('blazer', 'Nagasaki Blazer', 'Nagasaki', 'offroad', 'suv', 208, 26000, 2),
  V('streetblazer', 'Street Blazer', 'Street', 'offroad', 'suv', 212, 28000, 2),
  V('caracara', 'Vapid Caracara', 'Vapid', 'offroad', 'truck', 244, 58000, 4),
  V('riata', 'Vapid Riata Classic', 'Vapid', 'offroad', 'truck', 226, 40000, 2),
  V('sandking', 'Vapid Sandking', 'Vapid', 'offroad', 'truck', 238, 62000, 4),
  // ---- Motorcycles & Cycles (Bab 23, 13 named) ----
  V('alvino', 'Alvino V1', 'Alvino', 'motorcycle', 'coupe', 288, 64000, 1),
  V('doublet', 'Dinka Double-T', 'Dinka', 'motorcycle', 'coupe', 292, 58000, 2),
  V('manchez', 'Maibatsu Manchez', 'Maibatsu', 'motorcycle', 'coupe', 232, 24000, 2),
  V('sanchez', 'Maibatsu Sanchez', 'Maibatsu', 'motorcycle', 'coupe', 228, 22000, 2),
  V('carbonrs', 'Nagasaki Carbon RS', 'Nagasaki', 'motorcycle', 'coupe', 296, 72000, 1),
  V('faggio', 'Pegassi Faggio', 'Pegassi', 'motorcycle', 'coupe', 148, 6000, 2),
  V('avarus', 'Western Avarus', 'Western', 'motorcycle', 'coupe', 262, 38000, 2),
  V('nightblade', 'Western Nightblade', 'Western', 'motorcycle', 'coupe', 272, 46000, 2),
  V('sovereign', 'Western Sovereign', 'Western', 'motorcycle', 'coupe', 258, 42000, 2),
  V('zombie', 'Western Zombie', 'Western', 'motorcycle', 'coupe', 266, 44000, 2),
  V('bmx', 'BMX', 'BMX', 'motorcycle', 'coupe', 42, 800, 1),
  V('cruiser', 'Cruiser', 'Cruiser', 'motorcycle', 'coupe', 38, 600, 1),
  V('lombike', 'LomBike', 'LomBike', 'motorcycle', 'coupe', 45, 1200, 1),
  // ---- Boats & Watercraft (Bab 23, 6 named) ----
  V('airboat09', 'Airboat 09', 'Airboat', 'boat', 'truck', 96, 42000, 4),
  V('delmar', 'BTN Delmar', 'BTN', 'boat', 'truck', 128, 68000, 4),
  V('dinghy', 'Nagasaki Dinghy', 'Nagasaki', 'boat', 'truck', 118, 36000, 4),
  V('seashark', 'Speedophile Seashark', 'Speedophile', 'boat', 'coupe', 132, 18000, 2),
  V('sailyacht', 'Sailing Yacht', 'Sailing', 'boat', 'truck', 62, 240000, 6),
  V('jetskitrailer', 'Jet Ski Trailer', 'Jet Ski', 'boat', 'truck', 0, 8000, 0),
  // ---- Planes, Helicopters & Trains (Bab 23, 11 named) ----
  V('maverick', 'Buckingham Maverick', 'Buckingham', 'aircraft', 'truck', 268, 780000, 4),
  V('shamal', 'Buckingham Shamal', 'Buckingham', 'aircraft', 'truck', 620, 2400000, 8),
  V('dodo', 'Mammoth Dodo', 'Mammoth', 'aircraft', 'truck', 240, 320000, 4),
  V('buzzard', 'Nagasaki Buzzard', 'Nagasaki', 'aircraft', 'truck', 252, 680000, 4),
  V('aerostat', 'Tethered Aerostat', 'Aerostat', 'aircraft', 'truck', 24, 120000, 2),
  V('newsheli', 'Weazel News Helicopter', 'Weazel', 'aircraft', 'truck', 244, 520000, 4),
  V('duster', 'Western Duster', 'Western', 'aircraft', 'truck', 210, 180000, 2),
  V('df890', 'DF8-90 Train', 'DF8-90', 'train', 'truck', 148, 0, 120),
  V('freight', 'Freight Train', 'Freight', 'train', 'truck', 132, 0, 0),
  V('vciatram', 'VCIA Tram', 'VCIA', 'train', 'truck', 68, 0, 60),
  V('vcmmmetro', 'VCMM Metro', 'VCMM', 'train', 'truck', 96, 0, 200),
  // ---- Commercial, Service, Utility & Emergency (Bab 23, 13 named) ----
  V('excavator', 'Brute Excavator', 'Brute', 'commercial', 'truck', 48, 120000, 1),
  V('rubble', 'Brute Rubble', 'Brute', 'commercial', 'truck', 96, 68000, 2),
  V('stockade', 'Brute Stockade', 'Brute', 'commercial', 'truck', 128, 88000, 2),
  V('buffalopursuit', 'Buffalo STX Pursuit', 'Bravado', 'emergency', 'police', 292, 0, 4),
  V('dashound', 'Dashound Bus', 'Dashound', 'commercial', 'van', 128, 48000, 24),
  V('burrito', 'Declasse Burrito', 'Declasse', 'commercial', 'van', 168, 22000, 4),
  V('packer', 'JoBuilt Packer', 'JoBuilt', 'commercial', 'truck', 132, 56000, 2),
  V('phantom', 'JoBuilt Phantom', 'JoBuilt', 'commercial', 'truck', 138, 72000, 2),
  V('riot', 'Police Riot', 'Police', 'emergency', 'truck', 142, 0, 8),
  V('benson', 'Vapid Benson', 'Vapid', 'commercial', 'truck', 136, 52000, 2),
  V('camper', 'Vapid Camper', 'Vapid', 'commercial', 'van', 148, 28000, 4),
  V('ghostcar', 'Vapid Ghost Car', 'Vapid', 'commercial', 'sedan', 168, 34000, 4),
  V('towtruck', 'Vapid Tow Truck', 'Vapid', 'commercial', 'truck', 142, 46000, 2),
  // ---- Bab 24: 26 extra named models ----
  V('cheetah', 'Grotti Cheetah', 'Grotti', 'supercar', 'coupe', 322, 420000, 2),
  V('coquette', 'Invetero Coquette', 'Invetero', 'sports', 'coupe', 306, 148000, 2),
  V('emerus', 'Progen Emerus', 'Progen', 'supercar', 'coupe', 348, 2750000, 2),
  V('chino', 'Albany Chino', 'Albany', 'muscle', 'coupe', 264, 38000, 2),
  V('gauntletcc', 'Bravado Gauntlet Classic Custom', 'Bravado', 'muscle', 'coupe', 280, 68000, 2),
  V('gauntlethell', 'Bravado Gauntlet Hellfire', 'Bravado', 'muscle', 'coupe', 286, 78000, 2),
  V('impaler', 'Declasse Impaler', 'Declasse', 'muscle', 'coupe', 272, 46000, 2),
  V('slamvan', 'Declasse Slamvan', 'Declasse', 'muscle', 'truck', 258, 42000, 2),
  V('vigeroconv', 'Declasse Vigero ZX Convertible', 'Declasse', 'muscle', 'coupe', 276, 62000, 2),
  V('dominatorasp', 'Vapid Dominator ASP', 'Vapid', 'muscle', 'coupe', 288, 86000, 2),
  V('dominatorgt', 'Vapid Dominator GT', 'Vapid', 'muscle', 'coupe', 292, 94000, 2),
  V('blista', 'Dinka Blista Compact', 'Dinka', 'sedan', 'sedan', 218, 16000, 4),
  V('stratum', 'Karin Stratum', 'Karin', 'sedan', 'sedan', 242, 30000, 4),
  V('tailgater', 'Obey Tailgater', 'Obey', 'sedan', 'sedan', 252, 42000, 4),
  V('primo', 'Albany Primo', 'Albany', 'sedan', 'sedan', 238, 26000, 4),
  V('primocustom', 'Albany Primo Custom', 'Albany', 'sedan', 'sedan', 248, 38000, 4),
  V('vstr', 'Albany V-STR', 'Albany', 'sedan', 'sedan', 262, 54000, 4),
  V('astron', 'Pfister Astron', 'Pfister', 'suv', 'suv', 256, 92000, 5),
  V('ballerst', 'Gallivanter Baller ST', 'Gallivanter', 'suv', 'suv', 254, 86000, 5),
  V('dorado', 'Bravado Dorado', 'Bravado', 'suv', 'suv', 246, 64000, 5),
  V('ganado', 'Ganado', 'Ganado', 'suv', 'suv', 240, 58000, 5),
  V('bison1800', 'Bison 1800', 'Bison', 'offroad', 'truck', 222, 36000, 3),
  V('bison3800', 'Bison 3800', 'Bison', 'offroad', 'truck', 226, 42000, 3),
  V('bison900', "'95 Bison 900", 'Bison', 'offroad', 'truck', 214, 28000, 3),
  V('crawler82', "'82 Crawler", 'Crawler', 'offroad', 'truck', 208, 32000, 2),
  V('reclaimer70', "'70 Reclaimer", 'Reclaimer', 'offroad', 'truck', 212, 34000, 2),
];

// ---- Bab 27 generated additions (brands named, models not) ----
// These fill the roster past 240. They are flagged generated: true.
const GEN = [
  // Sports (Bab 27 brands)
  V('schafterv12', 'Benefactor Schafter V12', 'Benefactor', 'sports', 'sedan', 292, 168000, 4, false),
  V('schaftergt', 'Benefactor Schafter GT', 'Benefactor', 'sports', 'coupe', 296, 182000, 2, false),
  V('surano', 'Benefactor Surano', 'Benefactor', 'sports', 'coupe', 300, 174000, 2, false),
  V('feltzer', 'Benefactor Feltzer', 'Benefactor', 'sports', 'coupe', 298, 166000, 2, false),
  V('krieger', 'Benefactor Krieger', 'Benefactor', 'supercar', 'coupe', 332, 1490000, 2, false),
  V('lm87', 'Benefactor LM87', 'Benefactor', 'supercar', 'coupe', 336, 1790000, 2, false),
  V('sm722', 'Benefactor SM722', 'Benefactor', 'sports', 'coupe', 304, 196000, 2, false),
  V('jesterrr', 'Dinka Jester RR', 'Dinka', 'sports', 'coupe', 308, 198000, 2, false),
  V('sugoi', 'Dinka Sugoi', 'Dinka', 'sports', 'sedan', 282, 98000, 4, false),
  V('verus', 'Dinka Verus', 'Dinka', 'offroad', 'suv', 224, 42000, 2, false),
  V('rt3000', 'Dinka RT3000', 'Dinka', 'sports', 'coupe', 296, 152000, 2, false),
  V('vector', 'Emperor Vector', 'Emperor', 'supercar', 'coupe', 340, 1580000, 2, false),
  V('etr1', 'Emperor ETR1', 'Emperor', 'supercar', 'coupe', 344, 1995000, 2, false),
  V('habanero', 'Emperor Habanero', 'Emperor', 'suv', 'suv', 236, 52000, 5, false),
  V('felongt', 'Lampadati Felon GT', 'Lampadati', 'sports', 'coupe', 294, 142000, 2, false),
  V('komoda', 'Lampadati Komoda', 'Lampadati', 'sports', 'sedan', 288, 138000, 4, false),
  V('michelli', 'Lampadati Michelli GT', 'Lampadati', 'sportsclassic', 'coupe', 272, 112000, 2, false),
  V('tropos', 'Lampadati Tropos Rallye', 'Lampadati', 'sports', 'coupe', 286, 128000, 2, false),
  V('tailgaters', 'Obey Tailgater S', 'Obey', 'sports', 'sedan', 292, 148000, 4, false),
  V('obey9f', 'Obey 9F', 'Obey', 'sports', 'coupe', 302, 186000, 2, false),
  V('omnis', 'Obey Omnis', 'Obey', 'sports', 'coupe', 296, 152000, 2, false),
  V('rocoto', 'Obey Rocoto', 'Obey', 'suv', 'suv', 242, 62000, 5, false),
  V('pariah', 'Ocelot Pariah', 'Ocelot', 'sports', 'coupe', 318, 248000, 2, false),
  V('xa21', 'Ocelot XA-21', 'Ocelot', 'supercar', 'coupe', 338, 1690000, 2, false),
  V('locust', 'Ocelot Locust', 'Ocelot', 'sports', 'coupe', 306, 208000, 2, false),
  V('jugular', 'Ocelot Jugular', 'Ocelot', 'sports', 'coupe', 300, 178000, 2, false),
  V('penumbraff', 'Maibatsu Penumbra FF', 'Maibatsu', 'sports', 'coupe', 292, 142000, 2, false),
  V('revolutionsg', 'Maibatsu Revolution SG', 'Maibatsu', 'sports', 'coupe', 298, 156000, 2, false),
  V('cometsr', 'Pfister Comet SR', 'Pfister', 'sports', 'coupe', 312, 212000, 2, false),
  V('cometsafari', 'Pfister Comet Safari', 'Pfister', 'offroad', 'coupe', 276, 168000, 2, false),
  V('neon', 'Pfister Neon', 'Pfister', 'sports', 'sedan', 290, 148000, 4, false),
  V('growler', 'Pfister Growler', 'Pfister', 'sports', 'coupe', 304, 188000, 2, false),
  V('reblagts', 'Ubermacht Rebla GTS', 'Ubermacht', 'suv', 'suv', 258, 96000, 5, false),
  V('sentinelclassic', 'Ubermacht Sentinel Classic', 'Ubermacht', 'sportsclassic', 'coupe', 268, 88000, 2, false),
  V('sc1', 'Ubermacht SC1', 'Ubermacht', 'supercar', 'coupe', 334, 1420000, 2, false),
  V('zionclassic', 'Ubermacht Zion Classic', 'Ubermacht', 'sportsclassic', 'coupe', 272, 92000, 2, false),
  V('driftyosemite', 'Declasse Drift Yosemite', 'Declasse', 'muscle', 'coupe', 278, 68000, 2, false),
  V('vamos', 'Declasse Vamos', 'Declasse', 'muscle', 'coupe', 274, 58000, 2, false),
  V('yosemite', 'Declasse Yosemite', 'Declasse', 'muscle', 'truck', 262, 52000, 2, false),
  V('deviant', 'Schyster Deviant', 'Schyster', 'muscle', 'coupe', 282, 72000, 2, false),
  V('fusilade', 'Schyster Fusilade', 'Schyster', 'sports', 'coupe', 296, 138000, 2, false),
  V('fmj', 'Vapid FMJ', 'Vapid', 'supercar', 'coupe', 336, 1540000, 2, false),
  V('bullet', 'Vapid Bullet', 'Vapid', 'supercar', 'coupe', 332, 1320000, 2, false),
  V('peyotegasser', 'Vapid Peyote Gasser', 'Vapid', 'muscle', 'coupe', 276, 64000, 2, false),
  V('yougaclassic', 'Bravado Youga Classic', 'Bravado', 'commercial', 'van', 188, 26000, 4, false),
  V('greenwood', 'Bravado Greenwood', 'Bravado', 'sedan', 'sedan', 252, 48000, 4, false),
  V('vagrant', 'Maxwell Vagrant', 'Maxwell', 'offroad', 'suv', 238, 54000, 2, false),
  V('asbo', 'Maxwell Asbo', 'Maxwell', 'sedan', 'sedan', 222, 18000, 4, false),
  V('outlaw', 'Nagasaki Outlaw', 'Nagasaki', 'offroad', 'suv', 234, 48000, 2, false),
  V('shinobi', 'Nagasaki Shinobi', 'Nagasaki', 'motorcycle', 'coupe', 298, 68000, 1, false),
  // Muscle / Off-road (Bab 27 brands)
  V('stallion', 'Declasse Stallion', 'Declasse', 'muscle', 'coupe', 272, 52000, 2, false),
  V('vigerzx', 'Declasse Vigero ZX', 'Declasse', 'muscle', 'coupe', 284, 76000, 2, false),
  V('dukes', 'Imponte Dukes', 'Imponte', 'muscle', 'coupe', 276, 56000, 2, false),
  V('nightshade', 'Imponte Nightshade', 'Imponte', 'muscle', 'coupe', 280, 62000, 2, false),
  V('gauntlets', 'Bravado Gauntlet S', 'Bravado', 'muscle', 'coupe', 282, 66000, 2, false),
  V('blade', 'Vapid Blade', 'Vapid', 'muscle', 'coupe', 270, 48000, 2, false),
  V('slamvancustom', 'Vapid Slamvan Custom', 'Vapid', 'muscle', 'truck', 264, 58000, 2, false),
  V('hermes', 'Albany Hermes', 'Albany', 'muscle', 'coupe', 266, 44000, 2, false),
  V('virgo', 'Albany Virgo Classic', 'Albany', 'muscle', 'coupe', 262, 42000, 2, false),
  V('buffalos', 'Bravado Buffalo S', 'Bravado', 'muscle', 'sedan', 286, 72000, 4, false),
  V('bodhi', 'Canis Bodhi', 'Canis', 'offroad', 'truck', 226, 36000, 2, false),
  V('contender', 'Vapid Contender', 'Vapid', 'offroad', 'truck', 240, 58000, 4, false),
  V('trophytruck', 'Vapid Trophy Truck', 'Vapid', 'offroad', 'truck', 248, 68000, 2, false),
  V('everonrs', 'Karin Everon RS', 'Karin', 'offroad', 'truck', 238, 54000, 4, false),
  V('duneloader', 'Bravado Duneloader', 'Bravado', 'offroad', 'truck', 218, 32000, 2, false),
  V('dunebuggy', 'Bravado Dune Buggy', 'Bravado', 'offroad', 'suv', 222, 34000, 2, false),
  V('blazeraqua', 'Nagasaki Blazer Aqua', 'Nagasaki', 'offroad', 'suv', 198, 38000, 2, false),
  V('monstrociti', 'Maibatsu Monstrociti', 'Maibatsu', 'offroad', 'truck', 232, 62000, 4, false),
  V('desertraid', 'Vapid Desert Raid', 'Vapid', 'offroad', 'truck', 244, 66000, 2, false),
  V('kalahari', 'Canis Kalahari', 'Canis', 'offroad', 'suv', 208, 28000, 2, false),
  V('xls', 'Benefactor XLS', 'Benefactor', 'suv', 'suv', 250, 78000, 5, false),
  V('ballerle', 'Gallivanter Baller LE', 'Gallivanter', 'suv', 'suv', 252, 84000, 5, false),
  V('novakgt', 'Lampadati Novak GT', 'Lampadati', 'suv', 'suv', 262, 98000, 5, false),
  V('rocotoxl', 'Obey Rocoto XL', 'Obey', 'suv', 'suv', 246, 72000, 5, false),
  V('rebla', 'Ubermacht Rebla', 'Ubermacht', 'suv', 'suv', 248, 72000, 5, false),
  V('radius', 'Vapid Radius', 'Vapid', 'suv', 'suv', 238, 48000, 5, false),
  V('beejay', 'Karin BeeJay XL', 'Karin', 'suv', 'suv', 234, 44000, 5, false),
  V('granger', 'Declasse Granger 3600LX', 'Declasse', 'suv', 'suv', 240, 58000, 5, false),
  V('gresley', 'Bravado Gresley', 'Bravado', 'suv', 'suv', 242, 56000, 5, false),
  V('verustrail', 'Dinka Verus Trail', 'Dinka', 'offroad', 'suv', 228, 46000, 2, false),
  // Boats & yachts (Bab 27: Cigarette / Contender / Crownline / Azimut / Lürssen / Riva)
  V('cig38', 'Cigarette 38 Top Gun', 'Cigarette', 'boat', 'truck', 148, 420000, 4, false),
  V('cig42', 'Cigarette 42 Tiger', 'Cigarette', 'boat', 'truck', 152, 520000, 4, false),
  V('cont35', 'Contender 35ST', 'Contender', 'boat', 'truck', 138, 380000, 4, false),
  V('cont39', 'Contender 39FA', 'Contender', 'boat', 'truck', 142, 460000, 4, false),
  V('crown290', 'Crownline 290 XSS', 'Crownline', 'boat', 'truck', 118, 240000, 6, false),
  V('crowne6', 'Crownline E6', 'Crownline', 'boat', 'truck', 108, 180000, 6, false),
  V('azimuts6', 'Azimut S6', 'Azimut', 'boat', 'truck', 88, 1800000, 8, false),
  V('azimut32', 'Azimut Grande 32', 'Azimut', 'boat', 'truck', 82, 3200000, 10, false),
  V('lurssen90', 'Lürssen 90m', 'Lürssen', 'boat', 'truck', 68, 12000000, 12, false),
  V('riva68', 'Riva 68 Diable', 'Riva', 'boat', 'truck', 98, 2400000, 6, false),
  V('rivaaqua', 'Riva Aquariva', 'Riva', 'boat', 'truck', 78, 900000, 4, false),
  V('rivaanni', 'Riva Anniversario', 'Riva', 'boat', 'truck', 92, 1800000, 6, false),
  // Trains / commercial / emergency (Bab 27)
  V('interceptor', 'Police Interceptor', 'Police', 'emergency', 'police', 296, 0, 4, false),
  V('policecruiser', 'Police Cruiser', 'Police', 'emergency', 'police', 288, 0, 4, false),
  V('sheriffsuv', 'Sheriff SUV', 'Sheriff', 'emergency', 'police', 272, 0, 5, false),
  V('ambulance', 'Ambulance', 'Ambulance', 'emergency', 'van', 178, 0, 4, false),
  V('firetruck', 'Fire Truck', 'Fire', 'emergency', 'truck', 158, 0, 4, false),
  V('speedo', 'Vapid Speedo', 'Vapid', 'commercial', 'van', 172, 24000, 4, false),
  V('minivan', 'Vapid Minivan', 'Vapid', 'commercial', 'van', 182, 28000, 5, false),
  V('boxville', 'Brute Boxville', 'Brute', 'commercial', 'truck', 138, 48000, 2, false),
  V('hauler', 'JoBuilt Hauler', 'JoBuilt', 'commercial', 'truck', 142, 76000, 2, false),
  V('lifeguard', 'Declasse Lifeguard', 'Declasse', 'commercial', 'truck', 168, 36000, 4, false),
  V('sadler', 'Vapid Sadler', 'Vapid', 'commercial', 'truck', 148, 32000, 2, false),
  V('bobcat', 'Vapid Bobcat XL', 'Vapid', 'commercial', 'truck', 152, 34000, 2, false),
  V('dilettante', 'Karin Dilettante', 'Karin', 'commercial', 'sedan', 198, 18000, 4, false),
  V('everon', 'Karin Everon', 'Karin', 'commercial', 'truck', 232, 46000, 4, false),
  V('coach', 'Dashound Coach', 'Dashound', 'commercial', 'van', 132, 52000, 24, false),
  V('bensonhauler', 'Vapid Benson Hauler', 'Vapid', 'commercial', 'truck', 140, 58000, 2, false),
  // Sports classics (Bab 27 brands)
  V('stingergt', 'Grotti Stinger GT', 'Grotti', 'sportsclassic', 'coupe', 284, 132000, 2, false),
  V('monroe', 'Pegassi Monroe', 'Pegassi', 'sportsclassic', 'coupe', 278, 118000, 2, false),
  V('torero', 'Pegassi Torero', 'Pegassi', 'sportsclassic', 'coupe', 282, 128000, 2, false),
  V('coquetteclassic', 'Invetero Coquette Classic', 'Invetero', 'sportsclassic', 'coupe', 286, 122000, 2, false),
  V('casco', 'Lampadati Casco', 'Lampadati', 'sportsclassic', 'coupe', 268, 98000, 2, false),
  V('tornado', 'Declasse Tornado', 'Declasse', 'sportsclassic', 'coupe', 258, 68000, 2, false),
  V('tornadocustom', 'Declasse Tornado Custom', 'Declasse', 'sportsclassic', 'coupe', 262, 78000, 2, false),
  V('peyote', 'Vapid Peyote', 'Vapid', 'sportsclassic', 'coupe', 256, 62000, 2, false),
  V('peyotecustom', 'Vapid Peyote Custom', 'Vapid', 'sportsclassic', 'coupe', 260, 72000, 2, false),
  V('roosevelt', 'Albany Roosevelt', 'Albany', 'sportsclassic', 'sedan', 232, 88000, 4, false),
  V('rooseveltvalor', 'Albany Roosevelt Valor', 'Albany', 'sportsclassic', 'sedan', 238, 98000, 4, false),
  V('ratloader', 'Bravado Rat-Loader', 'Bravado', 'sportsclassic', 'truck', 228, 42000, 2, false),
  V('deluxo', 'Imponte Deluxo', 'Imponte', 'sportsclassic', 'coupe', 276, 148000, 2, false),
  V('ztype', 'Truffade Z-Type', 'Truffade', 'sportsclassic', 'coupe', 288, 168000, 2, false),
  V('swinger', 'Ocelot Swinger', 'Ocelot', 'sportsclassic', 'coupe', 282, 138000, 2, false),
];

for (const v of GEN) VEHICLES.push(v);

export const VEHICLE_COUNT = VEHICLES.length;
export const NAMED_COUNT = VEHICLES.filter((v) => v.named).length;

const BY_ID = {};
const BY_NAME = {};
for (const v of VEHICLES) {
  BY_ID[v.id] = v;
  BY_NAME[v.name.toLowerCase()] = v;
}

export const VEHICLE_CATEGORIES = ['supercar', 'sports', 'sportsclassic', 'muscle', 'sedan', 'suv', 'offroad', 'motorcycle', 'boat', 'aircraft', 'train', 'commercial', 'emergency'];

// resolve(name): a model name ("Pegassi Tempesta"), a model id ("tempesta"),
// or a CAR_CLASSES key ("sedan", "police") → {cls, name, model}.
// vehicles.js calls this from makeCar; unknown keys return null (caller falls
// back to the raw key as a CAR_CLASSES lookup).
export function resolveVehicle(name) {
  if (!name) return null;
  const v = BY_ID[name] || BY_NAME[String(name).toLowerCase()];
  if (v) return { cls: v.cls, name: v.name, model: v };
  return null;
}

export function byCategory(cat) {
  return VEHICLES.filter((v) => v.cat === cat);
}

export function createVehicleDb() {
  return {
    resolve: resolveVehicle,
    byId: (id) => BY_ID[id] || null,
    byName: (name) => BY_NAME[String(name).toLowerCase()] || null,
    byCategory,
    count: VEHICLE_COUNT,
    namedCount: NAMED_COUNT,
    categories: VEHICLE_CATEGORIES,
    all: VEHICLES,
  };
}
