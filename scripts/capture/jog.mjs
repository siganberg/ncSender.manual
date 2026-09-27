import * as k from './lib.mjs';
const page = await k.connect();
await k.setTheme(process.env.THEME || 'dark');
const m0 = await k.machine();
const s0 = await k.api('/api/settings');
console.log('WCO before', m0.WCO, 'park', s0.parkingLocation, 'WPos', m0.WPos);
await k.prep();
if (await k.btn(/^X0/).count()) { await k.dbl(k.btn(/^X0/)); }   // merge back to XY0
const F = { settle: 700 };
const chip = (i) => page.locator('.chip').nth(i);
const listItem = (v) => page.locator('button', { hasText: new RegExp('^' + v + '$') }).last();
// make sure the large chip reads 10 before we start
if ((await chip(2).textContent()).trim() !== '10') { await k.hold(chip(2), 900, { settle: 600 }); await k.tap(listItem('10'), { settle: 600 }); }

// 1. step sizes -------------------------------------------------------------
if (!process.env.SKIP1) {
await k.recStart('jog-step-sizes');
await k.tap(chip(0), F); await k.tap(chip(1), F); await k.tap(chip(2), F);
await k.hold(chip(2), 900, { settle: 900 });
await k.tap(listItem('50'), { settle: 1200 });
await k.tap(chip(1), { settle: 900 });
await k.recStop();
await k.hold(chip(2), 900, { settle: 600 }); await k.tap(listItem('10'), { settle: 600 });
}

// 2. continuous jog ---------------------------------------------------------
await k.recStart('jog-continuous');
await k.hold(k.btn(/^Jog X positive$/), 1300, { settle: 300 }); await k.waitIdle();
await k.hold(k.btn(/^Jog X negative$/), 1300, { settle: 300 }); await k.waitIdle();
await k.sleep(500);
await k.recStop();

// 3. DRO long press (step 10: jog X+10, Y+10, then zero) --------------------
await k.tap(chip(2), F);
await k.tap(k.btn(/^Jog X positive$/), F); await k.waitIdle();
await k.tap(k.btn(/^Jog Y positive$/), F); await k.waitIdle();
await k.recStart('dro-long-press');
await k.sleep(400);
await k.holdAt(1358, 460, 1000, { settle: 1200 });       // X card
await k.holdAt(1475, 460, 1000, { settle: 1400 });       // XY pill
await k.recStop();

// 4. DRO manual entry (restore the original offset by typing +10) -----------
await k.recStart('dro-manual-entry');
await k.sleep(400);
await k.dblAt(1358, 460, { settle: 700 });
await page.keyboard.type('10', { delay: 90 }); await k.sleep(500);
await page.keyboard.press('Enter'); await k.sleep(1200);
await k.dblAt(1585, 460, { settle: 700 });
await page.keyboard.type('10', { delay: 90 }); await k.sleep(500);
await page.keyboard.press('Enter'); await k.sleep(1400);
await k.recStop();
const m1 = await k.machine();
console.log('WCO after entry', m1.WCO, 'WPos', m1.WPos);

// 5. go to zero buttons -----------------------------------------------------
await k.tap(k.btn(/^Jog Z positive$/), F); await k.waitIdle();
await k.tap(k.btn(/^Jog Z positive$/), F); await k.waitIdle();
await k.recStart('jog-zero-buttons');
await k.sleep(300);
await k.hold(k.btn(/^XY0/), 1200, { settle: 300 }); await k.waitIdle({ timeout: 90000 });
await k.sleep(300);
await k.hold(k.btn(/^Z0/), 1200, { settle: 300 }); await k.waitIdle({ timeout: 90000 });
await k.sleep(600);
await k.recStop();
const m2 = await k.machine();
console.log('after zero buttons WPos', m2.WPos, 'MPos', m2.MPos);

// 6. park save (then restore the real park spot) ----------------------------
await k.recStart('jog-park-save');
await k.sleep(400);
await k.dbl(k.btn(/Park/), { settle: 900 });
await k.tap(k.btn(/Save/), { settle: 2500 });
await k.recStop();
await k.api('/api/settings', { parkingLocation: s0.parkingLocation });
console.log('park restored to', (await k.api('/api/settings')).parkingLocation);

// 7. corners ----------------------------------------------------------------
await k.recStart('jog-corners');
await k.sleep(300);
await k.hold(page.getByRole('button', { name: 'Hold', exact: true }).nth(0), 1200, { settle: 300 }); await k.waitIdle({ timeout: 90000 });
await k.sleep(800);
await k.hold(k.btn(/^XY0/), 1200, { settle: 300 }); await k.waitIdle({ timeout: 90000 });
await k.sleep(600);
await k.recStop();
const m3 = await k.machine();
console.log('final WPos', m3.WPos, 'MPos', m3.MPos, 'WCO', m3.WCO);
const c = (o) => ({ crop: o, width: o.w });
if (!process.env.SKIP1) k.clip(`raw/jog-step-sizes${k.SUFFIX}.mp4`, 'features/jog-step-sizes.mp4', c(k.JOG));
k.clip(`raw/jog-continuous${k.SUFFIX}.mp4`, 'features/jog-continuous.mp4', c(k.RIGHT));
k.clip(`raw/dro-long-press${k.SUFFIX}.mp4`, 'features/dro-long-press.mp4', c({ x: 1230, y: 370, w: 680, h: 150 }));
k.clip(`raw/dro-manual-entry${k.SUFFIX}.mp4`, 'features/dro-manual-entry.mp4', c({ x: 780, y: 100, w: 1140, h: 980 }));
k.clip(`raw/jog-zero-buttons${k.SUFFIX}.mp4`, 'features/jog-zero-buttons.mp4', {});
k.clip(`raw/jog-park-save${k.SUFFIX}.mp4`, 'features/jog-park-save.mp4', c(k.JOG));
k.clip(`raw/jog-corners${k.SUFFIX}.mp4`, 'features/jog-corners.mp4', {});
await k.cmd('G0 X0 Y0'); await k.waitIdle(); await k.cmd('G0 Z0'); await k.waitIdle();
await k.setTheme('dark');
await k.disconnect();
