// Batch S6: plugin dialogs via their real container (.plugin-dialog-backdrop).
import * as k from './lib.mjs';
const page = await k.connect();
const S = k.section;
const themes = (process.env.THEMES || 'dark,light').split(',');
const tab = (t) => page.locator('button', { hasText: new RegExp('^' + t + '$') }).first();
const dlg = () => page.locator('.plugin-dialog-backdrop').last();
const closePlugin = async () => { for (let i = 0; i < 3 && await page.locator('.plugin-dialog-backdrop').count(); i++) { await page.keyboard.press('Escape'); await k.sleep(500); } };
const openPlugin = async (name) => {
  await closePlugin(); await k.closeDialogs();
  await k.tap(tab('Plugins'), { settle: 800 });
  await k.tap(page.locator('.tool-menu-item, .plugin-tile, button, div', { hasText: new RegExp('^' + name + '$') }).last(), { settle: 2200 });
};
const side = async (t) => { await k.tap(dlg().getByText(t, { exact: true }).first(), { settle: 1000 }); };

await k.forThemes(async (theme) => {
  await S('quickcut', async () => {
    await openPlugin('QuickCut');
    for (const [t, rel] of [['Rectangle', 'plugins/quickcut-rectangle.webp'], ['Circle', 'plugins/quickcut-circle.webp'], ['Polygon', 'plugins/quickcut-polygon.webp'], ['Planer', 'plugins/quickcut-planer.webp'], ['Jointer', 'plugins/quickcut-jointer.webp'], ['Cutter', 'plugins/quickcut-cutter.webp']]) { await side(t); await k.still(rel); }
    await closePlugin();
  });
  await S('patc', async () => {
    await openPlugin('PneumaticATC');
    for (const [t, rel] of [['ATC Setup', 'plugins/patc-setup.webp'], ['TLS', 'plugins/patc-tls.webp'], ['Probe', 'plugins/patc-probe.webp'], ['Manual', 'plugins/patc-manual.webp'], ['Events', 'plugins/patc-events.webp'], ['Advanced', 'plugins/patc-advanced.webp']]) { await side(t); await k.still(rel); }
    await closePlugin();
  });
  await S('autodustboot', async () => {
    await openPlugin('AutoDustBoot');
    await k.still('accessories/autodustboot-connections-wireless.webp');
    await k.recStart('autodustboot-retract-expand');
    await k.tap(dlg().locator('button', { hasText: /Retract/i }).first(), { settle: 4500 });
    await k.tap(dlg().locator('button', { hasText: /Expand/i }).first(), { settle: 4500 });
    await k.recStop();
    await side('Options');
    await k.still('accessories/autodustboot-options.webp');
    await closePlugin();
  });
  await S('edgealign', async () => {
    await openPlugin('Edge Align');
    await k.still('plugins/edge-align-probe.webp');
    const st = dlg().getByText('Settings', { exact: true }).first();
    if (await st.count()) { await k.tap(st, { settle: 900 }); await k.still('plugins/edge-align-settings.webp'); }
    await closePlugin();
  });
  await S('replicator', async () => {
    await openPlugin('Replicator');
    await k.still('plugins/replicator-dialog.webp');
    await closePlugin();
  });
  await S('gcode-explorer', async () => {
    await openPlugin('G-code Explorer');
    await k.still('plugins/gcode-explorer.webp');
    await closePlugin();
  });
  await closePlugin();
  await k.tap(tab('Terminal'), { settle: 400 });
  const f = `raw/autodustboot-retract-expand${k.SUFFIX}.mp4`;
  if ((await import('node:fs')).existsSync(f)) { try { k.clip(f, 'accessories/autodustboot-retract-expand.mp4', { crop: { x: 560, y: 80, w: 800, h: 930 }, width: 800 }); } catch (e) { console.log('!! clip', e.message.split('\n')[0]); } }
}, themes);
console.log('failures:', k.failures);
await k.disconnect();
