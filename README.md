# AZURA BAY — a GTA 6 game

A 2D top-down open-world game set in Leonida (Vice City, Leonida Keys,
Grassrivers, Port Gellhorn, Ambrosia, Mount Kalaga). Play as Jason Duval
and Lucia Caminos through 91 missions in 5 chapters, with the full GTA 6
feature set: weapons, cheats, radio, map, Wanted & Heat, smartphone,
properties, attributes, Criminal Profile, 4 endings, and a 4-corner HUD.

## Play

```sh
node serve.ts --host 127.0.0.1 --port 8000
# open http://127.0.0.1:8000/
```

## Build

```sh
node main.ts
# writes /output (game/ + screenshots/ + dossier.json)
```

## Selftest

```sh
node game/src/selftest.js
# 46/46 tests
```

## Contents

- **91 missions** in 5 chapters (Just Like Paradise, Paradise Lost,
  Tits, Ass, Drug Money, Vice City, Baby, Top of the World, Ma)
- **69 weapons**: 16 sidearms (exact names), 37 longarms, 9 melee,
  4 explosives, 3 special
- **245 vehicles** (122 named, rest generated from brands)
- **61 cheats** (unlock after finishing all 91 missions; cheats disable
  trophies and saving; money cheat $250,000 is the only money cheat)
- **13 Strangers & Freaks**, **24 radio stations**, **27 characters**
- **Leonida map** with 26 verified gtabase coordinates
- **Criminal Profile**: Professional / Hardened / Violent & Dangerous /
  Psycho / Irredeemable
- **4 endings** — Good 1 is decided by BuckMe **savings** (>= $40,000),
  not cash (cash is capped at $20,000)
- **Wanted & Heat**: hollow / solid / blinking / red / 6-star manhunt
- **Smartphone**: 10 apps (BuckMe, WhatUp!, Lifeinvader, Eyefind,
  Music/Radio, Camera & Wildlife Logbook, RydeMe, Wink App,
  Scooter Bros, Snapmatic)
- **4-corner HUD**: health/stamina/focus/oxygen/adrenaline (top-left),
  minimap + vehicle warnings (bottom-left), Wanted/weapon/cash/BuckMe
  (top-right), Criminal Profile + Relationship (bottom-right)
- **1,242 collectibles**, **397 stunts**, **500+ random events**,
  **20 mysteries**, **35 fish**, **32 challenges**, **24 gun shops**

## License

MIT. See LICENSE.
