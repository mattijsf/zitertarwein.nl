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
  :root { --paper:#ffffff; --ink:#000000; --ink-soft:#7c7c7c;
    --rule-soft:#d5d5d5; --wash:#f2f2f0; --alert:#e2001a; }
  * { margin:0; padding:0; box-sizing:border-box; }
  html { background:var(--wash); }
  body { background:var(--paper); color:var(--ink);
    font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size:13px; line-height:1.5;
    border:2px solid var(--ink); margin:10px auto; max-width:700px;
    min-height:calc(100vh - 20px); padding:16px 18px 22px; }
  .runhead { display:flex; justify-content:space-between; font-size:9.5px;
    font-weight:700; letter-spacing:.2em; text-transform:uppercase; }
  .runhead .reg { color:var(--ink-soft); }
  .rule { border-top:2px solid var(--ink); margin:10px 0 16px; }
  h1 { font-size:1.7rem; font-weight:700; letter-spacing:-.025em; line-height:1.05; }
  .verdict { margin-top:12px; padding:11px 14px; background:var(--ink); color:var(--paper);
    font-size:1.35rem; font-weight:700; letter-spacing:-.02em; }
  .yes .verdict { background:var(--alert); }
  .no .verdict { background:var(--paper); color:var(--ink); border:2px solid var(--ink); padding:9px 12px; }
  p { margin-top:12px; font-size:13.5px; }
  .source { margin-top:14px; padding-top:10px; border-top:1px solid var(--rule-soft);
    font-size:11.5px; color:var(--ink-soft); }
  a { color:var(--ink); }
  .app-link { display:inline-block; margin-top:16px; border:2px solid var(--ink);
    color:var(--ink); text-decoration:none; padding:10px 14px;
    font-size:9.5px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; }
  .app-link:hover { background:var(--ink); color:var(--paper); }
  footer { margin-top:22px; padding-top:12px; border-top:1px solid var(--rule-soft);
    font-size:10.5px; color:var(--ink-soft); }
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
<div class="runhead"><span>Zitertarwein.nl</span><span class="reg">NL · EU 1169/2011</span></div>
<div class="rule"></div>
<h1>Zit er tarwe in ${escapeHtml(it.name)}?</h1>
<div class="verdict">${VERDICT[it.s]}</div>
<p>${escapeHtml(it.info)}</p>
<p class="source">Bron: <a href="${escapeHtml(it.sourceUrl)}" rel="noopener">${escapeHtml(it.sourceName)}</a></p>
<a class="app-link" href="/?p=${encodeURIComponent(it.appQuery)}">Zoek zelf een product →</a>
</main>`
  writeFileSync(path.join(pDir, slug + ".html"), page(title, description, "/p/" + slug, body))
}

// ── A-Z index page ──
const sorted = [...bySlug.entries()].sort((a, b) => a[1].name.localeCompare(b[1].name, "nl"))
const links = sorted
  .map(([slug, it]) => `<li><a href="/p/${slug}">${escapeHtml(it.name)}</a></li>`)
  .join("\n")
const indexBody = `<main>
<div class="runhead"><span>Zitertarwein.nl</span><span class="reg">NL · EU 1169/2011</span></div>
<div class="rule"></div>
<h1>Alle producten — zit er tarwe in?</h1>
<p>${bySlug.size} producten. Kies een product of <a href="/">zoek direct</a>.</p>
<ul style="columns:2;list-style:none;font-size:.95rem">${links}</ul>
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
