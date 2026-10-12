# Pocket Giggles

Homepage for **pocketgiggles.com** — tiny games for kids, each tucked into a pocket.

Plain static site, no build step: `index.html`, `styles.css`, `script.js`, `favicon.svg`.
Open `index.html` in a browser, or serve the folder from any static host.

## Adding a game

Copy the `pocket--capy` `<a>` in `index.html`, change the `href`, the patch title, and
`--fabric` / `--pk-thread` colors (see `.pocket--zoom` in `styles.css`). Swap it in for one
of the `pocket--soon` mystery pockets.

## Secrets 🤫

Spoilers live at the top of `script.js`. Handy for testing: `?night` / `?day` force the
time of day, and `localStorage` keys starting with `pg:` hold coin progress.

## Deploying

Hosted on Cloudflare (Workers static assets), like the Capy game at `capy.pocketgiggles.com`.
The `pocketgiggles-home` Worker is connected to this repo with Workers Builds, so every push to the
default branch deploys automatically (deploy command: `npx wrangler deploy`, config in `wrangler.jsonc`).
`pocketgiggles.com` and `www.pocketgiggles.com` are attached to it as custom domains, and Cloudflare
manages their DNS records. `.assetsignore` lists files that are never served.
