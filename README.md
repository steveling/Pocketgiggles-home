# Pocket Giggles

Homepage for **pocketgiggles.com** — tiny games for kids, each tucked into a pocket.

Plain static site, no build step: `index.html`, `styles.css`, `script.js`, `favicon.svg`.
Open `index.html` in a browser, or serve the folder from any static host.

## Adding a game

Copy the `pocket--capy` `<a>` in `index.html`, change the `href`, the patch title, and
`--fabric` / `--pk-thread` colors (see `.pocket--pink` in `styles.css`). Swap it in for one
of the `pocket--soon` mystery pockets.

## Secrets 🤫

Spoilers live at the top of `script.js`. Handy for testing: `?night` / `?day` force the
time of day, and `localStorage` keys starting with `pg:` hold coin progress.
