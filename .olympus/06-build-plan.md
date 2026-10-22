# SEEBLICK & GLUT — "Fensterplatz"

**This document is the design, not a task list.** It was written in the planning session
(Claude Fable 5.1, 2026-10-22) and is implemented in a fresh local session on Claude Opus 5.5.
If someone read only this file they should be able to picture the finished page: a sheet of warm
paper, a restaurant's name set large in a serif, and a sequence of numbered windows — each one a
framed opening into a dark, fire-lit room by the lake.

## Outcome

A single-page restaurant site for a wood-fire restaurant on the Wörthersee, rebuilt from the
ground up. The current site is a black, full-bleed, scroll-scrubbed cinema; the new one is its
opposite and its complement: a quiet editorial page on parchment where the darkness is kept
*inside* frames. The visitor — a couple from Graz or Vienna planning a lake weekend, or a food
tourist who has heard about the Reinanke — should feel that they have been handed the menu card
of a place that is calm, serious about fire, and worth driving to. Primary action: reserve a
table (phone or e-mail; there is no booking engine and none is invented). Secondary action:
answer the four questions guests always ask without a call (Mondays, parking, terrace,
gluten-free).

**Direction policy:** the instruction granted full creative freedom and asked for one new
design. One direction is delivered; no alternatives were generated. This is an acceptance
criterion below.

**Doctrine:** `convenium-design-atelier`, with three deviations argued in *Creative system*.

## Creative system

### Art direction

*Fensterplatz* — the window seat. The page is the paper: warm, matte, near-still. Every image
and every video is a **Fenster**, a numbered window with a mat and a hairline, through which
the dark room, the hearth and the lake are seen. The visitor never enters the dark; they sit at
the window and look in. It is **not** a dark cinematic site, not a food-photo carousel, not a
hotel brochure, not a farmhouse. Nothing glows except fire.

### Palette

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F3EBDD` | Ground. The owned "warm parchment menu" from the intake. Ambient. |
| `--paper-2` | `#EAE0CE` | Window mats, the Praktisches card. Lifted paper. |
| `--line` | `#D8CDBB` | Hairlines: window frames, rules, table borders (1.33:1 against paper — a rule, never text). |
| `--ink` | `#1A1511` | Text, wordmark. Warm near-black. 15.3:1 on paper. |
| `--ink-2` | `#5C5149` | Secondary text, captions, menu notes. 6.5:1 on paper. |
| `--ink-3` | `#756A5F` | Window numbers, meta ≥ 13 px uppercase. 4.45:1 on paper. |
| `--night` | `#0C0A09` | The owned near-black. **Only** inside window frames (video/canvas ground) and the closing band. |
| `--night-2` | `#161210` | Mats inside the closing band. |
| `--paper-dim` | `#C9BFAE` | Secondary text on night. 10.9:1. |
| `--ember` | `#E85D2F` | The one accent. **Three UI appearances per page**: the reservation button (header + closing band count as one component, two instances), the focus ring, the hearth progress hairline. Otherwise ember exists only as fire inside windows. Never as running text on paper (2.94:1 — banned). |

Legal text pairings and measured ratios: ink/paper 15.30, ink-2/paper 6.50, ink-3/paper 4.45,
ink/paper-2 13.85, ink-2/paper-2 5.88, ink-3/paper-2 4.03, paper/night 16.69, paper-dim/night
10.86, **ink/ember 5.21** (button text is ink on ember, never paper on ember at 2.94),
ember/night 5.68 (hairline only). Banned: ember on paper as text (2.94), paper on ember (2.94),
ink-2 on night (2.57).

### Type

- **Display: Fraunces** (variable; axes `opsz` 9–144, `wght` 100–900, `SOFT`, `WONK`). Chosen
  because its optical-size axis gives a true text cut at 20 px and a true display cut at 144 px
  from one file, which is what an editorial page on paper needs; and because at `SOFT 0,
  WONK 0` it is a sober old-style serif with none of the "quirky" reading the axes allow. Used
  for the wordmark, every headline, the pull line, prices and the big reservation line.
- **Text: Instrument Sans** (variable, `wght` 400–700). A neutral grotesque with slightly
  narrow proportions that sits well beside a Garalde serif; used for body, UI, captions, the
  Praktisches card and the menu notes. Tabular numerals via `font-feature-settings: "tnum"`
  (verify in the browser; fall back to Fraunces for prices if the feature is absent).
- Nothing else. Two families, two files, self-hosted via Fontsource
  (`@fontsource-variable/fraunces`, `@fontsource-variable/instrument-sans`), both SIL OFL.

The scale is Atelier's major third (1.25) and every size is a **fixed step**, never
interpolated:

| Role | Desktop ≥ 1280 | 900–1279 | 600–899 | < 600 | Face / weight / leading / tracking |
|---|---|---|---|---|---|
| Wordmark (hero) | **140 px** | 112 px | 72 px | 56 px | Fraunces opsz 144, wght 400, lh 0.95, ls −0.02em, `&` italic at 0.5em |
| Display-1 (section headlines) | 72 px | 56 px | 40 px | 40 px | Fraunces opsz 72, wght 400, lh 1.05, ls −0.02em |
| Display-2 (reservation line, Feste headline) | 56 px | 40 px | 32 px | 28 px | same |
| Display-3 (dish names, Praktisches title) | 28 px | 28 px | 24 px | 22 px | Fraunces opsz 28, wght 500, lh 1.2 |
| Pull line (motto, intro) | 28 px | 24 px | 22 px | 20 px | Fraunces italic opsz 28, wght 400, lh 1.35, measure 34–44ch |
| Body | 20 px | 20 px | 18 px | 18 px | Instrument Sans 400, lh 1.55, measure 62–72ch |
| UI (buttons, links) | 16 px | 16 px | 16 px | 16 px | Instrument Sans 500, lh 1.35 |
| Meta / caption / small caps | 13 px | 13 px | 13 px | 13 px | Instrument Sans 500, uppercase, ls +0.08em, lh 1.35 |

**Hero size argued against the doctrine.** Atelier lists `--sizes: 72/56/40/28/20/16/13 — pick
one, never interpolate` and "a fixed step from the scale, never fluid". 72 px for a
two-word wordmark on a 1440 px paper sheet reads as a sub-head, not a name; the brief's
"award-level" ambition is a floor. The scale is therefore extended **two further steps at the
same ratio** (90, 112, 140) and the wordmark takes the top one, 140 px, as a fixed step with
breakpoint steps below — never `vw`, never `clamp()`. `run.json` records
`hero_type_vw: fixed 140px (9.7vw at 1440)` and the doctrine range. Everything else stays
inside the doctrine's list.

### Material

Matte paper with a 4 % SVG-noise grain that does **not** animate (Atelier: stillness). Ink is
flat. Windows are the only depth: a 12 px mat of `--paper-2`, a 1 px `--line` frame, radius
2 px, no shadow; inside, `--night` and the media at full strength — never scrimmed, because no
type ever crosses a window. Light is only what the videos carry. Edges are hairlines.

### Composition

- 12-column grid, content max 1280 px, gutter 24 px (16 px under 600), margins 48 px (24 under
  900). Section rhythm 160 px desktop / 96 px mobile.
- **Asymmetry over centring.** Text columns are 5/12 and start at column 1 or column 2; windows
  take 4, 5, 6, 7 or 8 columns and never sit centred. Consecutive sections alternate which side
  the window is on. The hero is left-heavy (wordmark columns 1–8, window columns 6–12 starting a
  row lower, so the wordmark's baseline and the window's top edge overlap by one line of the
  display-1 size — the one place two layers touch).
- **The one rule that keeps it coherent:** *type on paper, media in windows, and the two never
  overlap except at the hero seam.* Every window has a number and a caption in meta type
  beneath it: `02 — Der Saal, 20:30`. The numbers run 00 to 08 down the page like plates in a
  book; they are the navigation the visitor does not know they are using.
- Max window width 840 px CSS (8/12 at 1280) — which is why 720-line video is sharp here and why
  no full-screen video is needed.

## Page sequence and media map

Section heights are natural (content-sized) unless stated. Scroll is native — Lenis is removed.

### 0. Header — 64 px, sticky

- Assets: none (text, I01 phone icon).
- A paper bar with a bottom hairline. Left: `SEEBLICK & GLUT` in Fraunces 20 px. Centre:
  nothing. Right: phone number as a text link (UI 16) and the reservation button — **ember
  appearance 1**: ink text on ember fill, 16 px, padding 12/20, radius 2. The bar is transparent
  over the first 80 px of the hero and becomes `--paper` with the hairline after that (one 160 ms
  background transition, no blur).
- Copy intent: `site.hero.cta.label` ("Tisch reservieren") and `site.practical.contact.phone`.
  Nothing new.

### 1. Fenster 00 — Hero — min 88svh desktop, natural on mobile

- Assets: `f00-glut.720.mp4` / `f00-glut.480.mp4` / `f00-glut.webp` (from
  `public/media/hero-sear.mp4`, 3:2 crop).
- The wordmark at 140 px, three lines `SEEBLICK / & / GLUT`, left-aligned at column 1, top of
  the viewport. The motto `Feuer. See. Sonst nichts.` as the pull line at column 9, aligned to
  the wordmark's first baseline. Below and to the right, the first window: 3:2, columns 6–12,
  its top edge overlapping the last wordmark line by one display-1 line-height. Caption:
  `00 — Die Glut, 19:40`. Video autoplays muted, loops, poster first.
- Motion: the only kinetic-type moment on the page. The wordmark settles **once** on load:
  `wght 300 → 400` and `opsz 72 → 144` over 900 ms, ease-out, letters already in place (no
  slide, no stagger). Then it is still forever. The window's mat is drawn first; the video fades
  in over 400 ms when `playing` fires.
- Copy intent: `site.hero.lines`, `site.tagline`. Do not add a sub-headline.

### 2. Philosophie — natural height

- Assets: `f01-feuer.webp` (frame 0 of `hero-sear.mp4`, 3:4 crop 810×1080).
- Display-1 headline `Zwölf Gänge. Ein Feuer. Der See durch das Glas.` at columns 1–7, body
  below it at 62ch. The window is portrait, columns 9–12, sitting 160 px lower than the headline
  so the eye drops diagonally. Caption `01 — Das Feuer`.
- Motion: window reveal (see choreography). Nothing on the type.
- Copy intent: `site.philosophy.*` verbatim. The headline is the thesis of the page.

### 3. Der Saal — natural height, two windows

- Assets: `f02-saal.720.mp4` / `.480.mp4` / poster (from `room.mp4`, 3:2); `f03-seelicht.720.mp4`
  (generated V01, 3:4) **or** the fallback `tour-leg2.mp4` 4.5–9.5 s portrait crop.
- Kicker meta `Der Raum`, display-1 `Ein Haus. Jede Geschichte.` (reusing `site.tour.preBeat`),
  then a short body built from `site.tour.legMeta` sublines (three sentences, no invention).
  Window 02 is 3:2 at columns 1–7; window 03 is 3:4 at columns 9–12 and starts 240 px lower
  than 02. Captions `02 — Der Saal, 20:30` and `03 — Seelicht`.
- Motion: both windows reveal on entry; 03 plays only when ≥ 50 % visible.
- Copy intent: the room, the glass, the lake. No "culinary journey", no "hidden gem"
  (`brandspec.neverSay`).

### 4. Die Glut — the 3D window + the menu — pinned column, ~220vh scroll on desktop

- Assets: WebGL canvas (F04) inside a 4:5 window at columns 1–6, `position: sticky; top: 96px`
  while the right column scrolls; poster `f04-glut-poster.webp` (crop of `hero-sear-poster.jpg`
  or generated S02) for fallback; `f05-haende.720.mp4` (1:1, from `craft.mp4`) as window 05 at
  the end of the right column, columns 8–12; dish stills `d1-rind.webp`, `d2-reinanke.webp`,
  `d3-kasnudeln.webp` (generated S01, or no still for D3).
- Right column, columns 8–12: kicker `Die Glut`, display-1 `Hände. Feuer. Nichts dazwischen.`,
  body (`site.craft.body`), then the three signature dishes as a ruled list — name in display-3,
  price right-aligned in Fraunces 28 tabular, note in meta below, each row 96 px tall with a
  hairline. On desktop, hovering a row shows its 1:1 still (240 px) inside a small window that
  follows the row (one window, repositioned, 160 ms); on touch the stills are inline, 1:1, 120 px,
  left of the name. The tasting-menu line `Tagesmenü 5 Gänge — €78` closes the list as a pull
  line. Then window 05 (plating) with caption `05 — Die Hände`.
- **The one scroll-linked moment.** As the right column scrolls from the headline to the last
  dish, the hearth is stoked: ember emission 40 → 140 /s, point-light intensity 0.6 → 1.2, and a
  2 px ember hairline (**ember appearance 2**) fills along the left edge of the window frame.
  Scrolling back calms it. The fire never moves the type.
- Copy intent: `site.craft.*` verbatim; prices from `site.craft.dishes` and
  `site.practical.tastingMenu`. Prices are ink, not ember (a paper menu grammar).

### 5. Feste & Events — natural height

- Assets: `f06-haus.720.mp4` (from `tour-leg3.mp4` 3.2–9.9 s, 3:2) as window 06, columns 1–8;
  `f07-terrasse.720.mp4` (from `tour-leg2.mp4` 4.5–9.5 s, 3:4) as window 07, columns 10–12,
  240 px lower.
- Kicker `Feste & Events`, display-2 `Das Haus für Ihren Abend.`, body
  (`site.tour.events.body`), then the four occasions as a **static** row of meta small caps
  separated by middle dots: `Hochzeiten · Galas · Geburtstage · Firmenfeiern`. The marquee is
  gone (Atelier refuses loops). A text link `Anfragen →` to the mailto.
- Captions `06 — Das Haus` and `07 — Die Terrasse`.
- Copy intent: `site.tour.events.*` verbatim.

### 6. Praktisches — natural height

- Assets: `f08-ankunft.720.mp4` (from `tour-leg1.mp4` 0–4.2 s, 3:2) as window 08, columns 8–12;
  I01 map-pin and phone icons.
- A `--paper-2` card spanning columns 1–7 with a hairline border and 40 px padding: the four
  blocks (Öffnungszeiten, Adresse, Parken & Terrasse, Kontakt) as a two-column definition list
  in body 18 with meta labels; the Monday note, parking note, terrace note and gluten-free note
  exactly as in `site.practical`. `Auf Karte anzeigen` is a text link with the pin icon. Window
  08 sits beside it with caption `08 — Die Ankunft`.
- Copy intent: `site.practical.*` verbatim. This section answers the four questions.

### 7. Reservieren — closing band, min 60svh

- Assets: none. Ground `--night`.
- The only dark surface outside a frame — "the room after service". `Tisch reservieren` as a
  display-2 line in `--paper`, then the phone number as a 28 px Fraunces link, the e-mail, and
  `site.practical.cta.sub` in `--paper-dim`. The reservation button appears again (**ember
  appearance 1, second instance**). A 2 px `--line`-on-night rule above.
- Motion: none beyond link states.
- Copy intent: `site.practical.cta.*`, phone, e-mail. No form (none exists; none invented).

### 8. Footer — natural

- Assets: none. Ground `--night`, continuous with the band.
- Wordmark 20 px, address line, copyright, Impressum / Datenschutz links in meta type.

### Unused assets, and why

- `public/assets/tour/`, `public/assets/tour-mobile/`, `public/assets/hero-sear/`,
  `public/assets/hero-sear-mobile/` (≈130 MB of JPEG/WebP frames) — the flipbook scrub is gone;
  deleted in build step 11 after QA. Rationale: the one scroll-linked moment is the hearth, and
  frame sequences cannot be kept under the payload ceiling.
- `public/media/*-mobile.mp4`, `*-poster.jpg/webp`, `hero-sear.mp4`-as-fullscreen — replaced by
  the cropped, re-encoded `f0x-*` set; sources stay in `assets-out/` for re-encodes.
- `site/` (legacy vanilla prototype) — deleted; it is not referenced by the Astro build.
- `tour-leg1.mp4` 4.2–8.0 s — hallucinated frames per `notes.md`.
- `still_hero.webp` — superseded by the OG crop.

## Motion and interaction choreography

- **GSAP 3 + ScrollTrigger** (already installed) earns its place for three things only: the
  window reveals, the hearth stoke progress, and the sticky-column pin bounds. No Lenis. No
  smooth-scroll proxy. `scrub: 1` on the stoke; everything else is `once: true`.
- **three.js** (WebGLRenderer, dynamic import) earns its place for one window, F04.
- **Native CSS** carries every state change (160 ms) and the header background (160 ms).

| Beat | Trigger | What moves | Duration / ease | Hands off to |
|---|---|---|---|---|
| Wordmark settle | load, once | Fraunces `wght` 300→400, `opsz` 72→144 | 900 ms, `cubic-bezier(.16,1,.3,1)` | stillness |
| Window reveal | window top at 85 % viewport, once | the mat is already there; the media inside goes `clip-path: inset(0 0 100% 0)` → `inset(0)` | 600 ms, same ease | autoplay (if video and ≥ 50 % visible) |
| Hearth stoke | right column of §4 from headline top to last dish bottom, scrubbed | ember emission 40→140/s, light 0.6→1.2, left hairline `scaleY` 0→1 | scrub 1 | — |
| Dish hover (desktop) | pointer enters a dish row | the preview window translates to the row and swaps its still | 160 ms opacity + 8 px y | — |
| Header solidify | scroll > 80 px | background paper, hairline opacity | 160 ms | — |

- **Hover/focus:** links underline with a 1 px `--line` → `--ink` rule (160 ms). Buttons darken
  ember by 8 % on hover. Focus ring: 2 px `--ember` outline, 3 px offset (**ember appearance
  3**); on night surfaces the ring stays ember (5.68:1).
- **Cursor:** default. No custom cursor.
- **Touch:** no hover previews (inline stills instead); the hearth has no pointer parallax;
  the sticky column becomes static flow.
- **Keyboard:** every window with video has a visible `Pause` text button in its caption row
  (meta type) that toggles all ambient video — one control, not nine.
- **Reduced motion:** no wordmark settle (final state rendered), no reveals (media visible), no
  autoplay (posters shown, the Pause control becomes `Abspielen`), the hearth shows its poster,
  the hairline is full. **Static end state = the page as printed.**
- **No JavaScript:** identical to reduced motion.

### WebGL contract — Fenster 04 "Die Glut"

Activation test (all five must hold): (1) fire as material behaviour — moving embers and a
breathing light — is the product's thesis ("the flame is the menu") and no still or 8 s loop
conveys *response to the visitor*; (2) a video loop cannot be stoked by scroll; (3) the concept
and assets support it (procedural, no model needed); (4) the poster fallback is coherent — it is
just another window; (5) budget accepted: one lazy chunk, one canvas. **Go.**

- Scene: orthographic-feeling perspective camera, FOV 35, fixed; a dark hearth plane at the
  bottom third with an emissive ember-bed texture (`f04-glut-poster.webp` as the texture, so the
  poster and the live scene share one image); an `InstancedMesh` of 1,800 quad sprites (700 on
  mobile) with additive blending, colour ramp `#E85D2F → #FFB37A → #3A1A0C` over a 2–5 s life,
  rising on curl noise with slight sideways drift; one `PointLight` (ember colour) whose
  intensity is noise-modulated between 0.85× and 1.15× of the stoke value at ~6 Hz, smoothed.
  Optional M01 log mesh placed in the bed if generated and approved.
- Input: scroll stoke only. Pointer parallax ±2° on desktop, none on touch.
- Loading: `import('./glut.ts')` when §4 is within 150 % of the viewport, after LCP; reserve the
  4:5 box; the poster is already there. Error or no WebGL → poster stays.
- Quality tiers: DPR cap 1.5 desktop / 1.0 mobile; if the mean frame time exceeds 22 ms over
  2 s, halve the particle count once, then stop rendering and show the poster.
- Lifecycle: `IntersectionObserver` pauses the loop when the window is offscreen;
  `visibilitychange` pauses; `resize` re-fits; `pagehide` disposes geometry, material, texture,
  renderer. No postprocessing, no shadows, no HDRI.
- Budget: three.js chunk ≤ 170 KB gz, GPU memory < 30 MB, ≥ 55 fps desktop / ≥ 30 fps mobile.
- Measurement signal: the hearth is removed if INP on §4 exceeds 200 ms on a mid-range Android
  in QA.

## Implementation notes

- Stack unchanged: Astro 5 static, GSAP 3. Add `three` (latest stable; WebGL build, not
  `three/webgpu`). Remove `lenis`. Add `@fontsource-variable/fraunces`,
  `@fontsource-variable/instrument-sans`.
- Components: replace `Hero`, `Philosophy`, `Tour`, `Craft`, `Practical`, `Footer`,
  `AmbientVideo` with `Header`, `Fenster` (the one framed-media primitive: props `num`,
  `caption`, `ratio` 3:2 | 3:4 | 1:1 | 4:5, `video` {720, 480, poster} | `image` | `canvas`),
  `Hero`, `Philosophie`, `Saal`, `Glut` (+ `glut.ts`), `Feste`, `Praktisches`, `Reservieren`,
  `Footer`. Delete `tour.ts`, `scrubber.ts`, `video.ts`; keep a smaller `video.ts` for
  lazy sources and the global Pause control.
- Content stays in `src/content/site.ts`; add `windows` metadata (numbers, captions) and the
  new asset paths; keep every fact.
- Tokens come from `DESIGN.md` / `design.json` into `src/styles/tokens.css` as CSS custom
  properties; `global.css` holds the type roles as classes (`.t-wordmark`, `.t-display-1` …).
- Asset pipeline: `scripts/encode-windows.mjs` (ffmpeg-static + sharp) reads a table of crops
  and writes `public/media/f0x-*.{720,480}.mp4`, `.webp` posters and the dish stills. The crop
  rule `x + width ≤ 1620` is asserted in the script.
- Loading: preload the two variable fonts and `f00-glut.webp`; videos `preload="none"` with
  sources injected on intersection; `loading="lazy"` on every image below the hero; the hero
  video source injected after `window.load`.
- SEO/meta: keep the JSON-LD, update `ogImage` to the new OG crop, keep `lang="de-AT"`.

## Responsive behavior

- **≥ 1280 (designed at 1440):** as described; 12 columns; wordmark 140.
- **900–1279:** wordmark 112; windows keep their column spans; the §4 sticky column stays.
- **600–899:** wordmark 72; the grid becomes 6 columns; windows go full content width in
  sequence (text, then window) keeping their ratios; §3 and §5's second window becomes 1:1
  instead of 3:4 to save height; §4's hearth is no longer sticky (static, before the dishes);
  dish stills inline.
- **< 600:** wordmark 56; gutter 16; section rhythm 96; the hero window is 3:2 full width under
  the wordmark; motto under the window; header shows only the wordmark and the button; the
  Praktisches card becomes one column; the closing band's line is display-2 at 28.
- Nothing is hidden on mobile except hover previews (replaced inline).

## Performance guardrails

| Guardrail | Value | Status |
|---|---|---|
| LCP (hero poster WebP, ≤ 70 KB) | ≤ 2.0 s on 4G | target |
| INP | ≤ 200 ms everywhere incl. §4 | target |
| CLS | 0 (every window reserves its ratio) | target |
| First-view transfer before video | ≤ 350 KB (HTML+CSS ≤ 60 KB gz, fonts ≤ 180 KB, poster ≤ 70 KB, JS ≤ 45 KB gz) | target |
| three.js lazy chunk | ≤ 170 KB gz, loaded only near §4 | target |
| Video, desktop total (7 clips at 720 lines) | ≤ 9 MB; mobile (480 lines) ≤ 4.5 MB | target |
| Frame budget | 16.6 ms desktop, 33 ms mobile in §4 | target |
| Repo payload | `public/assets` frame sequences removed (−130 MB) | target |

## Build order

1. Read `DESIGN.md`, `PRODUCT.md`, this file; run the impeccable context script if available.
2. Install/remove dependencies; add tokens; self-host fonts; verify `tnum` in the browser.
3. Run the encode script; confirm every output's crop rule and sizes; write the poster set.
4. Static hierarchy first: header, hero, all sections with posters only, no motion — screenshot
   desktop 1440 and mobile 390. Check the wordmark is 140 px, measure contrast pairs.
5. `Fenster` primitive with video injection and the Pause control; reveal choreography.
6. The §4 sticky column, dish rows, hover preview, inline stills.
7. `glut.ts`: poster texture → sprites → light → stoke → lifecycle → quality tiers.
8. Closing band, footer, legal pages re-tokened.
9. Reduced-motion and no-JS passes; keyboard pass.
10. Author QA (`07-qa.md`), then the independent finish review (`10-finish-review.md`) scored
    against `DESIGN.md`; one fix round; stop (loop bounds in Apollo `AGENTS.md`).
11. Delete `public/assets/tour*`, `public/assets/hero-sear*`, `site/`; update `_headers`.
12. Gate C: before/after screenshots, payload table, asset provenance, `09-handoff.md`.

## Acceptance criteria

- One direction built; no alternative directions were produced or presented.
- Every video on the page is inside a `Fenster` frame ≤ 840 px CSS wide; **no video is
  full-screen or full-bleed**; no video exceeds 720 lines (480 on mobile).
- Every crop of a Flow clip satisfies `x + width ≤ 1620` of the 1920 source; no watermark is
  visible in any frame at any breakpoint.
- The media map above is complete: all nine windows and three dish stills resolve to the named
  files or their named fallbacks; the unused-asset list matches what was deleted.
- Ground is `--paper`; `--night` appears only inside windows and in the closing band/footer.
- Ember appears as UI exactly three times (button component, focus ring, hearth hairline) and
  never as text on paper.
- The wordmark renders at 140 px at ≥ 1280 and at the fixed steps below; no `vw` or `clamp()`
  on any type size.
- The reservation action is reachable from the header, the closing band, and the Praktisches
  card; it is phone/e-mail; no booking form exists.
- Reduced motion and no-JS show the complete page with posters; keyboard reaches every link,
  the Pause control and the dish rows; focus is visible everywhere.
- The hearth has a poster fallback, pauses offscreen, disposes on pagehide, and never blocks
  the primary action.
- All copy comes from `site.ts`; nothing from `brandspec.neverSay` appears; no invented facts
  (no reviews, awards, chef names, booking system).
- Performance targets above are measured and recorded in `07-qa.md` with numbers.

## Research basis

The brief named "2026 latest trends on restaurant designs in awards" sites. The session's
network could not open awwwards.com or hontran.dev directly (proxy policy), so award facts
below come from indexed summaries of those pages; **the build session should open each URL and
confirm before quoting them to the client.**

Awwwards, hotel/restaurant and food/drink categories (what won, and what is transferable):

- Hotel & Restaurant category — https://www.awwwards.com/websites/hotel-restaurant/ and
  https://www.awwwards.com/inspiration_search/restaurant/ (the live pool of 2025–26 winners).
- Crav Burgers, Site of the Day + Developer Award, 13 Jun 2026 —
  https://www.awwwards.com/sites/crav-burgers — immersive visuals and motion for a burger
  concept; transferable: one signature interaction, not many.
- Tabela, Honorable Mention, 1 Aug 2026 — https://www.awwwards.com/sites/tabela.
- Studenterkilden, Honorable Mention, 11 Aug 2026 — https://www.awwwards.com/sites/studenterkilden.
- Restaurant GEM, Nominee, 17 Oct 2025 — https://www.awwwards.com/sites/restaurant-gem —
  on-hover dish preview and a full-screen menu; transferable: the hover dish still in §4.
- Gourou Indian Food, Honorable Mention — https://www.awwwards.com/sites/gourou-indian-food.
- Adjacent hospitality SOTDs 2026 (Tengile Malamala Collection 3 Oct, White Desert 11 Sep,
  Units 2 Jul) via the category page above.
- Awwwards technique references for the hearth: interactive particle menus
  https://www.awwwards.com/inspiration/interactive-particles-menu and FBO particles with
  three.js https://www.awwwards.com/inspiration/fbo-particles-with-three-js.

2026 trend reports (used for the editorial, framed-media and kinetic-type decisions):

- Envato Elements, "Web design trends for 2026: kinetic type, broken grids and the return of
  visual personality" — https://elements.envato.com/learn/web-design-trends
- Figma, "Top Web Design Trends for 2026" (WebGL models, scroll-triggered animation) —
  https://www.figma.com/resource-library/web-design-trends/
- Adobe Express, "Top 10 graphic design trends for 2026" (loose editorial compositions,
  asymmetry) — https://www.adobe.com/express/learn/blog/design-trends-2026
- Canva, "Imperfect by Design: the visual design trends set to define 2026" (structured
  editorial layouts) — https://www.canva.com/newsroom/news/design-trends-2026/
- GoDaddy, "5 essential web design trends for 2026" (floating images in asymmetric layouts with
  negative space) — https://www.godaddy.com/resources/skills/web-design-trends
- Paige Madden Design, hospitality branding trends (ambient hero video of in-between moments) —
  https://www.paigemaddendesign.com/blog/hospitality-branding-trends-you-need-to-know-this-year
- Wix, "The 11 Biggest Web Design Trends of 2026" — https://www.wix.com/blog/web-design-trends
- Hon Tran, "10 Best Award-Winning Websites of 2026 (judged by a juror)" —
  https://www.hontran.dev/blog/best-award-winning-websites-2026 and "WebGL Website Examples
  2026" — https://www.hontran.dev/blog/webgl-website-examples

Platform behaviour (why GSAP carries scroll-linking and why WebGL, not WebGPU):

- CSS scroll-driven animations: Safari 26 (Sep 2025) supports `animation-timeline`; Firefox
  still behind a flag with a 2026 Interop target — https://ics.media/en/entry/230718/ ,
  https://www.drweb.de/css-scroll-animationen-ohne-javascript/ ,
  https://connect.mozilla.org/t5/ideas/implement-css-scroll-driven-animations-animation-timeline/idc-p/119842
- three.js WebGPURenderer is a separate build (`three/webgpu`, r171+) and needs an async
  `init()` — https://threejs.org/manual/en/webgpurenderer ; the hearth uses the default
  WebGLRenderer for Safari/Firefox parity.

Asset and library sources (3D, media, animation):

- three.js (MIT) — https://threejs.org/
- Poly Haven, CC0 HDRIs/textures/models — https://polyhaven.com/ (not needed by the hearth;
  listed for an optional log texture)
- Sketchfab (filter by licence), Quaternius (CC0 GLTF), Poly Pizza (CC0 subset) — via
  https://www.itechguides.com/best/3d-asset-libraries/ and
  https://app.cinevva.com/guides/game-assets-guide
- Artlist AI generation (video 480p/720p models, image-to-image, text-to-3D) — balance and
  quotes recorded in `05-asset-manifest.md`.
- Fontsource (self-hosted OFL fonts) — https://fontsource.org/
- Lucide icons (ISC) — https://lucide.dev/
- Rive vs Lottie, 2026 — https://www.pkgpulse.com/guides/lottie-vs-rive-vs-css-animations-web-animation-formats-2026
  (reviewed; neither is used — the page has no illustrated animation).
