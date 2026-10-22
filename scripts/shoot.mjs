#!/usr/bin/env node
// QA evidence: viewport + full-page screenshots via Chrome DevTools Protocol.
// usage: node scripts/shoot.mjs <url> <outPrefix> [waitMs]
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME =
  process.env.CHROME ??
  resolve(ROOT, 'remotion/node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe');
const [url, prefix, waitArg] = process.argv.slice(2);
const wait = Number(waitArg ?? 6000);
const port = 9300 + Math.floor(Math.random() * 500);

const chrome = spawn(CHROME, [
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${resolve(tmpdir(), `shoot-${port}`)}`,
  '--hide-scrollbars',
  '--autoplay-policy=no-user-gesture-required',
  '--use-angle=swiftshader',
  'about:blank',
]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 40 && !target; i++) {
  await sleep(250);
  try {
    target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page');
  } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) pending.get(m.id)(m.result ?? m.error), pending.delete(m.id);
});
const send = (method, params = {}) =>
  new Promise((r) => {
    pending.set(++id, r);
    ws.send(JSON.stringify({ id, method, params }));
  });

mkdirSync(dirname(resolve(ROOT, prefix)), { recursive: true });

for (const [name, width, height, mobile] of [
  ['1440', 1440, 900, false],
  ['390', 390, 844, true],
]) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  await send('Page.navigate', { url });
  await sleep(wait);
  // Walk the page so lazy media and reveals trigger, then return to the top.
  const { result } = await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true });
  for (let y = 0; y < result.value; y += height * 0.8) {
    await send('Runtime.evaluate', { expression: `scrollTo(0, ${y})` });
    await sleep(350);
  }
  await send('Runtime.evaluate', { expression: 'scrollTo(0, 0)' });
  await sleep(1200);
  const top = await send('Page.captureScreenshot', { format: 'jpeg', quality: 82 });
  writeFileSync(resolve(ROOT, `${prefix}-${name}-top.jpg`), Buffer.from(top.data, 'base64'));
  const full = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70, captureBeyondViewport: true });
  writeFileSync(resolve(ROOT, `${prefix}-${name}-full.jpg`), Buffer.from(full.data, 'base64'));
  console.log(`${prefix}-${name} done`);
}
ws.close();
chrome.kill();
