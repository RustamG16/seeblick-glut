---
name: SEEBLICK & GLUT — Fensterplatz
description: Warm parchment paper on which the dark, fire-lit room is seen only through numbered, framed windows.
northStar: Fensterplatz (00-brief.md, abridged trail; doctrine convenium-design-atelier with three argued deviations)

colors:
  paper: "#F3EBDD"        # ground
  paper-2: "#EAE0CE"      # window mats, Praktisches card
  line: "#D8CDBB"         # hairlines only (1.33:1 vs paper) — never text
  ink: "#1A1511"          # text, wordmark — 15.30:1 on paper, 13.85:1 on paper-2
  ink-2: "#5C5149"        # secondary text — 6.50:1 on paper, 5.88:1 on paper-2
  ink-3: "#756A5F"        # meta ≥13px uppercase, window numbers — 4.45:1 on paper, 4.03:1 on paper-2
  night: "#0C0A09"        # only inside windows and the closing band/footer
  night-2: "#161210"      # mats on night
  paper-dim: "#C9BFAE"    # secondary text on night — 10.86:1
  ember: "#E85D2F"        # ONE accent, 3 UI appearances: button fill (ink text 5.21:1), focus ring, hearth hairline (5.68:1 on night). Never text on paper (2.94:1 banned).
  ember-hover: "#D5552B"  # button hover (−8%)

typography:
  hero:                   # the wordmark; fixed steps, never fluid — doctrine deviation argued in .olympus/06-build-plan.md
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: "140px (8.75rem) ≥1280 · 112px 900–1279 · 72px 600–899 · 56px <600"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.02em"
    fontVariationSettings: "'opsz' 144, 'SOFT' 0, 'WONK' 0"
  display-1:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: "72px (4.5rem) ≥1280 · 56px 900–1279 · 40px <900"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
    fontVariationSettings: "'opsz' 72"
  display-2:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: "56px (3.5rem) ≥1280 · 40px 900–1279 · 32px 600–899 · 28px <600"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  display-3:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: "28px (1.75rem) · 24px <900 · 22px <600"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0"
  pull:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontStyle: italic
    fontSize: "28px (1.75rem) · 24px <1280 · 22px <900 · 20px <600"
    fontWeight: 400
    lineHeight: 1.35
    measure: "34–44ch"
  body:
    fontFamily: "'Instrument Sans Variable', -apple-system, sans-serif"
    fontSize: "20px (1.25rem) · 18px <900"
    fontWeight: 400
    lineHeight: 1.55
    measure: "62–72ch"
  label:                  # UI: buttons, links
    fontFamily: "'Instrument Sans Variable', -apple-system, sans-serif"
    fontSize: "16px (1rem)"
    fontWeight: 500
    lineHeight: 1.35
  meta:                   # captions, window numbers, kickers, small caps
    fontFamily: "'Instrument Sans Variable', -apple-system, sans-serif"
    fontSize: "13px (0.8125rem)"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "+0.08em"
    textTransform: uppercase
  price:
    fontFamily: "'Fraunces Variable', Georgia, serif"
    fontSize: "28px (1.75rem)"
    fontWeight: 400
    fontFeatureSettings: "'tnum'"

spacing:
  scale: "4 / 8 / 16 / 24 / 40 / 64 / 96 / 160"
  section: "160px desktop · 96px <900"
  gutter: "24px · 16px <600"
  margin: "48px · 24px <900"
  grid: "12 columns, content max 1280px; 6 columns <900"
  window-mat: "12px"
  window-radius: "2px"
  measure: "62–72ch body, 34–44ch pull"

motion:
  micro: "160ms"          # state feedback: links, buttons, header background
  move: "600ms"           # window reveal (clip-path inset) — deviation argued; once per window
  scene: "900ms"          # wordmark settle on load, once — deviation argued
  scrub: "1"              # the hearth stoke, the only scroll-linked sequence
  ease-out: "cubic-bezier(.16,1,.3,1)"
  ease-in-out: "cubic-bezier(.65,0,.35,1)"
  reduced: "no settle, no reveals, no autoplay, hearth poster — the page as printed"

breakpoints:
  target: "1440 (designed), 1280, 900, 600, 390 (mobile check)"

components:
  button-primary: "ink #1A1511 on ember #E85D2F (5.21:1), label 16/500, padding 12px 20px, radius 2px, hover ember-hover, focus 2px ember outline offset 3px"
  link: "ink, 1px underline line → ink on hover (160ms); on night: paper, underline paper-dim"
  fenster: "mat paper-2 12px, 1px line frame, radius 2px, inner ground night, ratio 3:2 | 3:4 | 1:1 | 4:5, caption row below: meta ink-3 number + meta ink-2 title, optional Pause control (label 13/500)"
  dish-row: "96px tall, hairline line, name display-3 ink, price 28 Fraunces tnum ink right-aligned, note meta ink-2; hover preview 240px 1:1 window (desktop), inline 120px still (touch)"
  practical-card: "paper-2, 1px line border, 40px padding, dl two columns, labels meta ink-3, values body 18 ink"
  header: "64px, transparent over first 80px then paper + bottom line (160ms); wordmark 20px Fraunces; phone link; button-primary"
  closing-band: "night ground, display-2 paper, phone 28 Fraunces paper, sub body paper-dim, 2px line rule above, button-primary"
---

# SEEBLICK & GLUT — Fensterplatz

## Visual World

A sheet of warm parchment, almost still. The name of the restaurant is set large in an
old-style serif at the top left; a single italic line sits beside it. Down the page run nine
numbered windows — each a thin hairline frame on a slightly deeper paper mat — and inside every
window it is night: a hearth, a dining room at dusk, the lake in a pane of glass, hands over
slate. The paper never gets dark and the windows never get light. At the very end the page
turns over to the room after service: a black band with the reservation line in paper type.
You would pick this page out of ten others by the windows and by the fact that nothing glows
except fire.

## Type

Fraunces (variable, optical sizes) carries the wordmark and every headline because one file
gives a true display cut at 144 and a true text cut at 20, and because at `SOFT 0, WONK 0` it
is a sober Garalde, not a novelty face. Instrument Sans carries everything a guest reads for
information. The scale is a major third (1.25) in fixed steps: 13 / 16 / 20 / 28 / 40 / 56 /
72, extended by two steps (90, 112, 140) so the wordmark can be a name rather than a
sub-head. **Hero = 140 px fixed at ≥ 1280 (≈ 9.7vw at 1440), 112 / 72 / 56 at the breakpoints
below; never `vw`, never `clamp()`.** Everything else stays inside the doctrine's list.

## Colour

Legal pairings (measured): ink/paper 15.30 · ink-2/paper 6.50 · ink-3/paper 4.45 ·
ink/paper-2 13.85 · ink-2/paper-2 5.88 · ink-3/paper-2 4.03 · paper/night 16.69 ·
paper-dim/night 10.86 · ink/ember 5.21 · ember/night 5.68 (hairline only).
Banned (measured): ember on paper as text 2.94 · paper on ember 2.94 · ink-2 on night 2.57 ·
line as text 1.33. Ember is UI exactly three times per page (button component, focus ring,
hearth hairline); prices are ink.

## Media

Every image and video is contained in a `Fenster`: mat, hairline, 2 px radius, no shadow, night
ground, media at full strength, never scrimmed. Type never crosses a window — the only overlap
on the page is the hero seam where the wordmark's last line and the first window's top edge
share one line-height, and there the type sits on paper, not on the picture. Windows are at most
840 px CSS wide, which is why 720-line video is sharp and why no video is ever full-screen.
Every crop of a Flow clip ends at x ≤ 1620 of the 1920 source (watermark exclusion).

## Motion

GSAP + ScrollTrigger own the window reveals (600 ms clip-path, once), the hearth stoke (scrub 1)
and the sticky-column bounds. three.js owns one window (04, Die Glut). CSS owns every 160 ms
state. The wordmark settles once on load (900 ms). No Lenis, no marquee, no parallax on
images, no stagger-fade-up pattern. Reduced-motion end state: the page as printed — posters in
every window, the hearth poster, hairline full, Pause control reads "Abspielen".

## Accessibility

Focus: 2 px ember outline, 3 px offset, on paper and on night. Landmarks: header, main with one
`h1` (wordmark) and one `h2` per section, footer. Each video window is `aria-hidden` with a
visible caption that carries meaning and a single page-level Pause control (button, labelled).
Dish rows are a list; hover previews are decorative and have inline equivalents on touch. The
hearth canvas is `aria-hidden`; its caption and poster carry the meaning. Skip link kept.

## Known Deployment Debt

- Flow clips carry a watermark; crops hide it at the cost of the right 16 % of each frame.
  A clean re-export is a launch nicety, not a blocker.
- Three generated assets (V01, S01, S02) and the optional M01 mesh are pending approval; each
  has a supplied fallback in `.olympus/05-asset-manifest.md`.
- No booking engine exists; the action is phone/e-mail. `ATU00000000` in the Impressum is a
  placeholder the client must replace.
- `tnum` in Instrument Sans must be verified in the browser; fall back to Fraunces for prices.

## Do's and Don'ts

### Do
- Keep the ground paper everywhere outside windows and the closing band.
- Number and caption every window; the numbers are the page's spine.
- Set the wordmark at 140 px and leave it still after the one settle.
- Let the hearth respond to scroll and to nothing else.
- Put prices in ink, right-aligned, tabular.
- Ship posters for every window first; video is an enhancement.

### Don't
- Don't let any video go full-bleed, exceed 720 lines, or lose its frame on mobile.
- Don't add a fourth ember appearance, or ember text on paper.
- Don't fade sections up on scroll; the reveal is the window opening, nothing else moves.
- Don't reintroduce smooth scroll, marquees, loaders, custom cursors or a second hero moment.
- Don't scrim a window to put type on it.
- Don't invent a booking form, reviews, awards or a chef.
