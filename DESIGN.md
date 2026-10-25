---
name: SEEBLICK & GLUT — Die Speisekarte am See
description: A summer menu card from the Wörthersee, printed in four inks — fire, lake, pine, butter.
northStar: .olympus/06b-direction-speisekarte.md (reference: Da Maria, chosen by the client 2026-10-22). Previous direction archived at .olympus/DESIGN-fensterplatz.md.

colors:
  cream: "#F3E7D3"       # paper
  cream-2: "#EADBC2"     # inner panels
  ink: "#241C17"         # text, drop caps, engravings — 13.7:1 on cream
  ink-2: "#5A4A3F"       # secondary text — 6.9:1
  ember: "#D8452B"       # display ≥ 28 px and fills only (3.58:1) — the masthead, section titles, page frame
  ember-deep: "#B23219"  # small red text, buttons, prices — 5.11:1; cream on it 5.11:1
  lake: "#2D5D7B"        # Philosophie panel, occasions marquee, Praktisches title — 5.8:1
  pine: "#2F4A3A"        # Die Glut section, footer — 7.95:1
  butter: "#E9B949"      # stamps, dock, labels on pine; ink on butter 9.2:1
  night: "#16110E"       # video ground only

typography:
  display: Playfair Display Variable 900, caps, line-height .86 — masthead clamp(132px, 30vw, 420px); titles clamp(64px, 13vw, 184px), fitted to the longest word (src/lib/fit.ts)
  label: Playfair Display italic 700 — box labels, prices, buttons, notes
  text: Bitter Variable 400/600, 18–19 px / 1.6, ≤ 62ch
  meta: Bitter 600, 13 px, caps, +0.08em

components:
  frame: fixed red double frame (body::before), always on top
  header: round "Karte" badge · boxed logo (double rule) · oval Reservieren button; sticky, ink rule after 24 px
  plate: photo/video with 1 px ink rule offset 5 px, ink caption box (number in butter italic + Pause)
  box: filled ember-deep or butter band with italic label and rule
  panel: full lake/pine colour fields inside the frame
  stamp: rotating round stamp (SVG ring text), speed follows scroll velocity
  engraving: pen illustrations (8, Artlist) draw in on entry, sway on hover
  marquee: running wordmark (masthead) and occasions band (lake), scroll-velocity coupled
  dock: butter ticket with live status + call button, phones only

motion:
  intro: Remotion card (remotion/src/Wordmark.tsx, 72 f @ 30) — frame draws, words stamped with off-register lake plate, butter "&" stamp spins; card lifts off (clip-path). ≤ 3.2 s, once per session.
  reveals: letter-mask titles, box wipes, plate reveals, engraving draw-in — one IntersectionObserver, CSS transitions
  hearth: three.js + ScrollTrigger lazy-loaded near "Die Glut"; stoke scrub kept
  reduced-motion: everything static, marquees still, no intro
