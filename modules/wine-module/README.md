# Wine module

Modul poskytuje veřejný katalog vín, produktový detail, karty produktů a administrační CRUD. Doménové `wine` se na PHP backendu mapuje na `/products`.

## Registrace

- komponenty `CmpPrice`, `CmpWineCard`, `CmpWineDetailCard`, `CmpWineIconAttrs` a `CmpWineListTop`
- composable `useWineAdmin`
- stránky `/wine`, `/wine/:id`, `/admin/wine`, `/admin/wine/create` a `/admin/wine/:id`
- české a anglické překlady

Konfigurace katalogu, detailu, top vín a administrace jsou v `runtime/assets/configs/`.

## API

| Metoda | Nuxt endpoint | PHP endpoint |
| --- | --- | --- |
| GET | `/api/wine` | `/products` |
| GET | `/api/wine/:id` | `/products/:id` |
| POST | `/api/admin/wine` | `/products` |
| PATCH | `/api/admin/wine/:id` | `/products/:id` |
| DELETE | `/api/admin/wine/:id` | `/products/:id` |

`wine-list-top.json` filtruje produkty kategorií se syscodem `top`. GET query se předává PHP API přes společnou proxy.

## Komponenty

- `CmpWineCard` dostává `fields` a volitelné `wine`; vloží jednu lahev do košíku.
- `CmpWineDetailCard` zobrazuje galerii, vlastnosti a volbu množství.
- `CmpWineIconAttrs` vykreslí konfigurované vlastnosti a doplní překlady nebo jednotky.
- `CmpWineListTop` načte top produkty přes SSR `useAsyncData` a použije carousel nebo seznam podle breakpointu.
- `CmpPrice` formátuje cenu v aktivním locale a standardně ukazuje i vypočtenou původní cenu.

## Administrace a soubory

`useWineAdmin` obsluhuje načtení, filtry, stránkování a CRUD. `onCreate` vrací ID produktu, aby stránka mohla potvrdit dočasně nahrané fotografie pomocí `file-module`. Obrázky se zobrazují přes `/api/files/...`.

## Závislosti

Karty používají `useCashdesk` z `eshop-module`; administrace používá `file-module`. Modul dále staví na `common`, `lang`, `ui`, `form`, `notify`, `menu` a `auth` modulech.
