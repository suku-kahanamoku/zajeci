# Mail module

Modul zprostředkuje e-mailové šablony PHP backendu, administrační testovací odeslání a transakční e-maily.

## Registrace

- composable `useMailAdmin`
- utility `SEND_SIGNUP_MAIL`, `SEND_CONTACT_FORM_MAIL`, `SEND_CONTACT_FORM_ADMIN_MAIL`, `SEND_RESET_PASSWORD_MAIL` a `SEND_ORDER_MAIL`
- stránka `/admin/mail`
- endpointy `/api/admin/mail`, `/api/admin/mail/send` a `/api/email/contact`
- české a anglické překlady

## API

| Metoda | Nuxt endpoint | PHP endpoint | Použití |
| --- | --- | --- | --- |
| GET | `/api/admin/mail` | `/mailer/list` | seznam šablon |
| POST | `/api/admin/mail/send` | `/mailer/` | administrační test |
| POST | `/api/email/contact` | `/mailer/` dvakrát | potvrzení uživateli a zpráva administrátorovi |

PHP mailer se volá query parametry. Odesílatel se doplňuje ze soukromého runtime configu a logo aktuálně ukazuje na `https://vinozezajeci.cz/img/logo_white.svg`.

## Konfigurace

| Volba `mailModule` | Environment fallback | Default |
| --- | --- | --- |
| `defaultTo` | `NUXT_MAIL_DEFAULT_TO` | prázdná |
| `defaultSubject` | `NUXT_MAIL_DEFAULT_SUBJECT` | `Test email` |
| `fromEmail` | `NUXT_MAIL_FROM_EMAIL` | prázdná |
| `fromName` | `NUXT_MAIL_FROM_NAME` | prázdná |
| `fromPhone` | `NUXT_MAIL_FROM_PHONE` | prázdná |

Tyto hodnoty modul zveřejní jako `runtimeConfig.public.mailModule`. Reálné odesílání používá soukromé `NUXT_MAILING_FROM`, `NUXT_MAILING_FROM_NAME` a `NUXT_MAILING_FROM_PHONE`.

Serverové utility vyžadují `H3Event`, aby předaly session a host PHP API:

```ts
await SEND_ORDER_MAIL(event, customerEmail, orderNumber, attachmentPaths);
```

`useMailAdmin` načítá šablony a odesílá formulář podle `admin-mail-send.json`.
