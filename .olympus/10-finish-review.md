# 10 — Finish review

Independent, read-only pass. Written from the reports of the `independent-critic` specialist
(a separate agent that did not build the site; no file access beyond reading). The author
transcribed the verdicts and defects; nothing was softened.

## Scope

- Route reviewed: `/` (plus legal pages by source)
- Viewports: 1440, 390 (screenshots `.olympus/screenshots/after-*`, `reserve-*`)
- Evidence read: `DESIGN.md`, `design.json`, `06-build-plan.md`, `06a-amendment.md`, `07-qa.md`,
  all live components/scripts/styles, `dist/` sizes (gzip measured by the reviewer)
- Reviewer: Apollo `independent-critic` (visual-qa + award-rubric), two passes
- Date: 2026-10-22

## Score

| Axis | Pass 1 (b5b835c) | Pass 2 (fb3db08) | Note |
|---|---:|---:|---|
| Design /40 | 32 | **36** | Ramp, Fenster, WebGL contract faithful; ember discipline restored |
| Usability /30 | 24 | **27** | Failsafe, focus order, contrast fixed; first-visit LCP over target |
| Creativity /20 | 17 | **17** | Windows-as-spine, hearth, loader closing onto window 00 |
| Content /10 | 10 | **10** | All facts from `site.ts`; no `neverSay`, no form, no invented claims |
| **Total /100** | 83 | **90** | |

**Verdict:** PASS WITH NOTES (both passes).

## Against the committed design system (final)

| Token / rule | Committed | Built | Drift |
|---|---|---|---|
| Hero ramp | 140 / 112 / 72 / 56 fixed | same, `--t-hero` | none — **140 px = 9.72 vw at 1440** |
| Other type steps | DESIGN.md | match | none |
| Ground / night | paper; night in windows, band, footer (+ loader, amended) | as committed | none |
| Ember UI | button, focus ring, hearth hairline (+ loader/favicon on night) | same | none |
| Hearth hairline | ember on night 5.68:1 | ember fill in 4 px night track on mat | none |
| Fenster | mat 12, 1 px line, r 2, ≤ 840, no scrim | same; `.fenster__glare` 5–10 % screen veil | minor |
| Video | ≤ 720 / 480 lines, crop x+w ≤ 1620 | asserted in `encode-windows.mjs`; max 1620 | none |
| Motion | settle, reveals, one scrub | same + hover-only magnetic/sweep on CTA | minor |
| Glass | specific effect with light behind (06a) | header, dock, tiles, dish preview, reserve card | none |
| Radius / palette | 2 px; 11 tokens | glass radii 14–18 / 999; `--lake`, status green | accepted debt |

## Defects (remaining after the bound)

| # | Severity | Defect | Status |
|---|---|---|---|
| 1 | Medium | First-visit LCP over 2.0 s on slow 4G (390: 2.09–2.12 s poster; 1440: 2.35 s loader video). Repeat visits ≈ 0.5 s. | open — cost of the requested intro; re-measure on Pages with PSI |
| 2 | Low | Reservation glass card overlaps window 09 — a second type/picture seam | open — argued in `06a` (glass in front of the lake is the effect) |
| 3 | Low | Window 09 built outside `Fenster`; rail/loader count stop at 08 | open |
| 4 | Low | Failsafe on very slow networks cuts the loader without a transition after 6 s | open |
| 5 | Low | Open days hard-coded | **fixed after review** (parsed from `openingHours`) |
| 6 | Low | Radius/palette drift | accepted debt |
| 7 | Low | Glare veil over media | open |
| 8 | Low | No 390 evidence of the closing band | **fixed** — `screenshots/reserve-390-top.jpg`, `reserve-1440-top.jpg` |
| 9 | Low | Hero composition slack under GLUT at 1440 | open |

Loop bound reached (one fix round, review re-run once). Remaining items are presented to the
user in `09-handoff.md`, not looped.
