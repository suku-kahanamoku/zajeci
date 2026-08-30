# User module

Modul poskytuje administrační dashboard, profil a správu uživatelů, adres a rolí. Neregistruje veřejné datové endpointy.

## Registrace

- composables `useUserAdmin`, `useAddressAdmin` a `useRoleAdmin`
- dashboard `/admin` a profil `/admin/profile`
- správa `/admin/user`, `/admin/user/:id` a CRUD pod `/admin/address` a `/admin/role`
- české a anglické překlady

Stránky používají layout `admin`; prefix `/admin` chrání kořenový `authModule`. JSON konfigurace jsou v `runtime/assets/configs/`.

## API

| Resource | Nuxt endpointy | PHP endpointy | Metody |
| --- | --- | --- | --- |
| Uživatelé | `/api/admin/user`, `/api/admin/user/:id` | `/users`, `/users/:id` | GET seznam/detail, PATCH, DELETE |
| Adresy | `/api/admin/address`, `/api/admin/address/:id` | `/address`, `/address/:id` | GET seznam/detail, POST, PATCH, DELETE |
| Role | `/api/admin/role`, `/api/admin/role/:id` | `/roles`, `/roles/:id` | GET seznam/detail, POST, PATCH, DELETE |

Modul aktuálně neregistruje `POST /api/admin/user`; profil používá stejný PATCH endpoint jako editace uživatele.

## Composables

Admin composables klonují JSON config, načítají data přes `useAsyncData`, poskytují CRUD stav a synchronizují filtry, řazení a stránku s URL.

## Závislosti

Používá `common`, `lang`, `ui`, `form`, `notify`, `menu` a `auth` moduly. Datové typy jsou v `runtime/types/`.
