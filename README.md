# Zit er tarwe in? 🌾

Minimalistische website: typ een product en zie meteen of er tarwe in zit,
met bronvermelding. Live op **https://zitertarwein.nl**.

Staat een product niet in de eigen database, dan zoekt de site live in de
etiketdata van [Open Food Facts](https://nl.openfoodfacts.org/) (met bronlink).
Levert ook dat niets op, dan toont de site een Google-link met ingevulde
zoekopdracht als laatste redmiddel.

## Bestanden

React 19 + zustand, gebouwd met Vite, strikte TypeScript.

| Pad                          | Doel                                                                 |
| ---------------------------- | -------------------------------------------------------------------- |
| `index.html`                 | Vite-entry: meta-tags en `#root`                                     |
| `src/app/`                   | Opbouw van de pagina: kop, voet (pop-look)                           |
| `src/features/`              | Zoekvak met autocomplete, resultaatkaart, voorbeelden                |
| `src/stores/`                | Gedeelde staat (zustand)                                             |
| `src/lib/`                   | Pure logica met tests: zoeken, suggesties, Open Food Facts           |
| `src/data/products.ts`       | Handgemaakte productdatabase (~310 producten) met status en bron     |
| `src/data/off-products.json` | Supermarktproducten uit Open Food Facts (gegenereerd, niet bewerken) |
| `src/data/sources.ts`        | De bronnen waarnaar de antwoorden verwijzen                          |
| `deploy.sh`                  | Bouwen en deployen naar Cloudflare                                   |
| `importeer_off.py`           | Genereert `src/data/off-products.json`                               |

`src/data/off-products.json` opnieuw genereren vanuit de Open Food Facts bulk-export
(geen API-limieten, ± 8 GB download, licentie ODbL):

```bash
pip3 install duckdb
curl -L https://huggingface.co/datasets/openfoodfacts/product-database/resolve/main/food.parquet -o food.parquet
python3 importeer_off.py food.parquet
```

Het script selecteert de populairste Nederlandse producten met
ingrediëntinformatie plus extra dekking per risico-categorie (sauzen,
soepen, koek, snoep, …), en overschrijft `src/data/off-products.json` alleen bij een
geslaagde import. De grote lijst (eigen chunk) wordt in de browser pas ná het renderen
van de pagina geladen.

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
