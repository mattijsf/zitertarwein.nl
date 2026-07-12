#!/usr/bin/env python3
"""Generate src/data/off-products.json from one or more data sources.

Usage:
  python3 generate.py off=food.parquet [csv=supermarket-export.csv ...] [--max 4000]

Sources (modules in sources/):
  off=<path>  Open Food Facts bulk export (parquet)
  csv=<path>  CSV/TSV export with columns naam/ingredienten[/merk/barcode/sporen]

For duplicate product names the source listed first on the command line
wins; products already covered by the hand-curated src/data/products.ts are always
skipped. Selection: the most popular products plus extra coverage per
risk category. src/data/off-products.json is only overwritten on a successful run.
"""
import json, os, re, sys

from sources import norm

PROJECT = os.path.dirname(os.path.abspath(__file__))

MAX_GLOBAL = 3000      # most popular products, regardless of category
MAX_PER_CATEGORY = 60  # extra coverage per risk category
DEFAULT_MAX = 4000

RISK_CATEGORIES = [
    "en:sauces", "en:soups", "en:biscuits", "en:cakes", "en:candies",
    "en:breakfast-cereals", "en:meat-alternatives", "en:meat-analogues",
    "en:snacks", "en:pizzas", "en:breads", "en:pastas", "en:chocolates",
    "en:ice-creams-and-sorbets", "en:beers", "en:prepared-meals",
    "en:desserts", "en:crisps", "en:noodles",
]

SOURCE_MODULES = {"off": "off_parquet", "csv": "csv_export"}


def curated_names():
    src = open(os.path.join(PROJECT, "src", "data", "products.ts"), encoding="utf-8").read()
    names = set(norm(m) for m in re.findall(r'n: "([^"]+)"', src))
    for aliases in re.findall(r'a: \[([^\]]*)\]', src):
        names.update(norm(m) for m in re.findall(r'"([^"]+)"', aliases))
    return names


def main():
    args = sys.argv[1:]
    maximum = DEFAULT_MAX
    if "--max" in args:
        i = args.index("--max")
        maximum = int(args[i + 1])
        del args[i:i + 2]
    if not args:
        sys.exit(__doc__)

    # Read the sources in the given order (first source wins on duplicate
    # names). Sources with ALWAYS_INCLUDE (such as a CSV export) are taken
    # in full; the rest competes in the popularity selection.
    curated = curated_names()
    mandatory, candidates, seen = [], [], set()
    for arg in args:
        if "=" not in arg or arg.split("=", 1)[0] not in SOURCE_MODULES:
            sys.exit(f"unknown source: {arg}\n\n{__doc__}")
        kind, path = arg.split("=", 1)
        module = __import__(f"sources.{SOURCE_MODULES[kind]}", fromlist=["read"])
        products = module.read(path)
        print(f"source {kind} ({os.path.basename(path)}): {len(products)} products")
        target = mandatory if getattr(module, "ALWAYS_INCLUDE", False) else candidates
        for p in products:
            key = norm(p["n"])
            if key in curated or key in seen:
                continue
            seen.add(key)
            target.append(p)

    # Mandatory sources first, then the most popular products…
    selected, chosen = list(mandatory), set(id(p) for p in mandatory)
    for p in candidates[:MAX_GLOBAL]:
        selected.append(p)
        chosen.add(id(p))
    # …plus targeted coverage per risk category.
    for category in RISK_CATEGORIES:
        count = 0
        for p in candidates:
            if count >= MAX_PER_CATEGORY or len(selected) >= maximum:
                break
            if id(p) in chosen or category not in p["cats"]:
                continue
            selected.append(p)
            chosen.add(id(p))
            count += 1
    selected = selected[:maximum]

    if len(selected) < 100:
        sys.exit(f"only {len(selected)} products — off-products.json NOT overwritten")

    # Supermarket products with label data, mainly from Open Food Facts (https://nl.openfoodfacts.org/,
    # ODbL licence). JSON has no comments: one product per line, do not edit by hand.
    lines = []
    for p in selected:
        bare = {k: v for k, v in p.items() if k not in ("cats", "scans")}
        lines.append("  " + json.dumps(bare, ensure_ascii=False))
    with open(os.path.join(PROJECT, "src", "data", "off-products.json"), "w", encoding="utf-8") as f:
        f.write("[\n" + ",\n".join(lines) + "\n]\n")

    tally = {}
    for p in selected:
        tally[p["s"]] = tally.get(p["s"], 0) + 1
    print(f"done: {len(selected)} products written to src/data/off-products.json")
    print("breakdown:", tally, "| traces-only:", sum(1 for p in selected if p.get("sp")))


main()
