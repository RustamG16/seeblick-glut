#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'assets-out');
const DEST = join(ROOT, 'public', 'media');

if (!existsSync(SRC)) {
  console.warn('assets-out/ missing — skipping media sync');
  process.exit(0);
}

const files = readdirSync(SRC).filter((f) => !f.startsWith('.') && f !== 'ingest-report.json');
if (files.length === 0) {
  console.warn('assets-out/ empty — run npm run ingest first');
  process.exit(0);
}

mkdirSync(DEST, { recursive: true });

let copied = 0;
for (const file of files) {
  const srcPath = join(SRC, file);
  if (!statSync(srcPath).isFile()) continue;
  copyFileSync(srcPath, join(DEST, file));
  copied++;
}

console.log(`Synced ${copied} files → public/media/`);
