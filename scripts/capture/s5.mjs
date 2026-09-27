// Batch S5: plugin dialogs (iframes), park-not-set prompt, and a short job run for stop + preview-running.
import * as k from './lib.mjs';
const page = await k.connect();
const S = k.section;
const themes = (process.env.THEMES || 'dark,light').split(',');
const CON = { x: 1230, y: 530, w: 680, h: 540 };
const tab = (t) => page.locator('button', { hasText: new RegExp('^' + t + '$') }).first();
const openPlugin = async (name) => {
  await k.closeDialogs();
  await k.tap(tab('Plugins'), { settle: 800 });
  await k.tap(page.locator('.tool-menu-item, .plugin-tile, button, div', { hasText: new RegExp('^' + name + '$') }).last(), { settle: 2200 });
  return page.frameLocator('.dialog-backdrop iframe, iframe').last();
};
const status = async () => (await k.machine()).status;
const cutting = (m) => m.status === 'Run' && !m.isToolChanging;
const waitFor = async (pred, timeout = 400000, label = 'cond') => { const t0 = Date.now(); while (Date.now() - t0 < timeout) { const m = await k.machine(); if (pred(m)) return m; await k.sleep(250); } throw new Error('waitFor ' + label + ' timeout'); };
const waitCutting = async (holdMs = 2000) => { for (;;) { await waitFor(cutting, 400000, 'cutting'); await k.sleep(holdMs); if (cutting(await k.machine())) return; } };

await k.forThemes(async (theme) => {
  await S('quickcut', async () => {
    const f = await openPlugin('QuickCut');
    for (const [t, rel] of [['Circle', 'plugins/quickcut-circle.webp'], ['Polygon', 'plugins/quickcut-polygon.webp'], ['Planer', 'plugins/quickcut-planer.webp'], ['Jointer', 'plugins/quickcut-jointer.webp'], ['Cutter', 'plugins/quickcut-cutter.webp'], ['Rectangle', 'plugins/quickcut-rectangle.webp']]) {
      await k.tap(f.getByText(t, { exact: true }).first(), { settle: 1000 }); await k.still(rel);
    }
    await k.closeDialogs();
  });
  await S('patc', async () => {
    const f = await openPlugin('PneumaticATC');
    for (const [t, rel] of [['ATC Setup', 'plugins/patc-setup.webp'], ['TLS', 'plugins/patc-tls.webp'], ['Probe', 'plugins/patc-probe.webp'], ['Manual', 'plugins/patc-manual.webp'], ['Events', 'plugins/patc-events.webp'], ['Advanced', 'plugins/patc-advanced.webp']]) {
      const l = f.getByText(t, { exact: true }).first();
      if (await l.count()) { await k.tap(l, { settle: 1000 }); await k.still(rel); } else console.log('no tab', t);
    }
    await k.closeDialogs();
  });
  await S('autodustboot', async () => {
    const f = await openPlugin('AutoDustBoot');
    await k.still('accessories/autodustboot-connections-wireless.webp');
    await k.recStart('autodustboot-retract-expand');
    await k.tap(f.locator('button', { hasText: /Retract/i }).first(), { settle: 4500 });
    await k.tap(f.locator('button', { hasText: /Expand/i }).first(), { settle: 4500 });
    await k.recStop();
    await k.tap(f.getByText('Options', { exact: true }).first(), { settle: 1000 });
    await k.still('accessories/autodustboot-options.webp');
    await k.closeDialogs();
  });
  await S('mtc', async () => {
    // Manual Tool Changer plugin is installed but disabled; its config still opens from the Plugins list? skip if absent
    const item = page.locator('.tool-menu-item, .plugin-tile, button, div', { hasText: /^Manual Tool Changer$/ });
    if (!(await item.count())) { console.log('mtc not in tool menu'); return; }
  });
  await S('park-not-set', async () => {
    await k.closeDialogs();
    const s0 = await k.api('/api/settings');
    await k.api('/api/settings', { parkingLocation: '' }); await k.sleep(800);
    await k.hold(k.btn(/Park/), 1500, { settle: 900 });
    await k.still('features/jog-park-not-set.webp');
    await k.closeDialogs();
    await k.api('/api/settings', { parkingLocation: s0.parkingLocation });
    console.log('park restored', (await k.api('/api/settings')).parkingLocation);
  });
  await S('job-stop', async () => {
    await k.closeDialogs();
    await k.cmd('G0 X0 Y0'); await k.waitIdle(); await k.cmd('G0 Z0'); await k.waitIdle();
    await k.recStart('job-short');
    const t0 = Date.now(); const marks = {}; const mark = (n) => { marks[n] = (Date.now() - t0) / 1000; };
    await k.sleep(600);
    await k.tap(k.btn(/^Cycle$/), { settle: 200 }); mark('cycle');
    await waitCutting(); await k.sleep(6000); mark('running');
    await k.tap(tab('G-Code Preview'), { settle: 300 }); mark('preview-on'); await k.sleep(8000);
    await k.tap(tab('Terminal'), { settle: 300 }); mark('preview-off');
    await k.sleep(1500);
    await k.tap(k.btn(/^Stop$/), { settle: 200 }); mark('stop');
    await k.waitIdle({ timeout: 120000 }); await k.sleep(3000); mark('stopped');
    const raw = await k.recStop({ tail: 8000 });
    console.log('marks', JSON.stringify(marks));
    k.clip(raw, 'features/gcode-preview-running.mp4', { start: marks['preview-on'] - 0.5, end: marks['preview-off'] + 0.5, crop: CON, width: CON.w });
    k.clip(raw, 'features/job-stop.mp4', { start: marks.stop - 1.5, end: marks.stopped });
    const m = await k.machine(); console.log('after stop', m.status, m.WPos, 'tool', m.tool, 'toolChanging', m.isToolChanging);
    if (m.status === 'Idle') { await k.cmd('G53 G0 Z0'); await k.waitIdle(); await k.cmd('G0 X0 Y0'); await k.waitIdle(); await k.cmd('G0 Z0'); await k.waitIdle(); }
  });
  const f = `raw/autodustboot-retract-expand${k.SUFFIX}.mp4`;
  if ((await import('node:fs')).existsSync(f)) { try { k.clip(f, 'accessories/autodustboot-retract-expand.mp4', {}); } catch (e) { console.log('!! clip', e.message.split('\n')[0]); } }
}, themes);
console.log('failures:', k.failures);
await k.disconnect();
