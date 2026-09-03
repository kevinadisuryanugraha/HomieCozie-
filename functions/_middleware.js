/*
 * Cloudflare Pages - Edge Middleware
 * 1. Serve static files directly (robots.txt, sitemap.xml, llms.txt, photos, assets)
 * 2. Fallback to index.html only for unmatched routes (SPA client-side routing)
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Try fetching the exact static asset first from Cloudflare ASSETS binding
  const assetResponse = await env.ASSETS.fetch(request);
  if (assetResponse.status !== 404) {
    return assetResponse;
  }

  // If asset not found and it is not a file with extension, serve SPA index.html
  if (!url.pathname.includes('.')) {
    return env.ASSETS.fetch(new Request(new URL('/index.html', url.origin)));
  }

  return assetResponse;
}
