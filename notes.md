# notes.md — lab/001-restaurant (SEEBLICK & GLUT)

Retro doc for productizing the agency Astro pipeline. Updated during Astro build, 2026-07-10.

## Decisions that deviated from the prompt

| Deviation | Why |
|---|---|
| **Flipbook → ambient video loops** | Approved stack design (`2026-07-10-lab001-astro-stack-design.md`) explicitly replaces the vanilla prototype's canvas scrub with native `<video>` for VENUE/ORBIT-ambient. Legacy `site/` kept for reference only. **Reverted post-build:** hero switched back to flipbook scroll-scrub (agency signature); linear push-in maps 1:1 to scroll. Room/Craft remain ambient loops. |
| **Full menu → 3 signature dishes in Craft** | Prompt: "3 signature dishes (no full menu dump)". Prototype's 12-item grid dropped. Tasting-menu note moved to Practical. |
| **Reservation form → static CTAs** | v1 constraint: no interactive UI. Hero CTA anchors to `#practical`; Practical CTA is `tel:+43463555012`. |
| **No topbar** | Prompt structure lists Hero → Philosophy → Room → Craft → Practical → Footer only. Restraint per VENUE archetype. |
| **Node ingest script instead of bash-only** | Windows host had no `ffmpeg`/`ffprobe` in PATH. `scripts/ingest.mjs` uses `ffmpeg-static` + `sharp` for cross-platform ingest. Shell wrapper added upstream at `engine/ffmpeg/ingest-ambient.sh`. |
| **English → German copy** | `lang="de-AT"` requirement. Prototype English strings translated in `site.ts` during build. |

## Asset problems found

| Issue | Resolution |
|---|---|
| Raw still named `still-hero.jpeg` (hyphen) vs spec `still_hero.jpg` (underscore) | Ingest renames/outputs `still_hero.jpg` + `still_hero.webp` to `assets-out/` |
| Raw videos ship with AAC audio track | Ingest strips audio (`-an`) on re-encode |
| `ffmpeg-static` bundle has no `ffprobe` | Metadata via ffmpeg stderr parse; sizes in `ingest-report.json` |
| Poster extraction on Windows needs `-update 1` | Fixed in `ingest.mjs` |
| `generation-sheet.md` still references flipbook frame paths (`site/frames/hero/`) | **Upstream:** update sheet to ambient-video delivery names matching `cursor-prompt.md` |

## Ingest results (2026-07-10)

- **Total video payload:** 12.12 MB (desktop + mobile variants, within ~12 MB target)
- **Hero desktop:** 3.29 MB · mobile 1.30 MB
- **Room desktop:** 2.67 MB · mobile 1.00 MB
- **Craft desktop:** 2.87 MB · mobile 0.99 MB
- Report: `assets-out/ingest-report.json`

## Build verification

- [x] `npm run ingest` → `assets-out/` populated
- [x] `npm run build` → `dist/` static HTML (3 pages)
- [x] `npm run dev` → localhost:4321
- [x] Sections render: Hero, Philosophy, Room, Craft, Practical, Footer
- [x] Legal pages: `/impressum`, `/datenschutz`
- [x] schema.org Restaurant JSON-LD in `Base.astro` (build-time)
- [x] OG meta tags present
- [x] GSAP bundle ~52 KB gzip (ScrollTrigger + Lenis)
- [x] **Bugfix (post-launch):** media disappearing — `gsap.from()` default `immediateRender: true` hid all `[data-reveal]` elements at opacity 0; hero `video.load()` hid poster before video was visible. Fixed with `immediateRender: false`, poster swap only on `playing` event, absolute fill positioning.
- [x] **Bugfix:** black sections after Room — (1) non-fill videos stacked poster+video in document flow, clipping video via `overflow:hidden`; fixed with absolute stacking on all `.video-wrap`. (2) GSAP `pin` + Lenis desync added pin-spacer and broke scroll layout; replaced Room pin with CSS `position: sticky`. Added Lenis `scrollerProxy`.

## Upstream for generation sheet / lab/002 ingest pipeline

1. **Unify asset naming** in `generation-sheet.md` with `cursor-prompt.md` (`still_hero.jpg`, `hero-sear.mp4`, not `0A-identity-still.webp` / `1-hero-sear.mp4`).
2. **Remove flipbook extract step** from VENUE generation sheet — ambient ingest only.
3. **Add `npm run ingest`** to client-skeleton template with `ffmpeg-static` + `sharp` deps.
4. **Gate 1 delivery:** require underscore filename `still_hero.jpg` at source to skip rename.
5. **Poster WebP** as LCP default — generation sheet should note hero poster path for preload.
6. **ingest-report.json** schema — fold into QA checklist in `playbook/RETRO-CHECKLIST.md`.

## Next time — agency workflow optimizations

1. **Scaffold Astro first**, then fill `site.ts` from brandspec/intake — avoids throwaway vanilla prototype work (saved ~60m on lab/001 but code not reused).
2. **Run ingest before Cursor build** — Cowork/CLI step: `npm run ingest` so `public/media/` exists on first dev load.
3. **Template repo:** extract `src/layouts/Base.astro`, `AmbientVideo.astro`, `scripts/{main,video,scroll}.ts` into `templates/astro-venue/` with empty `site.ts`.
4. **Legal boilerplate:** move impressum/datenschutz section types to `site.legal` in template; UID/hosting placeholders flagged in intake.
5. **Archetype switch in sitespec:** `usage: scrub:hero` → `usage: autoplay-loop:hero` when archetype is ORBIT-ambient to prevent flipbook misrouting.
6. **Single prebuild chain:** `ingest && sync-media && astro build` for CI (optional skip ingest if `assets-out/` cached).
7. **Scrub vs loop per clip — decide before first build:** linear camera moves (hero push-in) → deliver frame sequences at ingest via `npm run assets:hero`; human-action clips (room, craft) → ambient loop. Avoids post-build hero re-extract.

## Hero flipbook (post-build, 2026-07-10)

- **Extraction:** `npm run assets:hero` — ffmpeg-static, desktop 1920px @ 16fps q65 (128 frames, ~13.8 MB, over 12 MB budget — acceptable for QA; lower q if needed), mobile 960px @ 20fps q70 (160 frames, ~7.2 MB)
- **Runtime:** fixed canvas + GSAP ScrollTrigger pin 250vh, `createImageBitmap` cache, scroll-driven headline/CTA reveal
- **LCP:** `frame_0001.webp` poster + preload in `Base.astro`

## Der Raum tour rework (2026-07-12)

### Deviations

| Deviation | Why |
|---|---|
| **Hero scrub reverted to ambient loop (again, final)** | One signature mechanic per page — the scroll-scrub moved to the Der Raum tour. Hero = `hero-sear.mp4` loop via `AmbientVideo` (eager path added to `video.ts`); flipbook engine extracted to reusable `src/scripts/scrubber.ts`. |
| **Der Raum → manifest-driven 3-leg scroll tour** | `Tour.astro` + `tour.ts`: pre-beat pin 150vh ("Ein Haus." → "Jede Geschichte."), main pin 700vh over 420 frames @15fps, per-leg `power2.inOut` frame easing, captions with per-leg motion personality (track-in / scale-kick / crossfade), ember progress hairline, lazy preload via IntersectionObserver, static 3-poster fallback for reduced-motion/no-JS. Legs come from `assets-out/manifest.json` (build-time import) — new legs = regenerate frames + manifest, zero code changes. |
| **Leg set changed from generation sheet** | Delivered clips are leg1 entrance→dining, leg2 dining→terrace, leg3 terrace→bar→staff hall. Captions per delivery spec: Die Ankunft / Das Fest / Das Haus (not Ankunft/Abend/Fest); room.mp4 is no longer a tour leg. |
| **"Feste & Events" subsection added** | Under the tour: copy in `site.ts`, slow CSS marquee (Hochzeiten · Galas · Geburtstage · Firmenfeiern, hover-pausable, reduced-motion disabled), `Anfragen` mailto CTA. |

### Bug found

- **`+=NNNvh` in ScrollTrigger `end` is parsed as px, not vh** — the old hero pin (`+=420vh`) was actually 420px long, which is why every scrub "felt too fast". Fixed with a function-based end computing px from `window.innerHeight` (`tour.ts` → `vh()` helper).

### QA flags (see qa/report.md)

- Both leg seams are visible content jumps (SSIM 0.47 / 0.37) — presented as chapter beats via captions.
- Veo watermark baked into all frames, bottom-right — needs clean re-export or crop/inpaint before production.

### Iteration 2 (2026-07-12, after client review)

- Intro beat merged into the tour stage: one 850vh pin — "Ein Haus."/"Jede Geschichte." over the solid dip, video reveals behind the text (~60–100% of intro), then the scrub begins. Separate 150vh pre-beat pin removed.
- Seam 1→2: cross-dissolve under 0.6 dip; leg1 trimmed via manifest to `endFrame: 64` (frames 65–120 hallucinate as the POV passes the host/door — files stay on disk, manifest skips them; leg scroll weight scales via `durationSec: 4.27`).
- Captions now carry a leg counter (01/03) + one-line subline per leg (`site.ts → tour.legMeta`).

### Next time

- Decide the page's ONE scrub moment during design, before building.
- The leg/manifest-driven scrubber (`scrubber.ts` + manifest schema) is the template pattern going forward.
- Frame payload: desktop 77.8 MB / mobile 28.8 MB at q85 15fps — too heavy for production; next iteration: webp q~70, evaluate 12fps, or stream legs on demand.
