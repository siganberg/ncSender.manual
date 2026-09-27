// Batch S2: console panel tabs, macros, preview, events, software update, accessories, probe, kiosk QR, header stills.
import * as k from './lib.mjs';
const page = await k.connect();
const S = k.section;
const CON = { x: 1230, y: 530, w: 680, h: 540 };
const themes = (process.env.THEMES || 'dark,light').split(',');
const tab = (t) => page.locator('.console-tabs button, .tabs button, button', { hasText: new RegExp('^' + t + '$') }).first();
const inDlg = (re) => page.locator('.dialog-backdrop button', { hasText: re }).last();

await k.forThemes(async (theme) => {
  await S('console', async () => {
    await k.closeDialogs();
    await k.tap(tab('Terminal'), { settle: 800 });
    await k.still('getting-started/console-panel-tabs.webp', { clip: { x: 1230, y: 530, w: 680, h: 90 } });
    await k.recStart('console-send-command');
    await k.tap(page.getByPlaceholder('Send command(s)'), { settle: 600 });
    await page.keyboard.type('$G', { delay: 120 }); await k.sleep(500);
    await page.keyboard.press('Enter'); await k.sleep(2200);
    await k.recStop();
    await page.evaluate(() => document.activeElement && document.activeElement.blur()); await k.sleep(500);
    await k.still('features/console-terminal.webp', { clip: CON });
    await k.tapAt(1797, 627, { settle: 1200 });
    await k.still('features/console-quick-controls.webp');
    await k.tapAt(1623, 114, { settle: 800 });
    await k.closeDialogs();
  });
  await S('macros', async () => {
    await k.tap(tab('Macros'), { settle: 900 });
    await k.still('features/macros-tab.webp', { clip: CON });
    await k.tap(page.getByPlaceholder('Search macros...'), { settle: 300 });
    await page.keyboard.type('ATC', { delay: 100 }); await k.sleep(900);
    await k.still('features/macros-search.webp', { clip: CON });
    await page.getByPlaceholder('Search macros...').fill(''); await page.evaluate(() => document.activeElement && document.activeElement.blur()); await k.sleep(500);
    await k.tap(page.locator('button', { hasText: /\+ New/ }), { settle: 1200 });
    await k.still('features/macros-editor.webp', { clip: CON });
    await k.tapAt(1523, 617, { settle: 800 });
    const toggle = page.getByText('Use controller macros', { exact: true }).first();
    await k.tap(toggle, { settle: 1200 });
    await k.still('features/macros-controller-mode.webp', { clip: CON });
    await k.tap(toggle, { settle: 1000 });
    await k.recStart('macros-run');
    await k.tap(page.locator('.macro-play-btn').first(), { settle: 500 });
    await k.waitIdle({ timeout: 300000 }); await k.sleep(1200);
    await k.recStop();
  });
  await S('preview', async () => {
    await k.tap(tab('G-Code Preview'), { settle: 900 });
    await k.still('features/gcode-preview.webp', { clip: CON });
    await k.recStart('gcode-preview-start-from-line');
    await k.dblAt(1283, 986, { settle: 1500 });
    await k.still('features/gcode-preview-start-from-line.webp');
    await k.tap(inDlg(/^Cancel$/), { settle: 800 });
    await k.recStop();
    await k.recStart('gcode-preview-editor');
    await k.tapAt(1843, 627, { settle: 1500 });
    await k.still('features/gcode-preview-editor.webp');
    await k.tapAt(760, 618, { settle: 500 });                 // click into line 20 of the Monaco editor
    await page.keyboard.press('End'); await page.keyboard.type(' (checked)', { delay: 80 }); await k.sleep(1200);
    await page.evaluate(() => document.activeElement && document.activeElement.blur()); await k.sleep(900);   // hide the on-screen keyboard
    await k.tap(page.locator('.modal-overlay .cancel-button', { hasText: /^Discard$/ }).last(), { settle: 1200 });
    await k.still('features/gcode-preview-discard-confirm.webp');
    await k.tap(page.locator('.dialog-backdrop .confirm-dialog__btn', { hasText: /^Discard$/ }).last(), { settle: 1200 });
    await k.recStop();
    if (await page.locator('.modal-overlay').count()) await k.tap(page.locator('.modal-overlay .modal-close').first(), { settle: 600 });
    await k.closeDialogs();
  });
  await S('events', async () => {
    await k.tap(tab('Events'), { settle: 900 });
    await k.still('features/events-tab.webp', { clip: CON });
    await k.tap(tab('Terminal'), { settle: 500 });
  });
  await S('update', async () => {
    await k.closeDialogs();
    await k.tapAt(137, 62, { settle: 2500 });
    if (!(await page.locator('.dialog-backdrop').count())) throw new Error('update dialog did not open');
    await k.still('getting-started/update-dialog.webp');
    const chan = page.locator('.dialog-backdrop').getByText(/Channel:/).first();
    if (await chan.count()) {
      await k.tap(chan, { settle: 1200 });
      await k.still('getting-started/update-channel-switch.webp');
      await k.tap(inDlg(/^Cancel$/), { settle: 800 });
    }
    await k.closeDialogs();
  });
  await S('accessories', async () => {
    await k.tapAt(430, 54, { settle: 1200 });
    await k.still('getting-started/accessories-view.webp');
    const d = k.dlg();
    await k.tap(d.getByText('AutoDustBoot', { exact: true }).first(), { settle: 1000 });
    await k.still('accessories/accessories-autodustboot.webp');
    await k.tap(d.getByText('Pendant', { exact: true }).first(), { settle: 1000 });
    await k.still('accessories/accessories-pendant.webp');
    await k.tap(d.getByText('Wireless USB', { exact: true }).first(), { settle: 800 });
    await k.tap(d.getByRole('button', { name: /Pair Device/ }), { settle: 1500 });
    await k.still('accessories/accessories-pair-device.webp');
    await k.closeDialogs();
  });
  await S('probe', async () => {
    await k.tap(page.locator('.probe-button'), { settle: 1200 });
    const d = k.dlg();
    await k.tap(d.getByText('3D Probe', { exact: true }).first(), { settle: 800 });
    await k.still('features/probe-dialog.webp');
    await k.recStart('probe-types');
    for (const t of ['Standard Block', 'AutoZero Touch', 'Tool Length Setter', '3D Probe']) await k.tap(d.getByText(t, { exact: true }).first(), { settle: 1500 });
    await k.recStop();
    await k.tap(d.getByText('AutoZero Touch', { exact: true }).first(), { settle: 1000 });
    await k.still('features/probe-autozero-diameter.webp');
    await k.tap(d.getByText('3D Probe', { exact: true }).first(), { settle: 600 });
    await k.closeDialogs();
  });
  await S('qr', async () => {
    await k.closeDialogs();
    await k.tapAt(430, 54, { settle: 1200 });
    await k.tap(page.getByText('Get One', { exact: true }).first(), { settle: 1500 });
    await k.still('getting-started/kiosk-link-qr.webp');
    await k.closeDialogs();
  });
  await S('header', async () => {
    await k.closeDialogs();
    await k.tap(tab('Terminal'), { settle: 600 });
    await k.still('getting-started/interface-main.webp');
  });
  const cc = { crop: CON, width: CON.w };
  for (const [raw, rel, opt] of [
    ['console-send-command', 'features/console-send-command.mp4', cc],
    ['macros-run', 'features/macros-run.mp4', { start: 0, end: 9, crop: { x: 780, y: 100, w: 1140, h: 980 }, width: 1140 }],
    ['gcode-preview-start-from-line', 'features/gcode-preview-start-from-line.mp4', {}],
    ['gcode-preview-editor', 'features/gcode-preview-editor.mp4', {}],
    ['probe-types', 'features/probe-types.mp4', { crop: { x: 460, y: 80, w: 1000, h: 920 }, width: 1000 }],
  ]) {
    const f = `raw/${raw}${k.SUFFIX}.mp4`;
    if ((await import('node:fs')).existsSync(f)) { try { k.clip(f, rel, opt); } catch (e) { console.log('!! clip', raw, e.message.split('\n')[0]); } }
  }
}, themes);
console.log('failures:', k.failures);
await k.disconnect();
