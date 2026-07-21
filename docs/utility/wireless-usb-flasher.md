# Wireless USB Flasher

Flash firmware to the ncSender **Wireless USB** directly from your browser.
Requires **Google Chrome or Microsoft Edge (v89+)** — the tool uses the Web
Serial API.

<div class="wusb">
<div class="wusb-warning" id="wusb-browser-warning">Web Serial API is not supported in this browser. Please use <a href="https://www.google.com/chrome/" target="_blank" rel="noopener">Google Chrome</a> or <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener">Microsoft Edge</a> (v89+).</div>
<div class="wusb-notice show"><b>Close ncSender before flashing.</b> If ncSender (Desktop or Pro) is running on any computer connected to this Wireless USB, it holds the serial port open and the flash will fail to connect. Fully quit ncSender — or unplug the Wireless USB from the other machine — before continuing.</div>
<section class="wusb-card">
<div class="wusb-card__title"><span class="wusb-dot"></span> Boot mode instructions</div>
<ol class="wusb-steps">
<li><b>Press and hold</b> the <b>BOOT</b> button on the Wireless USB.</li>
<li>While holding BOOT, <b>plug the Wireless USB</b> into your computer's USB port.</li>
<li>Continue holding BOOT for <b>~1 second</b>, then release. The device is now in flash mode.</li>
</ol>
</section>
<section class="wusb-card">
<div class="wusb-card__title"><span class="wusb-dot"></span> Firmware</div>
<div class="wusb-versions">
<button type="button" class="wusb-ver" data-url="../firmware/firmware_wireless_usb_v0.2.3.bin" data-name="firmware_wireless_usb_v0.2.3.bin"><div class="wusb-ver__head"><span class="wusb-ver__tag">v0.2.3</span><span class="wusb-ver__badge wusb-ver__badge--latest">Latest</span></div><div class="wusb-ver__title">Multi-device support</div><div class="wusb-ver__desc">Pendant + AutoDustBoot + Smart RGB LED on the same Wireless USB. Fixes pendant jog step-skipping introduced in v0.2.2. Requires ncSender v2.0.63+ or ncSender Pro v2.0.117+.</div></button>
<button type="button" class="wusb-ver" data-url="../firmware/firmware_wireless_usb_v0.1.0.bin" data-name="firmware_wireless_usb_v0.1.0.bin"><div class="wusb-ver__head"><span class="wusb-ver__tag">v0.1.0</span><span class="wusb-ver__badge">Original</span></div><div class="wusb-ver__title">Single pendant (rollback)</div><div class="wusb-ver__desc">Original firmware. Use to roll back if v0.2.x causes an issue. Does not support AutoDustBoot or Smart RGB LED.</div></button>
</div>
<div class="wusb-selected" id="wusb-selected"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg><span class="wusb-selected__name" id="wusb-file-name"></span><span class="wusb-selected__size" id="wusb-file-size"></span><button type="button" class="wusb-selected__remove" id="wusb-remove" aria-label="Remove file">&times;</button></div>
<div class="wusb-controls">
<button type="button" class="wusb-btn wusb-btn--outline" id="wusb-connect"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/></svg><span>Connect</span></button>
<button type="button" class="wusb-btn wusb-btn--primary" id="wusb-flash" disabled><span class="wusb-spinner" id="wusb-spinner"></span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="wusb-flash-icon" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><span id="wusb-flash-text">Flash firmware</span></button>
</div>
<div class="wusb-status-row"><span class="wusb-status wusb-status--disconnected" id="wusb-status"><span class="wusb-pulse"></span><span id="wusb-status-text">Disconnected</span></span></div>
<div class="wusb-chips" id="wusb-chips"><span class="wusb-chip">Chip: <b id="wusb-chip-type">—</b></span><span class="wusb-chip">MAC: <b id="wusb-chip-mac">—</b></span></div>
<div class="wusb-progress" id="wusb-progress"><div class="wusb-progress__track"><div class="wusb-progress__fill" id="wusb-progress-fill"></div></div><div class="wusb-progress__text"><span id="wusb-progress-label">Preparing…</span><span id="wusb-progress-percent">0%</span></div></div>
<div class="wusb-reset-notice" id="wusb-reset-notice">Unplug the Wireless USB and plug it back in to start the new firmware.</div>
<pre class="wusb-console" id="wusb-console"></pre>
</section>
</div>

<style>
  .wusb {
    --wusb-accent: var(--md-primary-fg-color, #26a69a);
    --wusb-accent-fg: var(--md-primary-bg-color, #fff);
    --wusb-accent-soft: color-mix(in srgb, var(--wusb-accent) 15%, transparent);
    --wusb-surface: var(--md-code-bg-color, #f5f5f5);
    --wusb-border: color-mix(in srgb, var(--md-default-fg-color) 12%, transparent);
    --wusb-border-strong: color-mix(in srgb, var(--md-default-fg-color) 22%, transparent);
    --wusb-text: var(--md-default-fg-color);
    --wusb-dim: var(--md-default-fg-color--light);
    --wusb-muted: var(--md-default-fg-color--lighter);
    --wusb-success: #22c55e;
    --wusb-success-soft: rgba(34, 197, 94, 0.14);
    --wusb-danger: #ef4444;
    --wusb-warning: #f59e0b;
    --wusb-warning-soft: rgba(245, 158, 11, 0.12);
  }
  .wusb .wusb-warning {
    display: none;
    padding: 0.9rem 1rem;
    background: var(--wusb-warning-soft);
    border: 1px solid color-mix(in srgb, var(--wusb-warning) 40%, transparent);
    border-radius: 0.5rem;
    color: var(--wusb-warning);
    font-size: 0.85rem;
    margin: 1rem 0;
  }
  .wusb .wusb-warning.show { display: block; }
  .wusb .wusb-notice {
    display: none;
    padding: 0.9rem 1rem;
    background: color-mix(in srgb, var(--wusb-accent) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--wusb-accent) 45%, transparent);
    border-left: 3px solid var(--wusb-accent);
    border-radius: 0.5rem;
    color: var(--wusb-text);
    font-size: 0.85rem;
    line-height: 1.55;
    margin: 1rem 0;
  }
  .wusb .wusb-notice.show { display: block; }
  .wusb .wusb-notice b { color: var(--wusb-accent); }
  .wusb .wusb-card {
    background: var(--wusb-surface);
    border: 1px solid var(--wusb-border);
    border-radius: 0.6rem;
    padding: 1.25rem 1.25rem 1.35rem;
    margin: 1rem 0;
  }
  .wusb .wusb-card__title {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--wusb-dim);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .wusb .wusb-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--wusb-accent);
  }
  .wusb .wusb-steps {
    list-style: none;
    counter-reset: wusb-step;
    padding: 0;
    margin: 0;
  }
  .wusb .wusb-steps li {
    counter-increment: wusb-step;
    position: relative;
    padding: 0 0 0.7rem 2.25rem;
    font-size: 0.9rem;
    color: var(--wusb-text);
  }
  .wusb .wusb-steps li:last-child { padding-bottom: 0; }
  .wusb .wusb-steps li::before {
    content: counter(wusb-step);
    position: absolute;
    left: 0; top: 0.05em;
    width: 22px; height: 22px;
    border-radius: 6px;
    background: color-mix(in srgb, var(--wusb-accent) 12%, transparent);
    color: var(--wusb-accent);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 700;
  }
  .wusb .wusb-versions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  @media (max-width: 640px) {
    .wusb .wusb-versions { grid-template-columns: 1fr; }
  }
  .wusb .wusb-ver {
    display: block;
    text-align: left;
    background: transparent;
    border: 1px solid var(--wusb-border);
    border-radius: 0.5rem;
    padding: 0.85rem 1rem;
    cursor: pointer;
    font-family: inherit;
    color: var(--wusb-text);
    transition: border-color 0.15s, background 0.15s, transform 0.05s;
  }
  .wusb .wusb-ver:hover {
    border-color: var(--wusb-accent);
    background: var(--wusb-accent-soft);
  }
  .wusb .wusb-ver:active { transform: translateY(1px); }
  .wusb .wusb-ver.is-loading { opacity: 0.6; cursor: wait; }
  .wusb .wusb-ver.is-selected {
    border-color: var(--wusb-success);
    background: var(--wusb-success-soft);
  }
  .wusb .wusb-ver__head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
  }
  .wusb .wusb-ver__tag {
    font-family: var(--md-code-font-family, 'SF Mono', monospace);
    font-weight: 700;
    font-size: 0.85rem;
    color: var(--wusb-accent);
  }
  .wusb .wusb-ver__badge {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
    background: color-mix(in srgb, var(--wusb-dim) 18%, transparent);
    color: var(--wusb-dim);
  }
  .wusb .wusb-ver__badge--latest {
    background: var(--wusb-accent);
    color: var(--wusb-accent-fg);
  }
  .wusb .wusb-ver__title {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.15rem;
  }
  .wusb .wusb-ver__desc {
    font-size: 0.78rem;
    color: var(--wusb-dim);
    line-height: 1.5;
  }
  .wusb .wusb-selected {
    display: none;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.9rem;
    padding: 0.55rem 0.75rem;
    background: var(--wusb-success-soft);
    border: 1px solid color-mix(in srgb, var(--wusb-success) 40%, transparent);
    border-radius: 0.4rem;
    color: var(--wusb-success);
    font-size: 0.85rem;
  }
  .wusb .wusb-selected.show { display: flex; }
  .wusb .wusb-selected__name { font-weight: 600; }
  .wusb .wusb-selected__size { color: var(--wusb-dim); font-size: 0.78rem; margin-left: auto; }
  .wusb .wusb-selected__remove {
    background: none; border: none; cursor: pointer;
    font-size: 1.15rem; line-height: 1;
    color: var(--wusb-muted);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
  }
  .wusb .wusb-selected__remove:hover { color: var(--wusb-danger); }
  .wusb .wusb-controls {
    display: flex;
    gap: 0.65rem;
    margin-top: 1rem;
  }
  .wusb .wusb-btn {
    flex: 1;
    padding: 0.65rem 1rem;
    border-radius: 0.4rem;
    border: none;
    font-size: 0.87rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background 0.15s, opacity 0.15s, border-color 0.15s;
    font-family: inherit;
  }
  .wusb .wusb-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .wusb .wusb-btn--primary {
    background: var(--wusb-accent);
    color: var(--wusb-accent-fg);
  }
  .wusb .wusb-btn--primary:hover:not(:disabled) { filter: brightness(1.08); }
  .wusb .wusb-btn--outline {
    background: transparent;
    color: var(--wusb-text);
    border: 1px solid var(--wusb-border-strong);
  }
  .wusb .wusb-btn--outline:hover:not(:disabled) {
    border-color: var(--wusb-accent);
    color: var(--wusb-accent);
  }
  .wusb .wusb-status-row { text-align: center; margin-top: 0.85rem; }
  .wusb .wusb-status {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
    border: 1px solid var(--wusb-border);
  }
  .wusb .wusb-status--disconnected { color: var(--wusb-muted); }
  .wusb .wusb-status--connected {
    color: var(--wusb-success);
    background: var(--wusb-success-soft);
    border-color: color-mix(in srgb, var(--wusb-success) 30%, transparent);
  }
  .wusb .wusb-status--error {
    color: var(--wusb-danger);
    background: rgba(239, 68, 68, 0.12);
    border-color: color-mix(in srgb, var(--wusb-danger) 30%, transparent);
  }
  .wusb .wusb-pulse {
    width: 7px; height: 7px; border-radius: 50%;
    background: currentColor;
    animation: wusb-pulse 2s infinite;
  }
  @keyframes wusb-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
  .wusb .wusb-chips {
    display: none;
    justify-content: center;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }
  .wusb .wusb-chips.show { display: flex; }
  .wusb .wusb-chip {
    background: transparent;
    border: 1px solid var(--wusb-border);
    border-radius: 4px;
    padding: 0.25rem 0.55rem;
    font-size: 0.75rem;
    color: var(--wusb-dim);
  }
  .wusb .wusb-chip b { color: var(--wusb-text); }
  .wusb .wusb-progress { display: none; margin-top: 1rem; }
  .wusb .wusb-progress.show { display: block; }
  .wusb .wusb-progress__track {
    width: 100%;
    height: 6px;
    background: color-mix(in srgb, var(--wusb-dim) 20%, transparent);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 0.4rem;
  }
  .wusb .wusb-progress__fill {
    height: 100%;
    width: 0%;
    background: var(--wusb-accent);
    transition: width 0.3s ease;
  }
  .wusb .wusb-progress__fill.is-erase { background: var(--wusb-danger); }
  .wusb .wusb-progress__fill.is-done { background: var(--wusb-success); }
  .wusb .wusb-progress__text {
    font-size: 0.78rem;
    color: var(--wusb-dim);
    display: flex;
    justify-content: space-between;
  }
  .wusb .wusb-reset-notice {
    display: none;
    padding: 0.75rem 1rem;
    background: var(--wusb-warning-soft);
    border: 1px solid color-mix(in srgb, var(--wusb-warning) 30%, transparent);
    border-radius: 0.4rem;
    color: var(--wusb-warning);
    font-size: 0.85rem;
    margin-top: 0.85rem;
  }
  .wusb .wusb-reset-notice.show { display: block; }
  .wusb .wusb-console {
    display: none;
    background: color-mix(in srgb, var(--md-default-fg-color) 6%, transparent);
    border: 1px solid var(--wusb-border);
    border-radius: 0.4rem;
    padding: 0.75rem 0.9rem;
    margin-top: 0.85rem;
    font-family: var(--md-code-font-family, 'SF Mono', 'Fira Code', monospace);
    font-size: 0.75rem;
    line-height: 1.6;
    max-height: 240px;
    overflow-y: auto;
    color: var(--wusb-dim);
    white-space: pre-wrap;
  }
  .wusb .wusb-console.show { display: block; }
  .wusb .wusb-console .lg-ok { color: var(--wusb-success); }
  .wusb .wusb-console .lg-err { color: var(--wusb-danger); }
  .wusb .wusb-console .lg-warn { color: var(--wusb-warning); }
  .wusb .wusb-spinner {
    display: none;
    width: 14px; height: 14px;
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: wusb-spin 0.6s linear infinite;
  }
  .wusb .wusb-spinner.show { display: inline-block; }
  @keyframes wusb-spin { to { transform: rotate(360deg); } }
  @media (max-width: 600px) {
    .wusb .wusb-controls { flex-direction: column; }
  }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"></script>
<script type="module">
  import { ESPLoader, Transport } from 'https://unpkg.com/esptool-js@0.5.4/bundle.js';

  const $ = (id) => document.getElementById(id);
  const connectBtn = $('wusb-connect');
  const flashBtn = $('wusb-flash');
  const flashText = $('wusb-flash-text');
  const flashIcon = $('wusb-flash-icon');
  const spinner = $('wusb-spinner');
  const fileNameEl = $('wusb-file-name');
  const fileSizeEl = $('wusb-file-size');
  const removeBtn = $('wusb-remove');
  const selectedEl = $('wusb-selected');
  const versionBtns = document.querySelectorAll('.wusb-ver');
  const status = $('wusb-status');
  const statusText = $('wusb-status-text');
  const chipsEl = $('wusb-chips');
  const chipType = $('wusb-chip-type');
  const chipMac = $('wusb-chip-mac');
  const progressEl = $('wusb-progress');
  const progressFill = $('wusb-progress-fill');
  const progressLabel = $('wusb-progress-label');
  const progressPercent = $('wusb-progress-percent');
  const consoleEl = $('wusb-console');
  const resetNotice = $('wusb-reset-notice');
  const browserWarn = $('wusb-browser-warning');

  let transport = null, esploader = null, firmwareData = null;
  let isConnected = false, isFlashing = false;

  if (!('serial' in navigator)) {
    browserWarn.classList.add('show');
    connectBtn.disabled = true;
  }

  function log(msg, kind) {
    consoleEl.classList.add('show');
    const line = document.createElement('div');
    if (kind) line.className = 'lg-' + kind;
    const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
    line.textContent = '[' + ts + '] ' + msg;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  const espTerm = {
    clean() { consoleEl.textContent = ''; },
    writeLine(d) { log(d); },
    write(d) { log(d); }
  };

  function fmt(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  }

  function setStatus(kind, text) {
    status.className = 'wusb-status wusb-status--' + kind;
    statusText.textContent = text;
  }

  function updateFlashBtn() {
    flashBtn.disabled = !isConnected || !firmwareData || isFlashing;
  }

  function setFlashing(active, text) {
    isFlashing = active;
    spinner.classList.toggle('show', active);
    flashIcon.style.display = active ? 'none' : '';
    flashText.textContent = text || 'Flash firmware';
    connectBtn.disabled = active;
    updateFlashBtn();
    if (active) flashBtn.disabled = true;
  }

  removeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearFirmware();
  });

  function clearFirmware() {
    firmwareData = null;
    selectedEl.classList.remove('show');
    versionBtns.forEach((b) => b.classList.remove('is-selected'));
    updateFlashBtn();
  }

  function setFirmware(bytes, name) {
    firmwareData = bytes;
    fileNameEl.textContent = name;
    fileSizeEl.textContent = fmt(bytes.length);
    selectedEl.classList.add('show');
    log('Loaded firmware: ' + name + ' (' + fmt(bytes.length) + ')', 'ok');
    updateFlashBtn();
  }

  versionBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (btn.classList.contains('is-loading')) return;
      const url = btn.getAttribute('data-url');
      const name = btn.getAttribute('data-name');
      btn.classList.add('is-loading');
      try {
        log('Fetching ' + name + '…');
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const buf = await res.arrayBuffer();
        versionBtns.forEach((b) => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        setFirmware(new Uint8Array(buf), name);
      } catch (err) {
        log('Failed to load ' + name + ': ' + err.message, 'err');
      } finally {
        btn.classList.remove('is-loading');
      }
    });
  });

  connectBtn.addEventListener('click', async () => {
    if (isConnected) { await disconnect(); return; }
    try {
      const device = await navigator.serial.requestPort({});
      transport = new Transport(device, true);
      esploader = new ESPLoader({
        transport, baudrate: 115200, terminal: espTerm, debugLogging: false,
      });
      log('Connecting to ESP32-S3…');
      setStatus('disconnected', 'Connecting…');
      const chip = await esploader.main();
      isConnected = true;
      setStatus('connected', 'Connected');
      connectBtn.querySelector('span').textContent = 'Disconnect';
      log('Connected: ' + chip, 'ok');
      chipType.textContent = chip || '—';
      try { chipMac.textContent = (await esploader.readMac()) || '—'; }
      catch { chipMac.textContent = '—'; }
      chipsEl.classList.add('show');
      updateFlashBtn();
    } catch (err) {
      log('Connection failed: ' + err.message, 'err');
      setStatus('error', 'Connection failed');
      isConnected = false;
      updateFlashBtn();
    }
  });

  async function disconnect() {
    try { if (transport) await transport.disconnect(); } catch {}
    transport = null; esploader = null;
    isConnected = false;
    setStatus('disconnected', 'Disconnected');
    chipsEl.classList.remove('show');
    connectBtn.querySelector('span').textContent = 'Connect';
    updateFlashBtn();
    log('Disconnected');
  }

  flashBtn.addEventListener('click', async () => {
    if (!esploader || !firmwareData || isFlashing) return;
    try {
      progressEl.classList.add('show');
      resetNotice.classList.remove('show');

      setFlashing(true, 'Erasing…');
      progressFill.className = 'wusb-progress__fill is-erase';
      progressFill.style.width = '0%';
      progressLabel.textContent = 'Erasing flash…';
      progressPercent.textContent = '';
      log('Erasing flash…', 'warn');

      let ep = 0;
      const t = setInterval(() => {
        ep = Math.min(ep + 1, 95);
        progressFill.style.width = ep + '%';
        progressPercent.textContent = ep + '%';
      }, 800);

      await esploader.eraseFlash();
      clearInterval(t);
      progressFill.style.width = '100%';
      progressPercent.textContent = '100%';
      log('Flash erased', 'ok');

      await new Promise(r => setTimeout(r, 400));

      setFlashing(true, 'Flashing…');
      progressFill.className = 'wusb-progress__fill';
      progressFill.style.width = '0%';
      progressLabel.textContent = 'Writing firmware…';
      progressPercent.textContent = '0%';

      const binaryString = Array.from(firmwareData, (b) => String.fromCharCode(b)).join('');
      log('Writing firmware at 0x0…');

      await esploader.writeFlash({
        fileArray: [{ data: binaryString, address: 0x0 }],
        flashSize: 'keep', flashMode: 'keep', flashFreq: 'keep',
        eraseAll: false, compress: true,
        reportProgress: (_i, written, total) => {
          const pct = Math.round((written / total) * 100);
          progressFill.style.width = pct + '%';
          progressPercent.textContent = pct + '%';
          progressLabel.textContent = 'Writing firmware… ' + fmt(written) + ' / ' + fmt(total);
        },
        calculateMD5Hash: (image) => CryptoJS.MD5(CryptoJS.enc.Latin1.parse(image)).toString(),
      });

      progressFill.className = 'wusb-progress__fill is-done';
      progressFill.style.width = '100%';
      progressPercent.textContent = '100%';
      progressLabel.textContent = 'Firmware flashed successfully';
      setFlashing(false);
      log('Firmware written', 'ok');

      let didReset = false;
      try { await esploader.hardReset(); log('Device reset', 'ok'); didReset = true; }
      catch { log('Could not auto-reset', 'warn'); }
      if (!didReset) {
        resetNotice.classList.add('show');
        log('Unplug and replug the Wireless USB to start the new firmware', 'warn');
      }
    } catch (err) {
      log('Flash failed: ' + err.message, 'err');
      setFlashing(false);
      progressLabel.textContent = 'Flash failed';
      progressFill.className = 'wusb-progress__fill is-erase';
    }
  });
</script>
