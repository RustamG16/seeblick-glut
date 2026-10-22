#!/usr/bin/env node
// LCP / CLS / transfer under Lighthouse-style slow 4G (1.6 Mbps, 150 ms RTT, 4x CPU), via CDP.
// usage: node scripts/measure.mjs <url> [width height mobile]
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = process.env.CHROME ?? resolve(ROOT, 'remotion/node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe');
const [url, w = '390', h = '844', m = '1'] = process.argv.slice(2);
const port = 9800 + Math.floor(Math.random() * 100);
const chrome = spawn(CHROME, [`--remote-debugging-port=${port}`, `--user-data-dir=${resolve(tmpdir(), `measure-${port}`)}`, 'about:blank']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 40 && !target; i++) {
  await sleep(250);
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {}
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const x = JSON.parse(e.data); if (x.id && pending.has(x.id)) pending.get(x.id)(x.result ?? x.error), pending.delete(x.id); });
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });

await send('Page.enable');
await send('Network.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
await send('Emulation.setCPUThrottlingRate', { rate: 4 });
await send('Emulation.setDeviceMetricsOverride', { width: +w, height: +h, deviceScaleFactor: 1, mobile: m === '1' });
await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__lcp=0;window.__cls=0;new PerformanceObserver(l=>{for(const e of l.getEntries()){window.__lcp=e.startTime;(window.__lcps=window.__lcps||[]).push(Math.round(e.startTime)+':'+(e.element?e.element.tagName+'.'+e.element.className:'?')+':'+e.size)}}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__cls+=e.value}).observe({type:'layout-shift',buffered:true});` });

const run = async (label) => {
  await send('Page.navigate', { url });
  await sleep(14000);
  const r = await send('Runtime.evaluate', { returnByValue: true, expression: `({lcp:Math.round(__lcp),cls:+__cls.toFixed(4),fcp:Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime||0),lcps:window.__lcps,kb:Math.round(performance.getEntriesByType('resource').reduce((a,r)=>a+r.transferSize,0)/1024)+Math.round(performance.getEntriesByType('navigation')[0].transferSize/1024)})` });
  console.log(label, JSON.stringify(r.result?.value ?? r));
};
await run('first-visit');
await send('Network.setCacheDisabled', { cacheDisabled: false });
await run('repeat-visit');
ws.close(); chrome.kill();
