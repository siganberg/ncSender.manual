// CDP screencast recorder for a Playwright page: frames + timestamps -> mp4 via ffmpeg concat.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
export async function startCast(page, dir, { quality = 92 } = {}) {
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async (ev) => {
    const i = frames.length;
    fs.writeFileSync(path.join(dir, `f${String(i).padStart(6, '0')}.jpg`), Buffer.from(ev.data, 'base64'));
    frames.push(ev.metadata.timestamp);
    try { await cdp.send('Page.screencastFrameAck', { sessionId: ev.sessionId }); } catch {}
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality, everyNthFrame: 1 });
  return {
    frames,
    async stop(out) {
      await cdp.send('Page.stopScreencast');
      await new Promise(r => setTimeout(r, 300));
      await cdp.detach().catch(() => {});
      // concat demuxer with real durations
      const lines = ['ffconcat version 1.0'];
      for (let i = 0; i < frames.length; i++) {
        const d = i + 1 < frames.length ? Math.max(0.001, frames[i + 1] - frames[i]) : 0.033;
        lines.push(`file f${String(i).padStart(6, '0')}.jpg`, `duration ${d.toFixed(4)}`);
      }
      lines.push(`file f${String(frames.length - 1).padStart(6, '0')}.jpg`);
      fs.writeFileSync(path.join(dir, 'list.txt'), lines.join('\n') + '\n');
      execSync(`ffmpeg -v error -y -f concat -safe 0 -i ${path.join(dir, 'list.txt')} -vf "fps=60,format=yuv420p" -c:v libx264 -preset veryfast -crf 14 ${out}`);
      fs.rmSync(dir, { recursive: true, force: true });   // frames are only needed until encoded
      const dur = frames.length > 1 ? frames[frames.length - 1] - frames[0] : 0;
      console.log(`cast   ${path.basename(out)}  ${frames.length} frames over ${dur.toFixed(1)}s (${(frames.length / Math.max(dur, 0.001)).toFixed(1)} fps)`);
      return out;
    },
  };
}
