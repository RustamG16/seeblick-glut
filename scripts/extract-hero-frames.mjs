#!/usr/bin/env node
/**
 * Extract hero flipbook frames from hero-sear.mp4 → public/assets/
 * Usage: npm run assets:hero [-- --trim-first] [-- --trim-last]
 */
import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DESKTOP_OUT = join(ROOT, 'public', 'assets', 'hero-sear');
const MOBILE_OUT = join(ROOT, 'public', 'assets', 'hero-sear-mobile');
const SIZE_BUDGET_MB = 12;

const args = process.argv.slice(2);
const trimFirst = args.includes('--trim-first');
const trimLast = args.includes('--trim-last');

function findSource() {
  const candidates = [
    join(ROOT, 'assets-in', 'hero-sear.mp4'),
    join(ROOT, 'assets-out', 'hero-sear.mp4'),
  ];
  const src = candidates.find(existsSync);
  if (!src) {
    throw new Error(
      'No hero-sear.mp4 found. Place it in assets-in/ or run npm run ingest first.',
    );
  }
  return src;
}

function runFfmpeg(src, outDir, vf, quality) {
  mkdirSync(outDir, { recursive: true });
  const pattern = join(outDir, 'frame_%04d.webp');
  execFileSync(
    ffmpegPath,
    ['-y', '-i', src, '-vf', vf, '-c:v', 'libwebp', '-q:v', String(quality), pattern],
    { stdio: 'inherit' },
  );
}

function clearWebp(dir) {
  if (!existsSync(dir)) return;
  readdirSync(dir)
    .filter((f) => f.endsWith('.webp'))
    .forEach((f) => rmSync(join(dir, f)));
}

function listFrames(dir) {
  return readdirSync(dir)
    .filter((f) => /^frame_\d+\.webp$/.test(f))
    .sort();
}

function totalSizeMB(dir, files) {
  return files.reduce((sum, f) => sum + statSync(join(dir, f)).size, 0) / (1024 * 1024);
}

function trimFrames(dir, files) {
  let trimmed = [...files];
  if (trimFirst && trimmed.length > 2) {
    rmSync(join(dir, trimmed[0]));
    trimmed = trimmed.slice(1);
    console.log(`  Trimmed first frame: ${files[0]}`);
  }
  if (trimLast && trimmed.length > 2) {
    const lastFile = trimmed[trimmed.length - 1];
    rmSync(join(dir, lastFile));
    trimmed = trimmed.slice(0, -1);
    console.log(`  Trimmed last frame: ${lastFile}`);
  }
  return trimmed;
}

function renumberFramesSync(dir, files) {
  const temp = files.map((f, i) => {
    const n = String(i + 1).padStart(4, '0');
    const tempPath = join(dir, `_tmp_frame_${n}.webp`);
    renameSync(join(dir, f), tempPath);
    return tempPath;
  });
  temp.forEach((tempPath, i) => {
    const n = String(i + 1).padStart(4, '0');
    renameSync(tempPath, join(dir, `frame_${n}.webp`));
  });
  return temp.map((_, i) => `frame_${String(i + 1).padStart(4, '0')}.webp`);
}

async function writeManifest(outDir, publicPath, files, fps) {
  const firstFrame = join(outDir, files[0]);
  let width = null;
  let height = null;
  try {
    const meta = await sharp(firstFrame).metadata();
    width = meta.width ?? null;
    height = meta.height ?? null;
  } catch {
    /* dimensions optional */
  }
  const manifest = {
    frameCount: files.length,
    width,
    height,
    pattern: `${publicPath}/frame_%04d.webp`,
    fps,
  };
  writeFileSync(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  return manifest;
}

function extractSet(src, outDir, publicPath, vf, quality, label) {
  console.log(`\nExtracting ${label} (${vf}, q=${quality})…`);
  clearWebp(outDir);
  runFfmpeg(src, outDir, vf, quality);
  let files = listFrames(outDir);
  files = trimFrames(outDir, files);
  if (trimFirst || trimLast) {
    files = renumberFramesSync(outDir, files);
  }
  const mb = totalSizeMB(outDir, files);
  console.log(`  ${files.length} frames, ${mb.toFixed(2)} MB`);
  const fps = vf.includes('fps=16') ? 16 : 20;
  return { files, mb, outDir, fps, publicPath, quality };
}

async function finalizeSet(result) {
  const manifest = await writeManifest(
    result.outDir,
    result.publicPath,
    result.files,
    result.fps,
  );
  return { ...result, manifest };
}

const src = findSource();
console.log(`Source: ${src.replace(ROOT, '.')}`);

let desktop = await finalizeSet(
  extractSet(src, DESKTOP_OUT, '/assets/hero-sear', 'fps=20,scale=1920:-1', 72, 'desktop'),
);

if (desktop.mb > SIZE_BUDGET_MB) {
  console.warn(
    `\nDesktop set ${desktop.mb.toFixed(2)} MB exceeds ~${SIZE_BUDGET_MB} MB — re-extracting at q=65…`,
  );
  desktop = await finalizeSet(
    extractSet(
      src,
      DESKTOP_OUT,
      '/assets/hero-sear',
      'fps=20,scale=1920:-1',
      65,
      'desktop (retry q=65)',
    ),
  );
}

if (desktop.mb > SIZE_BUDGET_MB) {
  console.warn(
    `\nStill over budget (${desktop.mb.toFixed(2)} MB) — re-extracting at fps=16, q=65…`,
  );
  desktop = await finalizeSet(
    extractSet(
      src,
      DESKTOP_OUT,
      '/assets/hero-sear',
      'fps=16,scale=1920:-1',
      65,
      'desktop (retry fps=16)',
    ),
  );
}

const mobile = await finalizeSet(
  extractSet(
    src,
    MOBILE_OUT,
    '/assets/hero-sear-mobile',
    'fps=20,scale=960:-1',
    70,
    'mobile',
  ),
);

console.log('\nDone.');
console.log(`  Desktop: ${desktop.files.length} frames, ${desktop.mb.toFixed(2)} MB`);
console.log(`  Mobile:  ${mobile.files.length} frames, ${mobile.mb.toFixed(2)} MB`);
if (desktop.mb > SIZE_BUDGET_MB) {
  console.warn(`  WARNING: desktop still ${desktop.mb.toFixed(2)} MB — lower q or fps manually.`);
}
