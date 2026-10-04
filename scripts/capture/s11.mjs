// Batch S11 (Oct 2026): full-screen media no other batch produced.
//   replicator  plugins/replicator-generate.mp4      generate a grid of copies
//   quickcut    plugins/quickcut-generate.mp4, quickcut-rectangle-honeycomb.webp
//   trace       features/trace-dialog.webp, features/trace.mp4 (machine traces the outline)
//   idle        getting-started/connected-idle.webp  (no program loaded)
//   laser       features/laser-enable-setting.webp   (Settings > Advanced)
//   language    getting-started/language-switch-german.mp4 (and back to English)
//   updates     getting-started/update-version-history-rollback.mp4 (nothing is installed)
//   tips        getting-started/tips-dialog.webp
//   license     getting-started/license-dialog.webp, license-deactivate-confirm.webp (Cancel only)
//   rgb         accessories/rgbled-status.webp, rgbled-colors.webp, accessories-rgbled.webp
//   unpair      accessories/accessories-unpair-confirm.webp (Cancel only)
//   orbit       features/visualizer-keepout.mp4      (orbit the 3D view around the keepout zone)
//
// Replicator, QuickCut and the idle shot replace the loaded program; the job file
// (JOB, default Falcon-Quick-3-Tool.nc) is loaded back after each.
import * as k from './lib.mjs';
const page = await k.connect();
const S = k.section;
const themes = (process.env.THEMES || 'dark,light').split(',');
const JOB = process.env.JOB || 'Falcon-Quick-3-Tool.nc';
const VIS = { x: 20, y: 105, w: 1200, h: 960 };
const tab = (t) => page.locator('button', { hasText: new RegExp('^' + t + '$') }).first();
const dlg = () => page.locator('.dialog-backdrop, .plugin-dialog-backdrop').last();
const reloadJob = async () => {
  await k.api('/api/gcode-files/load', { path: JOB });
  await k.sleep(2500);
};
const openPlugin = async (name) => {
  await k.closeDialogs();
  await k.tap(tab('Plugins'), { settle: 800 });
  await k.tap(page.locator('.tool-menu-item, .plugin-tile, button, div', { hasText: new RegExp('^' + name + '$') }).last(), { settle: 2200 });
};
// Across every open backdrop, first match (the last backdrop can be an empty one).
const anyDlg = () => page.locator('.dialog-backdrop, .plugin-dialog-backdrop');
const pluginTab = async (t) => k.tap(anyDlg().getByText(t, { exact: true }).first(), { settle: 1000 });
const licenseActive = async () => String((await k.api('/api/license'))?.licensed);

const licenseBefore = await licenseActive();
console.log('license before:', licenseBefore);

await k.forThemes(async () => {
  await S('replicator', async () => {
    await openPlugin('Replicator');
    await k.recStart('replicator-generate');
    await k.sleep(800);
    await k.tap(dlg().getByRole('button', { name: /^Generate$/ }).first(), { settle: 3500 });
    await k.recStop();
    await k.closeDialogs();
    k.clip(`raw/replicator-generate${k.SUFFIX}.mp4`, 'plugins/replicator-generate.mp4', { width: 1920 });
    await reloadJob();
  });

  await S('quickcut', async () => {
    await openPlugin('QuickCut');
    // Rectangle is the tab it opens on; Honeycomb is an option of a pattern list.
    const pattern = anyDlg().locator('select:has(option[value="honeycomb"])').first();
    if (await pattern.count()) { await pattern.selectOption('honeycomb'); await k.sleep(1200); await k.still('plugins/quickcut-rectangle-honeycomb.webp'); }
    else console.log('no honeycomb option');
    await pluginTab('Circle');
    await k.recStart('quickcut-generate');
    await k.sleep(600);
    await k.tap(anyDlg().getByRole('button', { name: /^Generate$/ }).first(), { settle: 3000 });
    await k.recStop();
    await k.closeDialogs();
    k.clip(`raw/quickcut-generate${k.SUFFIX}.mp4`, 'plugins/quickcut-generate.mp4', { width: 1920 });
    await reloadJob();
  });

  await S('trace', async () => {
    await k.closeDialogs();
    await k.tap(k.btn(/^3D$/), { settle: 1000 });
    await k.recStart('trace');
    await k.sleep(500);
    await k.tap(k.btn(/^Trace$/).first(), { settle: 1500 });
    await k.still('features/trace-dialog.webp');
    await k.tap(dlg().getByRole('button', { name: /^Trace$/ }).last(), { settle: 1000 });
    await k.waitIdle({ timeout: 240000 }); await k.sleep(1200);
    await k.recStop();
    k.clip(`raw/trace${k.SUFFIX}.mp4`, 'features/trace.mp4', { width: 1920 });
  });

  await S('idle', async () => {
    await k.closeDialogs();
    await k.tap(k.btn(/^Clear$/).first(), { settle: 1500 });
    const yes = page.locator('.dialog-backdrop button', { hasText: /^(Clear|Yes|Discard)$/ }).last();
    if (await yes.count()) await k.tap(yes, { settle: 1200 });
    await k.still('getting-started/connected-idle.webp');
    await reloadJob();
  });

  await S('laser', async () => {
    await k.openSettings('Advanced');
    await k.sleep(800);
    await k.still('features/laser-enable-setting.webp');
    await k.closeDialogs();
  });

  await S('language', async () => {
    await k.openSettings('General');
    const lang = page.getByText('Language & Region', { exact: true }).first();
    await lang.scrollIntoViewIfNeeded(); await k.sleep(700);
    const sel = page.locator('.setting-item', { hasText: /^\s*Language/ }).locator('select').first();
    await k.recStart('language-switch-german');
    await k.sleep(800);
    await k.center(sel).catch(() => {});            // ripple on the Language list
    // The screencast only sends frames when the page changes: keep it moving.
    const scroll = async (n) => { for (let i = 0; i < n; i++) { await page.mouse.wheel(0, 18); await k.sleep(120); } };
    await page.mouse.move(1000, 600); await scroll(8);
    await k.patchSettings({ language: 'de', keyboardLayout: 'de-DE' }); await k.sleep(600);   // the UI turns German
    await scroll(14); await k.sleep(600);
    await k.recStop();
    await k.patchSettings({ language: 'en', keyboardLayout: 'en-US' }); await k.sleep(2500);
    await k.closeDialogs();
    k.clip(`raw/language-switch-german${k.SUFFIX}.mp4`, 'getting-started/language-switch-german.mp4', { width: 1920 });
  });

  await S('updates', async () => {
    await k.closeDialogs();
    await k.tapAt(137, 62, { settle: 2500 });
    if (!(await page.locator('.dialog-backdrop').count())) throw new Error('update dialog did not open');
    await k.recStart('update-version-history-rollback');
    await k.sleep(600);
    await k.tap(page.locator('.dialog-backdrop').getByText('Version History', { exact: true }).first(), { settle: 1800 });
    // Pick the previous version: only selects it (the main button turns into
    // Roll back); nothing is installed.
    const older = page.locator('.dialog-backdrop').getByText(/^v2\.0\.\d+$/).nth(1);
    if (await older.count()) await k.tap(older, { settle: 2500 });
    await k.recStop();
    await k.closeDialogs();
    k.clip(`raw/update-version-history-rollback${k.SUFFIX}.mp4`, 'getting-started/update-version-history-rollback.mp4', { width: 1920 });
  });

  await S('tips', async () => {
    await k.openSettings('General');
    const btn = page.getByRole('button', { name: /Show tips now/i }).first();
    await btn.scrollIntoViewIfNeeded(); await k.tap(btn, { settle: 1800 });
    await k.still('getting-started/tips-dialog.webp');
    await k.closeDialogs();
  });

  await S('license', async () => {
    await k.openSettings('General');
    const manage = page.getByRole('button', { name: /Manage License/i }).first();
    await manage.scrollIntoViewIfNeeded(); await k.tap(manage, { settle: 1800 });
    await k.still('getting-started/license-dialog.webp');
    const deact = page.locator('.deactivate-btn').first();
    if (await deact.count()) {
      await deact.scrollIntoViewIfNeeded(); await k.tap(deact, { settle: 1200 });
      const confirm = page.locator('.confirm-dialog').last();
      await confirm.waitFor({ timeout: 5000 });
      await k.still('getting-started/license-deactivate-confirm.webp');
      // Only ever the non-danger button: Cancel.
      await k.tap(confirm.locator('button:not(.eula-btn--danger)').first(), { settle: 1000 });
    }
    await k.closeDialogs();
    const now = await licenseActive();
    if (now !== licenseBefore) throw new Error(`license changed: ${licenseBefore} -> ${now}`);
  });

  await S('rgb', async () => {
    await openPlugin('RGB LED');
    await pluginTab('Status'); await k.still('accessories/rgbled-status.webp');
    await pluginTab('Colors'); await k.still('accessories/rgbled-colors.webp');
    await k.closeDialogs();
    await k.tapAt(430, 54, { settle: 1200 });
    await k.tap(k.dlg().getByText('RGB LED', { exact: true }).first(), { settle: 1000 });
    await k.still('accessories/accessories-rgbled.webp');
    await k.closeDialogs();
  });

  await S('unpair', async () => {
    await k.tapAt(430, 54, { settle: 1200 });
    await k.tap(k.dlg().getByText('RGB LED', { exact: true }).first(), { settle: 1000 });
    const unpair = k.dlg().getByRole('button', { name: /^Unpair$/ }).first();
    if (!(await unpair.count())) throw new Error('no Unpair button');
    await k.tap(unpair, { settle: 1200 });
    await k.still('accessories/accessories-unpair-confirm.webp');
    // Cancel: the last dialog's button that is not Unpair.
    const cancel = page.locator('.dialog-backdrop').last().getByRole('button', { name: /^Cancel$/ }).first();
    await k.tap(cancel, { settle: 900 });
    await k.closeDialogs();
  });

  await S('orbit', async () => {
    await k.closeDialogs();
    await k.tap(k.btn(/^3D$/), { settle: 1200 });
    const box = await page.locator('canvas').first().boundingBox();
    const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
    await k.recStart('visualizer-keepout');
    await k.sleep(500);
    await page.mouse.move(cx, cy); await page.mouse.down();
    for (let i = 0; i <= 40; i++) { await page.mouse.move(cx - i * 8, cy - i * 2); await k.sleep(30); }
    await k.sleep(400);
    for (let i = 40; i >= 0; i--) { await page.mouse.move(cx - i * 8, cy - i * 2); await k.sleep(30); }
    await page.mouse.up(); await k.sleep(800);
    await k.recStop();
    await k.tap(k.btn(/^3D$/), { settle: 800 });
    k.clip(`raw/visualizer-keepout${k.SUFFIX}.mp4`, 'features/visualizer-keepout.mp4', { width: 1440 });
  });
}, themes);

console.log('license after:', await licenseActive());
console.log('failures:', k.failures);
await k.disconnect();
