"""Gedeelde helpers voor databron-modules.

Elke bron-module heeft één functie `lees(pad)` die een lijst producten
oplevert in het gedeelde formaat:

    {
      "n": naam, "m": merk, "s": "yes"|"no"|"check", "c": barcode (of ""),
      "w": bewijswoord (optioneel), "sp": 1 (alleen sporen, optioneel),
      "gv": 1 (glutenvrij-claim, optioneel),
      "cats": [categorie-tags], "scans": populariteit (int)
    }
"""
import json, os, re, unicodedata

_PROJECT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def laad_regels():
    """Leest de gedeelde detectieregels uit src/lib/rules.json."""
    r = json.load(open(os.path.join(_PROJECT, "src", "lib", "rules.json"), encoding="utf-8"))
    return {
        "tarwe_tekst": re.compile(r["wheatText"], re.I),
        "tarwe_tags": re.compile(r["wheatTags"], re.I),
        "gluten": re.compile(r["gluten"], re.I),
        "glutenvrij": re.compile(r["glutenFree"], re.I),
        "glutenvrij_labels": re.compile(r["glutenFreeLabels"], re.I),
    }


REGELS = laad_regels()


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if not unicodedata.combining(c)).strip()


def analyseer(tekst, ingr_tags=None, allerg_tags=None, sporen_tags=None, label_tags=None):
    """Bepaalt (status, sporen_vlag, bewijswoord, glutenvrij_claim) uit etiketdata."""
    tekst = tekst or ""
    ingr = " ".join(ingr_tags or [])
    allerg = " ".join(allerg_tags or [])
    sporen = " ".join(sporen_tags or [])
    labels = " ".join(label_tags or [])

    tekst_match = REGELS["tarwe_tekst"].search(tekst)
    tag_match = REGELS["tarwe_tags"].search(ingr) or REGELS["tarwe_tags"].search(allerg)
    glutenvrij = bool(REGELS["glutenvrij_labels"].search(labels)) or bool(REGELS["glutenvrij"].search(tekst))

    if tekst_match or tag_match:
        woord = tekst_match.group(0).strip("-") if tekst_match else tag_match.group(0)
        if glutenvrij:
            return "check", 0, woord, 1  # bijv. "tarwezetmeel (glutenvrij)"
        return "yes", 0, woord, 0
    if REGELS["gluten"].search(allerg) and not glutenvrij:
        return "check", 0, "", 0  # gluten als ingrediënt (bijv. rogge/gerst)
    if REGELS["gluten"].search(sporen) or REGELS["tarwe_tags"].search(sporen) or REGELS["tarwe_tekst"].search(sporen):
        return "check", 1, "", 0  # alleen mogelijke sporen
    return "no", 0, "", 0


def maak_product(naam, merk, code, tekst, ingr_tags=None, allerg_tags=None,
                 sporen_tags=None, label_tags=None, cats=None, scans=0):
    """Bouwt één product in het gedeelde formaat, of None als het niets oplevert."""
    naam = (naam or "").strip()
    if not (3 <= len(naam) <= 42) or not re.search(r"[a-zA-Z]{3}", naam):
        return None
    if not (tekst or "").strip() and not (ingr_tags or []):
        return None  # geen etiketinfo
    status, sporen_vlag, woord, glutenvrij = analyseer(tekst, ingr_tags, allerg_tags, sporen_tags, label_tags)
    p = {"n": naam, "m": (merk or "").split(",")[0].strip(), "s": status,
         "c": str(code or ""), "cats": cats or [], "scans": scans or 0}
    if sporen_vlag:
        p["sp"] = 1
    if woord and woord.lower() != "tarwe":
        p["w"] = woord.lower()
    if glutenvrij:
        p["gv"] = 1
    return p
