# MindGuardLabs — Contractor Drop Page (v2 UX)

Static, Vercel-ready drop page for **MindGuardLabs** (Good Ground LLC). Primary audience: contractors and local home-service owners.

> **v2 (2026-09-14):** Museum-grade redesign — 3 featured interactive demos (phone SMS, Social Engine approve→calendar, Grok+Hermes kanban), fixed CTAs (mailto until Stripe/calendar), mobile hamburger + sticky CTA, compact proof chips. See ops audit: `Hermes-Drop/ops/MONEY-SPRINT-DROP-PAGE-AUDIT.md`.

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy (Vercel)

```bash
npx vercel --yes
npx vercel --prod --yes
```

Project: `mindguardlabs-drop` → https://mindguardlabs-drop.vercel.app

## CTAs — replace before paying traffic

All Book links currently use:

`mailto:hello@mindguardlabs.com?subject=...`

HTML comments mark each spot. **Cody:** swap for real Stripe Checkout / calendar URL. Never leave `{{BOOKING_LINK}}` as href.

## Pricing (locked)

| Package | Price |
|---|---|
| Install Intensive | **$497** |
| Social Engine | **$1,997** |
| Team Agent Stack | **$3,497** |
| Growth Care | **$497/mo** |
| Bundle (Social + Team) | **$4,997** |

Do **not** put $20 / $250 sprint prices on this page. No invented testimonials.

## Featured demos (v2)

1. **Missed-call text-back** — iPhone UI: Run → miss → SMS thread → estimate chip → maps $497  
2. **Social Engine** — toggles IG/FB/Google + Approve → calendar chips → $1,997  
3. **Team Agents** — Grok desk chips + Hermes kanban with animated handoff → $3,497  

Also-available (pills only): estimate follow-up, reminders, review ask, speed-to-lead, field report.

## Hard stops

- No secrets in repo or chat
- No invented MindGuardLabs testimonials
- Prefer PR to `main`; do not force-push `main`

## Files

- `index.html` · `styles.css` · `app.js`
- `docs/LOOM-SHOT-LIST.md` — filming checklist (legacy A–H shot list still useful)
- `vercel.json` — static headers
