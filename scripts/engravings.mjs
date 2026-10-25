#!/usr/bin/env node
// Cuts the two Artlist engraving sheets (2×2 grids) into single illustrations and turns the
// paper transparent: alpha comes from ink darkness, colour is flattened to one ink so CSS can
// recolour it (mask-image) or show it as-is on any ground.
import sharp from 'sharp';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const GEN = join(ROOT, 'assets-out', 'gen');
const OUT = join(ROOT, 'public', 'media');
const sheets = {
  'engr-a.png': ['e-telefon', 'e-reinanke', 'e-rind', 'e-kasnudeln'],
  'engr-b.png': ['e-holz', 'e-see', 'e-feste', 'e-kerze'],
};
const INK = [36, 28, 23]; // --ink #241C17
const INSET = 60; // keeps the sheet's dividing lines out of the crop

for (const [file, names] of Object.entries(sheets)) {
  const { width } = await sharp(join(GEN, file)).metadata();
  const q = width / 2;
  for (let i = 0; i < 4; i++) {
    const left = (i % 2) * q + INSET;
    const top = Math.floor(i / 2) * q + INSET;
    const size = q - INSET * 2;
    const { data, info } = await sharp(join(GEN, file))
      .extract({ left, top, width: size, height: size })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const rgba = Buffer.alloc(info.width * info.height * 4);
    for (let p = 0; p < info.width * info.height; p++) {
      const l = data[p];
      const a = Math.max(0, Math.min(1, (222 - l) / 160));
      rgba[p * 4] = INK[0];
      rgba[p * 4 + 1] = INK[1];
      rgba[p * 4 + 2] = INK[2];
      rgba[p * 4 + 3] = Math.round(a * 255);
    }
    const out = join(OUT, `${names[i]}.webp`);
    await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
      .trim({ threshold: 1 })
      .resize(600, 600, { fit: 'inside' })
      .webp({ quality: 70, alphaQuality: 70, effort: 6 })
      .toFile(out);
    const m = await sharp(out).metadata();
    console.log(names[i], m.width, m.height);
  }
}
