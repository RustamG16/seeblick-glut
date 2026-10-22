# 08 — Metrics (targets only)

No analytics exist on this site and none were installed (the Datenschutz text promises no
tracking cookies). Everything below is a **target or a measurement plan**, not a result.

## Business outcome

| Signal | Target | How it could be measured without tracking |
|---|---|---|
| Friday/Saturday dinner fully booked by 19:00 | every week in season | owner's reservation book, weekly tally |
| Calls during service about Mondays, parking, terrace, gluten-free | → near zero | owner tallies "FAQ calls" for two weeks before and after launch |
| Reservations arriving by e-mail vs phone | e-mail share rises | count of `reservierung@` messages per week |

## Page behaviour (if the client later opts into privacy-friendly analytics, e.g. Plausible)

| Event | Element | Why |
|---|---|---|
| `tel_click` | header phone, Praktisches tile, closing band, mobile dock | primary action |
| `mail_click` | closing band e-mail, Feste "Anfragen" | secondary action |
| `reach_reserve` | `#reservieren` ≥ 50 % visible | did the page carry them to the action |
| `map_click` | "Auf Karte anzeigen" | arrival intent |

## Performance targets (from 06-build-plan.md, see 07-qa.md for what was measured)

LCP ≤ 2.0 s on 4G · INP ≤ 200 ms (incl. §4) · CLS 0 · first-view ≤ 350 KB before video ·
three.js chunk ≤ 170 KB gz · video ≤ 9 MB desktop / 4.5 MB mobile · §4 ≥ 55 fps desktop / ≥ 30 fps mobile.

Re-measure on the deployed GitHub Pages URL with PageSpeed Insights (mobile) after launch.
