#!/bin/sh
# Deploy to the Cloudflare Worker "zitertarwein" (zitertarwein.nl points at it).
# Invoked automatically by the post-commit hook, or manually: ./deploy.sh
set -e
cd "$(dirname "$0")"

# Vite builds the site into dist/
pnpm install --frozen-lockfile
pnpm build

npx wrangler deploy
