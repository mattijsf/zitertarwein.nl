"""Bron: Open Food Facts bulk-export (food.parquet, licentie ODbL).

Download:
  curl -L https://huggingface.co/datasets/openfoodfacts/product-database/resolve/main/food.parquet -o food.parquet
"""
import duckdb

from . import maak_product


def lees(pad):
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
    uit = []
    for code, naam, merken, tekst, ingr, allerg, sporen, cats, labels, scans in con.execute(query, [pad]).fetchall():
        p = maak_product(naam, merken, code, tekst, ingr, allerg, sporen, labels, cats, scans)
        if p:
            uit.append(p)
    return uit
