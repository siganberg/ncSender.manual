/*
 * Pro badge — tag nav entries for features that are ncSender Pro only.
 *
 * The left-hand navigation is static across every page, so we decorate the
 * links client-side. To mark a new page as Pro, add its doc path (without the
 * `.md` extension) to PRO_PAGES below — it matches the same slug MkDocs uses
 * in the URL, e.g. `features/laser-mode.md` -> `features/laser-mode`.
 */
(function () {
  var PRO_PAGES = [
    'getting-started/license-activation',
    'features/laser-mode',
    'features/4th-axis',
    'features/multi-workspace',
    'features/trace',
    'features/safety-door',
    'features/virtual-keyboard',
    'plugins/rapid-change-atc',
  ];

  // Tab labels (inside Material `=== "…"` blocks) whose entire tab is Pro-only.
  // Match is case-insensitive against the trimmed label text.
  var PRO_TAB_LABELS = [
    'Raspberry Pi 5',
  ];

  function slugFromHref(href) {
    try {
      // Nav hrefs are relative (e.g. `../laser-mode/`) — resolve against the
      // current page URL, then normalise to a pathname without slashes.
      var path = new URL(href, window.location.href).pathname;
      return path.replace(/^\/+|\/+$/g, '');
    } catch (_) {
      return '';
    }
  }

  function isProSlug(slug) {
    for (var i = 0; i < PRO_PAGES.length; i++) {
      var p = PRO_PAGES[i];
      // MkDocs renders `features/laser-mode.md` as `.../features/laser-mode/`.
      if (slug === p || slug.endsWith('/' + p) || slug.endsWith(p)) return true;
    }
    return false;
  }

  function badge() {
    var span = document.createElement('span');
    span.className = 'ncs-pro-badge';
    span.textContent = 'Pro';
    span.setAttribute('title', 'Available in ncSender Pro');
    return span;
  }

  function decorate() {
    var links = document.querySelectorAll('.md-nav__link[href]');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.querySelector('.ncs-pro-badge')) continue;
      if (isProSlug(slugFromHref(link.getAttribute('href')))) {
        link.classList.add('ncs-pro-link');
        link.appendChild(badge());
      }
    }

    var proTabsLower = PRO_TAB_LABELS.map(function (s) { return s.toLowerCase(); });
    var tabLabels = document.querySelectorAll('.tabbed-set > label, .tabbed-labels > label');
    for (var j = 0; j < tabLabels.length; j++) {
      var lbl = tabLabels[j];
      if (lbl.querySelector('.ncs-pro-badge')) continue;
      var text = (lbl.textContent || '').trim().toLowerCase();
      if (proTabsLower.indexOf(text) !== -1) {
        lbl.classList.add('ncs-pro-link');
        lbl.appendChild(badge());
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decorate);
  } else {
    decorate();
  }
})();
