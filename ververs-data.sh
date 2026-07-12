#!/bin/sh
# Ververs src/data/off-products.json vanuit de Open Food Facts bulk-export en commit bij
# wijzigingen (de post-commit hook deployt dan automatisch).
#
# Periodiek draaien kan met bijvoorbeeld deze crontab-regel (1e van de maand, 06:00):
#   0 6 1 * * /path/to/zitertarwein.nl/ververs-data.sh >> /tmp/zitertarwein-verversing.log 2>&1
set -e
cd "$(dirname "$0")"

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

echo "→ Bulk-export downloaden (± 8 GB)…"
curl -sL "https://huggingface.co/datasets/openfoodfacts/product-database/resolve/main/food.parquet" -o "$TMP/food.parquet"

echo "→ Importeren…"
python3 importeer_off.py "$TMP/food.parquet"

if git diff --quiet src/data/off-products.json; then
  echo "Geen wijzigingen in de productdata."
else
  git add src/data/off-products.json
  git commit -m "chore: verversing productdata uit Open Food Facts"
fi
