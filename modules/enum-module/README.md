# Enum module

Modul spravuje obecné číselníky z PHP resource `/enumerations`. Nad jedním API poskytuje obecné enumy a specializované pohledy pro degustace, dopravu, platbu a sazby DPH.

## Registrace

- composables `useEnumAdmin` a `useTasteAdmin`
- komponenta `CmpTasteCard`
- CRUD stránky pod `/admin/enum`, `/admin/taste`, `/admin/payment`, `/admin/shipping` a `/admin/vat-rate`
- české a anglické překlady

Specializované sekce filtrují stejný resource podle `type`: `taste`, `payment`, `shipping` nebo `vat_rate`. JSON konfigurace jsou v `runtime/assets/configs/`.

## API

| Metoda | Nuxt endpoint | PHP endpoint |
| --- | --- | --- |
| GET | `/api/enumerations` | `/enumerations` |
| GET | `/api/enumerations/:id` | `/enumerations/:id` |
| GET, POST | `/api/admin/enum` | `/enumerations` |
| PATCH, DELETE | `/api/admin/enum/:id` | `/enumerations/:id` |

Administrační GET upravuje data pro tabulkový pohled. Veřejný endpoint využívá například e-shop pro dopravu a platbu.

## Rozhraní

`useEnumAdmin` obsluhuje obecný seznam, CRUD, filtry, řazení a stránkování. `useTasteAdmin` poskytuje stejný tok pro specializované typy. `CmpTasteCard` dostává `item` a zobrazuje název, cenu a volitelné `data.drink`, `data.food` a `data.time`.

## Závislosti

Používá `common`, `lang`, `ui`, `form`, `notify`, `menu` a `auth` moduly.
