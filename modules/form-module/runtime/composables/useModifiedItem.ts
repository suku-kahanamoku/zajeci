import { defineStore, reactive } from "#imports";

import type { IHttpMethod, IItem} from "@suku-kahanamoku/common-module/types";

/**
 * @composable useModifiedItemStore
 * @description
 * Pinia store pro správu upravených záznamů.
 *
 * @return {*} Objekt obsahující funkce pro práci s upravenými záznamy.
 *
 * @example
 * ```typescript
 * const modifiedStore = useModifiedItemStore();
 * modifiedStore.setItem("user", "POST", { id: 1, name: "John" });
 * const item = modifiedStore.getItem("user");
 * console.log(item); // { method: "POST", item: { id: 1, name: "John" } }
 * ```
 */
export const useModifiedItemStore = defineStore("ModifiedItem", () => {
  /**
   * @property {Record<string, { method: IHttpMethod; item: IItem } | undefined>} _items
   * Reaktivní objekt obsahující upravené záznamy.
   */
  const _items: Record<
    string,
    { method: IHttpMethod; item: IItem } | undefined
  > = reactive({});

  /**
   * @function getItem
   * @description
   * Vrací upravený záznam podle typu.
   *
   * @param {string} type - Typ záznamu.
   * @return {*}  {({ method: IHttpMethod; item: IItem } | undefined)} Upravený záznam nebo `undefined`.
   *
   * @example
   * ```typescript
   * const item = modifiedStore.getItem("user");
   * console.log(item); // { method: "POST", item: { id: 1, name: "John" } }
   * ```
   */
  const getItem = (type: string) => _items[type];

  /**
   * @function setItem
   * @description
   * Nastavuje upravený záznam.
   *
   * @param {string} type - Typ záznamu.
   * @param {IHttpMethod} method - HTTP metoda.
   * @param {IItem} item - Upravený záznam.
   *
   * @example
   * ```typescript
   * modifiedStore.setItem("user", "POST", { id: 1, name: "John" });
   * ```
   */
  const setItem = (type: string, method: IHttpMethod, item: IItem) => {
    _items[type] = { method, item };
  };

  /**
   * @function deleteItem
   * @description
   * Odstraňuje upravený záznam podle typu.
   *
   * @param {string} type - Typ záznamu.
   *
   * @example
   * ```typescript
   * modifiedStore.deleteItem("user");
   * ```
   */
  const deleteItem = (type: string) => {
    delete _items[type];
  };

  return { getItem, setItem, deleteItem };
});
