# 06b — "Die Speisekarte am See" (replaces Fensterplatz)

**Why:** the user reviewed the live Fensterplatz build (2026-10-22) and rejected it — mobile read
as small stamps on beige, the palette was too close to the studio's own house style, the theme
gave no vibe. They asked for research, picked one reference, and asked for more colour, more
motion and a theme you can feel. `06-build-plan.md` stays as history; this file is the design.

## Reference (chosen by the user from four)

**Da Maria** — https://damaria-roma.webflow.io · Awwwards Honorable Mention, 2 Apr 2026 ·
https://www.awwwards.com/sites/da-maria (Webflow, GSAP, Barba). Research sheet:
`.olympus/research/sheet-{390,1440}.jpg`; full captures `research/damaria-page-*`.

Transferable grammar (not its expression): a printed menu card as the page — thin red double
frame around everything; giant condensed high-contrast serif caps; filled colour boxes with an
italic label + rule; black drop caps; column hairlines; engraved pen illustrations; double-border
italic buttons; a rotating stamp; photos as rectangular plates with a 1 px rule.

What is ours, not theirs: four colours from the place (fire red, lake blue, Carinthian pine,
summer butter) instead of one red; Kärnten engravings (Reinanke, Kasnudeln, firewood, a sailboat
on the Wörthersee); the hearth (three.js) and the Flow video kept as plates; German copy from
`site.ts`; a horizontally running wordmark as the masthead.

## Theme in one line

A summer menu card from the Wörthersee, printed in four inks — fire, lake, pine, butter —
that you read like the menu handed to you at the table.

## Palette (measured on cream)

| Token | Hex | Use |
|---|---|---|
| cream | #F3E7D3 | paper (ground) |
| cream-2 | #EADBC2 | inner panels |
| ink | #241C17 | body text, drop caps, engravings (13.7:1) |
| ink-2 | #5A4A3F | secondary text (6.9:1) |
| ember | #D8452B | **display only** (≥ 28 px) and fills; never small text (3.58:1) |
| ember-deep | #B23219 | small red text, buttons, labels (5.11:1; cream on it 5.11:1) |
| lake | #2D5D7B | second ink: section boxes, marquee band, links (5.8:1) |
| pine | #2F4A3A | third ink: "Die Glut" section, footer (7.95:1) |
| butter | #E9B949 | stamps, highlights, the dock; ink on butter 9.2:1 |
| night | #16110E | video ground only |

## Type

- Display: **Playfair Display** variable 800–900, caps, line-height 0.86, tracking −0.01em.
  Fluid (`clamp`) is allowed in this direction: masthead `clamp(132px, 30vw, 420px)`;
  section titles `clamp(64px, 12vw, 176px)`.
- Labels / prices / small heads: Playfair Display italic 700.
- Text: **Bitter** variable 400 / 600 (slab, menu-card body), 18 px / 1.6, max 62ch.
- Meta: Bitter 600, 13 px, caps, +0.08em.

## Page (mobile first; each section a panel of the card)

1. **Masthead** — header row (round "Karte" badge left, boxed logo centre, oval "Reservieren"
   right). Running wordmark `SEEBLICK ✦ GLUT ✦` in ember, scroll-velocity marquee. Rotating
   butter stamp "FEUER · SEE · SONST NICHTS". Hero plate: video 00 full content width, ink caption
   box with tagline + live status.
2. **Die Karte** — title in ember; Reinanke engraving; drop-cap craft body; menu list with dotted
   leaders and italic notes, small engraving per dish; Tagesmenü in an ember-deep box.
   Right column (stacked on mobile): ember-deep box "Jetzt buchen / RESERVIEREN", telephone
   engraving, phone in italic, hours, address, contact note.
3. **Philosophie** — lake box with italic label + cream headline; drop-cap body; plate 01.
4. **Die Glut** — pine section: headline in cream, the three.js hearth plate (stoked by scroll),
   firewood engraving column with hours, plate 05 (hands).
5. **Der Raum** — ember title, plates 02 + 03, candle engraving, drop-cap text.
6. **Feste & Events** — butter box label; lake marquee band of occasions; plates 06 + 07;
   champagne engraving; double-border "Anfragen".
7. **Anreise** — sailboat engraving, parking + terrace + map; plate 08.
8. **Reservieren** — giant ember title, rotating stamp, drop-cap sub, phone in display italic,
   e-mail, lake plate 09.
9. **Footer** — pine panel, columns (Seiten · Kontakt · Adresse), outline wordmark.

## Motion

- Intro (once per session): cream card; the Remotion wordmark stamps in red, stamp spins, then
  the card lifts away (clip-path up). ≤ 2.4 s. Skipped for reduced motion / repeat visits.
- Masthead and occasion marquees run continuously and speed up with scroll velocity (GSAP);
  reversed direction on the second band.
- Section titles: letters rise from a mask on entry (split per letter, 40 ms stagger, once).
- Colour boxes wipe in (clip-path from left), plates reveal (clip-path from bottom), engravings
  draw in (mask sweep) and sway gently on hover.
- Stamps rotate slowly; spin faster with scroll velocity.
- Hearth stoke kept (scrub). Reduced motion: everything still, marquees static.

## Acceptance

All copy and facts from `site.ts`; no booking form, reviews, awards or chef names (Da Maria's
"recently awarded" badge is **not** copied); small red text uses ember-deep; mobile 390 shows
full-width plates and a poster masthead (no postage stamps); first-view JS ≤ 45 KB gz.
