// Re-cut every clip from the 60 fps masters (default speed now 1.5x). JOB=1 also re-cuts the job-run clips.
import * as k from './lib.mjs';
import fs from 'node:fs';
const CON = { x: 1230, y: 530, w: 680, h: 540 }, VIS = { x: 20, y: 105, w: 1200, h: 960 }, DLG = k.DLG;
const c = (o) => ({ crop: o, width: o.w });
const cv = c(VIS);
const list = [
  ['jog-step-sizes', 'features/jog-step-sizes.mp4', c(k.JOG)], ['jog-continuous', 'features/jog-continuous.mp4', c(k.RIGHT)],
  ['dro-long-press', 'features/dro-long-press.mp4', c({ x: 1230, y: 370, w: 680, h: 150 })], ['dro-manual-entry', 'features/dro-manual-entry.mp4', c({ x: 780, y: 100, w: 1140, h: 980 })],
  ['jog-zero-buttons', 'features/jog-zero-buttons.mp4', {}], ['jog-park-save', 'features/jog-park-save.mp4', c(k.JOG)], ['jog-corners', 'features/jog-corners.mp4', {}],
  ['visualizer-views', 'features/visualizer-views.mp4', cv], ['visualizer-zoom', 'features/visualizer-zoom.mp4', cv], ['visualizer-context-menu', 'features/visualizer-context-menu.mp4', cv],
  ['visualizer-move-to', 'features/visualizer-move-to.mp4', {}], ['visualizer-slot-tap', 'features/visualizer-slot-tap.mp4', cv], ['laser-mode-toggle', 'features/laser-mode-toggle.mp4', cv],
  ['tool-change-hold', 'features/tool-change-hold.mp4', {}], ['visualizer-out-of-bounds', 'features/visualizer-out-of-bounds.mp4', cv],
  ['visualizer-spindle-run', 'features/visualizer-spindle-run.mp4', { crop: { x: 20, y: 600, w: 1200, h: 465 }, width: 1200 }],
  ['setup-wizard-walk', 'getting-started/setup-wizard-walk.mp4', {}], ['tool-assign-slot', 'features/tool-assign-slot.mp4', {}], ['controls-capture-key', 'settings/controls-capture-key.mp4', c(DLG)],
  ['console-send-command', 'features/console-send-command.mp4', c(CON)], ['macros-run', 'features/macros-run.mp4', { start: 0, end: 9, crop: { x: 780, y: 100, w: 1140, h: 980 }, width: 1140 }],
  ['gcode-preview-start-from-line', 'features/gcode-preview-start-from-line.mp4', {}], ['gcode-preview-editor', 'features/gcode-preview-editor.mp4', {}],
  ['probe-types', 'features/probe-types.mp4', { crop: { x: 460, y: 80, w: 1000, h: 920 }, width: 1000 }],
  ['tool-tls-run', 'features/tool-tls-run.mp4', {}], ['alarm-unlock', 'settings/alarm-unlock.mp4', {}], ['jog-home', 'features/jog-home.mp4', {}], ['virtual-keyboard', 'features/virtual-keyboard.mp4', {}],
  ['autodustboot-retract-expand', 'accessories/autodustboot-retract-expand.mp4', { crop: { x: 560, y: 80, w: 800, h: 930 }, width: 800 }],
];
for (const suffix of ['', '-light']) {
  k.setSuffix(suffix);
  if (!process.env.JOB) for (const [raw, rel, opt] of list) { const f = `raw/${raw}${suffix}.mp4`; if (fs.existsSync(f)) k.clip(f, rel, opt); else console.log('missing', f); }
  if (process.env.JOB) {
    const raw = `raw/job-run${suffix}.mp4`; const marks = JSON.parse(fs.readFileSync(`raw/job-run${suffix}.json`));
    const cut = (name, a, b, opt = {}) => k.clip(raw, name, { start: Math.max(0, marks[a] - 1), end: marks[b] + 1, ...opt });
    cut('features/visualizer-running.mp4', 'running', 'spindle-view-on', cv);
    cut('features/visualizer-spindle-view.mp4', 'spindle-view-on', 'spindle-view-off', cv);
    cut('features/visualizer-overrides.mp4', 'override', 'override-reset', { crop: { x: 20, y: 600, w: 1200, h: 465 }, width: 1200 });
    cut('features/gcode-preview-running.mp4', 'preview-on', 'preview-off', c(CON));
    cut('features/job-pause-resume.mp4', 'pause', 'resume', {});
    cut('plugins/patc-tool-change.mp4', 'toolchange-start', 'toolchange-end', {});
    cut('features/visualizer-toolpath.mp4', 'toolchange-end', 'running2', cv);
    cut('features/job-stop.mp4', 'stop', 'stopped', {});
    cut('features/job-start.mp4', 'cycle', 'running', { speed: 3 });
  }
}
