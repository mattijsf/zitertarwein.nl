"""Source: a CSV/TSV export with product data, for example from a
supermarket or supplier.

Expected columns (header row, case-insensitive; the delimiter is detected
automatically). Dutch column names, matching the exports this site works
with:

  naam         — product name (required)
  ingredienten — ingredient list as printed on the label (required)
  merk         — brand name (optional)
  barcode      — EAN (optional; enables a link to Open Food Facts)
  sporen       — traces/allergen statement, e.g. "kan tarwe bevatten" (optional)

Products from a CSV source take precedence over Open Food Facts data for
duplicate names (see generate.py).
"""
import csv

from . import make_product

# A CSV export is hand-delivered: include everything, regardless of popularity.
ALWAYS_INCLUDE = True


def read(path):
    out = []
    with open(path, newline="", encoding="utf-8-sig") as f:
        sample = f.read(4096)
        f.seek(0)
        dialect = csv.Sniffer().sniff(sample, delimiters=",;\t")
        for row in csv.DictReader(f, dialect=dialect):
            row = {k.strip().lower(): (v or "").strip() for k, v in row.items() if k}
            p = make_product(
                row.get("naam"),
                row.get("merk"),
                row.get("barcode"),
                row.get("ingredienten"),
                trace_tags=[row["sporen"]] if row.get("sporen") else None,
            )
            if p:
                out.append(p)
    return out
