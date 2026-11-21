# spot-the-difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/qaxgg895/spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/qaxgg895/spot-the-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Harbour at Dusk — a complete spot-the-difference game: two near-identical hand-drawn harbour scenes, seven hidden differences, hints, a timer and sounds.

## Run it

```sh
node main.ts
```

`main.ts` hands the game in: it copies `game/` and `screenshots/` to `/output` and writes `/output/dossier.json`. To play it locally, serve `game/` with any static server (for example `python3 -m http.server -d game 8080`) and open http://localhost:8080 — click a difference on either picture to circle it. Keyboard: H hint, R restart, M sound.

---

<sub>Entered on [make.fun](https://make.fun/?ref=qaxgg895&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
