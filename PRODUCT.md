# Product

<!-- impeccable:product-schema 1 -->

## Platform

web — static site, Astro 5, deployed as HTML.

## Stack

Astro 5 (static output, fixed: the site is three pages with no server), GSAP 3 + ScrollTrigger
(fixed: already installed, carries the window reveals and the hearth stoke), three.js (added for
exactly one window, lazy-loaded), Fontsource variable fonts (self-hosted, OFL). Lenis removed.
Node 22, ffmpeg-static + sharp for the media pipeline.

## Users

Couples from Graz and Vienna planning a long weekend at the Wörthersee, deciding on their phone
or laptop in the evening whether to book dinner; Carinthian food tourists who heard about the
Reinanke and will book three weeks out. They decide in under two minutes and then call or write.

## Product Purpose

Make reserving a table feel as considered as the meal, and answer the four questions guests
always ask (Mondays, parking, terrace, gluten-free) so the owner stops answering the phone
during service. Success: Friday and Saturday dinner fully booked by 19:00.

## Positioning

The place on the Wörthersee where the flame is the menu: open fire and floor-to-ceiling glass
to the Lendkanal in one room, twelve dishes, no schnitzel wallpaper. Quieter than Steirereck.

## Operating Context

Phones first (390 px check), laptops at 1280–1440. Lake-season 4G. Video is an enhancement
behind posters; the page must read completely without it. Language `de-AT`.

## Capabilities and Constraints

- Routes: `/` (the page), `/impressum`, `/datenschutz`. Primary action: reserve a table by
  phone (`tel:`) or e-mail (`mailto:`). There is no booking engine; none is invented.
- Nothing ships as a prototype.
- Facts that must not be invented: reviews, awards, chef names, a reservation widget, menu items
  beyond `src/content/site.ts`, prices, hours, the UID (placeholder `ATU00000000` stays until
  the client supplies it).
- Required: reduced-motion and no-JS states equal to the page as printed; keyboard access to
  every link, the Pause control and the dish rows; visible focus everywhere; CLS 0.
- Media policy: every video framed, never full-screen, ≤ 720 lines (≤ 480 on mobile); every
  crop of a Flow clip ends at x ≤ 1620 of 1920.

## Brand Commitments

Real restaurant brief (`intake.md`, `brandspec.json`): wordmark `SEEBLICK & GLUT`, motto
`Feuer. See. Sonst nichts.`, owned colours near-black `#0C0A09`, ember `#E85D2F`, warm
parchment; refused: Mediterranean blue, red-check, gold foil. Voice: sparse, sensory, Carinthian
direct; never "culinary journey", "passionate", "artisanal experience", "hidden gem",
"farm-to-table". Direction: *Die Speisekarte am See* (2026-10-22 redirect, `.olympus/06b-direction-speisekarte.md`; previously *Fensterplatz* under the Atelier doctrine, see `.olympus/DESIGN-fensterplatz.md`,
`.olympus/06-build-plan.md`). Build path: code-led, one direction, no alternatives.
