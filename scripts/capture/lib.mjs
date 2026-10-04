// Capture library for the ncSender kiosk (10.0.2.254; KIOSK_IP to override).
// - drives the Electron page over CDP (ssh tunnel on 127.0.0.1:9222)
// - records the real screen with wf-recorder on the kiosk
// - encodes clips (2x speed, 30 fps, 1280x720 h264) + posters, stills as webp
import { chromium } from 'playwright-core';
import { startCast } from './cast.mjs';
import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const KIOSK_IP = process.env.KIOSK_IP || '10.0.2.254';
export const KIOSK = `root@${KIOSK_IP}`;
const API = `http://${KIOSK_IP}:8090`;
export const MANUAL = '/Users/francis/Projects/ncSender/ncSender.manual/docs/assets/images';
export const WORK = path.dirname(new URL(import.meta.url).pathname);
export const RAW = path.join(WORK, 'raw');
fs.mkdirSync(RAW, { recursive: true });

export const sleep = (ms) => new Promise(r => setTimeout(r, ms));
export const ssh = (cmd) => execSync(`ssh ${KIOSK} bash -s`, { input: cmd + '\n', encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });

// --- CDP connection ---------------------------------------------------------
let browser, page;
export const LOCAL = process.env.MODE === 'local';   // render + record the kiosk's web UI in Chrome on this Mac
export async function connect() {
  if (LOCAL) {
    browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--window-size=1920,1080', '--window-position=0,0', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'] });
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, hasTouch: false });
    page = await ctx.newPage();
    await page.goto(API + '/', { waitUntil: 'networkidle' });
    await sleep(3500);
    await installOverlay();
    return page;
  }
  browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const ctx = browser.contexts()[0];
  page = ctx.pages().find(p => p.url().startsWith('http://localhost:8090') && !p.url().includes('sw.js'));
  if (!page) throw new Error('ncSender page not found');
  await installOverlay();
  return page;
}
export function getPage() { return page; }
export async function disconnect() { if (LOCAL) { try { await setTheme('dark'); } catch {} } await browser?.close(); }

// --- overlay: click ripple + hide the update badge --------------------------
const OVERLAY_JS = `
(() => {
  if (window.__capOverlay) return;
  window.__capOverlay = true;
  const st = document.createElement('style');
  st.id = '__cap_style';
  st.textContent = \`
    .__cap_ripple{position:fixed;left:0;top:0;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;
      pointer-events:none;z-index:2147483647;border:3px solid rgba(255,214,0,.95);
      background:rgba(255,214,0,.25);box-shadow:0 0 0 2px rgba(0,0,0,.35);
      animation:__cap_rip .55s cubic-bezier(.2,.7,.3,1) forwards}
    @keyframes __cap_rip{0%{transform:scale(.35);opacity:1}100%{transform:scale(1.9);opacity:0}}
    .__cap_hold{position:fixed;left:0;top:0;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;
      pointer-events:none;z-index:2147483647;border:3px solid rgba(255,214,0,.95);background:rgba(255,214,0,.18);
      box-shadow:0 0 0 2px rgba(0,0,0,.35)}
    .__cap_hide{display:none !important}
  \`;
  document.head.appendChild(st);
  let hold = null;
  window.__capRipple = (x, y) => {
    const d = document.createElement('div');
    d.className = '__cap_ripple';
    d.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.transform = '';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 650);
  };
  window.__capHoldStart = (x, y) => {
    window.__capHoldEnd();
    hold = document.createElement('div');
    hold.className = '__cap_hold';
    hold.style.left = x + 'px'; hold.style.top = y + 'px';
    document.body.appendChild(hold);
  };
  window.__capHoldEnd = () => { if (hold) { hold.remove(); hold = null; } };
  const onDown = (e) => { const p = e.touches ? e.touches[0] : e; window.__capRipple(p.clientX, p.clientY); };
  window.addEventListener('pointerdown', onDown, true);
  // hide the "Update vX" badge in the header so clips don't date themselves
  const hideBadge = () => {
    for (const el of document.querySelectorAll('button, a, div, span')) {
      if (el.children.length <= 2 && /^\\s*Update v\\d/.test(el.textContent || '') && el.getBoundingClientRect().top < 100) {
        el.classList.add('__cap_hide');
      }
    }
  };
  hideBadge();
  new MutationObserver(hideBadge).observe(document.body, { childList: true, subtree: true });
})();`;
export async function installOverlay() {
  await page.evaluate(OVERLAY_JS);
}

// --- interaction helpers ----------------------------------------------------
export async function center(locator) {
  const b = await locator.boundingBox();
  if (!b) throw new Error('no bounding box');
  return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
}
export async function tap(locator, { settle = 600 } = {}) {
  const c = await center(locator);
  await page.mouse.click(c.x, c.y);
  await sleep(settle);
}
export async function tapAt(x, y, { settle = 600 } = {}) {
  await page.mouse.click(x, y);
  await sleep(settle);
}
// press-and-hold (the UI uses hold for Home / zero / park etc.)
export async function hold(locator, ms, { settle = 600 } = {}) {
  const c = await center(locator);
  await page.mouse.move(c.x, c.y);
  await page.mouse.down();
  await page.evaluate(([x, y]) => window.__capHoldStart(x, y), [c.x, c.y]);
  await sleep(ms);
  await page.mouse.up();
  await page.evaluate(() => window.__capHoldEnd());
  await sleep(settle);
}
export const text = (t, opts = {}) => page.getByText(t, { exact: true, ...opts });
export const role = (r, name) => page.getByRole(r, { name, exact: true });

// --- stills -----------------------------------------------------------------
// Screenshot via CDP (exact 1920x1080 frame of the page) -> webp in the manual.
export let SUFFIX = '';
export const setSuffix = (v) => { SUFFIX = v; };
export const withSuffix = (rel) => rel.replace(/(\.[a-z0-9]+)$/i, SUFFIX + '$1');
export async function still(rel, { quality = 82, clip } = {}) {
  rel = withSuffix(rel);
  if (clip && clip.w) clip = { x: clip.x, y: clip.y, width: clip.w, height: clip.h };
  const png = path.join(RAW, path.basename(rel, '.webp') + '.png');
  await page.screenshot({ path: png, clip });
  const out = path.join(MANUAL, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execSync(`cwebp -quiet -q ${quality} ${JSON.stringify(png)} -o ${JSON.stringify(out)}`);
  const kb = Math.round(fs.statSync(out).size / 1024);
  console.log(`still  ${rel}  ${kb} KB`);
  return out;
}

// --- recording --------------------------------------------------------------
// wf-recorder runs on the kiosk; we stop it with SIGINT and scp the file back.
let recName = null, cast = null;
export async function recStart(name) {
  name = name + SUFFIX;
  recName = name;
  if (LOCAL) { cast = await startCast(page, path.join(RAW, 'cast-' + name)); await sleep(700); return; }
  ssh(`export WAYLAND_DISPLAY=wayland-0 XDG_RUNTIME_DIR=/run/user/0; mkdir -p /root/rec; rm -f /root/rec/${name}.mp4; setsid nohup wf-recorder -f /root/rec/${name}.mp4 -r 30 -c libx264 -p preset=ultrafast -p crf=18 -y >/root/rec/${name}.log 2>&1 </dev/null & echo $! > /root/rec/${name}.pid`);
  await sleep(900); // let the first frames land
}
export async function recStop({ tail = 4000 } = {}) {
  const name = recName; recName = null;
  if (LOCAL) { await sleep(400); const local = path.join(RAW, name + '.mp4'); await cast.stop(local); cast = null; return local; }
  await sleep(tail);   // let the encoder catch up before SIGINT, which drops queued frames
  ssh(`kill -INT $(cat /root/rec/${name}.pid); for i in $(seq 1 600); do kill -0 $(cat /root/rec/${name}.pid) 2>/dev/null || break; sleep 0.2; done; kill -0 $(cat /root/rec/${name}.pid) 2>/dev/null && echo STILL-RUNNING; true`);
  const local = path.join(RAW, name + '.mp4');
  execSync(`scp -q ${KIOSK}:/root/rec/${name}.mp4 ${JSON.stringify(local)}`);
  console.log(`rec    ${name}.mp4  ${Math.round(fs.statSync(local).size / 1024)} KB`);
  return local;
}

// --- clip encoding ----------------------------------------------------------
// speed: 2 => 2x. Output 1280x720 30fps h264 yuv420p + poster jpg next to it.
export function clip(rawMp4, rel, { speed = 1.5, start = 0, end, crop, width = 1280, crf = 27, posterAt = 0.2, hold = 0.3 } = {}) {
  rel = withSuffix(rel);
  const out = path.join(MANUAL, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const vf = [];
  if (crop) vf.push(`crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`);
  vf.push(`setpts=PTS/${speed}`);
  vf.push(`scale=${width}:-2:flags=lanczos`, 'fps=30', `tpad=stop_mode=clone:stop_duration=${hold}`, 'format=yuv420p');
  const ss = start ? `-ss ${start}` : '';
  const to = end != null ? `-to ${end}` : '';
  execSync(`ffmpeg -v error -y ${ss} ${to} -i ${JSON.stringify(rawMp4)} -an -vf ${JSON.stringify(vf.join(','))} -c:v libx264 -profile:v high -preset slow -crf ${crf} -movflags +faststart -pix_fmt yuv420p ${JSON.stringify(out)}`);
  const poster = out.replace(/\.mp4$/, '-poster.jpg');
  execSync(`ffmpeg -v error -y -ss ${posterAt} -i ${JSON.stringify(out)} -frames:v 1 -q:v 4 ${JSON.stringify(poster)}`);
  const dur = execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${JSON.stringify(out)}`).toString().trim();
  console.log(`clip   ${rel}  ${Math.round(fs.statSync(out).size / 1024)} KB  ${Number(dur).toFixed(1)}s`);
  return out;
}

// Markdown snippet for a clip, given the page depth (features/x.md => '../../').
export function videoTag(rel, label, depth = '../../') {
  const base = `${depth}assets/images/${rel}`;
  return `<video autoplay loop muted playsinline preload="metadata" aria-label="${label}" poster="${base.replace(/\.mp4$/, '-poster.jpg')}">\n  <source src="${base}" type="video/mp4">\n</video>`;
}

// --- machine helpers --------------------------------------------------------
export async function api(p, body) {
  const r = await fetch(API + p, body === undefined ? {} : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const t = await r.text();
  try { return JSON.parse(t); } catch { return t; }
}
export const cmd = (c) => api('/api/send-command', { command: c });
// PATCH, unlike api()'s POST, broadcasts settings-changed, so the open page
// follows (language, units). Use it for anything the page must react to.
export const patchSettings = async (body) => (await fetch(API + '/api/settings', { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })).ok;
export async function machine() { const s = await api('/api/server-state'); return s.machineState || s; }
export async function waitIdle({ timeout = 60000, settle = 400 } = {}) {
  const t0 = Date.now();
  await sleep(settle);
  while (Date.now() - t0 < timeout) {
    const m = await machine();
    if (m.status === 'Idle') {
      // require Idle to hold for 1.2 s with the position unchanged (multi-segment moves pass through Idle)
      let stable = true, last = m.MPos;
      for (let i = 0; i < 6; i++) { await sleep(200); const n = await machine(); if (n.status !== 'Idle' || n.MPos !== last) { stable = false; break; } }
      if (stable) { await sleep(settle); return m; }
      continue;
    }
    await sleep(200);
  }
  throw new Error('waitIdle timeout');
}
export async function prep() {
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await page.keyboard.press('Escape');
  await sleep(300);
}
export const btn = (re) => page.getByRole('button', { name: re });
export async function dbl(locator, { gap = 120, settle = 600 } = {}) {
  const c = await center(locator);
  await page.mouse.click(c.x, c.y); await sleep(gap); await page.mouse.click(c.x, c.y);
  await sleep(settle);
}
export async function dblAt(x, y, { gap = 120, settle = 600 } = {}) {
  await page.mouse.dblclick(x, y);      // two presses, the second with detail=2 like a real double-click
  await sleep(settle);
}
export async function holdAt(x, y, ms, { settle = 600 } = {}) {
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.evaluate(([x, y]) => window.__capHoldStart(x, y), [x, y]);
  await sleep(ms);
  await page.mouse.up();
  await page.evaluate(() => window.__capHoldEnd());
  await sleep(settle);
}
export const RIGHT = { x: 1230, y: 100, w: 680, h: 415 };   // jog + DRO column
export const JOG = { x: 1230, y: 100, w: 680, h: 275 };
export const DRO = { x: 1230, y: 375, w: 680, h: 140 };

// --- themes -----------------------------------------------------------------
export async function currentTheme() {
  const s = await api('/api/settings');
  return s.theme;
}
// The page is the truth: read the rendered background, not the saved setting.
export async function pageTheme() {
  // mean luminance of the rendered header strip; the body background does not change with the theme
  const png = await page.screenshot({ clip: { x: 0, y: 0, width: 1920, height: 100 } });
  const out = execSync('ffmpeg -v error -i - -frames:v 1 -f rawvideo -pix_fmt gray -s 32x2 -', { input: png });
  let sum = 0; for (const b of out) sum += b;
  return sum / out.length < 128 ? 'dark' : 'light';
}
export async function setTheme(t) {
  await closeDialogs();
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await sleep(500);
  for (let i = 0; i < 3 && (await pageTheme()) !== t; i++) {
    const btn = page.locator('.theme-toggle[title="Toggle theme"]').first();
    const c = await center(btn);
    await page.mouse.click(c.x, c.y);
    await sleep(1200);
  }
  const now = await pageTheme();
  if (now !== t) throw new Error('theme toggle failed: page is ' + now);
  if ((await currentTheme()) !== t) await api('/api/settings', { theme: t });
  SUFFIX = t === 'light' ? '-light' : '';
  console.log('theme', t, 'suffix', JSON.stringify(SUFFIX));
}
export async function forThemes(fn, themes = ['dark', 'light']) {
  for (const t of themes) { await setTheme(t); await prep(); await fn(t); }
  await setTheme('dark');
}

// --- section guard ------------------------------------------------------------
// Runs fn; on failure logs it, stops any recorder, closes dialogs, and carries on.
export const failures = [];
export async function section(name, fn) {
  if (process.env.ONLY && !process.env.ONLY.split(',').includes(name)) return;
  try {
    await fn();
  } catch (e) {
    failures.push(name);
    console.log(`!! section ${name} failed: ${e.message.split('\n')[0]}`);
    try { await page.screenshot({ path: path.join(RAW, `fail-${name}${SUFFIX}.png`) }); } catch {}
    try { if (recName && LOCAL && cast) { await cast.stop(path.join(RAW, 'failed-' + recName + '.mp4')); cast = null; } else if (recName) ssh(`pkill -INT wf-recorder`); recName = null; } catch {}
    await closeDialogs();
  }
}
export async function closeDialogs() {
  const open = async () => (await page.locator('.dialog-backdrop').count()) + (await page.locator('.plugin-dialog-backdrop').count());
  for (let i = 0; i < 6 && await open(); i++) { await page.keyboard.press('Escape'); await sleep(400); }
  const n = await page.locator('.dialog-backdrop').count();
  if (n) { const x = page.locator('.dialog-backdrop button', { hasText: /^Close$/ }).last(); if (await x.count()) await tap(x, { settle: 500 }); }
}
export const DLG = { x: 335, y: 105, w: 1250, h: 870 };
export const dlg = () => page.locator('.dialog-backdrop').last();
export async function openSettings(tab) {
  await closeDialogs();
  await tapAt(1850, 54, { settle: 1000 });
  if (tab) await tap(dlg().getByText(tab, { exact: true }).first(), { settle: 900 });
}
