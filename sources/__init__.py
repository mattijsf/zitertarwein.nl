"""Shared helpers for data source modules.

Each source module exposes a single function `read(path)` that returns a
list of products in the shared format:

    {
      "n": name, "m": brand, "s": "yes"|"no"|"check", "c": barcode (or ""),
      "w": evidence word (optional), "sp": 1 (traces only, optional),
      "gv": 1 (gluten-free claim, optional),
      "cats": [category tags], "scans": popularity (int)
    }
"""
import json, os, re, unicodedata

_PROJECT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def load_rules():
    """Reads the shared detection rules from src/lib/rules.json."""
    r = json.load(open(os.path.join(_PROJECT, "src", "lib", "rules.json"), encoding="utf-8"))
    return {
        "wheat_text": re.compile(r["wheatText"], re.I),
        "wheat_tags": re.compile(r["wheatTags"], re.I),
        "gluten": re.compile(r["gluten"], re.I),
        "gluten_free": re.compile(r["glutenFree"], re.I),
        "gluten_free_labels": re.compile(r["glutenFreeLabels"], re.I),
    }


RULES = load_rules()


def norm(s):
    """Lowercase, strip accents and all punctuation/whitespace (mirrors the
    site's normalize() so dedupe matches search behaviour)."""
    s = unicodedata.normalize("NFD", s.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in s if not unicodedata.combining(c)))


def analyze(text, ingredient_tags=None, allergen_tags=None, trace_tags=None, label_tags=None):
    """Determines (status, traces_flag, evidence_word, gluten_free_claim) from label data."""
    text = text or ""
    ingredients = " ".join(ingredient_tags or [])
    allergens = " ".join(allergen_tags or [])
    traces = " ".join(trace_tags or [])
    labels = " ".join(label_tags or [])

    text_match = RULES["wheat_text"].search(text)
    tag_match = RULES["wheat_tags"].search(ingredients) or RULES["wheat_tags"].search(allergens)
    gluten_free = bool(RULES["gluten_free_labels"].search(labels)) or bool(RULES["gluten_free"].search(text))

    if text_match or tag_match:
        word = text_match.group(0).strip("-") if text_match else tag_match.group(0)
        if gluten_free:
            return "check", 0, word, 1  # e.g. "wheat starch (gluten-free)"
        return "yes", 0, word, 0
    if RULES["gluten"].search(allergens) and not gluten_free:
        return "check", 0, "", 0  # gluten as an ingredient (e.g. rye/barley)
    if RULES["gluten"].search(traces) or RULES["wheat_tags"].search(traces) or RULES["wheat_text"].search(traces):
        return "check", 1, "", 0  # possible traces only
    return "no", 0, "", 0


def make_product(name, brand, code, text, ingredient_tags=None, allergen_tags=None,
                 trace_tags=None, label_tags=None, cats=None, scans=0):
    """Builds one product in the shared format, or None if unusable."""
    name = (name or "").strip()
    if not (3 <= len(name) <= 42) or not re.search(r"[a-zA-Z]{3}", name):
        return None
    if not (text or "").strip() and not (ingredient_tags or []):
        return None  # no label info
    status, traces_flag, word, gluten_free = analyze(text, ingredient_tags, allergen_tags, trace_tags, label_tags)
    p = {"n": name, "m": (brand or "").split(",")[0].strip(), "s": status,
         "c": str(code or ""), "cats": cats or [], "scans": scans or 0}
    if traces_flag:
        p["sp"] = 1
    if word and word.lower() != "tarwe":
        p["w"] = word.lower()
    if gluten_free:
        p["gv"] = 1
    return p
