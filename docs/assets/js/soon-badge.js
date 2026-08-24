/*
 * "Coming soon" badge — tag pages for products that aren't shipping yet.
 *
 * For every page listed in SOON_PAGES, we append a small orange "SOON" pill
 * to:
 *   • the entry in the left-hand navigation (both the desktop sidebar and
 *     the mobile drawer render from the same .md-nav__link elements)
 *   • the page's H1 (so someone landing directly on the page can see it
 *     without opening the sidebar)
 *
 * To flag inline text (e.g. a paragraph mentioning a coming-soon version),
 * just drop <sup class="ncs-soon-badge">Coming soon</sup> in the Markdown
 * directly — this script only handles the nav + H1 auto-decoration.
 */
(function () {
  var SOON_PAGES = [
    'accessories/smart-rgb-led',
  ];

  function slugFromHref(href) {
    try {
      var path = new URL(href, window.location.href).pathname;
      return path.replace(/^\/+|\/+$/g, '');
    } catch (_) {
      return '';
    }
  }

  function isSoonSlug(slug) {
    for (var i = 0; i < SOON_PAGES.length; i++) {
      var p = SOON_PAGES[i];
      if (slug === p || slug.endsWith('/' + p) || slug.endsWith(p)) return true;
    }
    return false;
  }

  function badge() {
    var span = document.createElement('span');
    span.className = 'ncs-soon-badge';
    span.textContent = 'Soon';
    span.setAttribute('title', 'Coming soon');
    return span;
  }

  function currentSlug() {
    return window.location.pathname.replace(/^\/+|\/+$/g, '');
  }

  function decorate() {
    // Sidebar / mobile drawer nav
    var links = document.querySelectorAll('.md-nav__link[href]');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      if (link.querySelector('.ncs-soon-badge')) continue;
      if (isSoonSlug(slugFromHref(link.getAttribute('href')))) {
        link.classList.add('ncs-soon-link');
        link.appendChild(badge());
      }
    }

    // Content-area H1 on soon pages
    if (isSoonSlug(currentSlug())) {
      var h1 = document.querySelector('.md-content h1');
      if (h1 && !h1.querySelector('.ncs-soon-badge')) {
        h1.appendChild(badge());
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decorate);
  } else {
    decorate();
  }
})();
