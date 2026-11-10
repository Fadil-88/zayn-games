# Zayn's Arcade

Browser games made by Zayn and Claude. Play them at **https://fadil-88.github.io/zayn-games/**

| Game | Link | For |
| --- | --- | --- |
| Dino Chase | [/dino/](https://fadil-88.github.io/zayn-games/dino/) | First-person dino adventure, 8 worlds and two bosses |
| Nebula Raiders | [/nebula/](https://fadil-88.github.io/zayn-games/nebula/) | Classic-style arcade space shooter |
| Zayn's Chess | [/chess/](https://fadil-88.github.io/zayn-games/chess/) | Play Claude, or learn the Halloween Gambit |
| Times Table Rocket | [/times/](https://fadil-88.github.io/zayn-games/times/) | Learn the 1 to 12 times tables with spaced repetition |
| Spelling Safari | [/spelling/](https://fadil-88.github.io/zayn-games/spelling/) | Zayn's 103 spelling words: unscramble, fill the gaps, spot the mistake, with spaced repetition |
| Balloon Pop | [/balloons/](https://fadil-88.github.io/zayn-games/balloons/) | Tap-to-pop balloons for little ones |

Each game is a single self-contained `index.html` in its own folder, served by GitHub Pages from the `main` branch. The one exception is Spelling Safari, whose word list lives in `spelling/words.js` so a new school list can be swapped in without touching the game.

## Offline play

`sw.js` (a service worker) saves every game on the device the first time the arcade is opened online; after that the arcade works with no internet. When online it always loads the newest version from GitHub and saves it. The home page footer shows "✅ Saved on this device" once everything is stored. **When adding a new game, add its folder name to `GAMES` in `sw.js`** (and to the list in the home page's offline check) so it's saved for offline play too. `manifest.webmanifest` lets the arcade be added to a phone or tablet home screen as an app.
