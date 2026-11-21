// AZURA BAY — vehicles (round 7 re-compose, written fresh under r7).
// 245 vehicles, SPEC.md Bab 23–24 + 27. 122 named in the spec; the rest
// generated deterministically from brands (same approach as the spec's
// "rest generated from brands"). Row: [name, class, topSpeed, accel,
// handling, price]. Classes: supercar, sports, classic, muscle, sedan,
// suv, offroad, bike, boat, aircraft, commercial.

export const NAMED = [
  // Supercars (4)
  ["Grotti Furia", "supercar", 210, 92, 88, 1200000],
  ["Pegassi Tempesta", "supercar", 205, 90, 86, 1100000],
  ["Pegassi Zorrusso", "supercar", 212, 93, 87, 1500000],
  ["Truffade Thrax", "supercar", 208, 91, 85, 1300000],
  // Sports (12)
  ["Annis Elegy Retro", "sports", 185, 82, 80, 450000],
  ["Bravado Banshee", "sports", 190, 85, 82, 520000],
  ["Creado", "sports", 178, 78, 76, 380000],
  ["Grotti Carbonizzare", "sports", 195, 86, 84, 600000],
  ["Grotti Itali GTO", "sports", 200, 88, 83, 750000],
  ["Invetero Coquette D10", "sports", 192, 84, 81, 580000],
  ["Karin Futo", "sports", 170, 75, 78, 280000],
  ["Karin Sultan", "sports", 180, 80, 79, 350000],
  ["Obey 8F Drafter", "sports", 188, 83, 82, 480000],
  ["Pfister Comet S2 Cabrio", "sports", 193, 85, 83, 620000],
  ["PMP 700", "sports", 182, 79, 77, 400000],
  ["Ubermacht Cypher", "sports", 186, 81, 80, 460000],
  // Sports Classics (5)
  ["Albany Manana", "classic", 150, 65, 70, 120000],
  ["Declasse Mamba", "classic", 175, 76, 74, 320000],
  ["Grotti Cheetah Classic", "classic", 180, 78, 75, 380000],
  ["Mamba GT", "classic", 178, 77, 73, 340000],
  ["Pegassi Infernus Classic", "classic", 185, 80, 76, 420000],
  // Muscle (13)
  ["Albany Buccaneer", "muscle", 165, 72, 68, 200000],
  ["Bravado Buffalo STX", "muscle", 180, 78, 72, 300000],
  ["Bravado Gauntlet", "muscle", 178, 77, 71, 280000],
  ["Declasse Impaler LX", "muscle", 172, 74, 70, 240000],
  ["Declasse Impaler SZ", "muscle", 176, 76, 71, 260000],
  ["Declasse Sabre Turbo", "muscle", 170, 73, 69, 220000],
  ["Declasse Tulip", "muscle", 168, 71, 68, 210000],
  ["Declasse Tulip M-100", "muscle", 174, 75, 70, 250000],
  ["Declasse Vigero", "muscle", 176, 76, 72, 270000],
  ["Imponte Phoenix", "muscle", 172, 74, 69, 230000],
  ["Imponte Ruiner", "muscle", 170, 73, 70, 225000],
  ["Vapid Dominator 1967", "muscle", 168, 72, 67, 190000],
  ["Vapid Dominator GTX", "muscle", 182, 79, 73, 310000],
  // Sedans & Coupes (5)
  ["Albany Emperor", "sedan", 155, 65, 72, 90000],
  ["Karin Asterope GZ", "sedan", 160, 68, 74, 110000],
  ["Karin Intruder", "sedan", 158, 66, 73, 95000],
  ["Ubermacht Zion", "sedan", 165, 70, 75, 130000],
  ["Vulcar Ingot", "sedan", 150, 62, 70, 75000],
  // SUVs (3)
  ["Bravado Aleutian", "suv", 160, 68, 72, 150000],
  ["Gallivanter Baller", "suv", 165, 70, 74, 180000],
  ["Lampadati Novak", "suv", 162, 69, 73, 160000],
  // Off-Road & Pickups (11)
  ["Annis Hellion", "offroad", 150, 70, 75, 140000],
  ["Bravado Bison", "offroad", 145, 65, 72, 110000],
  ["Canis Kamacho", "offroad", 155, 72, 78, 160000],
  ["Canis Mesa", "offroad", 148, 68, 74, 130000],
  ["Canis Seminole", "offroad", 146, 66, 73, 120000],
  ["Karin Rebel", "offroad", 152, 70, 76, 135000],
  ["Nagasaki Blazer", "offroad", 140, 68, 80, 90000],
  ["Street Blazer", "offroad", 142, 69, 79, 95000],
  ["Vapid Caracara", "offroad", 158, 72, 76, 170000],
  ["Vapid Riata Classic", "offroad", 150, 68, 74, 125000],
  ["Vapid Sandking", "offroad", 155, 71, 77, 155000],
  // Motorcycles & Cycles (13)
  ["Alvino V1", "bike", 170, 80, 82, 180000],
  ["Dinka Double-T", "bike", 175, 82, 83, 200000],
  ["Maibatsu Manchez", "bike", 150, 72, 80, 110000],
  ["Maibatsu Sanchez", "bike", 145, 70, 82, 95000],
  ["Nagasaki Carbon RS", "bike", 185, 86, 85, 260000],
  ["Pegassi Faggio", "bike", 90, 50, 70, 15000],
  ["Western Avarus", "bike", 165, 76, 78, 160000],
  ["Western Nightblade", "bike", 168, 77, 79, 170000],
  ["Western Sovereign", "bike", 160, 74, 76, 150000],
  ["Western Zombie", "bike", 162, 75, 77, 155000],
  ["BMX", "bike", 40, 40, 85, 5000],
  ["Cruiser", "bike", 45, 42, 84, 6000],
  ["LomBike", "bike", 50, 45, 83, 7000],
];

NAMED.push(
  // Boats (6)
  ["Airboat 09", "boat", 70, 60, 65, 80000],
  ["BTN Delmar", "boat", 90, 65, 70, 200000],
  ["Nagasaki Dinghy", "boat", 75, 62, 68, 60000],
  ["Speedophile Seashark", "boat", 85, 68, 72, 120000],
  ["Sailing Yacht", "boat", 60, 50, 60, 500000],
  ["Jet Ski Trailer", "boat", 55, 55, 62, 40000],
  // Planes / Helicopters / Trains (11)
  ["Buckingham Maverick", "aircraft", 180, 75, 80, 900000],
  ["Buckingham Shamal", "aircraft", 220, 80, 75, 1500000],
  ["Mammoth Dodo", "aircraft", 150, 65, 70, 400000],
  ["Nagasaki Buzzard", "aircraft", 190, 78, 82, 800000],
  ["Tethered Aerostat", "aircraft", 30, 30, 50, 200000],
  ["Weazel News Helicopter", "aircraft", 170, 72, 78, 700000],
  ["Western Duster", "aircraft", 140, 60, 68, 350000],
  ["DF8-90 Train", "aircraft", 120, 55, 60, 0],
  ["Freight Train", "aircraft", 110, 50, 55, 0],
  ["VCIA Tram", "aircraft", 80, 45, 60, 0],
  ["VCMM Metro", "aircraft", 90, 48, 62, 0],
  // Commercial / Service / Utility / Emergency (13)
  ["Brute Excavator", "commercial", 40, 40, 50, 150000],
  ["Brute Rubble", "commercial", 70, 50, 55, 120000],
  ["Brute Stockade", "commercial", 90, 55, 58, 180000],
  ["Buffalo STX Pursuit", "commercial", 185, 80, 74, 0],
  ["Dashound Bus", "commercial", 75, 45, 55, 100000],
  ["Declasse Burrito", "commercial", 85, 50, 60, 70000],
  ["JoBuilt Packer", "commercial", 80, 48, 55, 110000],
  ["JoBuilt Phantom", "commercial", 85, 50, 56, 120000],
  ["Police Riot", "commercial", 100, 60, 60, 0],
  ["Vapid Benson", "commercial", 82, 48, 58, 90000],
  ["Vapid Camper", "commercial", 88, 52, 62, 85000],
  ["Vapid Ghost Car", "commercial", 95, 55, 60, 95000],
  ["Vapid Tow Truck", "commercial", 90, 52, 58, 80000],
  // Bab 24 additions (26)
  ["Grotti Cheetah", "supercar", 198, 88, 84, 900000],
  ["Invetero Coquette", "sports", 190, 84, 82, 550000],
  ["Progen Emerus", "supercar", 207, 91, 86, 1200000],
  ["Albany Chino", "classic", 155, 66, 69, 140000],
  ["Bravado Gauntlet Classic Custom", "classic", 172, 75, 72, 290000],
  ["Bravado Gauntlet Hellfire", "muscle", 185, 80, 73, 340000],
  ["Declasse Impaler", "muscle", 170, 73, 69, 220000],
  ["Declasse Slamvan", "muscle", 160, 68, 66, 180000],
  ["Declasse Vigero ZX Convertible", "muscle", 178, 77, 72, 280000],
  ["Vapid Dominator ASP", "muscle", 183, 79, 73, 320000],
  ["Vapid Dominator GT", "muscle", 185, 80, 74, 330000],
  ["Dinka Blista Compact", "sedan", 145, 62, 72, 60000],
  ["Karin Stratum", "sedan", 158, 67, 73, 100000],
  ["Obey Tailgater", "sedan", 162, 69, 74, 115000],
  ["Albany Primo", "sedan", 152, 64, 71, 85000],
  ["Albany Primo Custom", "sedan", 158, 67, 72, 110000],
  ["Albany V-STR", "sports", 185, 82, 80, 480000],
  ["Pfister Astron", "suv", 168, 72, 75, 200000],
  ["Gallivanter Baller ST", "suv", 170, 73, 76, 210000],
  ["Bravado Dorado", "suv", 158, 67, 72, 140000],
  ["Ganado", "suv", 155, 66, 71, 130000],
  ["Bison 1800", "offroad", 148, 66, 73, 115000],
  ["Bison 3800", "offroad", 150, 67, 74, 120000],
  ["95 Bison 900", "offroad", 140, 62, 70, 80000],
  ["82 Crawler", "offroad", 135, 60, 78, 90000],
  ["70 Reclaimer", "offroad", 130, 58, 75, 75000],
);

// The remaining 123 vehicles are generated deterministically from brands
// (SPEC Bab 27: "rest generated from brands"). Seeded so the list is
// stable across runs. Total must be 245.
import { mulberry32, hashSeed } from "./rng.js";

const GEN_BRANDS = [
  ["Benefactor", "Schafter"], ["Benefactor", "Schafter V12"], ["Benefactor", "Schafter LWB"],
  ["Dinka", "Blista"], ["Dinka", "Jester"], ["Dinka", "Jester RR"],
  ["Emperor", "Habanero"], ["Emperor", "Rhapsody"], ["Emperor", "Rhapsody GT"],
  ["Lampadati", "Felon"], ["Lampadati", "Felon GT"], ["Lampadati", "Casco"],
  ["Obey", "9F"], ["Obey", "9F Cabrio"], ["Obey", "Tailgater S"],
  ["Ocelot", "F620"], ["Ocelot", "Jackal"], ["Ocelot", "Lynx"],
  ["Maibatsu", "Vincent"], ["Maibatsu", "Vincent GT"], ["Maibatsu", "Penumbra"],
  ["Pfister", "Comet"], ["Pfister", "Comet Retro"], ["Pfister", "Comet S2"],
  ["Ubermacht", "Oracle"], ["Ubermacht", "Oracle XS"], ["Ubermacht", "Sentinel"],
  ["Declasse", "Granger"], ["Declasse", "Granger 3600LX"], ["Declasse", "Sabre"],
  ["Schyster", "Fusilade"], ["Schyster", "Fusilade GT"], ["Schyster", "Cabrio"],
  ["Vapid", "Stanier"], ["Vapid", "Stanier GT"], ["Vapid", "Tampa"],
  ["Bravado", "Youga"], ["Bravado", "Youga Classic"], ["Bravado", "Bison"],
  ["Maxwell", "Vagrant"], ["Maxwell", "Vagrant GT"], ["Maxwell", "Asbo"],
  ["Nagasaki", "Blazer Aqua"], ["Nagasaki", "Blazer Lifeguard"], ["Nagasaki", "Outlaw"],
  ["Pegassi", "Faggio Mod"], ["Pegassi", "Faggio Sport"], ["Pegassi", "Oppressor"],
  ["Western", "Daemon"], ["Western", "Daemon Custom"], ["Western", "Rat Bike"],
  ["Grotti", "Brioso"], ["Grotti", "Brioso 300"], ["Grotti", "Brioso R/A"],
  ["Annis", "Savestra"], ["Annis", "Savestra GT"], ["Annis", "Zorba"],
  ["Karin", "Sultan RS"], ["Karin", "Sultan Classic"], ["Karin", "Kuruma"],
  ["Coil", "Voltaic"], ["Coil", "Voltaic GT"], ["Coil", "Cyclone"],
  ["Truffade", "Adder"], ["Truffade", "Adder GT"], ["Truffade", "Nero"],
  ["Progen", "T20"], ["Progen", "T20 GT"], ["Progen", "Itali GTB"],
  ["Overflod", "Entity"], ["Overflod", "Entity XXR"], ["Overflod", "Autarch"],
  ["Dewbauchee", "Massacro"], ["Dewbauchee", "Massacro Race"], ["Dewbauchee", "Rapid GT"],
  ["Hijak", "Khamelion"], ["Hijak", "Khamelion GT"], ["Hijak", "Ruston"],
  ["Vapid", "Clique"], ["Vapid", "Clique GT"], ["Vapid", "Caracara 4x4"],
  ["Bravado", "Gauntlet Classic"], ["Bravado", "Gauntlet Redwood"], ["Bravado", "Verlierer"],
  ["Declasse", "Tornado"], ["Declasse", "Tornado Custom"], ["Declasse", "Voodoo"],
  ["Imponte", "Deluxo"], ["Imponte", "Deluxo GT"], ["Imponte", "Ruiner 2000"],
  ["Albany", "Cavalcade"], ["Albany", "Cavalcade XL"], ["Albany", "Hermes"],
  ["Canis", "Bodhi"], ["Canis", "Bodhi GT"], ["Canis", "Kalahari"],
  ["Gallivanter", "Baller LE"], ["Gallivanter", "Baller LE LWB"], ["Gallivanter", "Baller Sport"],
  ["Enus", "Cognoscenti"], ["Enus", "Cognoscenti 55"], ["Enus", "Cognoscenti Cabrio"],
  ["Obey", "I-Wagen"], ["Obey", "I-Wagen GT"], ["Obey", "Omnis"],
  ["Ubermacht", "Rebla"], ["Ubermacht", "Rebla GTS"], ["Ubermacht", "Rhinehart"],
  ["Lampadati", "Tigon"], ["Lampadati", "Tigon GT"], ["Lampadati", "Komoda"],
  ["Pfister", "Growler"], ["Pfister", "Growler GT"], ["Pfister", "Neon"],
  ["Vulcar", "Warrener"], ["Vulcar", "Warrener GT"], ["Vulcar", "Fagaloa"],
  ["Dinka", "Verus"], ["Dinka", "Verus GT"], ["Dinka", "Sugoi"],
  ["Maibatsu", "Mule"], ["Maibatsu", "Mule Custom"], ["Maibatsu", "Mule 6x6"],
];

const GEN_CLASSES = ["sports", "sedan", "suv", "muscle", "classic", "offroad", "supercar"];

export function generatedVehicles() {
  const rand = mulberry32(hashSeed("vehicles-gen"));
  const out = [];
  for (let i = 0; i < 123; i++) {
    const [brand, model] = GEN_BRANDS[i % GEN_BRANDS.length];
    const cls = GEN_CLASSES[Math.floor(rand() * GEN_CLASSES.length)];
    const top = 120 + Math.floor(rand() * 90);
    const acc = 55 + Math.floor(rand() * 40);
    const han = 60 + Math.floor(rand() * 30);
    const price = 20000 + Math.floor(rand() * 900000);
    out.push([brand + " " + model + " #" + (i + 1), cls, top, acc, han, price]);
  }
  return out;
}

export const VEHICLES = NAMED.concat(generatedVehicles()).map((v, i) => ({
  id: "v" + (i + 1), name: v[0], cls: v[1], top: v[2], acc: v[3], han: v[4], price: v[5],
}));

export function totalVehicles() { return VEHICLES.length; }
export function vehicleById(id) { return VEHICLES.find((v) => v.id === id) || null; }
export function vehiclesByClass(cls) { return VEHICLES.filter((v) => v.cls === cls); }
export function fastestInClass(cls) {
  const list = vehiclesByClass(cls);
  return list.reduce((a, b) => (b.top > a.top ? b : a), list[0]);
}
export function cheapestInClass(cls) {
  const list = vehiclesByClass(cls).filter((v) => v.price > 0);
  return list.reduce((a, b) => (b.price < a.price ? b : a), list[0]);
}
