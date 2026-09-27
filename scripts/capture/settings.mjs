import * as k from './lib.mjs';
const page = await k.connect();
const S = k.section, DLG = k.DLG, dlg = k.dlg;
const themes = (process.env.THEMES || 'dark,light').split(',');

await k.forThemes(async (theme) => {
  // ---------------- General ----------------
  await S('general', async () => {
    await k.openSettings('General');
    await k.still('getting-started/connection-setup-general.webp', { clip: DLG });
    await k.tap(dlg().getByText('Ethernet', { exact: true }).first(), { settle: 900 });
    await k.still('getting-started/connection-setup-ethernet.webp', { clip: DLG });
    await k.tap(dlg().getByText('A cable from this computer to the controller board.').first(), { settle: 700 });
    const remote = dlg().getByText('Remote Control Settings', { exact: true });
    await remote.scrollIntoViewIfNeeded(); await page.mouse.wheel(0, 120); await k.sleep(700);
    await k.still('settings/remote-settings.webp', { clip: DLG });
  });
  await S('general-scroll', async () => {
    // walk the rest of General for Language & Region, keyboard layout, units
    await k.openSettings('General');
    const lang = dlg().getByText('Language & Region', { exact: true }).first();
    await lang.scrollIntoViewIfNeeded(); await k.sleep(700);
    await k.still('features/language-region.webp', { clip: DLG });
    await k.still('features/virtual-keyboard-layout-setting.webp', { clip: DLG });
  });
  await S('wizard', async () => {
    await k.openSettings('General');
    await k.recStart('setup-wizard-walk');
    await k.tap(dlg().getByRole('button', { name: 'Run setup wizard' }), { settle: 1500 });
    await k.still('getting-started/wizard-welcome.webp');
    const next = () => page.getByRole('button', { name: /^(Next|Continue)$/ }).last();
    for (const n of ['connection', 'travel', 'switches', 'motor-fault', 'homing', 'safety', 'review']) { await k.tap(next(), { settle: 1500 }); await k.still(`getting-started/wizard-${n}.webp`); }
    await k.recStop();
    await k.closeDialogs();
    console.log('wizardCompleted still', (await k.api('/api/settings')).setupWizardCompleted);
  });
  // ---------------- Tool Library ----------------
  await S('tools', async () => {
    await k.openSettings('Tool Library');
    await k.still('features/tool-library.webp', { clip: DLG });
    // assign slot: Edit Tool -> Assigned To Slot -> pick another slot (shows the swap hint) -> Cancel
    await k.recStart('tool-assign-slot');
    await k.tap(dlg().getByRole('button', { name: 'Edit' }).first(), { settle: 1400 });
    const sel = page.locator('.modal-body select').first();
    await page.evaluate(() => window.__capRipple(1112, 282));
    await sel.selectOption({ index: 2 }); await k.sleep(1800);
    await k.still('features/tool-edit-dialog.webp');
    await k.tap(page.locator('.dialog-backdrop button', { hasText: /^Cancel$/ }).last(), { settle: 1000 });
    await k.recStop();
    await k.tap(dlg().getByRole('button', { name: 'Add Tool' }), { settle: 1000 });
    await k.still('features/tool-add-dialog.webp');
    await page.keyboard.press('Escape'); await k.sleep(500);
  });
  // ---------------- Controls ----------------
  await S('controls', async () => {
    await k.openSettings('Controls');
    await k.still('settings/controls-tab.webp', { clip: DLG });
    await k.recStart('controls-capture-key');
    const cell = dlg().getByText('Shift+Z', { exact: true }).first();
    await k.tap(cell, { settle: 1200 });
    await k.still('settings/controls-capture-key.webp', { clip: DLG });
    await page.keyboard.press('Shift+Z'); await k.sleep(1500);
    await k.recStop();
    const gp = dlg().getByText('Not set', { exact: true }).first();
    await k.tap(gp, { settle: 1200 });
    await k.still('settings/controls-gamepad-bind.webp', { clip: DLG });
    await page.keyboard.press('Escape'); await k.sleep(500);
    await k.closeDialogs();
    await k.tapAt(62, 54, { settle: 1200 });
    await k.still('settings/controls-gamepad-debug.webp');
    await k.tapAt(62, 54, { settle: 800 });
  });
  // ---------------- Firmware ----------------
  await S('firmware', async () => {
    await k.openSettings('Firmware');
    await k.still('settings/firmware-tab.webp', { clip: DLG });
    const search = dlg().getByPlaceholder('Search Firmware Settings...');
    await search.fill('homing'); await k.sleep(1200);
    await k.still('settings/firmware-search.webp', { clip: DLG });
    await search.fill(''); await page.evaluate(() => document.activeElement && document.activeElement.blur()); await k.sleep(800);
    await k.tap(dlg().getByRole('button', { name: 'Flash Firmware' }), { settle: 1200 });
    await k.still('settings/firmware-flasher.webp');
    await k.closeDialogs();
  });
  // ---------------- Calibration ----------------
  await S('calibration', async () => {
    await k.openSettings('Calibration');
    await k.still('features/calibration-tab.webp', { clip: DLG });
  });
  // ---------------- Plugins ----------------
  await S('plugins', async () => {
    await k.openSettings('Plugins');
    await k.still('plugins/plugins-installed.webp', { clip: DLG });
    await k.tap(dlg().getByRole('button', { name: /Install Plugin/ }), { settle: 1500 });
    await k.still('plugins/plugins-install.webp');
    await k.closeDialogs();
  });
  // ---------------- Logs ----------------
  await S('logs', async () => {
    await k.openSettings('Logs');
    await k.still('settings/logs-tab.webp', { clip: DLG });
    await k.tap(dlg().getByRole('button', { name: 'Delete' }), { settle: 1200 });
    await k.still('settings/logs-delete-active.webp');
    const cancel = page.locator('.dialog-backdrop button', { hasText: /^Cancel$/ }).last();
    if (await cancel.count()) await k.tap(cancel, { settle: 500 }); else await page.keyboard.press('Escape');
  });
  // ---------------- Backup ----------------
  await S('backup', async () => {
    await k.openSettings('Backup');
    await k.still('settings/backup-tab.webp', { clip: DLG });
  });
  // ---------------- Advanced ----------------
  await S('advanced', async () => {
    await k.openSettings('Advanced');
    await k.still('features/aux-outputs-settings.webp', { clip: DLG });
    const kz = dlg().getByText('Keepout Zone', { exact: true }).first();
    await kz.scrollIntoViewIfNeeded(); await page.mouse.wheel(0, 420); await k.sleep(800);
    await k.still('features/keepout-settings.webp', { clip: DLG });
  });
  await k.closeDialogs();
  const c = { crop: DLG, width: DLG.w };
  for (const [raw, rel, opt] of [['setup-wizard-walk', 'getting-started/setup-wizard-walk.mp4', {}], ['tool-assign-slot', 'features/tool-assign-slot.mp4', {}], ['controls-capture-key', 'settings/controls-capture-key.mp4', c]]) {
    const f = `raw/${raw}${k.SUFFIX}.mp4`; if (k.failures.length === 0 || (await import('node:fs')).existsSync(f)) { try { k.clip(f, rel, opt); } catch (e) { console.log('!! clip', raw, e.message.split('\n')[0]); } }
  }
}, themes);
console.log('failures:', k.failures);
await k.disconnect();
