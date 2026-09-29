import * as k from './lib.mjs';
const page = await k.connect();
const VIS = { x: 20, y: 105, w: 1200, h: 960 };
const menu = (t) => page.getByText(t, { exact: false }).first();
const slot = (n) => page.locator('.tools-legend__item').nth(n - 1);
const FROM = process.env.FROM; let go = !FROM;
const at = (name) => { if (name === FROM) go = true; return go; };

await k.forThemes(async (theme) => {
  if (theme !== 'dark') go = true;
  // views
  if (at('views')) {
  await k.recStart('visualizer-views');
  await k.tap(k.btn(/^Top$/), { settle: 1500 });
  await k.tap(k.btn(/^Side$/), { settle: 1500 });
  await k.tap(k.btn(/^Split$/), { settle: 1800 });
  await k.tap(k.btn(/^3D$/), { settle: 1500 });
  await k.recStop();
  }

  // zoom toward cursor
  if (at('zoom')) {
  await k.recStart('visualizer-zoom');
  await page.mouse.move(560, 620); await k.sleep(400);
  for (let i = 0; i < 5; i++) { await page.mouse.wheel(0, -240); await k.sleep(260); }
  await k.sleep(900);
  for (let i = 0; i < 5; i++) { await page.mouse.wheel(0, 240); await k.sleep(260); }
  await k.sleep(900);
  await k.recStop();
  await k.tap(page.getByText('Auto-Fit', { exact: true }), { settle: 500 }); await k.tap(page.getByText('Auto-Fit', { exact: true }), { settle: 900 });
  }

  // transform menu: rotate, then reset
  if (at('menu')) {
  await k.recStart('visualizer-context-menu');
  await page.mouse.click(700, 600, { button: 'right' }); await page.evaluate(() => window.__capRipple(700, 600)); await k.sleep(1000);
  await k.tap(menu('Rotate 90° CW'), { settle: 1800 });
  await page.mouse.click(700, 600, { button: 'right' }); await page.evaluate(() => window.__capRipple(700, 600)); await k.sleep(1000);
  await k.tap(menu('Reset to Original'), { settle: 1500 });
  await k.recStop();
  }

  // Move To (machine moves)
  if (at('moveto')) {
  await k.recStart('visualizer-move-to');
  await k.tap(k.btn(/^Top$/), { settle: 1500 });
  await page.mouse.click(760, 520, { button: 'right' }); await page.evaluate(() => window.__capRipple(760, 520)); await k.sleep(1000);
  await k.tap(menu('Move To'), { settle: 1400 });
  await k.tap(k.btn(/^Move$/), { settle: 300 }); await k.waitIdle({ timeout: 90000 });
  await k.sleep(800);
  await k.recStop();
  await k.tap(k.btn(/^3D$/), { settle: 600 });
  await k.cmd('G0 X0 Y0'); await k.waitIdle(); await k.cmd('G0 Z0'); await k.waitIdle();
  }
  at('slot');

  // slot tap
  await k.recStart('visualizer-slot-tap');
  await k.tap(slot(2), { settle: 2200 });
  await k.tap(slot(2), { settle: 1000 });
  await k.recStop();

  at('laser');
  // laser mode: needs the tool unloaded first (dialog), shows the laser head, then off (confirm)
  await k.recStart('laser-mode-toggle');
  await k.tapAt(75, 892, { settle: 1500 });
  if (await page.locator('.dialog-backdrop').count()) { await k.tap(k.btn(/^Unload Tool$/), { settle: 500 }); await k.waitIdle({ timeout: 180000 }); }
  await k.sleep(2500);
  await k.still('features/laser-visualization.webp', { clip: VIS });
  await k.tapAt(75, 892, { settle: 1500 });
  if (await page.locator('.dialog-backdrop').count()) { await k.tap(page.locator('.dialog-backdrop button').last(), { settle: 500 }); }
  await k.sleep(2000);
  await k.recStop();

  at('toolchange');
  // hold a slot to load its tool (T1 back into the spindle)
  await k.recStart('tool-change-hold');
  await k.sleep(400);
  await k.hold(slot(1), 1300, { settle: 500 });
  if (await page.locator('.dialog-backdrop').count()) { await k.tap(page.locator('.dialog-backdrop button').last(), { settle: 500 }); }
  await k.waitIdle({ timeout: 180000 });
  await k.sleep(1500);
  await k.recStop();
  console.log('tool now', (await k.machine()).tool);

  at('spindle');
  // spindle controls: CW -> + -> STOP (spindle runs in air a few seconds)
  await k.still('features/visualizer-spindle-controls.webp', { clip: { x: 350, y: 860, width: 540, height: 125 } });
  await k.recStart('visualizer-spindle-run');
  await k.hold(page.locator('.spindle-run__dir').first(), 1400, { settle: 2200 });   // start needs a 1 s hold
  await k.still('features/visualizer-spindle-stop.webp', { clip: { x: 350, y: 860, width: 540, height: 125 } });
  await k.tap(page.locator('button', { hasText: /^\+$/ }).nth(1), { settle: 1500 });
  await k.tap(page.locator('.spindle-run__stop'), { settle: 1800 });
  await k.recStop();

  at('oob');
  // out-of-bounds banner via Offset Material, then Reset to Original
  await k.recStart('visualizer-out-of-bounds');
  await page.mouse.click(700, 600, { button: 'right' }); await page.evaluate(() => window.__capRipple(700, 600)); await k.sleep(1000);
  await k.tap(menu('Offset Material'), { settle: 1000 });
  const xin = page.locator('input[type=number]').first();
  await k.tap(xin, { settle: 300 }); await page.keyboard.press('Control+A'); await page.keyboard.type('900', { delay: 90 }); await k.sleep(600);
  await k.tap(k.btn(/Apply Offset/), { settle: 3500 });
  await page.mouse.click(700, 600, { button: 'right' }); await page.evaluate(() => window.__capRipple(700, 600)); await k.sleep(1000);
  await k.tap(menu('Reset to Original'), { settle: 1800 });
  await k.recStop();

  at('stills');
  // stills
  await k.still('features/visualizer-hero.webp');
  await k.still('features/visualizer-tool-legend.webp', { clip: { x: 20, y: 430, width: 460, height: 290 } });
  await k.still('features/visualizer-aux-controls.webp', { clip: { x: 20, y: 850, width: 600, height: 215 } });
  await k.still('features/visualizer-workspace-markers.webp', { clip: VIS });
  const m = await k.machine(); console.log('end', theme, m.status, m.WPos);

  const cv = { crop: VIS, width: 1200 };
  k.clip(`raw/visualizer-views${k.SUFFIX}.mp4`, 'features/visualizer-views.mp4', cv);
  k.clip(`raw/visualizer-zoom${k.SUFFIX}.mp4`, 'features/visualizer-zoom.mp4', cv);
  k.clip(`raw/visualizer-context-menu${k.SUFFIX}.mp4`, 'features/visualizer-context-menu.mp4', cv);
  k.clip(`raw/visualizer-move-to${k.SUFFIX}.mp4`, 'features/visualizer-move-to.mp4', {});
  k.clip(`raw/visualizer-slot-tap${k.SUFFIX}.mp4`, 'features/visualizer-slot-tap.mp4', cv);
  k.clip(`raw/laser-mode-toggle${k.SUFFIX}.mp4`, 'features/laser-mode-toggle.mp4', cv);
  k.clip(`raw/tool-change-hold${k.SUFFIX}.mp4`, 'features/tool-change-hold.mp4', {});
  k.clip(`raw/visualizer-out-of-bounds${k.SUFFIX}.mp4`, 'features/visualizer-out-of-bounds.mp4', cv);
  k.clip(`raw/visualizer-spindle-run${k.SUFFIX}.mp4`, 'features/visualizer-spindle-run.mp4', { crop: { x: 20, y: 600, w: 1200, h: 465 }, width: 1200 });
});
await k.disconnect();
