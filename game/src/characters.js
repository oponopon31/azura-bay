// characters.js — 27 characters, SPEC §15 (exact names + voice actors).
// 2 protagonists, 7 central, 18 supporting.
export const CHARACTERS = [
  // Protagonists
  { id: 'mara', name: 'Mara Solano', actor: 'Sofia Delgado', role: 'protagonist', desc: 'Ex-convict of Solmaris Penitentiary, from Harbor City; trained to fight by her father since childhood. Ambitious, smart, strategic — the planner. The first female protagonist of the main series.' },
  { id: 'cole', name: 'Cole Reyes', actor: 'Marcus Hale', role: 'protagonist', desc: 'Army veteran, grew up around con artists; smuggler for a local Solmaris Keys boss. Calm, loyal, expert driver and shooter — the field executor. Bonnie & Clyde.' },
  // Central
  { id: 'brian', name: 'Gus Marlowe', actor: 'Walter Grady', role: 'central', desc: 'Senior Solmaris Keys drug smuggler; relaxed but cunning. Employs Cole, gives him free housing, asks dirty work in return.' },
  { id: 'cal', name: 'Dale Mercer', actor: 'Rory Finch', role: 'central', desc: "Cole's best friend; paranoid conspiracy theorist, monitors the Coast Guard by radio while drinking beer." },
  { id: 'dante', name: 'Dante “Big D” Osei', actor: 'Darnell Ford', role: 'central', desc: 'Azura Bay street legend turned legal empire (real estate, King of Clubs, recording studio).' },
  { id: 'dre', name: "Malik “M-Que” Stanton", actor: 'Kofi Mensah', role: 'central', desc: 'Founder of Raw Deal Records, Dante “Big D” Osei\'s partner.' },
  { id: 'baeluxe', name: 'Vee Luxe', actor: 'Tasha Renee', role: 'central', desc: 'Half of Twin Dimes, the viral Azura Bay female rap duo; friends since high school, under Malik\'s label.' },
  { id: 'roxy', name: 'Candi', actor: 'Maya Solis', role: 'central', desc: 'Half of Twin Dimes, the viral Azura Bay female rap duo; friends since high school, under Malik\'s label.' },
  { id: 'raul', name: 'Hector Salazar', actor: 'Diego Fuentes', role: 'central', desc: 'Veteran bank robber, confident, charismatic, takes extreme risks; recruits Cole & Mara for the big heist.' },
  // Supporting
  { id: 'lori', name: 'Lori Marlowe', actor: 'Elena Voss', role: 'supporting', desc: "Gus's wife." },
  { id: 'donnie', name: 'Lenny Carson', actor: 'Sam Porter', role: 'supporting', desc: "Cole's old, careless associate." },
  { id: 'mendez', name: 'Captain Aldo Méndez', actor: 'Ray Delgado', role: 'supporting', desc: 'Senior ABPD officer.' },
  { id: 'andres', name: 'Andrés de León', actor: null, role: 'supporting', desc: 'Azura Bay contact.' },
  { id: 'petra', name: 'Petra Navarro', actor: null, role: 'supporting', desc: 'Azura Bay contact.' },
  { id: 'phil', name: 'Hank Fuller', actor: null, role: 'supporting', desc: "Owner of Hank's Ironhold." },
  { id: 'billy', name: 'Billy', actor: 'Kyle Mercer', role: 'supporting', desc: 'MudRunner Club leader.' },
  { id: 'moses', name: 'Ezekiel “Zeke” Watts', actor: 'Jerome Blake', role: 'supporting', desc: 'Steals cars to order.' },
  { id: 'pete', name: 'Flynn “Ace” Harper', actor: 'Nate Brooks', role: 'supporting', desc: 'Smuggler pilot; Cole flies air packages.' },
  { id: 'bret', name: 'Wayne Harker', actor: 'Clint Foster', role: 'supporting', desc: 'Veteran hunter with special hunting challenges.' },
  { id: 'katerina', name: 'Katerina Rosselli', actor: 'Nadia Petrova', role: 'supporting', desc: 'Azura Bay contact.' },
  { id: 'mattia', name: 'Mattia Tauro', actor: 'Luca Ferraro', role: 'supporting', desc: 'Azura Bay contact.' },
  { id: 'kenton', name: 'Kenton Rees', actor: 'Desmond Cole', role: 'supporting', desc: 'Azura Bay contact.' },
  { id: 'andy', name: 'Andy', actor: 'June Park', role: 'supporting', desc: 'SolCell liaison.' },
  { id: 'dunk', name: 'Dunk', actor: 'Owen Hale', role: 'supporting', desc: 'Rocco / Bishop crew.' },
  { id: 'wyman', name: 'Wyman', actor: 'Harold Finch', role: 'supporting', desc: 'Classic car collector.' },
  { id: 'vicki', name: 'Vicki', actor: 'Paula Reed', role: 'supporting', desc: 'Azura Bay contact.' },
  { id: 'linda', name: 'Linda', actor: 'Grace Nolan', role: 'supporting', desc: 'Azura Bay contact.' },
];

export function charactersByRole(role) {
  return CHARACTERS.filter((c) => c.role === role);
}

export function characterById(id) {
  return CHARACTERS.find((c) => c.id === id) || null;
}
