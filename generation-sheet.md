# Generation Sheet — SEEBLICK & GLUT
Backend: Google Flow · All video: 1080p, 16:9, no audio, ~8s, std. Reference assets attached to EVERY generation.

## GATE 1 — identity stills (iterate until locked; nothing moves before approval)

### Asset 0A — identity still (sear + lake-window composition)
> Cinematic editorial still of an ember-seared dry-aged beef edge on cast iron, centered in a dark Alpine-modern restaurant interior. Floor-to-ceiling west-facing glass reveals Wörthersee lake light at golden hour — soft blue-green water reflection on the table surface. Open wood-fire hearth glows deep orange in the background left. Dark slate plate, minimal styling. A single warm ember-orange (#E85D2F) rim light traces the sear crust from behind-right; soft key fills the meat texture. 85mm lens aesthetic, shallow depth of field, subtle film grain, high contrast, premium editorial photography. Nothing moves.
Takes: 2–3. Approval: [ ] Russ [ ] client
**Delivery:** `assets-in/0A-identity-still.webp`

## GATE 2 — clips (only after Gate 1 locked; attach 0A as reference to every prompt)

### Asset 1 — HERO SEAR
> [SUBJECT locked by reference 0A] Extreme close-up of the ember-seared beef crust on cast iron, identical sear texture and ember-orange rim light as reference. Slow, perfectly smooth cinematic push-in toward the sizzling edge. Tiny embers rise from the wood-fire hearth behind, blurred. Lake-window reflection stays fixed in the background glass. Single ember glow intensifies as camera advances. Duration 8 seconds. One camera move only. The beef sear pattern and rim light color must NOT change.
**Delivery:** `assets-in/1-hero-sear.mp4` → extract to `site/frames/hero/frame_%04d.webp` (160 frames @ 20fps)

### Asset 2 — THE ROOM
> [SUBJECT locked by reference 0A] Slow cinematic dolly forward through the Alpine-modern dining room at golden hour. Floor-to-ceiling glass reveals Wörthersee and Lendkanal shoreline. Wood-fire hearth glows left, dark wood tables with minimal place settings. Warm lake light floods through west windows, casting long shadows. Constant dolly speed, no shake, no zoom. Interior architecture and hearth position must NOT change. Duration 8 seconds. One camera move only.
**Delivery:** `assets-in/2-the-room.mp4` → `site/media/the-room.mp4`

### Asset 3 — THE CRAFT
> [SUBJECT locked by reference 0A] Overhead shot of chef hands plating grilled Reinanke on dark slate, steam rising. Wood-fire ember glow from below-left. Minimal garnish — lemon, dill. Slow, perfectly smooth overhead push-in. Steam behavior is the only movement besides the camera. Plate and slate texture must NOT change. Duration 8 seconds. One camera move only.
**Delivery:** `assets-in/3-the-craft.mp4` → `site/media/the-craft.mp4`

## Delivery checklist
| File | Destination |
|------|-------------|
| `0A-identity-still.webp` | `assets-in/` (reference for all clips) |
| `1-hero-sear.mp4` | `assets-in/` → FFmpeg extract → `site/frames/hero/` |
| `2-the-room.mp4` | `assets-in/` → `site/media/the-room.mp4` |
| `3-the-craft.mp4` | `assets-in/` → `site/media/the-craft.mp4` |

Then run: `engine/ffmpeg/extract.sh` on hero clip for WebP frame sequence.
