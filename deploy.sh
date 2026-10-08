#!/bin/sh
# Deploy to the Cloudflare Worker "zitertarwein" (zitertarwein.nl points at it).
# Invoked automatically by the post-commit hook, or manually: ./deploy.sh
set -e
cd "$(dirname "$0")"

# Vite builds the site into dist/ and copies public/ along with it (icons, favicon,
# manifest, sw.js, _headers, the wheat plate), then scripts/build-seo.ts adds
# the SEO pages: static product pages under /p/, sitemap.xml and robots.txt
pnpm install --frozen-lockfile
pnpm build

npx wrangler deploy
