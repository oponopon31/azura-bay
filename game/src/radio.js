// radio.js — 24+ radio stations, SPEC §8.
// Playable in vehicles AND on foot via phone headphones (Radio Wheel).
// Audio is original generative WebAudio synth — NO licensed music.
// In-fiction album "AZURA BAY: The Album" (34 songs), score by Justice
// (named as the in-fiction album; the game synthesises its own tracks).
export const STATIONS = [
  { id: 'flash', name: 'Flash FM', genre: 'Pop', hosts: ['Robyn', 'Alex Consani'], artists: ['Charli xcx', 'Zara Larsson', 'Dua Lipa'] },
  { id: 'cocoteo', name: 'Cocoteo FM', genre: 'Latin/Reggaeton', hosts: ['Bad Bunny', 'RaiNao'], artists: ['Bad Bunny — El Martillo', 'RaiNao — La Gata'] },
  { id: 'dirtysouth', name: 'Dirty South Classics', genre: 'Southern Rap/Hip-Hop', hosts: ['Trick Daddy', 'Trina'], artists: [] },
  { id: 'abrr', name: 'ABRR', genre: 'Modern Rap', hosts: ['JT', 'DJ Stevie J'], artists: [] },
  { id: 'honey', name: 'Honey FM', genre: '90s R&B & Soul', hosts: ['Chilli', 'T-Boz (TLC)', 'Craig Robinson'], artists: ['Craig Robinson — Liquid Wilson'] },
  { id: 'backcountry', name: 'Back Country Radio', genre: 'Country', hosts: ['Morgan Wallen', 'Lana Del Rey', 'Jeremy Dufrene'], artists: ['Morgan Wallen — MW', 'Lana Del Rey — Delta Dawne'] },
  { id: 'chamber', name: 'The Chamber 106.6', genre: 'Metal', hosts: ['Kerry King', 'Tom Araya (Slayer)'], artists: [] },
  { id: 'bayrock', name: 'Bay Rock', genre: 'Hard Rock/Heavy Metal', hosts: ['Lindsey Buckingham', 'Michael McDonald'], artists: [] },
  { id: 'abfm', name: 'Azura Bay FM', genre: '80s Pop/Hits', hosts: ['"Weird Al" Yankovic', 'Brigitte Nielsen'], artists: [] },
  { id: 'emotion', name: 'Emotion 98.3', genre: 'Soft Rock/Ballads', hosts: ['Doug Stanhope'], artists: [] },
  { id: 'afrobank', name: 'AfroBank FM', genre: 'African/Afrobeats', hosts: ['Burna Boy', 'Palms Trax'], artists: [] },
  { id: 'stockyard', name: 'Stockyard FM', genre: 'Indie/Dance', hosts: ['PinkPantheress', 'The Dare'], artists: [] },
  { id: 'circoloco', name: 'CircoLoco Records Radio', genre: 'Electronic/Dance', hosts: ['Seth Troxler', 'Antonio Carbonaro'], artists: [] },
  { id: 'kaleidoscope', name: 'Kaleidoscope FM', genre: 'Dance', hosts: ['Jeremy Irons (DJ Dicky)'], artists: [] },
  { id: 'gloriana', name: 'Gloriana Blues Radio', genre: 'Blues', hosts: ['Buddy Guy', 'Keith Richards'], artists: [] },
  { id: 'jazz', name: 'Solmaris Jazz', genre: 'Jazz', hosts: ['Randy Brecker', 'Stanley Clarke', 'Yussef Dayes'], artists: [] },
  { id: 'laola', name: 'Radio La Ola', genre: 'Latin Classics', hosts: ['Gloria Estefan', 'Emilio Estefan'], artists: [] },
  { id: 'onu', name: 'Radio On-U', genre: 'Reggae/Dub', hosts: ['Adrian Sherwood'], artists: [] },
  { id: 'symphony', name: 'Symphony FM', genre: 'Classical', hosts: ['Yuja Wang'], artists: [] },
  { id: 'worldwide', name: 'Worldwide FM', genre: 'House/Jazz/Worldbeat', hosts: ['Gilles Peterson'], artists: [] },
  { id: 'wipe', name: 'The Wipe', genre: 'Talk/Pop', hosts: ['Anitta'], artists: [] },
  { id: 'perla', name: 'La Perla Sniper', genre: 'Hip-Hop', hosts: ['Kodak Black'], artists: [] },
  { id: 'earlycareer', name: 'Early Career AF Radio', genre: 'Talk/Hip-Hop', hosts: ['Charlamagne tha God', 'Ivy Rivera'], artists: [] },
  { id: 'wktt', name: 'WKTT', genre: 'Talk Radio', hosts: ['Sam Rourke', 'Stavros Halkias'], artists: [] },
];

export const ALBUM = { name: 'AZURA BAY: The Album', tracks: 34, score: 'Justice' };

export function stationByGenre(genre) {
  return STATIONS.filter((s) => s.genre === genre);
}

export function stationById(id) {
  return STATIONS.find((s) => s.id === id) || null;
}
