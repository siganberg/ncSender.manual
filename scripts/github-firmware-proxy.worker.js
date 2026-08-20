/**
 * Cloudflare Worker — GitHub firmware asset CORS proxy for ncSender.manual.
 *
 * Why this exists: GitHub Release assets serve from
 * release-assets.githubusercontent.com, which sends no
 * Access-Control-Allow-Origin header. The browser-side flasher in
 * docs/utility/wireless-usb-flasher.md needs to fetch firmware bins
 * cross-origin, so we run a tiny transparent proxy in front of GitHub
 * that mirrors the bytes with CORS enabled.
 *
 * Usage from the manual:
 *   fetch('https://<your-worker>.workers.dev/?url=' + encodeURIComponent(dl))
 *
 * Security: only proxies GitHub release-asset download URLs. Any other
 * host returns 400. Cheap allow-list keeps this from becoming an open
 * relay if a URL leaks. Do NOT drop the allow-list — a public open
 * proxy will be abused within days.
 *
 * Deployment:
 *   1. https://dash.cloudflare.com/ → Workers & Pages → Create Worker
 *   2. Paste this file
 *   3. Deploy → note the *.workers.dev URL
 *   4. Set FIRMWARE_PROXY_URL in docs/utility/wireless-usb-flasher.md
 *      to that URL.
 */
export default {
  async fetch(request) {
    const cors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405, headers: cors });
    }

    const url = new URL(request.url);
    const target = url.searchParams.get('url');
    if (!target) {
      return new Response('Missing ?url=', { status: 400, headers: cors });
    }

    // Allow-list: only github.com release-asset downloads. Blocks
    // arbitrary hosts so this worker can't be turned into a general
    // proxy for exfiltration or abuse.
    let parsed;
    try { parsed = new URL(target); }
    catch { return new Response('Bad url', { status: 400, headers: cors }); }

    const okHost = parsed.host === 'github.com';
    const okPath = /^\/[^/]+\/[^/]+\/releases\/download\/[^/]+\/[^/]+\.bin$/.test(parsed.pathname);
    if (!okHost || !okPath) {
      return new Response('Only GitHub release .bin downloads are allowed', {
        status: 400,
        headers: cors,
      });
    }

    // Fetch upstream, follow the 302 to release-assets.githubusercontent.com,
    // and stream the body back with our CORS headers.
    const upstream = await fetch(target, { redirect: 'follow' });
    const headers = new Headers(cors);
    const ct = upstream.headers.get('content-type');
    const cl = upstream.headers.get('content-length');
    if (ct) headers.set('Content-Type', ct);
    if (cl) headers.set('Content-Length', cl);
    // Cache aggressively — firmware bins are immutable per release tag.
    headers.set('Cache-Control', 'public, max-age=86400, immutable');

    return new Response(upstream.body, { status: upstream.status, headers });
  },
};
