# ARCHITECTURE ESSENTIALS

1. Source of truth: `src/content/site.ts` for every fact; `DESIGN.md` + `design.json` for every token; `.olympus/06-build-plan.md` for the design.
2. Protected: all copy and facts in `site.ts`; legal pages' text; `assets-out/` sources. Never edit `.olympus/00`, `05`, `06` during the build — append to `07`–`10`.
3. Runtime: Astro 5 static, GSAP 3 (ScrollTrigger lazy, with three.js near §4), Fontsource fonts. No Lenis, no analytics, no CDN fonts. Build-time only: Remotion (`remotion/`) renders the wordmark intro.
4. Gates: reduced-motion/no-JS = page as printed; focus visible; CLS 0; LCP ≤ 2.0 s 4G; video ≤ 720 lines desktop / 480 mobile; crop rule `x + width ≤ 1620`.
5. Commands: `npm install` · `npm run encode` (needs sources in `assets-out/src`, `assets-out/gen`) · `npm run render:wordmark` (after `npm install` in `remotion/`) · `npm run dev` · `npm run build` · `npm run preview` · QA: `node scripts/shoot.mjs <url> <prefix>`, `node scripts/measure.mjs <url> [w h mobile]`.
6. No secrets in the repo; media provenance recorded in `.olympus/05-asset-manifest.md`.
7. Deploy: push to `main` → `.github/workflows/pages.yml` → https://rustamg16.github.io/seeblick-glut/ (`base` = `/seeblick-glut`; override with `BASE`/`SITE` for a custom domain).
