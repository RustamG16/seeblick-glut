# Tour Asset Finalization Report — SEEBLICK & GLUT (lab/001)

Date: 2026-07-12

## 1. Probe

| File | Resolution | FPS | Duration | Video codec | Audio |
|---|---|---|---|---|---|
| tour-leg1.mp4 | 1920×1080 (16:9) | 24 | 8.000 s (192 fr) | h264 | AAC (stripped in output) |
| tour-leg2.mp4 | 1920×1080 (16:9) | 24 | 10.000 s (240 fr) | h264 | AAC (stripped in output) |
| tour-leg3.mp4 | 1920×1080 (16:9) | 24 | 10.000 s (240 fr) | h264 | AAC (stripped in output) |

No anomalies. Files were already correctly named; nothing renamed.

## 2. Seam QA — ⚠ BOTH SEAMS FLAGGED

Contact sheets: `qa/seam-1-2.jpg`, `qa/seam-2-3.jpg` (rows 1–2 = legN last 10, rows 3–4 = legN+1 first 10).

SSIM scores (flag threshold < 0.90):

| Comparison | SSIM | Verdict |
|---|---|---|
| leg1 last frame vs anchor `leg1-end-room-start.jpg` | 0.842 | closest match — anchor is from leg1 end |
| leg2 first frame vs anchor `leg1-end-room-start.jpg` | 0.585 | ⚠ |
| leg2 last frame vs anchor `leg2-anchor-final.jpg` | 0.451 | ⚠ |
| leg3 first frame vs anchor `leg2-anchor-final.jpg` | 0.486 | ⚠ |
| **leg1-last vs leg2-first (seam 1→2)** | **0.471** | **⚠ visible jump** |
| **leg2-last vs leg3-first (seam 2→3)** | **0.366** | **⚠ visible jump** |

Visual inspection of contact sheets:
- **Seam 1→2**: same dining room and near-identical camera position, but leg1 ends with the room *empty* and leg2 opens with *seated diners*, warmer light. Continuity of place holds; continuity of population does not — a hard cut will read as a time-skip.
- **Seam 2→3**: same terrace/band scene, but leg3 opens with the camera pulled back and *additional foreground guests* flanking the frame. Reads as a deliberate wider "party grows" beat, not a match cut.

Both jumps look like intentional narrative beats from the generation sheet, but they are NOT invisible seams. If seamless flow is required, the legs need regeneration with true frame anchors; if the captions ("Die Ankunft" → "Das Fest" → "Das Haus") are shown at the cuts, the jumps can be presented as chapter transitions.

## 3. Watermark check — ⚠ FLAGGED, ALL LEGS

Crops (bottom-right 20%): `qa/watermark/legN-br-01..10.jpg` + per-leg review sheets `legN-sheet.jpg`.

The semi-transparent white four-pointed diamond (Veo/Flow watermark, matching `anchors/watermark-zoom.jpg`) is present in **every sampled frame of all three legs**, sitting in the bottom-right region. It is baked into the extracted frames too. These files are not clean for production — export watermark-free renders from Flow (paid tier) or plan a crop/inpaint pass before ship.

## 4. Audio strip

`assets-out/tour-leg{1,2,3}.mp4` — video stream bit-copied (`-c copy -an`), no re-encode. Verified: video-only, durations preserved (8.0 / 10.0 / 10.0 s).

## 5. Frame extraction

15 fps from stripped copies, global continuous index, JPEG q≈85 (mjpeg q:v 3):
- `assets-out/frames/desktop/frame-00001..00420.jpg` — 1920×1080
- `assets-out/frames/mobile/frame-00001..00420.jpg` — 960×540 (lanczos)

Seam dedupe check: leg2-first vs leg1-last SSIM 0.640, leg3-first vs leg2-last SSIM 0.542 — both far below the 0.98 near-identical threshold, so **no frames dropped** (consistent with the flagged jumps).

## 6. Manifest — `assets-out/manifest.json`

fps 15, 1920×1080, totalFrames 420.

| Leg | Caption | Frames (global, 1-based) | Count | Duration |
|---|---|---|---|---|
| leg1 | Die Ankunft | 1–120 | 120 | 8.0 s |
| leg2 | Das Fest | 121–270 | 150 | 10.0 s |
| leg3 | Das Haus | 271–420 | 150 | 10.0 s |

## 7. Verify

- File count vs manifest: 420/420 desktop, 420/420 mobile; numbering continuous 00001–00420, no gaps.
- Zero-byte files: 0. Full decode pass: OK both sets. Black-frame scan (blackframe amount=98): none.
- Payload: desktop 77.8 MB (leg1 21.3 / leg2 27.6 / leg3 28.8), mobile 28.8 MB (8.5 / 10.1 / 10.1).
- `assets-in/` untouched.

## Notes

- `scripts/sync-media.mjs` (runs on `predev`/`prebuild`) copies top-level `assets-out/*` files into `public/media/` — the three stripped tour mp4s (+ manifest.json) will land there on the next `npm run dev/build` (~32 MB added to public). The `frames/` directory is skipped (directories are not copied); wire the frames into `public/` deliberately when the tour section is built.
- Hero banner reworked separately: scroll-scrub flipbook removed, replaced with a looping ambient video (see session summary).
