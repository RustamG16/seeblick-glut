# 06a — Amendment to the build plan (user instruction, 2026-10-22)

`06-build-plan.md` is unchanged (protected). This file records what the user's later
instruction in the implementation session changed, so the finish review scores against the
plan **as amended**, not against a plan the client has since overruled.

## The instruction

> make sure to make it responsive with latest design trends for resolutions with glasmorph
> shinny cards and other design trends · make new assets with artlist budget 1000 tokens ·
> Don't stop for approvals, I am afk · loading screen, logo animations (remotion) and other
> cool features you can add for a restraunt concept · update and push to publish to gitpages

## Changes, and how each was folded into Fensterplatz

| Plan said | Amended to | How it stays inside the direction |
|---|---|---|
| "glass/blur/glow" ruled out (00-brief) | **Glass is admitted as the restaurant's own material** — the floor-to-ceiling pane to the lake. Used for: header bar (after 80 px, content scrolls under it), the four Praktisches tiles, dish preview card, closing-band reservation card, mobile phone dock. (Hero chip and window rail were glass in pass 1; the review removed them as glass on bare paper.) | Glass never sits on paper alone: it always has light behind it (the warm/lake light in the Praktisches card, the fire behind the dish preview, the lake view behind the reservation card). Specular rim + sheen follow the pointer — the light on a pane, not decoration. Windows themselves stay matted, unscrimmed. |
| "loaders" refused | **One intro, once per session**: night pane with the Remotion-rendered wordmark, counts windows 00→08, then closes down onto window 00 (clip-path), handing the dark to the first window. Skipped for reduced motion, no-JS and repeat visits. Min 2.0 s / max 3.2 s (shortened after review). | The loader *is* a Fenster: the room before service, seen whole, then framed. |
| No logo asset (wordmark only) | **Remotion wordmark animation** (`remotion/src/Wordmark.tsx` → `public/media/wordmark-intro.mp4`, 174 KB): letters arrive ember-hot and cool to paper, the `&` stays ember and flickers, hearth hairline draws, sparks rise, motto settles. | Same Fraunces cut and ember as the page. |
| Kickers above section headings (plan §3–5) | **Removed** — impeccable craft floor bans eyebrows; the window captions already name each section. | Numbers/captions carry the navigation, as the plan intended. |
| Three generated assets pending approval | **Generated within the 1,000-credit budget (670 spent)**: V01 Seelicht (Kling v3 Std 720, 400), S01 Kasnudeln (Nano Banana 2, 90), S02 Glut poster (Nano Banana 2, 90), **S03 Seeblick** blue-hour lake view through the glass (new, 90) for the closing band. M01 GLB not generated (optional). | Provenance in `05`-style table in `09-handoff.md`. |
| — | **Added features**: live open/closed status from `site.ts` hours (Europe/Vienna); window index rail (desktop); phone dock (mobile); magnetic + light-sweep reservation button; pointer-lit glass. | All derived from facts in `site.ts`; nothing invented. |
| Ember appears 3× as UI | Ember UI: button (header, Praktisches, closing band, dock = one component), focus ring, hearth hairline — unchanged. Additional ember appears in the loader (Remotion `&`, fallback `&`) and the favicon, on night only. | Never text on paper. |
| Deploy not in scope | **GitHub Pages** at `https://rustamg16.github.io/seeblick-glut/` via Actions; `base` = `/seeblick-glut`. | — |

## Added after the finish review

- **Window 09 — Nach dem Service.** The closing band's lake view is framed as a window on a
  night mat (no scrim). The reservation glass card deliberately overlaps its left edge: the one
  place on the page where you read *through glass to the lake* — the restaurant's name. This is a
  second, argued type/picture seam, in addition to the hero seam.
