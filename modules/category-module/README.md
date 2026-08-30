# Category module

Modul zajišťuje kategorie produktů: veřejné čtení a administrační CRUD. PHP zdrojem dat je `/categories`.

## Registrace

- composable `useCategoryAdmin`
- stránky `/admin/category`, `/admin/category/create` a `/admin/category/:id`
- české a anglické překlady
- formuláře a tabulka z `runtime/assets/configs/`

## API

| Metoda | Nuxt endpoint | PHP endpoint |
| --- | --- | --- |
| GET | `/api/category` | `/categories` |
| GET | `/api/category/:id` | `/categories/:id` |
| POST | `/api/admin/category` | `/categories` |
| PATCH | `/api/admin/category/:id` | `/categories/:id` |
| DELETE | `/api/admin/category/:id` | `/categories/:id` |

GET query se předává backendu. Autentizaci a normalizaci zajišťuje společná `phpApiFetch` utilita.

## `useCategoryAdmin`

Composable klonuje form config, promítá do něj aktuální URL a načítá data přes `useAsyncData`. Poskytuje `categories`, `meta`, `loading`, `refresh`, CRUD handlery, výběr položek a obsluhu stránkování, filtrování a řazení.

## Závislosti

Používá `common`, `lang`, `ui`, `form`, `notify`, `menu` a `auth` moduly. Nemá vlastní runtime nastavení.
