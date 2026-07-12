#!/bin/sh
# Refresh src/data/off-products.json from the Open Food Facts bulk export and commit when
# anything changed (the post-commit hook then deploys automatically).
#
# To run periodically, use a crontab entry like this (1st of the month, 06:00):
#   0 6 1 * * /path/to/zitertarwein.nl/refresh-data.sh >> /tmp/zitertarwein-refresh.log 2>&1
set -e
cd "$(dirname "$0")"

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

echo "→ Downloading bulk export (± 8 GB)…"
curl -sL "https://huggingface.co/datasets/openfoodfacts/product-database/resolve/main/food.parquet" -o "$TMP/food.parquet"

echo "→ Importing…"
python3 generate.py off="$TMP/food.parquet"

if git diff --quiet src/data/off-products.json; then
  echo "No changes in the product data."
else
  git add src/data/off-products.json
  git commit -m "chore: refresh product data from Open Food Facts"
fi
