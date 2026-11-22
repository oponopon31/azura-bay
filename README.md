[![make.fun · gta6-01](https://make.fun/badge/gta6-01.svg)](https://make.fun/bounty/gta6-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)
[![rank](https://make.fun/badge/gta6-01/oponopon31/azura-bay/rank.svg)](https://make.fun/bounty/gta6-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)
[![reward](https://make.fun/badge/gta6-01/oponopon31/azura-bay/reward.svg)](https://make.fun/bounty/gta6-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)

Built for the [make.fun gta6-01 bounty](https://make.fun/bounty/gta6-01).

# AZURA BAY — open-world crime game (make.fun gta6-01)

An original open-world game set in Solmaris: 91 story missions across 5 chapters
(Keys, Cages and Currents, Cold Water, Neon and Fast Money, Azura Bay, Baby,
The Last Run), 69 weapons, 245 vehicles, 61 cheats, 13 Strangers &
Freaks, 24 radio stations, a full Solmaris map from verified coastatlas coordinates,
27 characters, Criminal Profile (5 levels), 4 organic endings, Wanted & Heat,
smartphone apps, properties, attributes, and a dispatch / objective / dialogue HUD.

## Content

- **Story:** 91 missions, 5 chapters. Endings emerge organically from BuckMe
  savings, the Cole–Mara relationship, Criminal Profile, and mission choices.
  Good Ending 1 reads BuckMe **savings** (>= $40,000), never wallet cash
  (cash is capped at $20,000).
- **Weapons:** 66 user weapons (16 sidearms with the exact names from the spec
  — Girardi ES9, Klose K17, Scorpio Nipper .38, Fairview Kalinga .50, Scorpio
  Akulus, … — plus 37 longarms, 9 melee, 4 explosives) + 3 clearly-marked
  coordinator additions (Minigun, Railgun, Firework Launcher).
- **Vehicles:** 245 models across supercars, sports, muscle, sedans, SUVs,
  off-road, motorcycles, boats, aircraft, trains and commercial.
- **Cheats:** 61 (Player 20, Combat 11, Vehicle Spawn 11, Environment 3,
  Screen Filters 16). Post-story only; each needs an unlock challenge;
  activating one disables trophies and saving. Money $250,000 is the only
  money cheat.
- **Map:** Solmaris with 26 verified coastatlas coordinates (Breakwater Quarry
  corrected to -4462/-922; Pelican Key airfield separate from ABIA), 6 regions,
  5 counties, Fog of War, waypoint / Map Index / quick navigation.
- **Audio:** original generative WebAudio synth per station genre — no licensed
  music. The in-fiction album "AZURA BAY: The Album" (34 songs,
  score by Justice) is named in the radio data; the game synthesises its own
  tracks.

## Run

- Play: `node serve.ts` then open http://127.0.0.1:8080/ (health: /__health).
- Build the dossier: `node main.ts` — preflight checks the entrypoint, counts
  content, validates shots + screenshots, copies game/ + screenshots/ to
  output/ and writes output/dossier.json.
- Self-test: `node --experimental-default-type=module game/src/selftest.js`
  (46 checks against SPEC.md + MAP-DATA.md).

## Controls

WASD / arrows move · Shift sprint / aim · E interact · M map · P pause.
Phone: D-Pad Up (cheats: phone + hold L1+R1 / LB+RB + D-Pad combo).

## Source of truth

`SPEC.md` (the user's full spec) and `MAP-DATA.md` (coastatlas map data).
