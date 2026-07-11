#!/usr/bin/env python3
"""Haal populaire NL-producten met ingrediënten op uit Open Food Facts
en genereer src/data/off-products.json voor zitertarwein.nl."""
import json, os, re, sys, time, unicodedata, urllib.request, urllib.parse

PROJECT = os.path.dirname(os.path.abspath(__file__))
TARWE_RE = re.compile(
    r"tarwe|wheat|weizen|bl[eé]\b|froment|durum|semol|spelt|khorasan|kamut|seitan|bulgur|couscous",
    re.I,
)
TARWE_TAG_RE = re.compile(r"wheat|spelt|khorasan|triticum", re.I)
GLUTEN_TAG_RE = re.compile(r"gluten", re.I)


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if not unicodedata.combining(c)).strip()


def bestaande_namen():
    src = open(f"{PROJECT}/src/data/products.ts", encoding="utf-8").read()
    namen = set(norm(m) for m in re.findall(r'n: "([^"]+)"', src))
    for aliassen in re.findall(r'a: \[([^\]]*)\]', src):
        namen.update(norm(m) for m in re.findall(r'"([^"]+)"', aliassen))
    return namen


def haal_pagina(pagina):
    velden = "code,product_name,product_name_nl,brands,ingredients_text_nl,ingredients_text,allergens_tags,ingredients_tags,traces_tags"
    url = (
        "https://nl.openfoodfacts.org/cgi/search.pl?"
        + urllib.parse.urlencode({
            "search_simple": 1,
            "action": "process",
            "json": 1,
            "tagtype_0": "countries",
            "tag_contains_0": "contains",
            "tag_0": "netherlands",
            "sort_by": "unique_scans_n",
            "page_size": 50,
            "page": pagina,
            "fields": velden,
        })
    )
    req = urllib.request.Request(url, headers={"User-Agent": "zitertarwein.nl importer (mattijs.fuijkschot@pm.me)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r).get("products", [])


def bepaal_status(p):
    tekst = (p.get("ingredients_text_nl") or p.get("ingredients_text") or "").strip()
    ingr_tags = " ".join(p.get("ingredients_tags") or [])
    allerg_tags = " ".join(p.get("allergens_tags") or [])
    traces_tags = " ".join(p.get("traces_tags") or [])
    if not tekst and not ingr_tags:
        return None  # geen etiketinfo: overslaan
    if TARWE_RE.search(tekst) or TARWE_TAG_RE.search(ingr_tags) or TARWE_TAG_RE.search(allerg_tags):
        return "yes"
    if GLUTEN_TAG_RE.search(allerg_tags) or GLUTEN_TAG_RE.search(traces_tags) or TARWE_TAG_RE.search(traces_tags):
        return "check"  # gluten (mogelijk rogge/gerst) of sporen: niet zeker
    return "no"


def main():
    bekend = bestaande_namen()
    uit, gezien = [], set()
    for pagina in range(1, 25):
        producten = None
        for poging in range(6):
            try:
                producten = haal_pagina(pagina)
                break
            except Exception as e:
                print(f"pagina {pagina} poging {poging + 1} mislukt: {e}", file=sys.stderr, flush=True)
                time.sleep(120)
        if producten is None:
            break
        if not producten:
            break
        for p in producten:
            naam = (p.get("product_name_nl") or p.get("product_name") or "").strip()
            if not (3 <= len(naam) <= 42) or not re.search(r"[a-zA-Z]{3}", naam):
                continue
            sleutel = norm(naam)
            if sleutel in bekend or sleutel in gezien:
                continue
            status = bepaal_status(p)
            if not status or not p.get("code"):
                continue
            merk = (p.get("brands") or "").split(",")[0].strip()
            gezien.add(sleutel)
            uit.append({"n": naam, "m": merk, "s": status, "c": p["code"]})
        time.sleep(30)  # onder de rate-limit blijven (~2 verzoeken/min)
        print(f"pagina {pagina}: totaal {len(uit)}", flush=True)
        if len(uit) >= 1000:
            break

    uit = uit[:1000]
    if len(uit) < 50:
        print(f"maar {len(uit)} producten opgehaald — off-products.json NIET overschreven", file=sys.stderr)
        sys.exit(1)
    # Supermarktproducten met etiketdata uit Open Food Facts (https://nl.openfoodfacts.org/,
    # licentie ODbL). JSON kent geen commentaar: één product per regel, niet met de hand bewerken.
    with open(f"{PROJECT}/src/data/off-products.json", "w", encoding="utf-8") as f:
        f.write("[\n" + ",\n".join("  " + json.dumps(p, ensure_ascii=False) for p in uit) + "\n]\n")
    print(f"klaar: {len(uit)} producten naar src/data/off-products.json")
    telling = {}
    for p in uit:
        telling[p["s"]] = telling.get(p["s"], 0) + 1
    print("verdeling:", telling)


main()
