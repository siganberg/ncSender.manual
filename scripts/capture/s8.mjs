// Batch S8: the blue "Z0 is set, no tool length reference yet" note, without
// touching the operator's Z0. G49 drops the reference (WCO then equals G54),
// and G10 L2 writes G54 Z back to the SAME value: the server sees a Z0 written
// with no reference and shows the note. Afterwards the app is restarted (the
// flag is in memory) and TLS re-measures the tool, so G54 is exactly as found.
import * as k from './lib.mjs';
const page = await k.connect();
const themes = (process.env.THEMES || 'dark,light').split(',');
const VIS = { x: 20, y: 105, w: 1200, h: 960 };
const g54z = async () => Number(String((await k.machine()).WCO || '').split(',')[2]);

const before = await k.machine();
console.log('before', before.WCO, 'tool', before.tool, 'TLR', before.toolLengthSet);

await k.forThemes(async () => {
  await k.closeDialogs();
  await k.cmd('G49');
  await k.sleep(1500);
  const z = await g54z();
  if (!Number.isFinite(z)) throw new Error('no WCO');
  await k.cmd(`G10 L2 P1 Z${z.toFixed(3)}`);   // same value: flags the Z0, moves nothing
  await k.sleep(2500);
  const m = await k.machine();
  console.log('flag', m.zeroSetWithoutTlr, 'zeroTool', m.zeroTool, 'G54 Z', z);
  await k.still('features/tool-z0-kept-notice.webp', { clip: VIS });
}, themes);
await k.disconnect();
