/**
 * Generates static SEO pages: one small HTML page per product under /p/, plus an A-Z index page,
 * sitemap.xml and robots.txt. Runs after `vite build`:
 *
 *   node scripts/build-seo.ts dist
 *
 * The pages exist so search engines can answer "zit er tarwe in <product>" directly; each page
 * links through to the app (/?p=<name>) for the full experience. Verdict and info texts come from
 * the same data and helpers as the app.
 */
import { mkdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import offEntries from "../src/data/off-products.json" with { type: "json" }
import { PRODUCTS } from "../src/data/products.ts"
import { SOURCES } from "../src/data/sources.ts"
import { capitalize } from "../src/lib/capitalize.ts"
import { offToProduct } from "../src/lib/offToProduct.ts"
import { VERDICT } from "../src/lib/verdict.ts"
import type { Verdict } from "../src/types/product.ts"

const OUT = process.argv[2] ?? "dist"
const SITE = "https://zitertarwein.nl"

interface Item {
  name: string
  s: Verdict
  info: string
  sourceName: string
  sourceUrl: string
  appQuery: string
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

// ── Collect all products (curated first: they win on duplicate slugs) ──
const offProducts = offEntries.flatMap(entry => offToProduct(entry) ?? [])
const items: Item[] = [...PRODUCTS, ...offProducts].map(p => ({
  name: capitalize(p.n),
  s: p.s,
  info: p.i,
  sourceName: p.url ? "Open Food Facts — etiket van dit product" : SOURCES[p.b].name,
  sourceUrl: p.url ?? SOURCES[p.b].url,
  appQuery: p.n,
}))

const bySlug = new Map<string, Item>()
for (const it of items) {
  const slug = slugify(it.name)
  if (!slug || bySlug.has(slug)) {
    continue // first (curated) wins
  }
  bySlug.set(slug, it)
}

// ── Shared page chrome ──
const CSS = `
  :root { --cream:#f3f0e6; --paper:#ffffff; --ink:#16130f; --ink-soft:#6f6759; --line:#e2dccb;
    --serif:"Fraunces","Iowan Old Style",Georgia,serif;
    --stamp-red:#c8102e; --stamp-green:#1d7a3a; --stamp-amber:#b8860b; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--cream); color:var(--ink);
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    line-height:1.5; display:flex; flex-direction:column; align-items:center;
    min-height:100vh; padding:28px 20px; }
  main { max-width:560px; width:100%; }
  .plaat { display:block; width:150px; height:auto; margin:0 0 6px auto; }
  h1 { font-family:var(--serif); font-variation-settings:"opsz" 144,"SOFT" 40; font-weight:600;
    font-size:2.2rem; line-height:1.02; letter-spacing:-.02em; margin-bottom:18px; }
  h1 em { font-style:italic; font-weight:400; }
  .card { background:var(--paper); border:1.5px solid var(--ink); border-radius:6px; padding:20px; }
  .verdict { display:inline-block; font-family:var(--serif); font-variation-settings:"opsz" 48,"SOFT" 20;
    font-size:1.6rem; font-weight:700; line-height:1; color:#fff; background:var(--ink);
    padding:7px 14px 8px; transform:rotate(-3deg); transform-origin:left center; margin:2px 0 16px 2px;
    box-shadow:0 2px 0 rgba(0,0,0,.25); }
  .yes .verdict { background:var(--stamp-red); }
  .no .verdict { background:var(--stamp-green); }
  .check .verdict { background:var(--stamp-amber); }
  .name { font-family:var(--serif); font-variation-settings:"opsz" 48,"SOFT" 20; font-size:1.4rem; font-weight:600; line-height:1.15; }
  p { margin-top:10px; font-size:15.5px; }
  .source { margin-top:14px; padding-top:10px; border-top:1px solid var(--line); font-size:13.5px; color:var(--ink-soft); }
  a { color:var(--ink); }
  .app-link { display:inline-block; margin-top:16px; background:var(--ink); color:var(--cream);
    text-decoration:none; padding:11px 18px; border-radius:3px; font-weight:700; font-size:15px; }
  .index ul { columns:2; list-style:none; font-size:.95rem; margin-top:12px; }
  footer { margin-top:22px; font-size:.85rem; color:var(--ink-soft); text-align:center; max-width:560px; }
  footer a { color:var(--ink-soft); }
`.replace(/\n\s*/g, "")

function page(title: string, description: string, canonicalPath: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${SITE}${canonicalPath}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta property="og:locale" content="nl_NL">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.png">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..700,0..100;1,9..144,400..700,0..100&display=swap">
<style>${CSS}</style>
</head>
<body>
${body}
<footer>Algemene informatie, geen medisch advies. Tarwevrij is niet hetzelfde als glutenvrij.<br>
<a href="/">zitertarwein.nl</a> · <a href="/p/">alle producten</a></footer>
</body>
</html>
`
}

// ── Product pages ──
const pDir = path.join(OUT, "p")
mkdirSync(pDir, { recursive: true })

for (const [slug, it] of bySlug) {
  const title = `Zit er tarwe in ${it.name}? — ${VERDICT[it.s]}`
  const description = `Zit er tarwe in ${it.name}? ${VERDICT[it.s]} ${it.info}`.slice(0, 300)
  const body = `<main class="${it.s}">
<img class="plaat" src="/plaat-tarwe.webp" alt="" width="560" height="789">
<h1>Zit er <em>tarwe</em> in ${escapeHtml(it.name)}?</h1>
<div class="card">
<div class="verdict">${VERDICT[it.s]}</div>
<div class="name">${escapeHtml(it.name)}</div>
<p>${escapeHtml(it.info)}</p>
<p class="source">Bron: <a href="${escapeHtml(it.sourceUrl)}" rel="noopener">${escapeHtml(it.sourceName)}</a></p>
</div>
<a class="app-link" href="/?p=${encodeURIComponent(it.appQuery)}">Zoek zelf een product →</a>
</main>`
  writeFileSync(path.join(pDir, slug + ".html"), page(title, description, "/p/" + slug, body))
}

// ── A-Z index page ──
const sorted = [...bySlug.entries()].sort((a, b) => a[1].name.localeCompare(b[1].name, "nl"))
const links = sorted
  .map(([slug, it]) => `<li><a href="/p/${slug}">${escapeHtml(it.name)}</a></li>`)
  .join("\n")
const indexBody = `<main class="index">
<img class="plaat" src="/plaat-tarwe.webp" alt="" width="560" height="789">
<h1>Alle producten — zit er <em>tarwe</em> in?</h1>
<p>${bySlug.size} producten. Kies een product of <a href="/">zoek direct</a>.</p>
<ul>${links}</ul>
</main>`
writeFileSync(
  path.join(pDir, "index.html"),
  page(
    "Alle producten — Zit er tarwe in?",
    `Bekijk van ${bySlug.size} producten of er tarwe in zit, met bron.`,
    "/p/",
    indexBody
  )
)

// ── sitemap.xml + robots.txt ──
const urls = [SITE + "/", SITE + "/p/", ...sorted.map(([slug]) => `${SITE}/p/${slug}`)]
writeFileSync(
  path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url><loc>${u}</loc></url>`).join("\n") +
    "\n</urlset>\n"
)
writeFileSync(
  path.join(OUT, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`
)

console.log(`SEO: ${bySlug.size} product pages, index, sitemap.xml, robots.txt → ${OUT}/`)
