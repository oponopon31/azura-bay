// characters.js — 27 characters, SPEC §15 (exact names + voice actors).
// 2 protagonists, 7 central, 18 supporting.
export const CHARACTERS = [
  // Protagonists
  { id: 'lucia', name: 'Lucia Caminos', actor: 'Manni L. Perez', role: 'protagonist', desc: 'Ex-convict of Leonida Penitentiary, from Liberty City; trained to fight by her father since childhood. Ambitious, smart, strategic — the planner. The first female protagonist of the main series.' },
  { id: 'jason', name: 'Jason Duval', actor: 'Dylan Rourke', role: 'protagonist', desc: 'Army veteran, grew up around con artists; smuggler for a local Leonida Keys boss. Calm, loyal, expert driver and shooter — the field executor. Bonnie & Clyde.' },
  // Central
  { id: 'brian', name: 'Brian Heder', actor: 'Stephen Root', role: 'central', desc: 'Senior Leonida Keys drug smuggler; relaxed but cunning. Employs Jason, gives him free housing, asks dirty work in return.' },
  { id: 'cal', name: 'Cal Hampton', actor: 'Bobby Moynihan', role: 'central', desc: "Jason's best friend; paranoid conspiracy theorist, monitors the Coast Guard by radio while drinking beer." },
  { id: 'boobie', name: 'Boobie Ike', actor: 'Mike Forbs', role: 'central', desc: 'Vice City street legend turned legal empire (real estate, Jack of Hearts, recording studio).' },
  { id: 'dre', name: "Dre'Quan Priest", actor: 'Naiqui Macabroad', role: 'central', desc: 'Founder of Only Raw Records, Boobie Ike\'s partner.' },
  { id: 'baeluxe', name: 'Bae-Luxe', actor: 'Hood Brat', role: 'central', desc: 'Half of Real Dimez, the viral Vice City female rap duo; friends since high school, under Dre\'Quan\'s label.' },
  { id: 'roxy', name: 'Roxy', actor: 'Krissy Celess', role: 'central', desc: 'Half of Real Dimez, the viral Vice City female rap duo; friends since high school, under Dre\'Quan\'s label.' },
  { id: 'raul', name: 'Raul Bautista', actor: 'Manny Perez', role: 'central', desc: 'Veteran bank robber, confident, charismatic, takes extreme risks; recruits Jason & Lucia for the big heist.' },
  // Supporting
  { id: 'lori', name: 'Lori Heder', actor: 'Orlagh Cassidy', role: 'supporting', desc: "Brian's wife." },
  { id: 'donnie', name: 'Donnie Carter', actor: 'Brad Carter', role: 'supporting', desc: "Jason's old, careless associate." },
  { id: 'mendez', name: 'Captain Aldo Méndez', actor: 'Chris McKinney', role: 'supporting', desc: 'Senior VCPD officer.' },
  { id: 'andres', name: 'Andrés de León', actor: null, role: 'supporting', desc: 'Vice City contact.' },
  { id: 'petra', name: 'Petra Navarro', actor: null, role: 'supporting', desc: 'Vice City contact.' },
  { id: 'phil', name: 'Phil Cassidy', actor: null, role: 'supporting', desc: "Owner of Phil's Ammu-Nation." },
  { id: 'billy', name: 'Billy', actor: 'Spenser Granese', role: 'supporting', desc: 'Thrillbilly Mud Club leader.' },
  { id: 'moses', name: 'Moses "Mo" Watkins', actor: 'Aaron Morton', role: 'supporting', desc: 'Steals cars to order.' },
  { id: 'pete', name: 'Pilot Pete', actor: 'Carl Palmer', role: 'supporting', desc: 'Smuggler pilot; Jason flies air packages.' },
  { id: 'bret', name: 'Bret Vogel', actor: 'Jariko Denman', role: 'supporting', desc: 'Veteran hunter with special hunting challenges.' },
  { id: 'katerina', name: 'Katerina Rosselli', actor: 'Edwina Rai', role: 'supporting', desc: 'Vice City contact.' },
  { id: 'mattia', name: 'Mattia Tauro', actor: 'Massi Pregoni', role: 'supporting', desc: 'Vice City contact.' },
  { id: 'kenton', name: 'Kenton Rees', actor: 'Machel Montano', role: 'supporting', desc: 'Vice City contact.' },
  { id: 'andy', name: 'Andy', actor: 'Mallory Wu', role: 'supporting', desc: 'Cellerica liaison.' },
  { id: 'dunk', name: 'Dunk', actor: 'Brad Fleischer', role: 'supporting', desc: 'Randy / Tyrone crew.' },
  { id: 'wyman', name: 'Wyman', actor: 'Dave Stishan', role: 'supporting', desc: 'Classic car collector.' },
  { id: 'vicki', name: 'Vicki', actor: 'Taryn Manning', role: 'supporting', desc: 'Vice City contact.' },
  { id: 'linda', name: 'Linda', actor: 'Lisa Emery', role: 'supporting', desc: 'Vice City contact.' },
];

export function charactersByRole(role) {
  return CHARACTERS.filter((c) => c.role === role);
}

export function characterById(id) {
  return CHARACTERS.find((c) => c.id === id) || null;
}
