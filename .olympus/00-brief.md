# Brief — SEEBLICK & GLUT, redesign 2026 (director-resolved)

Trail: **abridged**. The instruction granted creative freedom ("completely change it"), fixed the
media policy (Seeblick imagery first, Artlist if required, 480p/720p, framed not full-screen),
named the technology lane (3D libraries, asset and animation sources) and opened the research
lane ("2026 latest trends on restaurant designs" on Awwwards and similar). No intake round was
run; every field below is resolved from the instruction, `intake.md`, `brandspec.json`,
`sitespec.json`, `notes.md` and the supplied media. Gates A and B are recorded
*approved-in-plan*; Gate C stays open until the build is reviewed.

## Target

- Project: `seeblick-glut` (Astro 5 static site, GSAP already installed)
- Route/page: `/` — `src/pages/index.astro` and all its components. `/impressum` and
  `/datenschutz` inherit the new tokens without a layout rethink.
- Mode: concept + implementation. **Plan here (Fable); implement in a fresh local session on
  Opus 5.5 from `06-build-plan.md` and `DESIGN.md`.**

## Outcome

- Primary business goal: Friday and Saturday dinner fully booked by 19:00 without the owner
  answering the phone during service (intake Q15).
- Primary visitor action: reserve a table — by phone or e-mail, because no booking engine
  exists. The site must make that one action feel as considered as the meal (intake Q10).
- Primary audience: couples from Graz and Vienna on a lake weekend who want "quieter than
  Steirereck"; second, Carinthian food tourists booking three weeks out for the Reinanke.
- Success signal: the reservation band is reached and the phone/e-mail link is used; the page
  answers the four questions guests always ask (Mondays, parking, terrace, gluten-free) without
  a call.

## Constraints

- Must preserve: the German copy and facts in `src/content/site.ts` (hours, address, prices,
  parking, tasting menu, legal pages), the wordmark SEEBLICK & GLUT, the motto "Feuer. See.
  Sonst nichts.", the owned colours (`#0C0A09` near-black, `#E85D2F` ember, warm parchment),
  the refused colours (Mediterranean blue, red-check, gold foil), the voice rules in
  `brandspec.json` (`neverSay` list), Astro + GSAP as the stack.
- May change: everything visual, the section order, the motion model, the media treatment,
  the type faces, the ground colour, the dependency on Lenis, the 130 MB frame sequences.
- Stack/dependencies: Astro 5, GSAP 3 (ScrollTrigger) kept; **three.js added** for one bounded
  window; Lenis removed; fonts self-hosted via Fontsource.
- Deadline/budget: none stated for this iteration. Artlist balance at planning time: 7,490
  credits on AI Suite 16500, renewing 15 Nov 2026.

## Taste references

| Reference | Specifically liked | Do not copy / avoid |
|---|---|---|
| Supplied Seeblick media (fire, room, plating, tour legs) | The single warm light source, the lake in the glass, dark wood, candle scale | The Veo watermark region (x>1620 of 1920); the AI "hallucination" frames flagged in `notes.md` |
| Steirereck site (client's reference) | Restraint, typography does the work, no food-porn carousel | Its exact layout or type |
| Amanzoe property pages (client's reference) | One image, sparse copy, dark room | Full-bleed dark ground — the client now wants a complete change |
| Awwwards hotel/restaurant category, 2025–26 (see Research basis) | Editorial, magazine-grade art direction; contained media; hover dish previews; one scroll-driven moment | Scroll-hijacking, loaders, second hero moments, autoplay audio |

## Direction

Resolved at intake from the instruction, the references and the doctrine library
(`library/design-dna/` holds no profile; the brief resolves it without an interview).

- Chosen doctrine: **`convenium-design-atelier`** (editorial restraint, paper and ink, type-led,
  one accent used rarely) with three deviations argued in writing in `06-build-plan.md`:
  (1) one scroll-linked sequence, the 3D hearth window; (2) a 600 ms window-reveal and a single
  900 ms wordmark settle, above the doctrine's 120–200 ms; (3) the wordmark set two steps above
  the doctrine's 72 px ceiling, still as a fixed step, never fluid.
- Structural posture: editorial.
- Motion posture: state-feedback by default; **one** scroll-narrative moment (Die Glut).
- Type logic: a serif with optical sizes carries every headline and the wordmark; a neutral
  grotesque carries body, UI and the menu; nothing else.
- Colour logic: warm parchment is the ground; the owned near-black lives only inside the window
  frames and the closing band; ember appears three times as UI and otherwise only as fire.
- Explicitly ruled out: full-screen video; any video above 720 lines; a second hero moment;
  marquee loops; the flipbook scrub; Lenis smooth scroll; glass/blur/glow; gradient heroes;
  more than two typefaces; invented facts (no booking widget, no reviews, no awards).
- Alternatives requested: **no** — one direction. The instruction asked for one new design.

## Available assets and access

- Brand: wordmark only (no logo), owned/refused colours, voice rules — `brandspec.json`.
- Fonts/licenses: new faces are OFL via Fontsource (`@fontsource-variable/fraunces`,
  `@fontsource-variable/instrument-sans`), self-hosted.
- Images/video/renders: see `05-asset-manifest.md`. Six usable clips (all 1920×1080, 24 fps,
  8–10 s, watermarked bottom-right), one clean still (`still_hero.jpg`), posters.
- Figma: none. Analytics: none supplied (no measurement claims will be made).
- Missing: a lake-light clip at 20:30 (intake Q9), a Kasnudeln still, an ember poster for the
  3D fallback — proposed for Artlist generation in the manifest, pending approval.

## Gate A

- Status: approved-in-plan (creative freedom granted; brief fixes direction)
- User decision: "completely change it … plan it with Fable, implement with Opus 5.5 locally"
- Date: 2026-10-22

## Gate B

- Status: approved-in-plan (one direction, no alternatives requested)
- Recorded in this file instead of `04-decision.md` per the abridged trail.
- Date: 2026-10-22
