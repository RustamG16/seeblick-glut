# ARCHITECTURE ESSENTIALS

1. Source of truth: `src/content/site.ts` for every fact; `DESIGN.md` + `design.json` for every token; `.olympus/06-build-plan.md` for the design.
2. Protected: all copy and facts in `site.ts`; legal pages' text; `assets-out/` sources. Never edit `.olympus/00`, `05`, `06` during the build — append to `07`–`10`.
3. Runtime: Astro 5 static, GSAP 3, three.js (one lazy chunk), Fontsource fonts. No Lenis, no analytics, no CDN fonts.
4. Gates: reduced-motion/no-JS = page as printed; focus visible; CLS 0; LCP ≤ 2.0 s 4G; video ≤ 720 lines desktop / 480 mobile; crop rule `x + width ≤ 1620`.
5. Commands: `npm install` · `node scripts/encode-windows.mjs` · `npm run dev` · `npm run build` · `npm run preview`.
6. No secrets in the repo; media provenance recorded in `.olympus/05-asset-manifest.md`.
