# Kickoff — implementation session (local, Claude Opus 5.5)

Open Claude Code locally with **both** folders attached: the Apollo repo (Convenium.Design) and
this project (`seeblick-glut`, branch `redesign/fensterplatz-plan`). Paste the prompt below as
the first message. Do not paste anything from the planning conversation; the files carry it.

---

Read, completely and in this order, before acting: Apollo `CLAUDE.md`, `ARCHITECTURE-ESSENTIALS.md`, `AGENTS.md`, `START-HERE.md`. Then in `seeblick-glut`: `ARCHITECTURE-ESSENTIALS.md`, `DESIGN.md`, `PRODUCT.md`, `.olympus/00-brief.md`, `.olympus/05-asset-manifest.md`, `.olympus/06-build-plan.md`, `.olympus/run.json`.

This is the **implementation session** for an abridged-trail run whose plan is already written and approved in-plan (Gates A and B). The design is `.olympus/06-build-plan.md` ("Fensterplatz"); the tokens are `DESIGN.md` / `design.json`. Do not run intake, do not propose alternative directions, do not re-plan. Build from the plan, section by section, in the order of its *Build order*, and keep the acceptance criteria as the definition of done.

Rules for this session:
1. Act as one Design Director. Route skills from Apollo `library/registry/ROUTING-DIGEST.md`; load one `SKILL.md` per phase. Use `impeccable` (run its `scripts/context.mjs` once from the project root) for the finish craft, `visual-qa` for the author pass, then delegate the independent finish review to a read-only specialist that did not build.
2. Static hierarchy first, in the browser, before any motion: header, hero, every section with posters. Screenshot 1440 and 390. Confirm the wordmark measures 140 px and the ground is `#F3EBDD` before writing a line of GSAP.
3. Media: write `scripts/encode-windows.mjs` from the manifest's encode recipe and crop table; assert the crop rule `x + width ≤ 1620` for every Flow clip; outputs ≤ 720 lines desktop / 480 mobile; every video inside a `Fenster` frame, never full-screen. Keep sources in `assets-out/`.
4. Generated media: before the first Artlist call, show me the manifest's *Generation approval* block and ask once. If I decline or you cannot reach Artlist, use the named fallbacks — the build never waits on generation.
5. The 3D window (Fenster 04) follows the WebGL contract in the plan exactly: three.js WebGLRenderer, dynamic import near the section, poster texture shared with the fallback, DPR caps, offscreen pause, dispose on pagehide, quality tiers. If it misses the frame budget in QA, degrade per contract rather than widen it.
6. Facts come only from `src/content/site.ts`. No booking form, reviews, awards, chef names. Nothing from `brandspec.neverSay`.
7. Remove Lenis, the tour flipbook, `src/scripts/tour.ts`, `scrubber.ts`, the frame sequences under `public/assets/` and the legacy `site/` folder — in build step 11, after QA passes, not before.
8. Verification is two passes with one fix round, then stop (loop bounds in Apollo `AGENTS.md`). Write `.olympus/07-qa.md`, `10-finish-review.md`, `08-metrics.md` (targets only — no analytics exist), `09-handoff.md`; update `run.json` (`phase_counts`, `qa_passes`, `finish_verdict`, `finish_score`, `gate_c: pending`). Commit in small steps on this branch with clear messages; do not push until I say so.
9. End with Gate C material: before/after screenshots, the payload table against the plan's guardrails, asset provenance, known debt, and the one question you need answered (if any).

Start with step 1 of the build order. Say in one line what you are about to do, then begin.
