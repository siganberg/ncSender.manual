// Remote-browser captures from this Mac against the kiosk: phone layout, and the Remote Control Disabled gate.
import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';
const M = '/Users/francis/Projects/ncSender/ncSender.manual/docs/assets/images';
const suffix = process.env.SUFFIX || '';
const API = `http://${process.env.KIOSK_IP || '10.0.2.254'}:8090`;
const api = async (p, body) => { const r = await fetch(API + p, body === undefined ? {} : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); return r.json().catch(() => null); };
const b = await chromium.launch({ channel: 'chrome', headless: true });
const shot = async (viewport, rel, extra = {}) => {
  const ctx = await b.newContext({ viewport, deviceScaleFactor: viewport.width < 600 ? 2 : 1, isMobile: viewport.width < 600, hasTouch: viewport.width < 600, ...extra });
  const p = await ctx.newPage();
  await p.goto(API + '/', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(4000);
  const png = `raw/${rel.split('/').pop().replace('.webp', '')}${suffix}.png`;
  await p.screenshot({ path: png });
  execSync(`cwebp -quiet -q 82 ${png} -o ${M}/${rel.replace('.webp', suffix + '.webp')}`);
  console.log('remote still', rel + suffix);
  await ctx.close();
};
await shot({ width: 390, height: 844 }, 'settings/remote-mobile-view.webp');
const before = (await api('/api/settings')).remoteControl;
console.log('remoteControl before', JSON.stringify(before));
await api('/api/settings', { remoteControl: { ...before, enabled: false } });
await new Promise(r => setTimeout(r, 1500));
await shot({ width: 1440, height: 900 }, 'settings/remote-gate.webp');
await api('/api/settings', { remoteControl: before });
console.log('remoteControl after', JSON.stringify((await api('/api/settings')).remoteControl));
await b.close();
