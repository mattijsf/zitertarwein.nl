// Redirects http:// to https:// (301) before serving the static assets.
// Without this, http URLs return 200 and search engines index every page
// twice. Requires "run_worker_first": true in wrangler.jsonc, otherwise
// asset requests never reach this code.
export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.protocol === "http:") {
      url.protocol = "https:"
      return Response.redirect(url.toString(), 301)
    }
    return env.ASSETS.fetch(request)
  },
}
