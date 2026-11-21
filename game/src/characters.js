// characters.js — The 25-character roster (SPEC Bab 15).
// Bio + voice-actor NAME as text only (credits / bio screen). No copyrighted
// or cloned voices — the game never plays a VA recording; the names are
// credits, nothing more. Vicki & Linda are listed after the 25 in the spec;
// they are included here as `roster: false` extras, not part of the 25.
// Round 5: table rows re-expressed one field per line. Values unchanged.

export const CHARACTERS = [
  {
    id: 'lucia',
    name: 'Lucia Caminos',
    va: 'Manni L. Perez',
    role: 'Protagonist',
    roster: true,
    bio: 'Fresh out of Leonida Penitentiary, back from Liberty City. Her father trained her to fight since she was a kid — ambitious, smart, strategic, the planner. The first female lead of a mainline GTA.',
  },
  {
    id: 'jason',
    name: 'Jason Duval',
    va: 'Dylan Rourke',
    role: 'Protagonist',
    roster: true,
    bio: 'Army veteran who grew up around grifters and criminals, a smuggler for a local Leonida Keys boss. Calm, loyal, a wheelman and a gunman — the field executor. Bonnie & Clyde, Leonida style.',
  },
  {
    id: 'brian',
    name: 'Brian Heder',
    va: 'Stephen Root',
    role: 'Central',
    roster: true,
    bio: 'Senior drug smuggler in the Leonida Keys. Relaxed, sly, and always one step ahead — he gives Jason free housing and expects dirty work in return.',
  },
  {
    id: 'cal',
    name: 'Cal Hampton',
    va: 'Bobby Moynihan',
    role: 'Central',
    roster: true,
    bio: "Jason's best friend and Brian's partner. A paranoid conspiracy theorist who watches the Coast Guard on the radio with a beer in his hand.",
  },
  {
    id: 'boobie',
    name: 'Boobie Ike',
    va: 'Mike Forbs',
    role: 'Central',
    roster: true,
    bio: 'Vice City street legend turned legal empire: real estate, the Jack of Hearts club, and a recording studio.',
  },
  {
    id: 'drequan',
    name: "Dre'Quan Priest",
    va: 'Naiqui Macabroad',
    role: 'Central',
    roster: true,
    bio: 'Founder of Only Raw Records and Boobie Ike\'s partner — the label behind the city\'s sound.',
  },
  {
    id: 'baeluxe',
    name: 'Bae-Luxe',
    va: 'Hood Brat',
    role: 'Central',
    roster: true,
    bio: 'One half of Real Dimez, the Vice City rap duo — best friends since high school, viral on social media, signed to Dre\'Quan\'s label.',
  },
  {
    id: 'roxy',
    name: 'Roxy',
    va: 'Krissy Celess',
    role: 'Central',
    roster: true,
    bio: 'The other half of Real Dimez — Vice City\'s loudest rap duo, best friends since high school.',
  },
  {
    id: 'raul',
    name: 'Raul Bautista',
    va: 'Manny Perez',
    role: 'Central',
    roster: true,
    bio: 'A veteran bank robber — confident, charismatic, and willing to take extreme risks. He recruits Jason & Lucia for the big heist.',
  },
  {
    id: 'lori',
    name: 'Lori Heder',
    va: 'Orlagh Cassidy',
    role: 'Supporting',
    roster: true,
    bio: "Brian's wife — the steady hand behind the Keys smuggling operation.",
  },
  {
    id: 'donnie',
    name: 'Donnie Carter',
    va: 'Brad Carter',
    role: 'Supporting',
    roster: true,
    bio: "Jason's old, reckless partner — the kind of friend who always has a plan and never has a good one.",
  },
  {
    id: 'mendez',
    name: 'Captain Aldo Méndez',
    va: 'Chris McKinney',
    role: 'Supporting',
    roster: true,
    bio: 'A senior VCPD officer — the face of the law in Vice City, and the one who wants Lucia back inside.',
  },
  {
    id: 'andres',
    name: 'Andrés de León',
    va: null,
    role: 'Supporting',
    roster: true,
    bio: 'A Leonida fixer with old money and older debts.',
  },
  {
    id: 'petra',
    name: 'Petra Navarro',
    va: null,
    role: 'Supporting',
    roster: true,
    bio: 'A Leonida operator who knows every fence and every back door in the bay.',
  },
  {
    id: 'phil',
    name: 'Phil Cassidy',
    va: null,
    role: 'Supporting',
    roster: true,
    bio: "Runs Phil's Ammu-Nation — the gun store that has armed every crew in Leonida since before Jason was born.",
  },
  {
    id: 'billy',
    name: 'Billy',
    va: 'Spenser Granese',
    role: 'Supporting',
    roster: true,
    bio: 'Thrillbilly Mud Club — mud, trucks, and bad decisions in the Leonida swamps.',
  },
  {
    id: 'moses',
    name: 'Moses "Mo" Watkins',
    va: 'Aaron Morton',
    role: 'Supporting',
    roster: true,
    bio: 'Steals cars to order — a fence for wheels, and the man who knows which garage pays best.',
  },
  {
    id: 'pete',
    name: 'Pilot Pete',
    va: 'Carl Palmer',
    role: 'Supporting',
    roster: true,
    bio: 'A pilot for hire — if it flies over Leonida, Pete has flown it, legally or otherwise.',
  },
  {
    id: 'bret',
    name: 'Bret Vogel',
    va: 'Jariko Denman',
    role: 'Supporting',
    roster: true,
    bio: 'A Leonida businessman with a clean suit and a dirty ledger.',
  },
  {
    id: 'katerina',
    name: 'Katerina Rosselli',
    va: 'Edwina Rai',
    role: 'Supporting',
    roster: true,
    bio: 'A Leonida socialite whose parties are where the city\'s deals get made.',
  },
  {
    id: 'mattia',
    name: 'Mattia Tauro',
    va: 'Massi Pregoni',
    role: 'Supporting',
    roster: true,
    bio: 'A Leonida enforcer — quiet, patient, and never in a hurry to collect.',
  },
  {
    id: 'kenton',
    name: 'Kenton Rees',
    va: 'Machel Montano',
    role: 'Supporting',
    roster: true,
    bio: 'A Leonida promoter — if there is a party in the bay, Kenton is running it.',
  },
  {
    id: 'andy',
    name: 'Andy',
    va: 'Mallory Wu',
    role: 'Supporting',
    roster: true,
    bio: "The Cellerica connection — Andy moves what the city drinks.",
  },
  {
    id: 'dunk',
    name: 'Dunk',
    va: 'Brad Fleischer',
    role: 'Supporting',
    roster: true,
    bio: 'A Leonida wheelman with a lead foot and a short fuse.',
  },
  {
    id: 'wyman',
    name: 'Wyman',
    va: 'Dave Stishan',
    role: 'Supporting',
    roster: true,
    bio: 'A collector of classic cars — if it is rare and old and fast, Wyman wants it.',
  },
  {
    id: 'vicki',
    name: 'Vicki',
    va: 'Taryn Manning',
    role: 'Supporting',
    roster: false,
    bio: 'A Leonida local — listed after the 25-character roster in the spec.',
  },
  {
    id: 'linda',
    name: 'Linda',
    va: 'Lisa Emery',
    role: 'Supporting',
    roster: false,
    bio: 'A Leonida local — listed after the 25-character roster in the spec.',
  },
];

export const ROSTER = CHARACTERS.filter((c) => c.roster);

export function characterById(id) {
  return CHARACTERS.find((c) => c.id === id) || null;
}

// The roster as a live system: the HUD pause menu renders the cast
// credits from here (bio + voice-talent name as TEXT only — no audio,
// no cloned voices), and missions resolve their contact through byName.
export function createCharacters(Game) {
  return {
    list: CHARACTERS,
    roster: ROSTER,
    byId: characterById,
    byName(name) {
      const n = String(name || '').toLowerCase();
      return CHARACTERS.find((c) => c.name.toLowerCase() === n
        || c.name.toLowerCase().startsWith(n)) || null;
    },
    count() { return ROSTER.length; },
    protagonists() { return ROSTER.filter((c) => c.role === 'Protagonist'); },
  };
}

// ---- Round 3: roster lookup by role (HUD cast list filters on this) ----
export function charactersByRole(role) {
  return ROSTER.filter((c) => c.role === role);
}
