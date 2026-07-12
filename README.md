# Zit er tarwe in? 🌾

Minimalistische website: typ een product en zie meteen of er tarwe in zit,
met bronvermelding. Live op **https://zitertarwein.nl**.

Staat een product niet in de eigen database, dan zoekt de site live in de
etiketdata van [Open Food Facts](https://nl.openfoodfacts.org/) (met bronlink).
Levert ook dat niets op, dan toont de site een Google-link met ingevulde
zoekopdracht als laatste redmiddel.

## Bestanden

React 19 + zustand, gebouwd met Vite, strikte TypeScript.

| Pad                          | Doel                                                               |
| ---------------------------- | ------------------------------------------------------------------ |
| `index.html`                 | Vite-entry: meta-tags en `#root`                                   |
| `src/app/`                   | Opbouw van de pagina: kop, voet (pop-look)                         |
| `src/features/`              | Zoekvak met autocomplete, resultaatkaart, voorbeelden              |
| `src/stores/`                | Gedeelde staat (zustand)                                           |
| `src/lib/`                   | Pure logica met tests: zoeken, suggesties, Open Food Facts         |
| `src/lib/rules.json`         | Gedeelde tarwe-detectieregels (site én importscripts)              |
| `src/data/products.ts`       | Handgemaakte productdatabase (~310 producten) met status en bron   |
| `src/data/off-products.json` | Supermarktproducten met etiketdata (gegenereerd, niet bewerken)    |
| `src/data/sources.ts`        | De bronnen waarnaar de antwoorden verwijzen                        |
| `deploy.sh`                  | Bouwen en deployen naar Cloudflare                                 |
| `genereer.py`                | Genereert `src/data/off-products.json` uit één of meer databronnen |
| `bronnen/`                   | Bron-modules: `off_parquet.py` (Open Food Facts), `csv_export.py`  |

## Productdata genereren

`src/data/off-products.json` wordt gegenereerd met `genereer.py`; elke databron is een
module in `bronnen/`. Bronnen combineren kan door ze achter elkaar op te
geven — de eerste bron wint bij dubbele namen, en CSV-bronnen worden
integraal opgenomen:

```bash
pip3 install duckdb
curl -L https://huggingface.co/datasets/openfoodfacts/product-database/resolve/main/food.parquet -o food.parquet
python3 genereer.py off=food.parquet
# of met een extra (supermarkt)export erbij:
python3 genereer.py csv=supermarkt-export.csv off=food.parquet
```

CSV-formaat: kolommen `naam` en `ingredienten` (verplicht) plus optioneel
`merk`, `barcode` en `sporen`; scheidingsteken wordt herkend. Zie
`bronnen/csv_export.py`. Een nieuwe bron toevoegen = één module met een
`lees(pad)`-functie die het gedeelde productformaat oplevert.

Uit de Open Food Facts-export (± 8 GB, licentie ODbL) selecteert de
generator de populairste Nederlandse producten met ingrediëntinformatie
plus extra dekking per risico-categorie (sauzen, soepen, koek, snoep, …).
`src/data/off-products.json` wordt alleen bij een geslaagde run overschreven, en wordt in
de browser (eigen chunk) pas ná het renderen van de pagina geladen.

De detectieregels (welke woorden en tags op tarwe wijzen) staan één keer
in `src/lib/rules.json` en worden door zowel de site als de importscripts gebruikt.

Alles-in-één verversing (download + import + commit + autodeploy):

```bash
./ververs-data.sh
```

Periodiek draaien kan met een crontab-regel, bijvoorbeeld op de 1e van de
maand om 06:00:

```
0 6 1 * * /path/to/zitertarwein.nl/ververs-data.sh >> /tmp/zitertarwein-verversing.log 2>&1
```

`src/data/products.ts` bewerken = product toevoegen:

```ts
{ n: "productnaam", a: ["alias"], s: "yes" | "no" | "check", i: "uitleg", b: "vc-gluten" | "vc-tarwe" | "ncv" | "off" }
```

## Lokaal draaien

```bash
pnpm install
pnpm dev     # http://localhost:4173
pnpm check   # lint, opmaak, typecheck, tests, escape hatches en ongebruikte code (knip)
```

## Deployen

Hosting: **Cloudflare Worker** `zitertarwein` (static assets) — daar hangt
zitertarwein.nl aan als custom domain. Configuratie in `wrangler.jsonc`.

- **Automatisch**: elke commit op `main` deployt via de lokale post-commit hook.
- **Handmatig**: `./deploy.sh`

Het script bouwt `dist/` met `pnpm build` (Vite) en draait
`npx wrangler deploy`.

### Autodeploy op een nieuwe machine

De hook staat in `.git/hooks/` en reist niet mee met git. Eenmalig instellen:

```bash
npx wrangler login   # Cloudflare OAuth goedkeuren in de browser

cat > .git/hooks/post-commit <<'EOF'
#!/bin/sh
# Autodeploy: elke commit op main gaat naar Cloudflare Pages.
[ "$(git rev-parse --abbrev-ref HEAD)" = "main" ] || exit 0
echo "→ Autodeploy naar Cloudflare…"
sh "$(git rev-parse --show-toplevel)/deploy.sh" 2>&1 | tail -2
EOF
chmod +x .git/hooks/post-commit
```

Verloopt de wrangler-sessie ooit, dan is `npx wrangler login` opnieuw genoeg.

## Bronnen

Antwoorden verwijzen per product naar een geverifieerde bron:

- [Voedingscentrum — Gluten en het glutenvrij dieet](https://www.voedingscentrum.nl/encyclopedie/gluten-en-het-glutenvrij-dieet.aspx)
- [Voedingscentrum — Tarwe: volkorenmeel en bloem](https://www.voedingscentrum.nl/encyclopedie/tarwe-meel-bloem.aspx)
- [Nederlandse Coeliakie Vereniging — glutenvrij.nl](https://www.glutenvrij.nl/)
- [Open Food Facts](https://nl.openfoodfacts.org/) — etiketdata, ook gebruikt voor de live-zoekfunctie

De site geeft algemene informatie en is geen medisch advies. Tarwevrij ≠ glutenvrij:
rogge en gerst bevatten óók gluten.
