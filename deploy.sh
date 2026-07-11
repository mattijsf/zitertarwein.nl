#!/bin/sh
# Deploy naar Cloudflare Pages (project: zitertarwein).
# Wordt automatisch aangeroepen door de post-commit hook, of handmatig: ./deploy.sh
set -e
cd "$(dirname "$0")"

# Vite bouwt de site in dist/
pnpm install --frozen-lockfile
pnpm build

npx wrangler pages deploy dist --project-name zitertarwein --branch main --commit-dirty=true
