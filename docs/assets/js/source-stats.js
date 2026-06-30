/*
 * Header repo-stats — fetch release tag, star count, and fork count
 * for each `[data-ncs-source]` entry and render them under the repo name.
 *
 * GitHub's unauthenticated API limit is 60/hour per IP, so we cache each
 * response in localStorage for an hour. Most visitors only ever hit the
 * docs site a handful of times in that window.
 */
(function () {
  var CACHE_TTL_MS = 60 * 60 * 1000;
  var CACHE_PREFIX = 'ncs-source-cache:';

  var ICONS = {
    tag:  '<svg class="ncs-source__stat-icon" viewBox="0 0 16 16" aria-hidden="true"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 0 1 .25-.25h5.025a.25.25 0 0 1 .177.073l6.25 6.25a.25.25 0 0 1 0 .354l-5.025 5.025a.25.25 0 0 1-.354 0l-6.25-6.25a.25.25 0 0 1-.073-.177Zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.75 1.75 0 0 1 1 7.775ZM6 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>',
    star: '<svg class="ncs-source__stat-icon" viewBox="0 0 16 16" aria-hidden="true"><path fill-rule="evenodd" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"/></svg>',
    fork: '<svg class="ncs-source__stat-icon" viewBox="0 0 16 16" aria-hidden="true"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878ZM11.25 3.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Zm-3 9.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/></svg>',
  };

  function cacheGet(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.ts !== 'number') return null;
      if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
      return parsed.data;
    } catch (_) { return null; }
  }

  function cacheSet(key, data) {
    try { localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: data })); } catch (_) {}
  }

  function fetchJson(url) {
    var key = CACHE_PREFIX + url;
    var hit = cacheGet(key);
    if (hit !== null) return Promise.resolve(hit);
    return fetch(url, { headers: { 'Accept': 'application/vnd.github+json' } })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) {
        if (data) cacheSet(key, data);
        return data;
      })
      .catch(function () { return null; });
  }

  function compact(n) {
    if (typeof n !== 'number') return '';
    if (n >= 10000) return (n / 1000).toFixed(0) + 'k';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
  }

  function renderStats(host, repoData, releaseData) {
    var parts = [];
    if (releaseData && releaseData.tag_name) {
      parts.push('<span class="ncs-source__stat">' + ICONS.tag + releaseData.tag_name + '</span>');
    }
    if (repoData && typeof repoData.stargazers_count === 'number') {
      parts.push('<span class="ncs-source__stat">' + ICONS.star + compact(repoData.stargazers_count) + '</span>');
    }
    if (repoData && typeof repoData.forks_count === 'number') {
      parts.push('<span class="ncs-source__stat">' + ICONS.fork + compact(repoData.forks_count) + '</span>');
    }
    host.innerHTML = parts.join('');
  }

  function hydrate(entry) {
    var host = entry.querySelector('[data-ncs-stats]');
    if (!host) return;
    var repo = entry.getAttribute('data-ncs-repo');
    var releases = entry.getAttribute('data-ncs-releases') || repo;
    Promise.all([
      fetchJson('https://api.github.com/repos/' + repo),
      fetchJson('https://api.github.com/repos/' + releases + '/releases/latest'),
    ]).then(function (results) {
      renderStats(host, results[0], results[1]);
    });
  }

  function init() {
    var entries = document.querySelectorAll('[data-ncs-source]');
    for (var i = 0; i < entries.length; i++) hydrate(entries[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
