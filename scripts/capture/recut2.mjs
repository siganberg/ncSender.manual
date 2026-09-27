import * as k from './lib.mjs';
import fs from 'node:fs';
import { execSync } from 'node:child_process';
const CON = { x: 1230, y: 530, w: 680, h: 540 };
const VIS = { x: 20, y: 105, w: 1200, h: 960 };
const cv = { crop: VIS, width: 1200 };
const join = (raw, out, segs, { crop } = {}) => {
  const parts = segs.map((s, i) => `[0:v]trim=${s[0]}:${s[1]},setpts=(PTS-STARTPTS)/2[s${i}]`).join(';');
  const cat = segs.map((_, i) => `[s${i}]`).join('') + `concat=n=${segs.length}:v=1:a=0`;
  const cr = crop ? `,crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}` : '';
  execSync(`ffmpeg -v error -y -i ${raw} -filter_complex "${parts};${cat}${cr},scale=1280:-2:flags=lanczos,fps=30,format=yuv420p[v]" -map "[v]" -an -c:v libx264 -profile:v high -preset slow -crf 27 -movflags +faststart ${out}`);
  execSync(`ffmpeg -v error -y -ss 0.2 -i ${out} -frames:v 1 -q:v 4 ${out.replace(/\.mp4$/, '-poster.jpg')}`);
  console.log('clip  ', out.split('/images/')[1], Math.round(fs.statSync(out).size / 1024), 'KB');
};
// ---- dark: header timeline: run 1.5, T1 change 4-21.5, run, sv blip 40, T2 change 56-72.5, hold 72.5-904, T2 tail 909-915, run, T3 change 933.5-956, run to 974
k.setSuffix('');
let raw = 'raw/job-run.mp4';
k.clip(raw, 'features/job-start.mp4', { start: 0.5, end: 26, speed: 3 });
k.clip(raw, 'features/visualizer-running.mp4', cv && { ...cv, start: 22, end: 39.5 });
k.clip(raw, 'features/visualizer-spindle-view.mp4', { ...cv, start: 39.5, end: 50.5 });
k.clip(raw, 'features/visualizer-overrides.mp4', { start: 51.5, end: 56, crop: { x: 20, y: 600, w: 1200, h: 465 }, width: 1200 });
k.clip(raw, 'plugins/patc-tool-change.mp4', { start: 932.5, end: 957 });
k.clip(raw, 'features/visualizer-toolpath.mp4', { ...cv, start: 956, end: 973 });
join(raw, `${k.MANUAL}/features/job-pause-resume.mp4`, [[69.5, 75.5], [903, 910]]);
// ---- light: run 1.5, T1 change 4-19, run, sv blip 37.5, run, T2 change 53-61.4(end). marks: sv-on 38.4 sv-off 47.5 override 50.0 reset 55.6 preview-on 56.05
k.setSuffix('-light');
raw = 'raw/job-run-light.mp4';
k.clip(raw, 'features/job-start.mp4', { start: 0.5, end: 23, speed: 3 });
k.clip(raw, 'features/visualizer-running.mp4', { ...cv, start: 20, end: 37 });
k.clip(raw, 'features/visualizer-spindle-view.mp4', { ...cv, start: 37, end: 48 });
k.clip(raw, 'features/visualizer-overrides.mp4', { start: 49, end: 53, crop: { x: 20, y: 600, w: 1200, h: 465 }, width: 1200 });
k.clip(raw, 'features/visualizer-toolpath.mp4', { ...cv, start: 20, end: 37 });
for (const n of ['job-start', 'visualizer-running', 'job-pause-resume']) { const f = `${k.MANUAL}/features/${n}.mp4`; const d = Number(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${f}`).toString()); execSync(`ffmpeg -v error -y -i ${f} -vf "fps=8/${d},scale=420:-1,tile=4x2" -frames:v 1 raw/enc-${n}-sheet.png`); }
