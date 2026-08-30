# Víno ze Zaječí

Nuxt aplikace pro prezentaci a prodej vín. Veřejná část obsahuje katalog a pokladnu, administrace spravuje produkty, číselníky, kategorie, texty, objednávky, faktury, uživatele a e-mailové šablony.

## Technologie

- Nuxt 4, Vue 3, TypeScript a zapnuté SSR
- Nuxt UI, Tailwind CSS a `@nuxt/image`
- i18n s jazyky `cs` a `en`
- Nitro endpointy jako serverová proxy před PHP API
- lokální doménové Nuxt moduly v `modules/`

## Spuštění

Požadavkem je aktuální LTS verze Node.js a npm.

```bash
npm install
npm run dev
```

Vývojový server standardně běží na `http://localhost:3000`.

```bash
npm run build     # produkční SSR build
npm run generate  # statické generování
npm run preview   # lokální náhled buildu
```

## Konfigurace prostředí

Lokální hodnoty patří do `.env`.

| Proměnná | Význam |
| --- | --- |
| `PHP_API_BASE_URL` | Základní URL PHP API |
| `PHP_FILE_ROOT` | Lokální kořen nebo HTTP(S) URL úložiště souborů |
| `FRONTEND_HOST` | Veřejná URL webu a host hlavička pro PHP API |
| `NUXT_PUBLIC_GTAG_ID` | Google Analytics ID |
| `NUXT_MAILING_FROM` | E-mail odesílatele a administrativní příjemce |
| `NUXT_MAILING_FROM_NAME` | Jméno odesílatele |
| `NUXT_MAILING_FROM_PHONE` | Telefon odesílatele |
| `NUXT_MAIL_DEFAULT_TO`, `NUXT_MAIL_DEFAULT_SUBJECT` | Výchozí hodnoty administračního testu |
| `NUXT_MAIL_FROM_EMAIL`, `NUXT_MAIL_FROM_NAME`, `NUXT_MAIL_FROM_PHONE` | Veřejné výchozí hodnoty mail formuláře |

## Architektura

Prohlížeč nevolá PHP backend přímo. Komponenty a composables volají `/api/...`, Nitro handler request předá na `PHP_API_BASE_URL` a vrátí backendovou obálku `{ success, message, data, errors? }`.

`server/utils/phpApi.ts` předá session token jako Bearer, nastaví `Host` podle `FRONTEND_HOST`, převede `skip/limit` na `page/limit` a normalizuje `projection` a `factory`. Administrační stránky používají layout `admin`; prefix `/admin` chrání `auth-module`. Formuláře a tabulky jsou popsané JSON konfiguracemi v jednotlivých `runtime/assets/configs`.

## Lokální moduly

Nuxt automaticky načítá `modules/*/index.ts`.

| Modul | Odpovědnost | Dokumentace |
| --- | --- | --- |
| Category | Kategorie produktů | [category-module](modules/category-module/README.md) |
| Enum | Číselníky, degustace, doprava, platba a DPH | [enum-module](modules/enum-module/README.md) |
| E-shop | Košík, pokladna, objednávky a faktury | [eshop-module](modules/eshop-module/README.md) |
| File | Upload, potvrzení a servírování souborů | [file-module](modules/file-module/README.md) |
| Mail | Kontaktní a transakční e-maily | [mail-module](modules/mail-module/README.md) |
| Text | Editovatelné textové záznamy | [text-module](modules/text-module/README.md) |
| User | Uživatelé, adresy, role a profil | [user-module](modules/user-module/README.md) |
| Wine | Katalog a administrace vín | [wine-module](modules/wine-module/README.md) |

## Vazby mezi moduly

- `wine-module` používá `eshop-module` pro vložení vína do košíku a `file-module` pro fotografie.
- `eshop-module` čte dopravu a platbu z `enum-module` a po objednávce používá `mail-module`.
- Doménové moduly staví na balíčcích `common`, `lang`, `ui`, `form`, `notify`, `menu` a `auth` z rodiny `@suku-kahanamoku`.

## Typy a překlady

Komponenty používají `useLang()` a globální helper `$tt`. Pokud editor nevidí typ `$tt`, projekt musí načíst augmentaci z `@suku-kahanamoku/lang-module/types` v `globals.d.ts`; potom restartujte TypeScript server.

## Produkce

Pro SSR spusťte `npm run build` a startujte výstup podle Nitro presetu. `npm run generate` používejte jen tam, kde je PHP API dostupné i během prerenderu; `crawlLinks` je zapnuté.
