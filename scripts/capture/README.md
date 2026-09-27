# Capture toolkit

Drives the ncSender kiosk (Radxa, 10.0.2.117) to reshoot the manual's screenshots
and clips. Every capture is taken twice, dark and light; the light file gets a
`-light` suffix and `assets/js/theme-media.js` swaps it in when the reader uses the
light scheme. Run `python3 scripts/theme-media-manifest.py` after adding captures.

## How it works

- `lib.mjs` connects to the kiosk's Electron app over CDP (`ncapp-restart --debug`
  on the kiosk, then `ssh -N -L 9222:127.0.0.1:9222 root@10.0.2.117`), injects a
  click-ripple overlay so taps are visible, and records the real screen with
  `wf-recorder`. Clips are cut with ffmpeg at 2x speed, 30 fps, 1280 wide, plus a
  poster JPEG. Stills go straight to WebP.
- `jog.mjs`, `vis.mjs`, `settings.mjs`, `s2.mjs` … `s6.mjs` are the batches, one per
  area. `ONLY=section,section` limits a batch; `THEMES=dark` limits the themes.
- `s3.mjs` runs the loaded program and cuts the running-job clips from one
  recording. `recut2.mjs` re-cuts from marks found in the header colour timeline.
- `remote2.mjs` captures the phone layout and the Remote Control gate from a
  headless Chrome on this Mac.

```sh
cd scripts/capture && npm i
ssh root@10.0.2.117 ncapp-restart --debug
ssh -N -L 9222:127.0.0.1:9222 root@10.0.2.117 &
node jog.mjs
```

Things learned the hard way: wf-recorder drops the queued frames on SIGINT, so
`recStop()` waits a few seconds before stopping; plugin dialogs live under
`.plugin-dialog-backdrop`, the app's own under `.dialog-backdrop`; the Electron
build swallows `Escape` from CDP when the on-screen keyboard is up, so blur the
input first.
