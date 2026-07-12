"""Source: Open Food Facts bulk export (food.parquet, ODbL licence).

Download:
  curl -L https://huggingface.co/datasets/openfoodfacts/product-database/resolve/main/food.parquet -o food.parquet
"""
import duckdb

from . import make_product


def read(path):
    con = duckdb.connect()
    query = """
        SELECT
          code,
          coalesce(
            list_filter(product_name, x -> x.lang = 'nl')[1].text,
            list_filter(product_name, x -> x.lang = 'main')[1].text
          ) AS name,
          brands,
          coalesce(
            list_filter(ingredients_text, x -> x.lang = 'nl')[1].text,
            list_filter(ingredients_text, x -> x.lang = 'main')[1].text
          ) AS ingredients,
          list_transform(ingredients_tags, x -> x)   AS ingredient_tags,
          list_transform(allergens_tags, x -> x)     AS allergen_tags,
          list_transform(traces_tags, x -> x)        AS trace_tags,
          list_transform(categories_tags, x -> x)    AS category_tags,
          list_transform(labels_tags, x -> x)        AS label_tags,
          coalesce(unique_scans_n, 0)                AS scans
        FROM read_parquet(?)
        WHERE list_contains(countries_tags, 'en:netherlands')
          AND (len(ingredients_tags) > 0 OR len(ingredients_text) > 0)
        ORDER BY scans DESC
    """
    out = []
    for code, name, brands, text, ingr, allerg, traces, cats, labels, scans in con.execute(query, [path]).fetchall():
        p = make_product(name, brands, code, text, ingr, allerg, traces, labels, cats, scans)
        if p:
            out.append(p)
    return out
