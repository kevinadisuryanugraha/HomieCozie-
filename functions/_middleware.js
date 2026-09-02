/*
 * Cloudflare Pages - SPA Routing Fix
 * Semua request yang tidak cocok dengan file statis akan di-redirect ke index.html
 * Ini diperlukan karena Homie Cozie menggunakan Hash Router (#-based routing)
 */

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // Coba serve file statis (JS, CSS, gambar, dll) dulu
  try {
    return await next();
  } catch (e) {
    // Jika file tidak ditemukan, serve index.html untuk SPA routing
    return env.ASSETS.fetch(new Request(new URL("/index.html", url.origin)));
  }
}
