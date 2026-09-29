// Batch S7 (Sep 2026 releases): Settings > Tool Changer, the refreshed Tool
// Library, the "not measured since power-up" note, the job-start measure
// banner, the dust boot Options tab (Home Offset), and the dust boot waiting
// card + "Dust boot not responding" pause.
//
// Machine state it needs and restores: a tool changer plugin with a tool
// setter (TLS), the loaded program starting with T1, a paired AutoDustBoot.
// It changes to T1 for the job shot and puts the original tool back at the end.
import * as k from './lib.mjs';
const page = await k.connect();
const S = k.section;
const themes = (process.env.THEMES || 'dark,light').split(',');
const VIS = { x: 20, y: 105, w: 1200, h: 960 };
const DLG = k.DLG;
const tab = (t) => page.locator('button', { hasText: new RegExp('^' + t + '$') }).first();
const waitFor = async (pred, timeout = 180000, label = 'cond') => {
  const t0 = Date.now();
  for (;;) { const m = await k.machine(); if (pred(m)) return m; if (Date.now() - t0 > timeout) throw new Error('waitFor ' + label); await k.sleep(250); }
};
const openPlugin = async (name) => {
  await k.closeDialogs();
  await k.tap(tab('Plugins'), { settle: 800 });
  await k.tap(page.locator('.tool-menu-item, .plugin-tile, button, div', { hasText: new RegExp('^' + name + '$') }).last(), { settle: 2200 });
};

const startTool = (await k.machine()).tool;
console.log('start tool', startTool);

// The job shot needs the loaded tool to be the program's first tool (T1).
if (!process.env.ONLY || process.env.ONLY.split(',').some(s => s === 'unmeasured' || s === 'job')) {
  if (startTool !== 1) {
    await k.cmd('M6 T1');
    await waitFor(m => m.tool === 1 && m.status === 'Idle' && !m.isToolChanging, 240000, 'M6 T1');
    await k.sleep(2000);
  }
}

await k.forThemes(async () => {
  await S('toolchanger', async () => {
    await k.openSettings('Tool Changer');
    await k.sleep(600);
    await k.still('features/tool-changer-settings.webp', { clip: DLG });
    await k.closeDialogs();
  });
  await S('toollibrary', async () => {
    await k.openSettings('Tool Library');
    await k.sleep(800);
    await k.still('features/tool-library.webp', { clip: DLG });
    await k.closeDialogs();
  });
  await S('adboptions', async () => {
    await openPlugin('AutoDustBoot');
    await k.tap(page.getByText('Options', { exact: true }).first(), { settle: 1000 });
    // Max Travel and the new Home Offset sit below the fold: bring them in.
    await page.locator('#adb-homeOffsetMm').scrollIntoViewIfNeeded();
    await page.evaluate(() => { const el = document.getElementById('adb-homeOffsetMm'); el && el.closest('.adb-option-block') && el.closest('.adb-option-block').scrollIntoView({ block: 'center' }); });
    await k.sleep(600);
    await k.still('accessories/autodustboot-options.webp');
    await k.closeDialogs();
  });
  await S('unmeasured', async () => {
    await k.closeDialogs();
    await k.cmd('G49');                     // drop the tool length reference
    await waitFor(m => m.toolLengthSet === false, 10000, 'TLR cleared');
    await k.sleep(1500);                   // note slides in, TLS starts blinking
    await k.still('features/tool-unmeasured-notice.webp', { clip: VIS });
  });
  await S('job', async () => {
    await k.closeDialogs();
    if ((await k.machine()).toolLengthSet) { await k.cmd('G49'); await k.sleep(800); }
    await k.tap(k.btn(/^Cycle$/), { settle: 200 });
    await waitFor(m => (m.measureBeforeJobTool || 0) > 0, 20000, 'job-start banner');
    await k.sleep(1800);
    await k.still('features/tool-measure-before-job.webp', { clip: VIS });
    await waitFor(m => (m.measureBeforeJobTool || 0) === 0 && m.toolLengthSet === true, 180000, 'measured');
    await k.sleep(1000);
    await k.tap(k.btn(/^Stop$/), { settle: 400 });
    await k.waitIdle({ timeout: 120000 });
    await k.sleep(1500);
  });
  await S('adbwait', async () => {
    await k.closeDialogs();
    // A position the boot never reports: the first 5 s wait fails, the violet
    // card shows while its last move is re-sent, then the pause dialog opens.
    const sent = k.cmd('(DONGLE_WAIT:autodustboot:pos=999999:50:5)');
    await waitFor(m => (m.accessoryWait || '') !== '', 15000, 'waiting card');
    await k.sleep(1500);
    await k.still('accessories/autodustboot-waiting.webp', { clip: VIS });
    await page.locator('.dialog-backdrop, .gate-dialog, [role="alertdialog"]', { hasText: /Dust boot not responding/ }).first().waitFor({ timeout: 20000 });
    await k.sleep(1200);
    await k.still('accessories/autodustboot-not-responding.webp');
    await k.tap(page.getByRole('button', { name: /^Abort$/ }).last(), { settle: 1500 });
    await sent.catch(() => {});
    await k.waitIdle({ timeout: 30000 });
  });
}, themes);

// Leave the machine as we found it: original tool back in, measured.
if ((await k.machine()).tool !== startTool) {
  await k.cmd(`M6 T${startTool}`);
  await waitFor(m => m.tool === startTool && m.status === 'Idle' && !m.isToolChanging, 240000, 'restore tool');
}
const end = await k.machine();
console.log('end', end.status, 'tool', end.tool, 'TLR', end.toolLengthSet);
console.log('failures:', k.failures);
await k.disconnect();
