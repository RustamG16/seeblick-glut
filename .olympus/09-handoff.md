# 09 — Handoff · Gate C material

**SEEBLICK & GLUT — Fensterplatz.** Built from `06-build-plan.md` as amended by `06a-amendment.md`.
Live: https://rustamg16.github.io/seeblick-glut/ · branch `redesign/fensterplatz-plan`, merged to `main`.

## What changed

The black, full-bleed, scroll-scrubbed flipbook (130 MB of frames, Lenis) is gone. The new page is
warm parchment with nine numbered windows (00–08, plus the lake view 09) through which the dark,
fire-lit room is seen. Added on the user's instruction: glass (the restaurant's lake-facing pane),
a one-time intro with a Remotion wordmark that closes onto window 00, a three.js hearth stoked by
scroll, a live open/closed line from the real hours, a desktop window index, and a mobile
call/reserve dock.

## Before / after

| | Before | After |
|---|---|---|
| 1440 first view | `screenshots/before-1440-top.jpg` | `screenshots/after-1440-top.jpg` |
| 1440 full page | `screenshots/before-1440-full.jpg` | `screenshots/after-1440-full.jpg` |
| 390 first view | `screenshots/before-390-top.jpg` | `screenshots/after-390-top.jpg` |
| 390 full page | `screenshots/before-390-full.jpg` | `screenshots/after-390-full.jpg` |
| Closing band | — | `screenshots/reserve-1440-top.jpg`, `reserve-390-top.jpg` |

(Full-page captures repeat the fixed header at the bottom — capture artefact.)

## Payload against the plan's guardrails

| Guardrail | Target | Result |
|---|---|---|
| First-view transfer before video | ≤ 350 KB | ≈ 282 KB |
| HTML + CSS gz | ≤ 60 KB | 5.5 + 6.4 KB |
| Fonts | ≤ 180 KB | 176 KB |
| LCP poster | ≤ 70 KB | 62 KB |
| First-view JS gz | ≤ 45 KB | 31.5 KB |
| three.js chunk gz | ≤ 170 KB | 119.5 KB (+ ScrollTrigger 18.3 KB), lazy near §4 |
| Video desktop (7 × 720) | ≤ 9 MB | 8.2 MB |
| Video mobile (7 × 480) | ≤ 4.5 MB | 3.4 MB |
| Repo frame sequences | −130 MB | removed; `dist` 14 MB |
| LCP, slow 4G (1.6 Mbps, 150 ms, 4× CPU) | ≤ 2.0 s | repeat 0.47–0.50 s · first visit 2.09–2.12 s (390) / 2.35 s (1440) — **over by the intro** |
| CLS | 0 | 0 – 0.0045 |
| §4 frame budget | 16.6 / 33 ms | not measured (hidden-pane throttling); tiers degrade automatically |

Finish review: **90 / 100, PASS WITH NOTES** (`10-finish-review.md`).

## Asset provenance

| Asset | Source | Rights / note |
|---|---|---|
| F00, F01, F02, F05–F08, D2 | Studio's Google Flow (Veo) clips for this client, re-encoded by `scripts/encode-windows.mjs` | Watermark excluded by crop (x+w ≤ 1620, asserted) |
| D1, OG | `still_hero.jpg` (studio Flow still, clean) | — |
| F03 Seelicht | **Artlist** · Kling v3 Standard 720p, image-to-video from a Saal frame · 400 credits · 2026-10-22 | Artlist AI terms |
| D3 Kasnudeln | **Artlist** · Nano Banana 2 I2I 1K, style ref D2 · 90 credits | Artlist AI terms |
| F04 poster / hearth texture | **Artlist** · Nano Banana 2 I2I 1K from F00 frame · 90 credits | Artlist AI terms |
| 09 Seeblick (closing band) | **Artlist** · Nano Banana 2 I2I 2K from a Saal frame · 90 credits | Artlist AI terms |
| Wordmark intro | Rendered with Remotion 4.0.534 from `remotion/src/Wordmark.tsx` | Fraunces + Instrument Sans, SIL OFL |
| Fonts | Fontsource (Fraunces, Instrument Sans), self-hosted | SIL OFL |
| Icons | Lucide, inlined | ISC |

Artlist total: **670 of 1,000 credits** (balance before: 7,490). Raw generations are kept in
`assets-out/gen/`, Flow sources in `assets-out/src/` — both **local only** (git-ignored); the
originals remain in git history before commit `a5117fe`.

## Known debt

1. First-visit LCP 2.1–2.35 s on slow 4G because of the intro; re-check with PageSpeed Insights on the live URL. Remove or shorten the intro if it matters more than the moment.
2. Window 09 is hand-built (not `Fenster`); the rail and loader count stop at 08.
3. Glass radii (14–18 px) and two off-palette colours (`--lake`, status green) — accepted with the amendment.
4. `.fenster__glare` adds a 5–10 % light veil over media.
5. Very slow networks: the 6 s failsafe cuts the intro without a transition.
6. Hero leaves open space under GLUT at 1440.
7. Client data still placeholders: `ATU00000000` (UID), and whether `reservierung@seeblick-glut.at` is real.
8. Flow clips are watermarked at source; a clean re-export would recover the right 16 % of each frame.
9. `site` in `astro.config.mjs` points at GitHub Pages; set `SITE`/`BASE` for the real domain.

## How success is measured

`08-metrics.md` — no analytics installed; owner-side tallies (Fri/Sat booked by 19:00, FAQ calls during service), plus optional privacy-friendly events if the client opts in.

## 2026-10-26 — Redirect: "Die Speisekarte am See"

The client rejected Fensterplatz on mobile and on palette/vibe, reviewed four references
(`research/`) and chose Da Maria. Design: `06b-direction-speisekarte.md`, tokens in `DESIGN.md`.

- New: Karte section (menu with dotted leaders + engravings, Tagesmenü box, reservation column),
  red double page frame, running masthead marquee, rotating stamps, lake occasions marquee,
  pine Glut section and footer, butter mobile dock, Remotion intro re-cut on cream.
- Removed: glass material, dish hover preview, window rail (`glass.ts`, `dishes.ts`).
- Kept: video injection (`video.ts`), live status, three.js hearth + stoke scrub, intro gate.
- Engravings: 8 pen illustrations, Artlist Nano Banana 2 (2 sheets, 180 credits → total spend
  930 / 1,000), cut by `scripts/engravings.mjs` into `public/media/e-*.webp` (516 KB).
- First-view JS 8.8 KB raw (GSAP now lazy with three.js). Slow-4G: LCP 1.74 s first visit,
  1.20 s repeat, CLS 0 (`scripts/measure.mjs`). Screens: `screenshots/sk3/` (`SLICES=1 shoot.mjs`).
- Not done: independent critic pass on the new direction (author QA only this round).
