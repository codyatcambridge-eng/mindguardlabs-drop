# MindGuardLabs — Contractor Drop Page

Static, Vercel-ready drop page for **MindGuardLabs** (Good Ground LLC). Primary audience: contractors and local home-service owners.

## Local preview

```bash
# from repo root
python3 -m http.server 8080
# open http://localhost:8080
```

Or open `index.html` directly in a browser.

## Deploy (Vercel)

```bash
npx vercel --yes
# production:
npx vercel --prod --yes
```

Or connect the GitHub repo at [vercel.com/new](https://vercel.com/new) and import `codyatcambridge-eng/mindguardlabs-drop`.

This is a static site (`index.html` + `styles.css` + `app.js`). No build step required.

## Placeholders — replace before launch

| Token | Purpose |
|---|---|
| `{{BOOKING_LINK}}` | Fit-call / calendar URL (all Book CTAs) |
| `{{CONTACT}}` | Email or contact form URL |
| `{{CLIENT_NAME}}` / `{{TRADE}}` / `{{LOCATION}}` / `{{QUOTE}}` | Real client review cards only |
| `{{Shop}}` | Demo SMS shop name (optional polish) |

### Client reviews (integrity)

- Section **B** under “What owners report” uses empty cards with `data-placeholder="true"`.
- **Do not invent** MindGuardLabs customers, cities, star ratings, or quotes.
- When you have a real client note: replace placeholders, remove `data-placeholder="true"` (or hide the helper label), and keep the service line accurate.
- Industry cards are **cited public sources** — never rebrand them as MindGuardLabs clients.

## Pricing (locked on this page)

| Package | Price |
|---|---|
| Install Intensive | **$497** |
| Social Engine | **$1,997** |
| Team Agent Stack | **$3,497** |
| Growth Care | **$497/mo** |
| Bundle (Social + Team) | **$4,997** |

Do **not** put $20 / $250 sprint prices on this page.

## Demos A–H

Interactive before/after mocks (no live Make/Meta/Twilio/Stripe keys):

- A Missed-call text-back → $497
- B Speed-to-lead → $497
- C Estimate follow-up → $497
- D Social Engine board → $1,997
- E Social DM → lead card → $1,997
- F Post-job review ask → $497
- G Grok Bot team desk → $3,497 (FEATURED)
- H Hermes Agent kanban → $3,497 (FEATURED)

## Loom shot list

See [`docs/LOOM-SHOT-LIST.md`](docs/LOOM-SHOT-LIST.md) — eight 20–40s walkthroughs to film later and swap for mocks.

## Hard stops

- No secrets in repo or chat
- No auto-send outreach
- No invented MindGuardLabs testimonials
- Bloom Guard untouched
- Prefer PR to `main`; do not force-push `main`

## Files

- `index.html` — full page
- `styles.css` — mobile-first dark slate + teal/amber
- `app.js` — before/after toggles + Run after animations
- `docs/LOOM-SHOT-LIST.md` — filming checklist
