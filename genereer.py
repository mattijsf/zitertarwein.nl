#!/usr/bin/env python3
"""Genereer src/data/off-products.json uit één of meer databronnen.

Gebruik:
  python3 genereer.py off=food.parquet [csv=supermarkt-export.csv ...] [--max 4000]

Bronnen (modules in bronnen/):
  off=<pad>   Open Food Facts bulk-export (parquet)
  csv=<pad>   CSV/TSV-export met kolommen naam/ingredienten[/merk/barcode/sporen]

Bij dubbele productnamen wint de bron die het eerst op de commandoregel
staat; producten uit de handgemaakte src/data/products.ts worden altijd overgeslagen.
Selectie: de populairste producten plus extra dekking per risico-categorie.
src/data/off-products.json wordt alleen overschreven bij een geslaagde run.
"""
import json, os, re, sys

from bronnen import norm

PROJECT = os.path.dirname(os.path.abspath(__file__))

MAX_GLOBAAL = 3000      # populairste producten, ongeacht categorie
MAX_PER_CATEGORIE = 60  # extra dekking per risico-categorie
STANDAARD_MAX = 4000

RISICO_CATEGORIEEN = [
    "en:sauces", "en:soups", "en:biscuits", "en:cakes", "en:candies",
    "en:breakfast-cereals", "en:meat-alternatives", "en:meat-analogues",
    "en:snacks", "en:pizzas", "en:breads", "en:pastas", "en:chocolates",
    "en:ice-creams-and-sorbets", "en:beers", "en:prepared-meals",
    "en:desserts", "en:crisps", "en:noodles",
]

BRON_MODULES = {"off": "off_parquet", "csv": "csv_export"}


def bestaande_namen():
    src = open(os.path.join(PROJECT, "src", "data", "products.ts"), encoding="utf-8").read()
    namen = set(norm(m) for m in re.findall(r'n: "([^"]+)"', src))
    for aliassen in re.findall(r'a: \[([^\]]*)\]', src):
        namen.update(norm(m) for m in re.findall(r'"([^"]+)"', aliassen))
    return namen


def main():
    argumenten = sys.argv[1:]
    maximum = STANDAARD_MAX
    if "--max" in argumenten:
        i = argumenten.index("--max")
        maximum = int(argumenten[i + 1])
        del argumenten[i:i + 2]
    if not argumenten:
        sys.exit(__doc__)

    # Bronnen inlezen, in opgegeven volgorde (eerste bron wint bij dubbele namen).
    # Bronnen met ALTIJD_OPNEMEN (zoals een CSV-export) gaan integraal mee;
    # de rest doet mee in de populariteitsselectie.
    bekend = bestaande_namen()
    verplicht, kandidaten, gezien = [], [], set()
    for arg in argumenten:
        if "=" not in arg or arg.split("=", 1)[0] not in BRON_MODULES:
            sys.exit(f"onbekende bron: {arg}\n\n{__doc__}")
        soort, pad = arg.split("=", 1)
        module = __import__(f"bronnen.{BRON_MODULES[soort]}", fromlist=["lees"])
        producten = module.lees(pad)
        print(f"bron {soort} ({os.path.basename(pad)}): {len(producten)} producten")
        doel = verplicht if getattr(module, "ALTIJD_OPNEMEN", False) else kandidaten
        for p in producten:
            sleutel = norm(p["n"])
            if sleutel in bekend or sleutel in gezien:
                continue
            gezien.add(sleutel)
            doel.append(p)

    # Verplichte bronnen eerst, dan de populairste producten…
    geselecteerd, codes = list(verplicht), set(id(p) for p in verplicht)
    for p in kandidaten[:MAX_GLOBAAL]:
        geselecteerd.append(p)
        codes.add(id(p))
    # …plus gerichte dekking per risico-categorie.
    for categorie in RISICO_CATEGORIEEN:
        teller = 0
        for p in kandidaten:
            if teller >= MAX_PER_CATEGORIE or len(geselecteerd) >= maximum:
                break
            if id(p) in codes or categorie not in p["cats"]:
                continue
            geselecteerd.append(p)
            codes.add(id(p))
            teller += 1
    geselecteerd = geselecteerd[:maximum]

    if len(geselecteerd) < 100:
        sys.exit(f"maar {len(geselecteerd)} producten — off-products.json NIET overschreven")

    # Supermarktproducten met etiketdata, o.a. uit Open Food Facts (https://nl.openfoodfacts.org/,
    # licentie ODbL). JSON kent geen commentaar: één product per regel, niet met de hand bewerken.
    regels = []
    for p in geselecteerd:
        kaal = {k: v for k, v in p.items() if k not in ("cats", "scans")}
        regels.append("  " + json.dumps(kaal, ensure_ascii=False))
    with open(os.path.join(PROJECT, "src", "data", "off-products.json"), "w", encoding="utf-8") as f:
        f.write("[\n" + ",\n".join(regels) + "\n]\n")

    telling = {}
    for p in geselecteerd:
        telling[p["s"]] = telling.get(p["s"], 0) + 1
    print(f"klaar: {len(geselecteerd)} producten naar src/data/off-products.json")
    print("verdeling:", telling, "| waarvan alleen-sporen:", sum(1 for p in geselecteerd if p.get("sp")))


main()
