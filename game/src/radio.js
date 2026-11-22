// radio.js — 24+ radio stations, SPEC §8.
// Playable in vehicles AND on foot via phone headphones (Radio Wheel).
// Audio is original generative WebAudio synth — NO licensed music.
// In-fiction album "AZURA BAY: The Album" (34 songs), score by the Solmaris Sound Collective
// (named as the in-fiction album; the game synthesises its own tracks).
export const STATIONS = [
  { id: 'neon', name: 'Neon FM', genre: 'Pop', hosts: ['Mira Sol', 'Alexa Voss'], artists: ['Luna Rey', 'Zara Lane', 'Nia Ray'] },
  { id: 'cocoteo', name: 'Cocoteo FM', genre: 'Latin/Reggaeton', hosts: ['El Conejo', 'Raina'], artists: ['El Conejo — El Martillo', 'Raina — La Gata'] },
  { id: 'dirtysouth', name: 'Dirty South Classics', genre: 'Southern Rap/Hip-Hop', hosts: ['Trick D', 'Tina Vee'], artists: [] },
  { id: 'abrr', name: 'ABRR', genre: 'Modern Rap', hosts: ['Jae Tee', 'DJ Stevie'], artists: [] },
  { id: 'honey', name: 'Honey FM', genre: '90s R&B & Soul', hosts: ['Chili P', 'Tee Boz', 'Craig Roberts'], artists: ['Craig Roberts — Liquid Wilson'] },
  { id: 'backcountry', name: 'Back Country Radio', genre: 'Country', hosts: ['Morgan Wells', 'Lana Del Mar', 'Jeremy Duval'], artists: ['Morgan Wells — MW', 'Lana Del Mar — Delta Dawn'] },
  { id: 'chamber', name: 'The Chamber 106.6', genre: 'Metal', hosts: ['Kerry Knight', 'Tom Arden'], artists: [] },
  { id: 'bayrock', name: 'Bay Rock', genre: 'Hard Rock/Heavy Metal', hosts: ['Lindsey Brooks', 'Michael Mack'], artists: [] },
  { id: 'abfm', name: 'Azura Bay FM', genre: '80s Pop/Hits', hosts: ['Al Yanez', 'Brigitte Nola'], artists: [] },
  { id: 'sunset', name: 'Sunset 98.3', genre: 'Soft Rock/Ballads', hosts: ['Doug Stanton'], artists: [] },
  { id: 'afrobank', name: 'AfroBank FM', genre: 'African/Afrobeats', hosts: ['Ember Boy', 'Palm Trax'], artists: [] },
  { id: 'stockyard', name: 'Stockyard FM', genre: 'Indie/Dance', hosts: ['Pink Panther', 'The Brave'], artists: [] },
  { id: 'solstice', name: 'Solstice Records Radio', genre: 'Electronic/Dance', hosts: ['Seth Turner', 'Antonio Carbona'], artists: [] },
  { id: 'kaleidoscope', name: 'Kaleidoscope FM', genre: 'Dance', hosts: ['Jerry Irons (DJ Ricky)'], artists: [] },
  { id: 'gloriana', name: 'Gloriana Blues Radio', genre: 'Blues', hosts: ['Buddy Gale', 'Keith Rickards'], artists: [] },
  { id: 'jazz', name: 'Solmaris Jazz', genre: 'Jazz', hosts: ['Ronnie Brewer', 'Stanley Clark', 'Yusuf Day'], artists: [] },
  { id: 'laola', name: 'Radio La Ola', genre: 'Latin Classics', hosts: ['Gloria Esteban', 'Emilio Esteban'], artists: [] },
  { id: 'onu', name: 'Radio On-U', genre: 'Reggae/Dub', hosts: ['Adrian Shaw'], artists: [] },
  { id: 'symphony', name: 'Symphony FM', genre: 'Classical', hosts: ['Yuna Wang'], artists: [] },
  { id: 'globalgroove', name: 'Global Groove FM', genre: 'House/Jazz/Worldbeat', hosts: ['Giles Peters'], artists: [] },
  { id: 'wipe', name: 'The Wipe', genre: 'Talk/Pop', hosts: ['Anita'], artists: [] },
  { id: 'perla', name: 'La Perla Sniper', genre: 'Hip-Hop', hosts: ['Kodak Blue'], artists: [] },
  { id: 'earlycareer', name: 'Early Career AF Radio', genre: 'Talk/Hip-Hop', hosts: ['Charlamagne', 'Ivy Rivers'], artists: [] },
  { id: 'wazb', name: 'WAZB', genre: 'Talk Radio', hosts: ['Sam Roarke', 'Stavros Hal'], artists: [] },
];

export const ALBUM = { name: 'AZURA BAY: The Album', tracks: 34, score: 'Solmaris Sound Collective' };

export function stationByGenre(genre) {
  return STATIONS.filter((s) => s.genre === genre);
}

export function stationById(id) {
  return STATIONS.find((s) => s.id === id) || null;
}
