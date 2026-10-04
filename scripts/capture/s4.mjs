// Batch S4: plugin dialogs, AutoDustBoot, alarm + unlock, homing, TLS run, German UI, keepout visualizer.
import * as k from './lib.mjs';
const page = await k.connect();
const S = k.section;
const themes = (process.env.THEMES || 'dark,light').split(',');
const CON = { x: 1230, y: 530, w: 680, h: 540 };
const VIS = { x: 20, y: 105, w: 1200, h: 960 };
const tab = (t) => page.locator('button', { hasText: new RegExp('^' + t + '$') }).first();
const openPlugin = async (name) => {
  await k.closeDialogs();
  await k.tap(tab('Plugins'), { settle: 800 });
  await k.tap(page.locator('.tool-menu-item, .plugin-tile, button, div', { hasText: new RegExp('^' + name + '$') }).last(), { settle: 1800 });
};
const pluginTab = async (t) => { await k.tap(page.locator('.dialog-backdrop, .plugin-dialog-backdrop').getByText(t, { exact: true }).first(), { settle: 900 }); };

await k.forThemes(async (theme) => {
  await S('quickcut', async () => {
    await openPlugin('QuickCut');
    for (const [t, rel] of [['Circle', 'plugins/quickcut-circle.webp'], ['Polygon', 'plugins/quickcut-polygon.webp'], ['Planer', 'plugins/quickcut-planer.webp'], ['Jointer', 'plugins/quickcut-jointer.webp'], ['Cutter', 'plugins/quickcut-cutter.webp']]) {
      await pluginTab(t); await k.still(rel);
    }
    await k.closeDialogs();
  });
  await S('replicator', async () => {
    await openPlugin('Replicator');
    await k.still('plugins/replicator-dialog.webp');
    await k.closeDialogs();
  });
  await S('edgealign', async () => {
    await openPlugin('Edge Align');
    await k.still('plugins/edge-align-probe.webp');
    const st = page.locator('.dialog-backdrop').getByText('Settings', { exact: true }).first();
    if (await st.count()) { await k.tap(st, { settle: 900 }); await k.still('plugins/edge-align-settings.webp'); }
    await k.closeDialogs();
  });
  await S('patc', async () => {
    await openPlugin('PneumaticATC');
    for (const [t, rel] of [['ATC Setup', 'plugins/patc-setup.webp'], ['TLS', 'plugins/patc-tls.webp'], ['Probe', 'plugins/patc-probe.webp'], ['Manual', 'plugins/patc-manual.webp'], ['Events', 'plugins/patc-events.webp'], ['Advanced', 'plugins/patc-advanced.webp']]) {
      const l = page.locator('.dialog-backdrop, .plugin-dialog-backdrop').getByText(t, { exact: true }).first();
      if (await l.count()) { await k.tap(l, { settle: 900 }); await k.still(rel); } else console.log('no tab', t);
    }
    await k.closeDialogs();
  });
  await S('autodustboot', async () => {
    await openPlugin('AutoDustBoot');
    await k.still('accessories/autodustboot-connections-wireless.webp');
    await k.recStart('autodustboot-retract-expand');
    await k.tap(page.locator('.dialog-backdrop button, .plugin-dialog-backdrop button', { hasText: /^Retract$/ }).first(), { settle: 4000 });
    await k.tap(page.locator('.dialog-backdrop button, .plugin-dialog-backdrop button', { hasText: /^Expand$/ }).first(), { settle: 4000 });
    await k.recStop();
    const opt = page.locator('.dialog-backdrop, .plugin-dialog-backdrop').getByText('Options', { exact: true }).first();
    if (await opt.count()) { await k.tap(opt, { settle: 900 }); await k.still('accessories/autodustboot-options.webp'); }
    await k.closeDialogs();
  });
  await S('jog-panel', async () => {
    await k.closeDialogs();
    await k.still('features/jog-panel.webp', { clip: k.JOG });
    await k.still('features/4th-axis-jog.webp', { clip: k.JOG });
  });
  await S('remote', async () => {
    (await import('node:child_process')).execSync('node remote2.mjs', { stdio: 'inherit', env: { ...process.env, SUFFIX: k.SUFFIX } });
  });
  await S('plugins-console', async () => {
    await k.closeDialogs();
    await k.tap(tab('Plugins'), { settle: 800 });
    await k.still('plugins/plugins-console-tab.webp', { clip: CON });
    await k.tap(tab('Terminal'), { settle: 400 });
  });
  await S('keepout-vis', async () => {
    await k.closeDialogs();
    await k.tap(k.btn(/^Top$/), { settle: 1500 });
    await k.still('features/keepout-visualizer.webp', { clip: VIS });
    await k.tap(k.btn(/^3D$/), { settle: 1200 });
  });
  await S('tls-run', async () => {
    await k.closeDialogs();
    await k.recStart('tool-tls-run');
    await k.sleep(400);
    await k.hold(page.locator('.tools-legend__item', { hasText: /^TLS$/i }).first(), 1300, { settle: 500 });
    if (await page.locator('.dialog-backdrop').count()) await k.tap(page.locator('.dialog-backdrop button').last(), { settle: 500 });
    await k.waitIdle({ timeout: 240000 }); await k.sleep(1500);
    await k.recStop();
  });
  await S('alarm', async () => {
    // soft-limit alarm (position is retained), then Press to Unlock
    await k.closeDialogs();
    await k.recStart('alarm-unlock');
    await k.sleep(400);
    await k.cmd('G53 G0 X5000'); await k.sleep(2500);
    await k.still('settings/alarm-dialog.webp');
    await k.tap(page.getByText('Press to Unlock', { exact: false }).first(), { settle: 1200 });
    await k.still('settings/alarm-unlocking.webp');
    await k.waitIdle({ timeout: 60000 }); await k.sleep(1500);
    await k.recStop();
    console.log('after alarm', JSON.stringify((({ status, homed, WPos }) => ({ status, homed, WPos }))(await k.machine())));
  });
  await S('homing', async () => {
    await k.closeDialogs();
    await k.recStart('jog-home');
    await k.sleep(400);
    await k.hold(k.btn(/^Home/), 1500, { settle: 800 });
    if (await page.locator('.dialog-backdrop').count()) {
      await k.still('features/keepout-homing-gate.webp');
      await k.tap(page.locator('.dialog-backdrop button', { hasText: /^Continue$/ }).first(), { settle: 500 });
    }
    await k.waitIdle({ timeout: 300000 }); await k.sleep(1500);
    await k.recStop();
    await k.cmd('G0 X0 Y0'); await k.waitIdle(); await k.cmd('G0 Z0'); await k.waitIdle();
  });
  await S('german', async () => {
    await k.closeDialogs();
    await k.patchSettings({ language: 'de', keyboardLayout: 'de-DE' }); await k.sleep(2500);
    await k.still('features/language-german-ui.webp');
    await k.tap(page.getByPlaceholder(/Befehl|command/i).first(), { settle: 1200 });
    await k.still('features/language-keyboard-follows.webp');
    await page.evaluate(() => document.activeElement && document.activeElement.blur()); await k.sleep(600);
    await k.patchSettings({ language: 'en', keyboardLayout: 'en-US' }); await k.sleep(2500);
  });
  await S('virtual-keyboard', async () => {
    await k.closeDialogs();
    await k.recStart('virtual-keyboard');
    await k.tap(page.getByPlaceholder('Send command(s)'), { settle: 1500 });
    await page.keyboard.type('$$', { delay: 150 }); await k.sleep(800);
    await page.evaluate(() => document.activeElement && document.activeElement.blur()); await k.sleep(1200);
    await k.recStop();
    await page.getByPlaceholder('Send command(s)').fill('');
  });
  for (const [raw, rel, opt] of [
    ['autodustboot-retract-expand', 'accessories/autodustboot-retract-expand.mp4', {}],
    ['tool-tls-run', 'features/tool-tls-run.mp4', {}],
    ['alarm-unlock', 'settings/alarm-unlock.mp4', {}],
    ['jog-home', 'features/jog-home.mp4', {}],
    ['virtual-keyboard', 'features/virtual-keyboard.mp4', {}],
  ]) {
    const f = `raw/${raw}${k.SUFFIX}.mp4`;
    if ((await import('node:fs')).existsSync(f)) { try { k.clip(f, rel, opt); } catch (e) { console.log('!! clip', raw, e.message.split('\n')[0]); } }
  }
}, themes);
console.log('failures:', k.failures);
await k.disconnect();
