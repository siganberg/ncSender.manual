// Batch S3: one recorded job run per theme, cut into clips afterwards.
// Covers: visualizer-running, spindle view, overrides, gcode-preview-running, toolpath progress,
// tool change (Pneumatic ATC), pause/resume, stop, program-start event markers, job info.
import * as k from './lib.mjs';
import fs from 'node:fs';
const page = await k.connect();
const themes = (process.env.THEMES || 'dark,light').split(',');
const CON = { x: 1230, y: 530, w: 680, h: 540 };
const VIS = { x: 20, y: 105, w: 1200, h: 960 };
const tab = (t) => page.locator('button', { hasText: new RegExp('^' + t + '$') }).first();
const status = async () => (await k.machine()).status;
const waitStatus = async (re, timeout = 240000) => { const t0 = Date.now(); while (Date.now() - t0 < timeout) { const s = await status(); if (re.test(s)) return s; await k.sleep(250); } throw new Error('waitStatus ' + re + ' timeout'); };
const waitFor = async (pred, timeout = 400000, label = 'cond') => { const t0 = Date.now(); while (Date.now() - t0 < timeout) { const m = await k.machine(); if (pred(m)) return m; await k.sleep(250); } throw new Error('waitFor ' + label + ' timeout'); };
const cutting = (m) => m.status === 'Run' && !m.isToolChanging;
const waitCutting = async (holdMs = 2000) => { for (;;) { await waitFor(cutting, 400000, 'cutting'); await k.sleep(holdMs); if (cutting(await k.machine())) return; } };
const setProgramStart = async (on) => {
  const ev = (await k.api('/api/settings')).events || {};
  const cur = !!ev.programStartEnabled;
  if (cur !== on) { await k.tap(tab('Events'), { settle: 800 }); await k.tapAt(1852, 624, { settle: 900 }); await k.tap(tab('Terminal'), { settle: 500 }); }
};

await k.forThemes(async (theme) => {
  await k.closeDialogs();
  await setProgramStart(true);
  console.log('events now', JSON.stringify((await k.api('/api/settings')).events));
  await k.cmd('G0 X0 Y0'); await k.waitIdle();
  await k.cmd('G0 Z0'); await k.waitIdle();

  const marks = {};
  await k.recStart('job-run');
  const t0 = Date.now();
  const mark = (n) => { marks[n] = (Date.now() - t0) / 1000; console.log('mark', n, marks[n].toFixed(1)); };
  await k.sleep(600);
  await k.tap(k.btn(/^Cycle$/), { settle: 200 }); mark('cycle');
  await waitStatus(/Run|Tool|Hold/); mark('started');
  await k.sleep(1500);
  await k.still('features/events-terminal-markers.webp', { clip: CON });
  // the program starts with M6 T1: wait for that change to finish and real cutting to begin
  await waitCutting(); await k.sleep(12000); mark('running');
  await k.still('features/visualizer-running.webp', { clip: VIS });
  await k.still('features/job-info.webp', { clip: { x: 520, y: 120, w: 200, h: 100 } });
  // spindle view
  await k.tapAt(70, 202, { settle: 300 }); mark('spindle-view-on'); await k.sleep(8000);
  await k.still('features/visualizer-spindle-view.webp', { clip: VIS });
  await k.tapAt(70, 202, { settle: 300 }); mark('spindle-view-off'); await k.sleep(2500);
  // overrides
  mark('override');
  await k.tap(page.locator('button', { hasText: /^\+$/ }).first(), { settle: 900 });
  await k.tap(page.locator('button', { hasText: /^\+$/ }).first(), { settle: 900 });
  await k.still('features/visualizer-overrides.webp', { clip: { x: 350, y: 860, w: 540, h: 125 } });
  await k.sleep(1500);
  await k.tap(page.locator('button', { hasText: /^\d+%$/ }).first(), { settle: 1500 }); mark('override-reset');
  // g-code preview follows the job
  await k.tap(tab('G-Code Preview'), { settle: 300 }); mark('preview-on'); await k.sleep(7000);
  await k.still('features/gcode-preview-running.webp', { clip: CON });
  await k.tap(tab('Terminal'), { settle: 300 }); mark('preview-off');
  if (process.env.SHORT) {
    await k.tap(k.btn(/^Stop$/), { settle: 200 }); mark('stop');
    await k.waitIdle({ timeout: 120000 }); await k.sleep(2000); mark('stopped');
  } else {
  // pause / resume
  await k.tap(k.btn(/^Pause$/), { settle: 200 }); mark('pause');
  await waitStatus(/Hold|Door/); await k.sleep(4000);
  await k.still('features/visualizer-paused.webp', { clip: VIS });
  await page.evaluate(() => window.__capRipple(419, 1023)); await k.api('/api/gcode-job/resume', {}); mark('resume');
  await waitCutting(); await k.sleep(3000);
  // next tool change (M6 T2)
  await waitFor(m => m.isToolChanging, 600000, 'toolchange'); mark('toolchange-start');
  await k.sleep(4000);
  await k.still('plugins/patc-tool-change.webp', { clip: VIS });
  await waitCutting(); mark('toolchange-end');
  await k.sleep(10000); mark('running2');
  await k.still('features/visualizer-toolpath.webp', { clip: VIS });
  // stop the job
  await k.tap(k.btn(/^Stop$/), { settle: 200 }); mark('stop');
  await k.waitIdle({ timeout: 120000 }); await k.sleep(2000); mark('stopped');
  }
  const raw = await k.recStop();
  { const dur = Number((await import('node:child_process')).execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${raw}`).toString()); const sc = dur / (marks.stopped + 0.9); for (const n in marks) marks[n] = (marks[n] + 0.9) * sc; console.log('time scale', sc.toFixed(4)); }
  fs.writeFileSync(`raw/job-run${k.SUFFIX}.json`, JSON.stringify(marks, null, 1));

  await setProgramStart(false);

  const cut = (name, a, b, opt = {}) => k.clip(raw, name, { start: Math.max(0, marks[a] - 1), end: marks[b] + 1, ...opt });
  const cv = { crop: VIS, width: 1200 };
  cut('features/visualizer-running.mp4', 'running', 'spindle-view-on', cv);
  cut('features/visualizer-spindle-view.mp4', 'spindle-view-on', 'spindle-view-off', cv);
  cut('features/visualizer-overrides.mp4', 'override', 'override-reset', { crop: { x: 20, y: 600, w: 1200, h: 465 }, width: 1200 });
  cut('features/gcode-preview-running.mp4', 'preview-on', 'preview-off', { crop: CON, width: CON.w });
  if (!process.env.SHORT) {
  cut('features/job-pause-resume.mp4', 'pause', 'resume', {});
  cut('plugins/patc-tool-change.mp4', 'toolchange-start', 'toolchange-end', {});
  cut('features/visualizer-toolpath.mp4', 'toolchange-end', 'running2', cv);
  } else { cut('features/visualizer-toolpath.mp4', 'preview-off', 'stop', cv); }
  cut('features/job-stop.mp4', 'stop', 'stopped', {});
  cut('features/job-start.mp4', 'cycle', 'running', { speed: 3 });
}, themes);
const m = await k.machine(); console.log('end', m.status, m.WPos, 'tool', m.tool);
await k.disconnect();
