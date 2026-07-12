"""Bron: een CSV/TSV-export met productdata, bijvoorbeeld van een
supermarkt of leverancier.

Verwachte kolommen (koptekst, hoofdletterongevoelig; scheidingsteken wordt
automatisch herkend):

  naam         — productnaam (verplicht)
  ingredienten — ingrediëntenlijst zoals op het etiket (verplicht)
  merk         — merknaam (optioneel)
  barcode      — EAN (optioneel; maakt een link naar Open Food Facts mogelijk)
  sporen       — sporen-/allergenenvermelding, bv. "kan tarwe bevatten" (optioneel)

Producten uit een CSV-bron krijgen voorrang op Open Food Facts-data bij
dubbele namen (zie genereer.py).
"""
import csv

from . import maak_product

# Een CSV-export is gericht aangeleverd: alles opnemen, ongeacht populariteit.
ALTIJD_OPNEMEN = True


def lees(pad):
    uit = []
    with open(pad, newline="", encoding="utf-8-sig") as f:
        proef = f.read(4096)
        f.seek(0)
        dialect = csv.Sniffer().sniff(proef, delimiters=",;\t")
        for rij in csv.DictReader(f, dialect=dialect):
            rij = {k.strip().lower(): (v or "").strip() for k, v in rij.items() if k}
            p = maak_product(
                rij.get("naam"),
                rij.get("merk"),
                rij.get("barcode"),
                rij.get("ingredienten"),
                sporen_tags=[rij["sporen"]] if rij.get("sporen") else None,
            )
            if p:
                uit.append(p)
    return uit
