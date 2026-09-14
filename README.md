# MindGuardLabs — Contractor Drop Page (v3)

Static, Vercel-ready drop page for **MindGuardLabs** (Good Ground LLC). Primary audience: HVAC / home-service owners who need a **job-recovery system**, not demo toys.

Live: https://mindguardlabs-drop.vercel.app

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

## CTAs — replace before paying traffic

All Book / Ask links currently use:

`mailto:hello@mindguardlabs.com?subject=...`

HTML comments mark each spot (`<!-- Cody: replace mailto with real Stripe/calendar booking URL -->`).

**Swap instructions:** search the repo for `mailto:hello@mindguardlabs.com` and replace each `href` with your Stripe Checkout or calendar URL. Never leave `{{BOOKING_LINK}}` as a raw href.

## Pricing (locked)

| Package | Price |
|---|---|
| Install Intensive | **$497** |
| Social Engine | **$1,997** |
| Team Agent Stack | **$3,497** |
| Growth Care | **$497/mo** |
| Bundle (Social + Team) | **$4,997** |

Do **not** put $20 / $39 / $250 as heroes. Soft NovaBloom chip only if space. No invented MindGuardLabs testimonials. Bloom Guard untouched.

## Conversion modules (v3)

0. Global spine: missed call → SMS → estimate → follow-up → job → review → social  
1. Sticky nav + mobile CTA bar (Book $497)  
2. Hero + live iPhone mock  
3. Job-Recovery System 7-step diagram with package badges  
4. Demo A — missed-call text-back → $497  
5. Demo B — Social Engine toggles + calendar chips → $1,997  
6. Demo C — Grok desk + Hermes Run board → $3,497  
7. Also-in Intensive/Care pills  
8. Packages + graduation strip  
9. Industry proof (cited only)  
10. How it works + ownership  
11. FAQ  
12. Final CTA band  

See `CHANGELOG.md`.

## Hard stops

- No secrets in repo or chat  
- No fake clients / invented testimonials  
- Prefer PR to `main`; do not force-push `main`

## Files

- `index.html` · `styles.css` · `app.js`  
- `vercel.json` — static headers  
- `docs/LOOM-SHOT-LIST.md` — filming checklist (legacy)
