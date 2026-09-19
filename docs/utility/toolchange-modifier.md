# ToolChange Modifier

Insert your own G-code around every tool change in a program, without editing
the file by hand or changing your post processor.

The tool runs **entirely in your browser** — the file is read locally and never
uploaded anywhere.

!!! tip "The usual reason to use it"
    AutoDustBoot. If you retract and expand the boot with `M9`/`M8`, the boot
    has to be out of the way *before* the spindle goes to the tool change
    position, and back down *after* the machine has moved to the first cut.
    Dropping `M9` before the change and `M8` after the first rapid puts those
    commands exactly where a collision is least likely.

<div class="tcm">
<section class="tcm-card">
<div class="tcm-card__title"><span class="tcm-dot"></span> G-code file</div>
<button type="button" class="tcm-drop" id="tcm-drop">
<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
<span class="tcm-drop__main">Drop a G-code file here, or click to choose</span>
<span class="tcm-drop__hint">.ngc and .nc files</span>
</button>
<input type="file" id="tcm-file" accept=".ngc,.nc" hidden>
<div class="tcm-selected" id="tcm-selected"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg><span class="tcm-selected__name" id="tcm-file-name"></span><span class="tcm-selected__size" id="tcm-file-size"></span><button type="button" class="tcm-selected__remove" id="tcm-remove" aria-label="Remove file">&times;</button></div>
</section>
<section class="tcm-card">
<div class="tcm-card__title"><span class="tcm-dot"></span> Commands to insert</div>
<div class="tcm-field">
<label for="tcm-before">Before tool change</label>
<input type="text" id="tcm-before" placeholder="e.g. M9" autocomplete="off" spellcheck="false">
<div class="tcm-hint">Separate multiple commands with commas — <code>M9, G4 P0.5</code>. Inserted immediately before any line containing <code>M6</code> or <code>M98</code>.</div>
<label class="tcm-check"><input type="checkbox" id="tcm-ignore-before"><span>Remove these commands where the file already has them</span></label>
</div>
<div class="tcm-field">
<label for="tcm-after">After tool change</label>
<input type="text" id="tcm-after" placeholder="e.g. M8, G4 P1" autocomplete="off" spellcheck="false">
<div class="tcm-hint">Inserted after the first <code>G0</code> that carries both an X and a Y following the tool change — the move to the first cut.</div>
<label class="tcm-check"><input type="checkbox" id="tcm-ignore-after"><span>Remove these commands where the file already has them</span></label>
</div>
</section>
<div class="tcm-controls">
<button type="button" class="tcm-btn tcm-btn--primary" id="tcm-generate"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg><span>Generate modified file</span></button>
</div>
<div class="tcm-status" id="tcm-status"></div>
<div class="tcm-chips" id="tcm-chips"><span class="tcm-chip">Tool changes: <b id="tcm-count-tc">—</b></span><span class="tcm-chip">Inserted before: <b id="tcm-count-before">—</b></span><span class="tcm-chip">Inserted after: <b id="tcm-count-after">—</b></span><span class="tcm-chip" id="tcm-chip-removed">Removed: <b id="tcm-count-removed">—</b></span></div>
<div class="tcm-version">ToolChange Modifier <span id="tcm-version">v1.0.003</span></div>
</div>

<style>
  .tcm {
    --tcm-accent: var(--md-primary-fg-color, #26a69a);
    --tcm-surface: var(--md-code-bg-color, #f5f5f5);
    --tcm-border: color-mix(in srgb, var(--md-default-fg-color) 12%, transparent);
    --tcm-text: var(--md-default-fg-color);
    --tcm-dim: var(--md-default-fg-color--light);
    --tcm-success: #22c55e;
    --tcm-success-soft: rgba(34, 197, 94, 0.14);
    --tcm-danger: #ef4444;
    --tcm-danger-soft: rgba(239, 68, 68, 0.12);
  }
  .tcm .tcm-card {
    background: var(--tcm-surface);
    border: 1px solid var(--tcm-border);
    border-radius: 0.6rem;
    padding: 1.25rem 1.25rem 1.35rem;
    margin: 1rem 0;
  }
  .tcm .tcm-card__title {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--tcm-dim);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .tcm .tcm-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--tcm-accent);
  }
  .tcm .tcm-drop {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    width: 100%;
    padding: 1.6rem 1rem;
    background: transparent;
    border: 2px dashed var(--tcm-border);
    border-radius: 0.5rem;
    color: var(--tcm-dim);
    font-family: inherit;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .tcm .tcm-drop:hover,
  .tcm .tcm-drop:focus-visible {
    border-color: var(--tcm-accent);
    color: var(--tcm-text);
    outline: none;
  }
  .tcm .tcm-drop.is-over {
    border-color: var(--tcm-accent);
    background: color-mix(in srgb, var(--tcm-accent) 12%, transparent);
    color: var(--tcm-text);
  }
  .tcm .tcm-drop__main { font-size: 0.9rem; font-weight: 600; }
  .tcm .tcm-drop__hint { font-size: 0.75rem; }
  .tcm .tcm-selected {
    display: none;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.85rem;
    padding: 0.6rem 0.75rem;
    background: var(--tcm-success-soft);
    border: 1px solid color-mix(in srgb, var(--tcm-success) 35%, transparent);
    border-radius: 0.4rem;
    color: var(--tcm-success);
    font-size: 0.82rem;
  }
  .tcm .tcm-selected.show { display: flex; }
  .tcm .tcm-selected__name {
    flex: 1;
    color: var(--tcm-text);
    font-family: var(--md-code-font-family, 'SF Mono', monospace);
    overflow-wrap: anywhere;
  }
  .tcm .tcm-selected__size { color: var(--tcm-dim); font-size: 0.75rem; white-space: nowrap; }
  .tcm .tcm-selected__remove {
    background: transparent;
    border: none;
    color: var(--tcm-dim);
    font-size: 1.1rem;
    line-height: 1;
    padding: 0 0.15rem;
    cursor: pointer;
  }
  .tcm .tcm-selected__remove:hover { color: var(--tcm-danger); }
  .tcm .tcm-field + .tcm-field { margin-top: 1.35rem; }
  .tcm .tcm-field > label {
    display: block;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--tcm-text);
    margin-bottom: 0.45rem;
  }
  .tcm .tcm-field input[type="text"] {
    width: 100%;
    padding: 0.65rem 0.8rem;
    background: var(--md-default-bg-color);
    border: 1px solid var(--tcm-border);
    border-radius: 0.4rem;
    color: var(--tcm-text);
    font-family: var(--md-code-font-family, 'SF Mono', monospace);
    font-size: 0.88rem;
    transition: border-color 0.15s;
  }
  .tcm .tcm-field input[type="text"]:focus {
    border-color: var(--tcm-accent);
    outline: none;
  }
  .tcm .tcm-hint {
    font-size: 0.75rem;
    color: var(--tcm-dim);
    line-height: 1.6;
    margin-top: 0.4rem;
  }
  .tcm .tcm-hint code {
    font-size: 0.72rem;
    padding: 0.05rem 0.3rem;
  }
  .tcm .tcm-check {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-top: 0.55rem;
    font-size: 0.8rem;
    color: var(--tcm-dim);
    cursor: pointer;
  }
  .tcm .tcm-check input { margin: 0.15rem 0 0; accent-color: var(--tcm-accent); }
  .tcm .tcm-controls { display: flex; gap: 0.75rem; margin-top: 1rem; }
  .tcm .tcm-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.7rem 1.3rem;
    border: 1px solid transparent;
    border-radius: 0.4rem;
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.05s;
  }
  .tcm .tcm-btn:active { transform: translateY(1px); }
  .tcm .tcm-btn--primary {
    background: var(--tcm-accent);
    color: var(--md-primary-bg-color, #fff);
  }
  .tcm .tcm-btn--primary:hover { opacity: 0.9; }
  .tcm .tcm-status {
    display: none;
    margin-top: 0.9rem;
    padding: 0.75rem 1rem;
    border-radius: 0.4rem;
    font-size: 0.85rem;
    line-height: 1.55;
  }
  .tcm .tcm-status.show { display: block; }
  .tcm .tcm-status.is-ok {
    background: var(--tcm-success-soft);
    border: 1px solid color-mix(in srgb, var(--tcm-success) 35%, transparent);
    color: var(--tcm-success);
  }
  .tcm .tcm-status.is-err {
    background: var(--tcm-danger-soft);
    border: 1px solid color-mix(in srgb, var(--tcm-danger) 35%, transparent);
    color: var(--tcm-danger);
  }
  .tcm .tcm-chips {
    display: none;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }
  .tcm .tcm-chips.show { display: flex; }
  .tcm .tcm-chip {
    background: transparent;
    border: 1px solid var(--tcm-border);
    border-radius: 4px;
    padding: 0.25rem 0.55rem;
    font-size: 0.75rem;
    color: var(--tcm-dim);
  }
  .tcm .tcm-chip b { color: var(--tcm-text); }
  .tcm .tcm-chip.is-hidden { display: none; }
  .tcm .tcm-version {
    margin-top: 1rem;
    font-size: 0.72rem;
    color: var(--md-default-fg-color--lighter);
    text-align: right;
  }
  @media (max-width: 600px) {
    .tcm .tcm-card { padding: 1rem; }
    .tcm .tcm-controls { flex-direction: column; }
    .tcm .tcm-btn { width: 100%; }
  }
</style>

<script>
  (() => {
    const TOOL_VERSION = '1.0.003';
    const $ = (id) => document.getElementById(id);

    const drop = $('tcm-drop');
    const fileInput = $('tcm-file');
    const selected = $('tcm-selected');
    const fileNameEl = $('tcm-file-name');
    const fileSizeEl = $('tcm-file-size');
    const removeBtn = $('tcm-remove');
    const beforeInput = $('tcm-before');
    const afterInput = $('tcm-after');
    const ignoreBefore = $('tcm-ignore-before');
    const ignoreAfter = $('tcm-ignore-after');
    const generateBtn = $('tcm-generate');
    const statusEl = $('tcm-status');
    const chipsEl = $('tcm-chips');

    if (!drop) return;

    $('tcm-version').textContent = 'v' + TOOL_VERSION;

    // The settings are the same on every job for a given machine, so they are
    // worth remembering between visits.
    const remember = (el, key, prop) => {
      const saved = localStorage.getItem(key);
      if (saved !== null) el[prop] = prop === 'checked' ? saved === 'true' : saved;
      el.addEventListener(prop === 'checked' ? 'change' : 'input', () => {
        localStorage.setItem(key, prop === 'checked' ? el.checked : el.value.trim());
      });
    };
    remember(beforeInput, 'beforeToolChange', 'value');
    remember(afterInput, 'afterToolChange', 'value');
    remember(ignoreBefore, 'ignoreBeforeMatches', 'checked');
    remember(ignoreAfter, 'ignoreAfterMatches', 'checked');
    if (!afterInput.value) afterInput.value = 'M8, G4 P1';

    let file = null;

    const setStatus = (message, kind) => {
      statusEl.textContent = message;
      statusEl.className = 'tcm-status show ' + (kind === 'ok' ? 'is-ok' : 'is-err');
    };

    const clearStatus = () => {
      statusEl.className = 'tcm-status';
      chipsEl.classList.remove('show');
    };

    const formatSize = (bytes) =>
      bytes < 1024 ? bytes + ' B'
        : bytes < 1024 * 1024 ? (bytes / 1024).toFixed(1) + ' KB'
          : (bytes / 1024 / 1024).toFixed(1) + ' MB';

    const acceptFile = (candidate) => {
      const name = candidate.name.toLowerCase();
      if (!name.endsWith('.ngc') && !name.endsWith('.nc')) {
        setStatus('Please choose a .ngc or .nc file.', 'err');
        return;
      }
      file = candidate;
      fileNameEl.textContent = candidate.name;
      fileSizeEl.textContent = formatSize(candidate.size);
      selected.classList.add('show');
      clearStatus();
    };

    drop.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length) acceptFile(fileInput.files[0]);
    });

    ['dragenter', 'dragover'].forEach((type) => {
      drop.addEventListener(type, (e) => {
        e.preventDefault();
        drop.classList.add('is-over');
      });
    });
    ['dragleave', 'dragend'].forEach((type) => {
      drop.addEventListener(type, () => drop.classList.remove('is-over'));
    });
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      drop.classList.remove('is-over');
      if (e.dataTransfer.files.length) acceptFile(e.dataTransfer.files[0]);
    });

    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      file = null;
      fileInput.value = '';
      selected.classList.remove('show');
      clearStatus();
    });

    const splitCommands = (raw) =>
      raw.split(',').map((cmd) => cmd.trim()).filter(Boolean);

    // M08 and M8 are the same command; compare on the normalised form so the
    // "remove existing" option catches both spellings.
    const normaliseMCode = (line) => {
      const match = line.match(/M0?(\d)/);
      return match ? 'M' + match[1] : null;
    };

    const modify = (text, beforeCommands, afterCommands) => {
      const lines = text.split('\n');
      const out = ['; Modified by ToolChange Modifier Version ' + TOOL_VERSION];
      const stats = { toolChanges: 0, before: 0, after: 0, removed: 0 };
      let pending = false;

      for (const line of lines) {
        const trimmed = line.trim();

        if (line.includes('M6') || line.includes('M98')) {
          stats.toolChanges++;
          if (beforeCommands.length) {
            out.push(...beforeCommands);
            stats.before += beforeCommands.length;
          }
          pending = true;
        }

        const normalised = normaliseMCode(trimmed);
        const drops =
          (ignoreBefore.checked && beforeCommands.includes(normalised)) ||
          (ignoreAfter.checked && afterCommands.includes(normalised));

        if (drops) stats.removed++;
        else out.push(line);

        if (pending && (trimmed.includes('G0 ') || trimmed.includes('G00 '))) {
          const hasXY = /X-?\d+\.?\d*/i.test(trimmed) && /Y-?\d+\.?\d*/i.test(trimmed);
          if (hasXY && afterCommands.length) {
            out.push(...afterCommands);
            stats.after += afterCommands.length;
            pending = false;
          }
        }
      }

      return { text: out.join('\n'), stats };
    };

    const save = async (contents, name) => {
      if ('showSaveFilePicker' in window) {
        const handle = await window.showSaveFilePicker({
          suggestedName: name,
          types: [{ description: 'G-code Files', accept: { 'text/plain': ['.ngc', '.nc'] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(contents);
        await writable.close();
        return 'saved';
      }

      const url = URL.createObjectURL(new Blob([contents], { type: 'text/plain' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return 'downloaded';
    };

    generateBtn.addEventListener('click', async () => {
      const beforeCommands = splitCommands(beforeInput.value.trim());
      const afterCommands = splitCommands(afterInput.value.trim());

      if (!file) {
        setStatus('Choose a G-code file first.', 'err');
        return;
      }
      if (!beforeCommands.length && !afterCommands.length) {
        setStatus('Enter at least one command to insert.', 'err');
        return;
      }

      try {
        const { text, stats } = modify(await file.text(), beforeCommands, afterCommands);
        const extension = file.name.substring(file.name.lastIndexOf('.'));
        const newName = file.name.replace(extension, '_modified' + extension);
        const outcome = await save(text, newName);

        $('tcm-count-tc').textContent = stats.toolChanges;
        $('tcm-count-before').textContent = stats.before;
        $('tcm-count-after').textContent = stats.after;
        $('tcm-count-removed').textContent = stats.removed;
        $('tcm-chip-removed').classList.toggle('is-hidden', stats.removed === 0);
        chipsEl.classList.add('show');

        if (!stats.toolChanges) {
          setStatus('No M6 or M98 tool change was found, so nothing was inserted. ' +
            newName + ' was ' + outcome + ' unchanged.', 'err');
          return;
        }
        setStatus(newName + ' ' + outcome + '.', 'ok');
      } catch (error) {
        if (error.name === 'AbortError') setStatus('Saving was cancelled.', 'err');
        else setStatus('Error: ' + error.message, 'err');
      }
    });
  })();
</script>

## What it changes

The tool walks the program line by line and makes two kinds of insertion:

| Where | Rule |
|---|---|
| **Before tool change** | Immediately above any line containing `M6` or `M98`. |
| **After tool change** | After the first `G0`/`G00` following that tool change that carries both an X and a Y — the rapid to the first cut. |

Everything else is copied through untouched, and the result is written to a new
file with `_modified` added to the name — your original is never overwritten. A
`; Modified by ToolChange Modifier` comment is added as the first line so you
can tell a processed file apart at a glance.

**Remove these commands where the file already has them** deletes existing
copies of the commands you entered, so a program that already contains stray
`M8`/`M9` lines ends up with them only where this tool puts them. `M08` and
`M8` count as the same command.

## Typical AutoDustBoot setup

| Field | Value |
|---|---|
| Before tool change | `M9` |
| After tool change | `M8, G4 P1` |

`M9` lifts the boot out of the way before the spindle travels to the tool
change position; `M8` lowers it once the machine is over the first cut, and
`G4 P1` gives it a second to settle before the spindle plunges.

See [AutoDustBoot &rarr;](../accessories/autodustboot.md) for wiring and for
the macro side of the setup.

## Notes

- Matching is textual: a line containing `M6` anywhere — including `T2 M6` —
  counts as a tool change.
- If a tool change is never followed by a `G0` with both X and Y, the
  "after" commands are skipped for that change rather than guessed at.
- Chrome and Edge ask where to save the file. Other browsers drop it in your
  downloads folder.
