#!/bin/sh
# Deploy naar de Cloudflare Worker "zitertarwein" (daar hangt zitertarwein.nl aan).
# Wordt automatisch aangeroepen door de post-commit hook, of handmatig: ./deploy.sh
set -e
cd "$(dirname "$0")"

# Vite bouwt de site in dist/
pnpm install --frozen-lockfile
pnpm build

npx wrangler deploy
