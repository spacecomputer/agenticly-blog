/**
 * Cloudflare Worker: serve the GitHub Pages Jekyll blog at agenticly.app/blog.
 *
 * Public URL:  https://agenticly.app/blog/...        (PUBLIC_PREFIX = "/blog")
 * Origin URL:  https://spacecomputer.github.io/agenticly-blog/...
 *                                                    (ORIGIN_PREFIX = "/agenticly-blog")
 *
 * Jekyll is configured with `baseurl: "/blog"`, so all generated links and
 * assets already point at "/blog/...". This Worker only has to swap the path
 * prefix when fetching the origin (and fix up any redirect Location headers
 * GitHub Pages emits back to its github.io host).
 */

const ORIGIN_HOST = "https://spacecomputer.github.io";
const ORIGIN_PREFIX = "/agenticly-blog";
const PUBLIC_PREFIX = "/blog";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Only the /blog subtree is ours; anything else 404s (it shouldn't route here).
    if (path !== PUBLIC_PREFIX && !path.startsWith(PUBLIC_PREFIX + "/")) {
      return new Response("Not found", { status: 404 });
    }

    // Normalize the bare "/blog" to "/blog/" so relative links resolve.
    if (path === PUBLIC_PREFIX) {
      return Response.redirect(url.origin + PUBLIC_PREFIX + "/" + url.search, 301);
    }

    // Map the public prefix to the GitHub Pages project path.
    const rest = path.slice(PUBLIC_PREFIX.length); // keeps its leading "/"
    const originUrl = ORIGIN_HOST + ORIGIN_PREFIX + rest + url.search;

    // Forward the request, letting Cloudflare cache static assets at the edge.
    const originReq = new Request(originUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: "manual",
    });

    const resp = await fetch(originReq, {
      cf: { cacheEverything: true, cacheTtl: 300 },
    });

    // Rewrite any redirect that points back at the github.io origin so the
    // visitor stays on agenticly.app/blog.
    const location = resp.headers.get("Location");
    if (location) {
      const rewritten = rewriteLocation(location, url.origin);
      if (rewritten !== location) {
        const headers = new Headers(resp.headers);
        headers.set("Location", rewritten);
        return new Response(resp.body, {
          status: resp.status,
          statusText: resp.statusText,
          headers,
        });
      }
    }

    return resp;
  },
};

function rewriteLocation(location, publicOrigin) {
  try {
    const loc = new URL(location, ORIGIN_HOST);
    if (
      loc.origin === ORIGIN_HOST &&
      (loc.pathname === ORIGIN_PREFIX || loc.pathname.startsWith(ORIGIN_PREFIX + "/"))
    ) {
      const rest = loc.pathname.slice(ORIGIN_PREFIX.length);
      return publicOrigin + PUBLIC_PREFIX + rest + loc.search + loc.hash;
    }
  } catch (_) {
    // Non-absolute or unparseable Location — leave it untouched.
  }
  return location;
}
