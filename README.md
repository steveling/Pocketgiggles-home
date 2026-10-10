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

## Deploying

`.github/workflows/deploy.yml` publishes the site to GitHub Pages on every push to the
default branch. One-time setup:

1. **Settings → Pages → Source:** GitHub Actions.
2. **Settings → Pages → Custom domain:** `pocketgiggles.com`, then tick **Enforce HTTPS**
   once the certificate is issued.
3. **DNS at your registrar** for `pocketgiggles.com`:

   | Type  | Name | Value |
   |-------|------|-------|
   | A     | @    | 185.199.108.153 |
   | A     | @    | 185.199.109.153 |
   | A     | @    | 185.199.110.153 |
   | A     | @    | 185.199.111.153 |
   | AAAA  | @    | 2606:50c0:8000::153 |
   | AAAA  | @    | 2606:50c0:8001::153 |
   | AAAA  | @    | 2606:50c0:8002::153 |
   | AAAA  | @    | 2606:50c0:8003::153 |
   | CNAME | www  | steveling.github.io |

   Leave any existing `capy` record alone so the Capy game keeps working.
