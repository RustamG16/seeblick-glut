#!/usr/bin/env node
/**
 * Cross-platform ambient video ingest — assets-in/ → assets-out/
 * Strips audio, re-encodes desktop/mobile variants, extracts posters.
 */
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const ASSETS_IN = join(ROOT, 'assets-in');
const ASSETS_OUT = join(ROOT, 'assets-out');

const VIDEOS = ['hero-sear', 'room', 'craft'];

function run(args) {
  execFileSync(ffmpegPath, args, { stdio: 'inherit' });
}

function sizeMB(file) {
  return (statSync(file).size / (1024 * 1024)).toFixed(2);
}

function probe(file) {
  try {
    const out = execFileSync(ffmpegPath, [
      '-v', 'error',
      '-i', file,
      '-f', 'null',
      '-',
    ], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    void out;
  } catch (e) {
    const stderr = e.stderr?.toString() ?? '';
    const res = stderr.match(/(\d{2,5})x(\d{2,5})/);
    const dur = stderr.match(/Duration: (\d{2}):(\d{2}):(\d{2}\.\d{2})/);
    return {
      width: res ? parseInt(res[1], 10) : null,
      height: res ? parseInt(res[2], 10) : null,
      duration: dur
        ? parseInt(dur[1], 10) * 3600 + parseInt(dur[2], 10) * 60 + parseFloat(dur[3])
        : null,
    };
  }
  return {};
}

async function ingestStill() {
  const candidates = ['still-hero.jpeg', 'still_hero.jpg', 'still-hero.jpg'];
  const src = candidates.map((n) => join(ASSETS_IN, n)).find(existsSync);
  if (!src) throw new Error('No identity still found in assets-in/');

  const jpgOut = join(ASSETS_OUT, 'still_hero.jpg');
  const webpOut = join(ASSETS_OUT, 'still_hero.webp');

  await sharp(src)
    .resize(1600, null, { withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(jpgOut);

  await sharp(src)
    .resize(1600, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(webpOut);

  return { src: src.replace(ROOT + '\\', '').replace(ROOT + '/', ''), jpgOut, webpOut };
}

async function ingestVideo(name) {
  const src = join(ASSETS_IN, `${name}.mp4`);
  if (!existsSync(src)) throw new Error(`Missing ${src}`);

  const desktop = join(ASSETS_OUT, `${name}.mp4`);
  const mobile = join(ASSETS_OUT, `${name}-mobile.mp4`);
  const posterJpg = join(ASSETS_OUT, `${name}-poster.jpg`);
  const posterWebp = join(ASSETS_OUT, `${name}-poster.webp`);

  // Desktop: H.264, no audio, faststart
  run([
    '-y', '-i', src,
    '-an',
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '28',
    '-movflags', '+faststart',
    '-pix_fmt', 'yuv420p',
    desktop,
  ]);

  // Mobile: 720p
  run([
    '-y', '-i', src,
    '-an',
    '-vf', 'scale=-2:720',
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '30',
    '-movflags', '+faststart',
    '-pix_fmt', 'yuv420p',
    mobile,
  ]);

  // Poster from first frame
  run(['-y', '-ss', '0', '-i', desktop, '-vframes', '1', '-update', '1', '-q:v', '2', posterJpg]);
  await sharp(posterJpg).webp({ quality: 80 }).toFile(posterWebp);

  const meta = probe(desktop);
  return {
    name,
    desktop: { path: desktop, mb: sizeMB(desktop) },
    mobile: { path: mobile, mb: sizeMB(mobile) },
    poster: { jpg: posterJpg, webp: posterWebp },
    width: meta.width,
    height: meta.height,
    duration: meta.duration,
  };
}

mkdirSync(ASSETS_OUT, { recursive: true });

console.log('Ingesting still…');
const still = await ingestStill();

console.log('Ingesting videos…');
const videos = [];
for (const name of VIDEOS) {
  videos.push(await ingestVideo(name));
}

const report = {
  timestamp: new Date().toISOString(),
  still: {
    source: still.src,
    outputs: ['still_hero.jpg', 'still_hero.webp'],
  },
  videos,
  totalVideoMB: videos
    .reduce((sum, v) => sum + parseFloat(v.desktop.mb) + parseFloat(v.mobile.mb), 0)
    .toFixed(2),
};

writeFileSync(join(ASSETS_OUT, 'ingest-report.json'), JSON.stringify(report, null, 2));
console.log(`Done. Total video payload: ${report.totalVideoMB} MB`);
console.log(`Report: assets-out/ingest-report.json`);
