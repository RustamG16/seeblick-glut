# ARCHITECTURE — SEEBLICK & GLUT

## Runtime and stack
Astro 5 static output (three pages, no server). GSAP 3 + ScrollTrigger for window reveals, the hearth stoke and sticky bounds. three.js WebGLRenderer, dynamically imported, for one canvas. Variable fonts self-hosted via Fontsource.

## Source layout and boundaries
- `src/content/site.ts` — facts, copy, window metadata, asset paths (owner: content).
- `src/styles/tokens.css` (from `design.json`), `src/styles/global.css` (type roles, Fenster primitive styles).
- `src/components/` — `Header`, `Fenster`, `Hero`, `Philosophie`, `Saal`, `Glut`, `Feste`, `Praktisches`, `Reservieren`, `Footer`.
- `src/scripts/` — `main.ts` (reveals, header, pause control), `video.ts` (lazy sources), `glut.ts` (three.js, lazy).
- `scripts/encode-windows.mjs` — ffmpeg-static + sharp pipeline from `assets-out/` sources to `public/media/f0x-*`.
- `public/media/` — encoded windows, posters, dish stills, OG image. `public/assets/` frame sequences are removed in build step 11.

## Interfaces and state
No persistence. Window metadata shape: `{ num: '02', caption: 'Der Saal, 20:30', ratio: '3:2', video?: { 720, 480, poster }, image?, canvas?: true }`. One global state: ambient video paused/playing (button, `aria-pressed`).

## Build, verification and deployment
`npm install` → `node scripts/encode-windows.mjs` → `npm run build` → `npm run preview`. Verify with Playwright screenshots at 1440 and 390, reduced-motion emulation, keyboard pass, Lighthouse. Deploy the `dist/` folder; `public/_headers` sets long cache on `/media/*`.

## Decisions and costs
See `.olympus/06-build-plan.md` (Creative system, WebGL contract, Research basis) and `PROGRESS-AND-DECISIONS.md`.
