# Floating panels

!!! info "ncSender Pro 2.0.317 and newer"
    Floating panels are a Pro feature. In Community the manifest's `overlay`
    block is ignored and `pluginContext.overlay` does not exist.

A plugin can show one small panel of its own on the main screen: a timer, a
vacuum gauge, a coolant status, a custom control. The panel floats over the
screen, never moves the layout under it and never blocks touches outside
itself.

The operator stays in charge of it:

- drag it by its title bar (the position is remembered per screen),
- shrink it to a chip with **–**, tap the chip to open it again,
- close it with **×**,
- switch it off for good in **Plugin Manager** > the plugin >
  **Panel on main screen**.

Only one framed panel is open at a time; opening another shrinks the rest to
chips.

## Three pieces

```
manifest.json    "overlay": { ... }       where and how big
overlay.html     the page inside the panel
commands.js      optional: data and control through pluginContext.overlay
```

### 1. The manifest

```json
"overlay": {
  "page": "overlay.html",
  "title": "Stopwatch",
  "area": "viewer",
  "corner": "top-right",
  "opacity": 0.85,
  "width": 250,
  "height": 168
},
"toolMenu": [
  { "id": "show-overlay", "label": "Show Stopwatch", "icon": "icon.svg" }
]
```

| Key | Default | Meaning |
|---|---|---|
| `page` | required | HTML file in the plugin folder |
| `title` | plugin name | Title bar and chip text |
| `area` | `viewer` | `viewer`: over the toolpath view. `screen`: anywhere in the window |
| `corner` | `top-right` | Where it starts: `top-left`, `top-right`, `bottom-left`, `bottom-right` |
| `opacity` | `1` | `1` is solid. `0.5` is the most see-through allowed |
| `solidOnTouch` | `true` | A see-through panel turns solid while it is touched or dragged. `false` keeps it see-through |
| `width`, `height` | 250 × 160 | Size of the page in pixels. Framed: 180 to 320 wide, 60 to 260 tall. Frameless: 32 to 360 each way |
| `frame` | `true` | `false` for a [frameless panel](#frameless-panels) |
| `shape` | none | Frameless only: the panel's outline |

A `toolMenu` entry with the id `show-overlay` gives the operator a button on
the **Plugins** tab that brings the panel back after it was closed or hidden.
Add one.

### 2. The page

The panel page is loaded in its own frame, so its CSS and script cannot clash
with ncSender (unlike a [plugin page](ui.md#the-page-is-part-of-the-app-not-a-frame)).

- `__PLUGIN_ID__` and `__SERVER_PORT__` are replaced when the page is served.
- ncSender sets `data-theme="light"` or `"dark"` on the page's `<html>` and
  fills in its colour variables: `--color-bg`, `--color-surface`,
  `--color-surface-muted`, `--color-text-primary`, `--color-text-secondary`,
  `--color-border`, `--color-accent`, `--font-family`. Give them fallback
  values so the page also looks right on its own.
- The page talks to the plugin's script with
  `POST /api/plugins/__PLUGIN_ID__/request` → `onRequest(payload)`.
- The page keeps running while the panel is shrunk to a chip.

```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  :root { --color-surface: #fff; --color-text-primary: #1e2a32; --color-accent: #1abc9c; }
  :root[data-theme="dark"] { --color-surface: #1a222e; --color-text-primary: #e6ecf2; }
  html, body { height: 100%; margin: 0; }
  body { padding: 12px; background: var(--color-surface); color: var(--color-text-primary);
         font: 14px system-ui, sans-serif; }
</style>
</head>
<body>
  <div id="value">…</div>
<script>
  function refresh() {
    fetch('/api/plugins/__PLUGIN_ID__/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    }).then(function (r) { return r.json(); })
      .then(function (s) { document.getElementById('value').textContent = s.text; });
  }
  refresh();
  setInterval(refresh, 1000);
</script>
</body>
</html>
```

### 3. The script

```js
function buildInitialConfig(raw) { return raw || {}; }

var started = Date.now();

function onRequest(payload) {
  return { text: Math.floor((Date.now() - started) / 1000) + ' s' };
}

if (pluginContext.overlay) {
  pluginContext.setInterval(function () {
    // Shown beside the title while the panel is a chip
    pluginContext.overlay.set({ summary: Math.floor((Date.now() - started) / 1000) + ' s' });
  }, 1000);
}
```

The manifest needs `"commands": "commands.js"` and `"events": ["background"]`
for this script to load.

| Call | Effect |
|---|---|
| `pluginContext.overlay.set({ summary })` | Short text (60 characters at most) shown on the chip |
| `pluginContext.overlay.set({ opacity })` | See-through level, 0.5 to 1 |
| `pluginContext.overlay.set({ shape })` | Frameless outline, see below |
| `pluginContext.overlay.show()` | Shows the panel on every screen, even where the operator closed it. Use it sparingly, for example when a job starts |
| `pluginContext.overlay.hide()` | Hides it on every screen until `show()` or the Plugins tab button |

A panel does not need a script at all: a page that only shows data it fetches
itself works with just the manifest block.

## Frameless panels

With `"frame": false` ncSender draws nothing around the page: no title bar, no
border, no background. The page draws its own shape: a circle, a gauge, a
badge.

```json
"overlay": {
  "page": "overlay.html",
  "frame": false,
  "shape": "circle(50%)",
  "width": 168,
  "height": 168
}
```

- Make `html` and `body` transparent and draw your shape inside.
- **Set `shape` to the same outline.** The panel is clipped to it, and touches
  outside it go to ncSender underneath. Without `shape`, the whole
  `width` × `height` rectangle takes touches, including its empty corners.
- `shape` is one CSS basic shape: `circle(...)`, `ellipse(...)`,
  `polygon(...)`, `inset(... round ...)`, `rect(...)`, `xywh(...)` or
  `path('...')`. Anything else is ignored.
- The operator drags the panel by any part of the page that is not a
  `button`, `a`, `input`, `select`, `textarea` or `label`. Add the attribute
  `data-no-drag` to anything else that must not start a drag.
- There is no title bar, so offer your own close or shrink control:

    ```js
    parent.postMessage({ type: 'ncsender:overlay', action: 'close' }, '*');
    parent.postMessage({ type: 'ncsender:overlay', action: 'shrink' }, '*');
    ```

    `close` closes the panel on that screen; `shrink` turns it into a chip the
    operator can tap to reopen.

```html
<style>
  html, body { height: 100%; margin: 0; background: transparent; }
  .dial { width: 100%; height: 100%; border-radius: 50%; cursor: grab;
          background: var(--color-surface); border: 5px solid var(--color-accent);
          display: flex; align-items: center; justify-content: center; }
</style>
<div class="dial"><button id="close">×</button></div>
```

## Design rules

- Keep it small. The panel sits over a machine control screen; the operator
  must still reach the controls around it.
- Never rely on the panel being visible. The operator can close it or switch
  it off. Anything safety-related belongs in a prompt (`askGate`).
- Use the theme variables so the panel matches light and dark themes.
- On a kiosk everything is touch: make buttons at least 30 px tall.
