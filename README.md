# azura-bay

[![make.fun · gta6-01](https://make.fun/badge/gta6-01.svg)](https://make.fun/bounty/gta6-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)
[![rank](https://make.fun/badge/gta6-01/oponopon31/azura-bay/rank.svg)](https://make.fun/bounty/gta6-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)
[![reward](https://make.fun/badge/gta6-01/oponopon31/azura-bay/reward.svg)](https://make.fun/bounty/gta6-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-01)

**AZURA BAY** is a sun-soaked coastal open-world crime game that runs entirely in a desktop browser from static files. You play Rio, a driver fresh back in town and in debt to crew boss Mara Voss. Steal cars off the street and drive them through a living city of traffic, pedestrians, neon and golden-hour light; dodge a real wanted system — police cars that chase and ram, foot cops, roadblocks and a helicopter at three stars and up; and run five story missions, from a hot-car delivery to a harbor heist finale, earning cash that actually lands in your pocket. It has on-foot and drive-by combat, a HUD with a live minimap, synthesized WebAudio engine hum, sirens and radio, and saves that persist in localStorage. Everything is original: the city, the characters, the cars, the story and the sound — built with three.js, no network requests at runtime.

## Run

```sh
node serve.ts
# open http://localhost:8080
```

Play with keyboard and mouse: WASD to walk and drive, mouse to look, click to shoot, E to enter or exit a car, F to punch, M for the mission list, R for the radio, Esc to pause and save. Run the entry build with `MAKEFUN_OUTPUT_DIR=out node main.ts`.

## Tech

- `game/` — plain static files; `game/index.html` plus one clear job per file under `game/src/` (city, vehicles, pedestrians, driving, police, combat, missions, HUD, audio, save, shots, self-test).
- `game/vendor/three.module.min.js` — vendored three.js (minified build).
- `screenshots/` — four real in-browser captures, posed deterministically via `?shot=` queries (`shots.json`).
- `main.ts` — the make.fun entry program (copies `game/` + `screenshots/` and writes `dossier.json`).

Built for [make.fun](https://make.fun/?ref=m5sdmdqp) — gta6-01, "Make GTA 6".
