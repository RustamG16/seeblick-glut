#!/usr/bin/env node
// Encodes every Fenster asset from .olympus/05-asset-manifest.md.
// Sources live in assets-out/src (Flow clips) and assets-out/gen (Artlist generations);
// outputs go to public/media. Crop rule for Flow clips: x + width <= 1620 (watermark at x>1700).
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import ffmpegStatic from 'ffmpeg-static';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'assets-out', 'src');
const GEN = join(ROOT, 'assets-out', 'gen');
const OUT = join(ROOT, 'public', 'media');
const FFMPEG = process.env.FFMPEG || ffmpegStatic || 'ffmpeg';
const WATERMARK_EDGE = 1620;

mkdirSync(SRC, { recursive: true });
mkdirSync(OUT, { recursive: true });

// First run: keep the original Flow sources in assets-out/src before public/media is cleaned.
for (const f of ['hero-sear.mp4', 'room.mp4', 'craft.mp4', 'tour-leg1.mp4', 'tour-leg2.mp4', 'tour-leg3.mp4', 'still_hero.jpg']) {
  const from = join(ROOT, 'public', 'media', f);
  if (!existsSync(join(SRC, f)) && existsSync(from)) copyFileSync(from, join(SRC, f));
}

const crop = (w, h, x, y) => ({ w, h, x, y });
const RATIO = { '3:2': [1080, 720, 720, 480], '3:4': [540, 720, 360, 480], '1:1': [720, 720, 480, 480] };

/** Video windows. flow: true asserts the watermark crop rule. */
const videos = [
  { id: 'f00-glut', src: 'hero-sear.mp4', ss: 0, t: 8, crop: crop(1620, 1080, 0, 0), ratio: '3:2', flow: true },
  { id: 'f02-saal', src: 'room.mp4', ss: 0, t: 8, crop: crop(1620, 1080, 0, 0), ratio: '3:2', flow: true },
  { id: 'f03-seelicht', src: 'gen/v01-seelicht.mp4', ss: 0, t: 5, crop: crop(588, 784, 420, 0), ratio: '3:4', flow: false },
  { id: 'f05-haende', src: 'craft.mp4', ss: 0, t: 8, crop: crop(1080, 1080, 270, 0), ratio: '1:1', flow: true },
  { id: 'f06-haus', src: 'tour-leg3.mp4', ss: 3.2, t: 6.7, crop: crop(1620, 1080, 0, 0), ratio: '3:2', flow: true },
  { id: 'f07-terrasse', src: 'tour-leg2.mp4', ss: 4.5, t: 5, crop: crop(810, 1080, 405, 0), ratio: '3:4', flow: true },
  { id: 'f08-ankunft', src: 'tour-leg1.mp4', ss: 0, t: 4.2, crop: crop(1620, 1080, 0, 0), ratio: '3:2', flow: true },
];

/** Stills taken from a frame of a Flow clip (or a still), then resized with sharp. */
const frameStills = [
  { id: 'f01-feuer', src: 'hero-sear.mp4', ss: 0, crop: crop(810, 1080, 405, 0), size: [810, 1080], flow: true },
  { id: 'd2-reinanke', src: 'craft.mp4', ss: 2, crop: crop(900, 900, 500, 90), size: [600, 600], flow: true },
];

const imageStills = [
  { id: 'd1-rind', src: join(SRC, 'still_hero.jpg'), extract: { left: 360, top: 0, width: 880, height: 880 }, size: [600, 600] },
  { id: 'd3-kasnudeln', src: join(GEN, 's01-kasnudeln.png'), size: [600, 600] },
  { id: 'f04-glut-poster', src: join(GEN, 's02-glut.png'), size: [864, 1080] },
  { id: 'seeblick-1600', src: join(GEN, 's03-seeblick.png'), size: [1600, 893] },
  { id: 'seeblick-900', src: join(GEN, 's03-seeblick.png'), size: [900, 1200] },
];

function assertCrop(item) {
  if (!item.flow) return;
  const edge = item.crop.x + item.crop.w;
  if (edge > WATERMARK_EDGE) throw new Error(`${item.id}: crop ends at x=${edge} > ${WATERMARK_EDGE} (watermark)`);
}

function srcPath(p) {
  return p.startsWith('gen/') ? join(GEN, p.slice(4)) : join(SRC, p);
}

function ff(args) {
  execFileSync(FFMPEG, ['-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
}

const rm = (p) => rmSync(p, { force: true });
const kb = (p) => `${(statSync(p).size / 1024).toFixed(0)} KB`;
const report = [];

for (const v of videos) {
  assertCrop(v);
  const [dw, dh, mw, mh] = RATIO[v.ratio];
  const c = `crop=${v.crop.w}:${v.crop.h}:${v.crop.x}:${v.crop.y}`;
  const input = ['-ss', String(v.ss), '-t', String(v.t), '-i', srcPath(v.src), '-an'];
  const enc = ['-c:v', 'libx264', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'];
  const d = join(OUT, `${v.id}.720.mp4`);
  const m = join(OUT, `${v.id}.480.mp4`);
  // crf 25 (manifest says 24) keeps the 7-clip desktop total under the 9 MB guardrail.
  ff([...input, '-vf', `${c},scale=${dw}:${dh}:flags=lanczos`, ...enc, '-crf', '25', d]);
  ff([...input, '-vf', `${c},scale=${mw}:${mh}:flags=lanczos`, ...enc, '-crf', '27', m]);
  const posterPng = join(OUT, `${v.id}.poster.tmp.png`);
  ff(['-i', d, '-frames:v', '1', posterPng]);
  await sharp(posterPng).webp({ quality: 80 }).toFile(join(OUT, `${v.id}.webp`));
  rm(posterPng);
  report.push(`${v.id}  720 ${kb(d)} · 480 ${kb(m)} · poster ${kb(join(OUT, `${v.id}.webp`))}  crop x+w=${v.crop.x + v.crop.w}`);
}

for (const s of frameStills) {
  assertCrop(s);
  const tmp = join(OUT, `${s.id}.tmp.png`);
  ff(['-ss', String(s.ss), '-i', srcPath(s.src), '-frames:v', '1', '-vf', `crop=${s.crop.w}:${s.crop.h}:${s.crop.x}:${s.crop.y}`, tmp]);
  const out = join(OUT, `${s.id}.webp`);
  await sharp(tmp).resize(...s.size, { fit: 'cover' }).webp({ quality: 80 }).toFile(out);
  rm(tmp);
  report.push(`${s.id}  ${kb(out)}  crop x+w=${s.crop.x + s.crop.w}`);
}

for (const s of imageStills) {
  let img = sharp(s.src);
  if (s.extract) img = img.extract(s.extract);
  const out = join(OUT, `${s.id}.webp`);
  await img.resize(...s.size, { fit: 'cover', position: 'attention' }).webp({ quality: 78 }).toFile(out);
  report.push(`${s.id}  ${kb(out)}`);
}

// Open Graph: clean still, 1200×630.
const og = join(OUT, 'og.jpg');
await sharp(join(SRC, 'still_hero.jpg')).extract({ left: 0, top: 30, width: 1600, height: 840 }).resize(1200, 630).jpeg({ quality: 82 }).toFile(og);
report.push(`og  ${kb(og)}`);

console.log(report.join('\n'));
