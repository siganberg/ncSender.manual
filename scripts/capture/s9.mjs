// Batch S9 (Oct 2026): media that had no batch of their own.
//   toolbuttons  features/tool-buttons.webp       the tool button column
//   hero         getting-started/home-desktop-hero.webp (1920x1080, G-code Preview)
//   portrait     getting-started/home-kiosk-portrait.webp (1080x1920 kiosk layout)
//   imperial     features/probe-imperial.webp     probe dialog in inches (units restored)
//   laser        features/laser-settings.mp4      the gear next to Laser Mode
//   keepout      features/keepout-jog-clamp.mp4   a jog toward the keepout zone stops at its edge
//
// Machine: keepout parks at safe Z right of the zone (machine X = zone max + 46 mm)
// and holds Jog X-; the keepout clamp stops it at the zone's edge.
import * as k from './lib.mjs';
const page = await k.connect();
const S = k.section;
const themes = (process.env.THEMES || 'dark,light').split(',');
const VIS = { x: 20, y: 105, w: 1200, h: 960 };
const tab = (t) => page.locator('button', { hasText: new RegExp('^' + t + '$') }).first();
// A clean screen for the overview shots: 3D view, no leftover Job Progress card.
const cleanView = async () => {
  await k.closeDialogs();
  const card = page.getByText('Job Progress', { exact: true });
  if (await card.count()) { const c = card.first().locator('xpath=ancestor::*[.//button[normalize-space()="Close"]][1]').getByRole('button', { name: 'Close' }); if (await c.count()) await k.tap(c.first(), { settle: 900 }); }
  await k.tap(k.btn(/^3D$/), { settle: 1200 });
};
const ko = (await k.api('/api/settings')).advanced?.keepoutZone;

await k.forThemes(async () => {
  await S('toolbuttons', async () => {
    await k.closeDialogs();
    const box = await page.locator('.tools-legend--bottom').first().boundingBox();
    await k.still('features/tool-buttons.webp', { clip: { x: box.x - 6, y: box.y - 6, w: box.width + 12, h: box.height + 12 } });
  });

  await S('hero', async () => {
    await cleanView();
    await k.tap(tab('G-Code Preview'), { settle: 1200 });
    await k.still('getting-started/home-desktop-hero.webp');
    await k.tap(tab('Terminal'), { settle: 500 });
  });

  await S('imperial', async () => {
    await k.closeDialogs();
    await k.api('/api/settings', { unitsPreference: 'imperial' }).catch(() => {});
    await page.reload({ waitUntil: 'networkidle' }); await k.installOverlay(); await k.sleep(2500);
    await k.tap(page.locator('.probe-button'), { settle: 1200 });
    await k.tap(k.dlg().getByText('3D Probe', { exact: true }).first(), { settle: 1200 });
    await k.still('features/probe-imperial.webp');
    await k.closeDialogs();
    await k.api('/api/settings', { unitsPreference: 'metric' }).catch(() => {});
    await page.reload({ waitUntil: 'networkidle' }); await k.installOverlay(); await k.sleep(2500);
  });

  await S('laser', async () => {
    await k.closeDialogs();
    await k.recStart('laser-settings');
    await k.sleep(500);
    await k.tap(page.locator('.spindle-toggle', { hasText: /Laser Mode/ }).first().locator('button').first(), { settle: 2600 });
    await k.closeDialogs(); await k.sleep(800);
    await k.recStop();
    k.clip(`raw/laser-settings${k.SUFFIX}.mp4`, 'features/laser-settings.mp4', {});
  });

  await S('keepout', async () => {
    if (!ko?.enabled) throw new Error('keepout zone is off');
    await k.closeDialogs();
    const parkX = (ko.max.x + 46).toFixed(3), parkY = ((ko.min.y + ko.max.y) / 2).toFixed(3);
    await k.cmd('G53 G0 Z0'); await k.waitIdle({ timeout: 60000 });
    await k.cmd(`G53 G0 X${parkX} Y${parkY}`); await k.waitIdle({ timeout: 90000 });
    await k.tap(k.btn(/^Top$/), { settle: 1500 });
    await k.recStart('keepout-jog-clamp');
    await k.sleep(600);
    await k.hold(page.getByRole('button', { name: 'Jog X negative' }).first(), 3500, { settle: 1500 });
    await k.recStop();
    await k.tap(k.btn(/^3D$/), { settle: 800 });
    const x = Number(String((await k.machine()).MPos || '').split(',')[0]);
    console.log('jog stopped at machine X', x, '(zone max X', ko.max.x + ')');
    k.clip(`raw/keepout-jog-clamp${k.SUFFIX}.mp4`, 'features/keepout-jog-clamp.mp4', { width: 1920 });
  });
}, themes);

// 4th axis: show the A controls, double-click the A readout for the angle entry.
const aBefore = (await k.api('/api/settings')).features?.showAAxis;
await k.forThemes(async () => {
  await S('aangle', async () => {
    await k.closeDialogs();
    await k.patchSettings({ features: { showAAxis: true } }); await k.sleep(1500);
    await k.dbl(page.locator('.work-coord:visible').last(), { settle: 1200 });   // A is the last readout shown
    await k.still('features/4th-axis-enter-angle.webp');
    await page.keyboard.press('Escape'); await k.sleep(400);
    await page.evaluate(() => document.activeElement && document.activeElement.blur()); await k.sleep(600);
  });
}, themes);
if (aBefore !== true) await k.patchSettings({ features: { showAAxis: aBefore ?? false } });

// Portrait last: it changes the viewport.
await S('portrait', async () => {
  await k.setTheme('dark');
  await page.setViewportSize({ width: 1080, height: 1920 });
  await page.reload({ waitUntil: 'networkidle' }); await k.installOverlay(); await k.sleep(3000);
  await cleanView();
  await k.tap(tab('G-Code Preview'), { settle: 1500 });
  await k.still('getting-started/home-kiosk-portrait.webp');
  await k.setTheme('light'); await k.sleep(1500);
  await k.still('getting-started/home-kiosk-portrait.webp');   // setTheme added the -light suffix
  await k.setTheme('dark');
  await k.tap(tab('Terminal'), { settle: 500 });
  await page.setViewportSize({ width: 1920, height: 1080 });
});
console.log('failures:', k.failures);
await k.disconnect();
