// Batch S10 (Oct 2026): the Manual Tool Changer and RapidChange ATC config pages.
// The kiosk runs Pneumatic ATC; tool changers are exclusive, so each plugin is
// enabled in turn (which disables the others) and Pneumatic ATC is enabled again
// at the end, which also re-syncs its tool settings. MTC's saved settings are
// switched to RapidChangeSolo on (Magazine Size 6) for its Solo page, then put
// back exactly as they were.
import * as k from './lib.mjs';
const page = await k.connect();
const S = k.section;
const themes = (process.env.THEMES || 'dark,light').split(',');
const API = `http://${process.env.KIOSK_IP || '10.0.2.254'}:8090`;
const tab = (t) => page.locator('button', { hasText: new RegExp('^' + t + '$') }).first();
const put = (p, body) => fetch(API + p, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
const post = (p) => fetch(API + p, { method: 'POST' });

const MTC = 'com.ncsender.manualtoolchange', RC = 'com.ncsender.rapidchangeatc', PATC = 'com.ncsender.pneumaticatc';
const before = await k.api('/api/settings');
const mtcSettings = await k.api(`/api/plugins/${MTC}/settings`);
console.log('tool settings before', JSON.stringify(before.tool));

const openPlugin = async (name) => {
  await k.closeDialogs();
  await k.tap(tab('Plugins'), { settle: 800 });
  await k.tap(page.locator('.tool-menu-item, .plugin-tile, button, div', { hasText: new RegExp('^' + name + '$') }).last(), { settle: 2200 });
};
const shootTabs = async (label, tabs) => {
  await openPlugin(label);
  for (const [t, rel] of tabs) {
    const l = page.locator('.dialog-backdrop, .plugin-dialog-backdrop').getByText(t, { exact: true }).first();
    if (await l.count()) { await k.tap(l, { settle: 1000 }); await k.still(rel); } else console.log('no tab', t);
  }
  await k.closeDialogs();
};
const useOnly = async (id) => {
  const r = await post(`/api/plugins/${id}/enable`);
  if (!r.ok) throw new Error(`enable ${id}: ${r.status}`);
  await k.sleep(1500);
  await page.reload({ waitUntil: 'networkidle' }); await k.installOverlay(); await k.sleep(2500);
};

try {
  await S('mtc', async () => {
    await put(`/api/plugins/${MTC}/settings`, { ...mtcSettings, autoSwap: true, numberOfTools: 6 });
    await useOnly(MTC);
    await k.forThemes(() => shootTabs('Manual Tool Changer', [
      ['Setup', 'plugins/mtc-setup.webp'],
      ['RapidChangeSolo', 'plugins/mtc-solo.webp'],
      ['TLS', 'plugins/mtc-tls.webp'],
      ['Probe Tool', 'plugins/mtc-probe-tool.webp'],
      ['Events', 'plugins/mtc-events.webp'],
    ]), themes);
  });
  await S('rcatc', async () => {
    await useOnly(RC);
    await k.forThemes(() => shootTabs('RapidChangeATC', [
      ['Magazines', 'plugins/rcatc-magazine.webp'],
      ['TLS', 'plugins/rcatc-tls.webp'],
      ['Manual', 'plugins/rcatc-manual.webp'],
      ['Probe Tool', 'plugins/rcatc-probe-tool.webp'],
      ['Events', 'plugins/rcatc-events.webp'],
    ]), themes);
  });
} finally {
  // Restore: MTC's own settings, then Pneumatic ATC as the tool changer.
  await put(`/api/plugins/${MTC}/settings`, mtcSettings);
  await useOnly(PATC);
  const after = await k.api('/api/settings');
  console.log('tool settings after ', JSON.stringify(after.tool));
  for (const key of ['source', 'count', 'probe', 'probeToolNumber', 'tls', 'numbering']) {
    if (JSON.stringify(before.tool?.[key]) !== JSON.stringify(after.tool?.[key])) console.log(`!! tool.${key} changed: ${before.tool?.[key]} -> ${after.tool?.[key]}`);
  }
  const mtcNow = await k.api(`/api/plugins/${MTC}/settings`);
  console.log('mtc settings restored:', JSON.stringify(mtcNow) === JSON.stringify(mtcSettings));
}
console.log('failures:', k.failures);
await k.disconnect();
