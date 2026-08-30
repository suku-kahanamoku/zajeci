# E-shop module

Modul spojuje košík, tříkrokovou pokladnu, vytvoření objednávky a administraci objednávek a faktur.

## Registrace

- komponenty `CmpCartDialog` a `CmpCashdesk*`
- composables `useCart`, `useCashdesk`, `useShipping`, `usePayment`, `useOrderAdmin` a `useInvoiceAdmin`
- stránky `/cashdesk`, `/cashdesk-completed`, `/admin/order`, `/admin/order/:id`, `/admin/invoice`, `/admin/invoice/create` a `/admin/invoice/:id`
- české a anglické překlady

## Checkout

`useCart` je klientský singleton s položkami, množstvím a cenami s DPH. `useCashdesk` skládá košík, zákazníka, dopravu a platbu. Stav ukládá na sedm dní pod klíčem `cashdesk` v `localStorage`. Po odeslání volá `POST /api/order`, vyčistí pokladnu a přesměruje na potvrzení.

`useShipping` a `usePayment` načítají publikované položky z `/api/enumerations`. Při ceně košíku nad 2 500 Kč nastavují příplatek dopravy a platby na nulu.

## Tok objednávky

1. `POST /api/order` vytvoří objednávku na PHP `/orders`.
2. Handler se pro objednávku s e-mailem pokusí vytvořit fakturu přes `/invoices`.
3. Cesty PDF souborů připojí k potvrzovacímu e-mailu z `mail-module`.
4. Selhání faktury nebo e-mailu neruší již vytvořenou objednávku; zapíše se do serverového logu.

## API

| Metody | Nuxt endpoint | PHP endpoint |
| --- | --- | --- |
| POST | `/api/order` | `/orders`, volitelně `/invoices` a `/mailer/` |
| GET, POST | `/api/admin/order` | `/orders` |
| GET, PATCH, DELETE | `/api/admin/order/:id` | `/orders/:id` |
| GET, POST | `/api/admin/invoice` | `/invoices` |
| GET, DELETE | `/api/admin/invoice/:id` | `/invoices/:id` |
| PATCH | `/api/admin/invoice/:id` | `/invoices/:id/status` |

## Závislosti

Používá typy `wine-module` a `user-module`, volby z `enum-module` a serverové odesílání z `mail-module`. UI, formuláře, autentizaci a notifikace poskytují balíčky `@suku-kahanamoku`.
