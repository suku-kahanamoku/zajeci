# Text module

Modul spravuje editovatelné textové záznamy. Veřejná část je může číst, administrace je vytváří, upravuje a maže. PHP resource je `/texts`.

## Registrace

- composable `useTextAdmin`
- stránky `/admin/text`, `/admin/text/create` a `/admin/text/:id`
- české a anglické překlady
- konfigurace seznamu a formulářů v `runtime/assets/configs/`

## API

| Metoda | Nuxt endpoint | PHP endpoint |
| --- | --- | --- |
| GET | `/api/text` | `/texts` |
| GET | `/api/text/:id` | `/texts/:id` |
| POST | `/api/admin/text` | `/texts` |
| PATCH | `/api/admin/text/:id` | `/texts/:id` |
| DELETE | `/api/admin/text/:id` | `/texts/:id` |

## `useTextAdmin`

Composable propojuje JSON form config, parametry route a `useAsyncData`. Vrací texty, metadata stránkování, loading, výběr, dialog a CRUD handlery. Filtry, řazení a stránku synchronizuje s URL.

## Závislosti

Používá `common`, `lang`, `ui`, `form`, `notify`, `menu` a `auth` moduly.
