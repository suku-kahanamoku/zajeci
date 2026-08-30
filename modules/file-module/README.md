# File module

Modul poskytuje UI pro výběr souborů, upload do dočasného úložiště, potvrzení souborů k entitě a jejich servírování přes Nuxt.

## Registrace

- komponenty `UiDropzone`, `UiFileItem` a `UiFileUpload`
- composable `useFileUpload`
- endpointy pro upload a commit
- catch-all GET handlery pro `/api/temp/**` a `/api/files/**`

## Dvoufázový upload

1. `useFileUpload` odešle soubor jako multipart pole `file` na `POST /api/files/upload`.
2. XHR aktualizuje stav `pending`, `uploading`, `uploaded` nebo `error` a `progress`.
3. Backend vrátí dočasnou cestu; úspěšné cesty poskytuje computed `tempPaths`.
4. Po uložení entity musí volající potvrdit každou cestu na `POST /api/files/commit`. Upload sám soubor natrvalo nepřiřadí.

```ts
for (const path of tempPaths.value) {
  await useApi("/api/files/commit", {
    method: "POST",
    body: {
      path,
      name: path.split("/").pop(),
      visibility: "public",
      entity_type: "product",
      entity_id: productId,
    },
  });
}
```

Commit vrátí ID souboru. Pokud entita uchovává vazby v poli `file_ids`, musí je volající následně uložit na entitu. Konkrétní tvar body musí odpovídat kontraktu PHP API.

## API

| Metoda | Nuxt endpoint | Zdroj |
| --- | --- | --- |
| POST | `/api/files/upload` | PHP `/files/upload` |
| POST | `/api/files/commit` | PHP `/files/commit` |
| GET | `/api/temp/**` | dočasná část `PHP_FILE_ROOT` |
| GET | `/api/files/**` | trvalá část `PHP_FILE_ROOT` |

Upload předá session Bearer token. GET handler odmítá `..`, umí číst z lokálního filesystemu i HTTP(S) adresy a nastavuje MIME typ. Temp soubory mají privátní pětiminutovou cache, trvalé veřejnou immutable cache na rok.

## Rozhraní

`UiDropzone` respektuje `IFormField.multiple`, `fileTypes` a `fileSize` v MB. `useFileUpload` vrací `files`, `uploadedFiles`, `tempPaths`, `addFiles`, `removeUploadedFile` a `clearUploadedFiles`.

`PHP_API_BASE_URL` určuje PHP API a `PHP_FILE_ROOT` kořen souborů nebo jejich vzdálenou URL.
