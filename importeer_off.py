#!/usr/bin/env python3
"""Genereer src/data/off-products.json uit de Open Food Facts bulk-export (food.parquet).

Gebruik:
  python3 importeer_off.py [pad/naar/food.parquet]

De export (± 8 GB, licentie ODbL) is te downloaden met:
  curl -L https://huggingface.co/datasets/openfoodfacts/product-database/resolve/main/food.parquet -o food.parquet

Selectie: de populairste Nederlandse producten mét ingrediëntinformatie,
aangevuld met de top per risico-categorie (sauzen, soepen, koek, snoep, …).
Tarwe-analyse gebruikt zowel de gestructureerde ingrediënt-tags als de
ingrediëntentekst; sporen en gluten-zonder-tarwe worden apart gemarkeerd.
"""
import json, os, re, sys, unicodedata

import duckdb

PROJECT = os.path.dirname(os.path.abspath(__file__))
PARQUET = sys.argv[1] if len(sys.argv) > 1 else os.path.join(PROJECT, "food.parquet")

TARWE_TEKST_RE = re.compile(
    r"[\w-]*(?:tarwe|wheat|weizen|bl[eé]\b|froment|durum|semol|spelt|khorasan|kamut|seitan|bulgur|couscous)[\w-]*",
    re.I,
)
TARWE_TAG_RE = re.compile(r"wheat|spelt|khorasan|triticum|seitan", re.I)
GLUTEN_RE = re.compile(r"gluten", re.I)
GLUTENVRIJ_RE = re.compile(r"glutenvrij|gluten[ -]?free|sans gluten|glutenfrei", re.I)

MAX_GLOBAAL = 3000     # populairste producten, ongeacht categorie
MAX_PER_CATEGORIE = 60 # extra dekking per risico-categorie
MAX_TOTAAL = 4000

RISICO_CATEGORIEEN = [
    "en:sauces", "en:soups", "en:biscuits", "en:cakes", "en:candies",
    "en:breakfast-cereals", "en:meat-alternatives", "en:meat-analogues",
    "en:snacks", "en:pizzas", "en:breads", "en:pastas", "en:chocolates",
    "en:ice-creams-and-sorbets", "en:beers", "en:prepared-meals",
    "en:desserts", "en:crisps", "en:noodles",
]


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if not unicodedata.combining(c)).strip()


def bestaande_namen():
    src = open(os.path.join(PROJECT, "src", "data", "products.ts"), encoding="utf-8").read()
    namen = set(norm(m) for m in re.findall(r'n: "([^"]+)"', src))
    for aliassen in re.findall(r'a: \[([^\]]*)\]', src):
        namen.update(norm(m) for m in re.findall(r'"([^"]+)"', aliassen))
    return namen


def laad_producten():
    con = duckdb.connect()
    query = """
        SELECT
          code,
          coalesce(
            list_filter(product_name, x -> x.lang = 'nl')[1].text,
            list_filter(product_name, x -> x.lang = 'main')[1].text
          ) AS naam,
          brands,
          coalesce(
            list_filter(ingredients_text, x -> x.lang = 'nl')[1].text,
            list_filter(ingredients_text, x -> x.lang = 'main')[1].text
          ) AS ingredienten,
          list_transform(ingredients_tags, x -> x)   AS ingr_tags,
          list_transform(allergens_tags, x -> x)     AS allerg_tags,
          list_transform(traces_tags, x -> x)        AS sporen_tags,
          list_transform(categories_tags, x -> x)    AS cat_tags,
          list_transform(labels_tags, x -> x)        AS label_tags,
          coalesce(unique_scans_n, 0)                AS scans
        FROM read_parquet(?)
        WHERE list_contains(countries_tags, 'en:netherlands')
          AND (len(ingredients_tags) > 0 OR len(ingredients_text) > 0)
        ORDER BY scans DESC
    """
    return con.execute(query, [PARQUET]).fetchall()


def analyseer(ingredienten, ingr_tags, allerg_tags, sporen_tags, label_tags):
    """Geeft (status, sporen_vlag, bewijswoord, glutenvrij_claim)."""
    tekst = ingredienten or ""
    ingr = " ".join(ingr_tags or [])
    allerg = " ".join(allerg_tags or [])
    sporen = " ".join(sporen_tags or [])
    labels = " ".join(label_tags or [])

    tekst_match = TARWE_TEKST_RE.search(tekst)
    tag_match = TARWE_TAG_RE.search(ingr) or TARWE_TAG_RE.search(allerg)
    glutenvrij = bool(re.search(r"en:no-gluten|en:gluten-free", labels)) or bool(GLUTENVRIJ_RE.search(tekst))

    if tekst_match or tag_match:
        woord = tekst_match.group(0).strip("-") if tekst_match else tag_match.group(0)
        if glutenvrij:
            # Bijv. "tarwezetmeel (glutenvrij)": vrijwel eiwitvrij, maar bij
            # tarweallergie tóch relevant. Eigen uitleg in de frontend.
            return "check", 0, woord, 1
        return "yes", 0, woord, 0
    if GLUTEN_RE.search(allerg) and not glutenvrij:
        return "check", 0, "", 0  # gluten als ingrediënt (bijv. rogge/gerst), geen duidelijke tarwe
    if GLUTEN_RE.search(sporen) or TARWE_TAG_RE.search(sporen):
        return "check", 1, "", 0  # alleen mogelijke sporen
    return "no", 0, "", 0


def main():
    if not os.path.exists(PARQUET):
        sys.exit(f"parquet-bestand niet gevonden: {PARQUET} (zie docstring voor download)")
    bekend = bestaande_namen()
    rijen = laad_producten()
    print(f"{len(rijen)} NL-producten met ingrediëntinfo in de export")

    kandidaten, per_naam = [], {}
    for code, naam, merken, ingredienten, ingr_tags, allerg_tags, sporen_tags, cat_tags, label_tags, scans in rijen:
        naam = (naam or "").strip()
        if not (3 <= len(naam) <= 42) or not re.search(r"[a-zA-Z]{3}", naam):
            continue
        sleutel = norm(naam)
        if sleutel in bekend or sleutel in per_naam:
            continue
        status, sporen_vlag, woord, glutenvrij = analyseer(ingredienten, ingr_tags, allerg_tags, sporen_tags, label_tags)
        merk = (merken or "").split(",")[0].strip()
        item = {"n": naam, "m": merk, "s": status, "c": code}
        if sporen_vlag:
            item["sp"] = 1
        if woord and woord.lower() != "tarwe":
            item["w"] = woord.lower()
        if glutenvrij:
            item["gv"] = 1
        per_naam[sleutel] = True
        kandidaten.append((item, cat_tags or [], scans))

    # Populairste producten wereldwijd binnen NL…
    geselecteerd, codes = [], set()
    for item, _, _ in kandidaten[:MAX_GLOBAAL]:
        geselecteerd.append(item)
        codes.add(item["c"])
    # …plus gerichte dekking per risico-categorie.
    for categorie in RISICO_CATEGORIEEN:
        teller = 0
        for item, cats, _ in kandidaten:
            if teller >= MAX_PER_CATEGORIE or len(geselecteerd) >= MAX_TOTAAL:
                break
            if item["c"] in codes or categorie not in cats:
                continue
            geselecteerd.append(item)
            codes.add(item["c"])
            teller += 1

    if len(geselecteerd) < 100:
        sys.exit(f"maar {len(geselecteerd)} producten — off-products.json NIET overschreven")

    # Supermarktproducten met etiketdata uit Open Food Facts (https://nl.openfoodfacts.org/,
    # licentie ODbL). JSON kent geen commentaar: één product per regel, niet met de hand bewerken.
    with open(os.path.join(PROJECT, "src", "data", "off-products.json"), "w", encoding="utf-8") as f:
        f.write("[\n" + ",\n".join("  " + json.dumps(p, ensure_ascii=False) for p in geselecteerd) + "\n]\n")

    telling = {}
    for p in geselecteerd:
        telling[p["s"]] = telling.get(p["s"], 0) + 1
    print(f"klaar: {len(geselecteerd)} producten naar src/data/off-products.json")
    print("verdeling:", telling, "| waarvan alleen-sporen:", sum(1 for p in geselecteerd if p.get("sp")))


main()
