// AZURA BAY — characters (round 7 re-compose, written fresh under r7).
// 27 characters, SPEC.md Bab 15. 2 protagonists, 7 central, 18 supporting.
// Voice actors credited where the spec names them.

export const CHARACTERS = [
  // Protagonists (2)
  { id: "lucia", name: "Lucia Caminos", role: "protagonist", actor: "Manni L. Perez", desc: "Ex-convict of Leonida Penitentiary, from Liberty City. Ambitious, smart, strategic — the planner. First female lead of the main series." },
  { id: "jason", name: "Jason Duval", role: "protagonist", actor: "Dylan Rourke", desc: "Army veteran, smuggler for a local Leonida Keys boss. Calm, loyal, expert driver and shooter — the field executor." },
  // Central (7)
  { id: "brian", name: "Brian Heder", role: "central", actor: "Stephen Root", desc: "Senior Leonida Keys smuggler. Employs Jason, gives him a place to live." },
  { id: "cal", name: "Cal Hampton", role: "central", actor: "Bobby Moynihan", desc: "Jason's best friend. Conspiracy theorist, monitors the Coast Guard by radio." },
  { id: "boobie", name: "Boobie Ike", role: "central", actor: "Mike Forbs", desc: "Street legend turned legal empire: real estate, Jack of Hearts, studio." },
  { id: "drequan", name: "Dre'Quan Priest", role: "central", actor: "Naiqui Macabroad", desc: "Founder of Only Raw Records, Boobie's partner." },
  { id: "baeluxe", name: "Bae-Luxe", role: "central", actor: "Hood Brat", desc: "Half of rap duo Real Dimez, viral with Roxy." },
  { id: "roxy", name: "Roxy", role: "central", actor: "Krissy Celess", desc: "Half of rap duo Real Dimez, viral with Bae-Luxe." },
  { id: "raul", name: "Raul Bautista", role: "central", actor: "Manny Perez", desc: "Veteran bank robber. Recruits Jason and Lucia for the big heist." },
  // Supporting (18)
  { id: "lori", name: "Lori Heder", role: "supporting", actor: "Orlagh Cassidy", desc: "Brian's wife." },
  { id: "donnie", name: "Donnie Carter", role: "supporting", actor: "Brad Carter", desc: "Jason's careless old partner." },
  { id: "mendez", name: "Captain Aldo Méndez", role: "supporting", actor: "Chris McKinney", desc: "Senior VCPD officer." },
  { id: "andres", name: "Andrés de León", role: "supporting", actor: "", desc: "Vice City contact." },
  { id: "petra", name: "Petra Navarro", role: "supporting", actor: "", desc: "Vice City contact." },
  { id: "phil", name: "Phil Cassidy", role: "supporting", actor: "", desc: "Owns Phil's Ammu-Nation." },
  { id: "billy", name: "Billy", role: "supporting", actor: "Spenser Granese", desc: "Thrillbilly Mud Club leader." },
  { id: "moses", name: "Moses Watkins", role: "supporting", actor: "Aaron Morton", desc: "Steals cars to order. Goes by Mo." },
  { id: "pete", name: "Pilot Pete", role: "supporting", actor: "Carl Palmer", desc: "Smuggler pilot." },
  { id: "bret", name: "Bret Vogel", role: "supporting", actor: "Jariko Denman", desc: "Veteran hunter." },
  { id: "katerina", name: "Katerina Rosselli", role: "supporting", actor: "Edwina Rai", desc: "Vice City contact." },
  { id: "mattia", name: "Mattia Tauro", role: "supporting", actor: "Massi Pregoni", desc: "Vice City contact." },
  { id: "kenton", name: "Kenton Rees", role: "supporting", actor: "Machel Montano", desc: "Vice City contact." },
  { id: "andy", name: "Andy", role: "supporting", actor: "Mallory Wu", desc: "Cellerica contact." },
  { id: "dunk", name: "Dunk", role: "supporting", actor: "Brad Fleischer", desc: "Vice City contact." },
  { id: "wyman", name: "Wyman", role: "supporting", actor: "Dave Stishan", desc: "Classic car collector." },
  { id: "vicki", name: "Vicki", role: "supporting", actor: "Taryn Manning", desc: "Vice City contact." },
  { id: "linda", name: "Linda", role: "supporting", actor: "Lisa Emery", desc: "Vice City contact." },
];

export function characterById(id) { return CHARACTERS.find((c) => c.id === id) || null; }
export function charactersByRole(role) { return CHARACTERS.filter((c) => c.role === role); }
export function totalCharacters() { return CHARACTERS.length; }
