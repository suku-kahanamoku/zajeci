import type { RouteLocationNormalizedLoaded } from "vue-router";

import type { IConfig } from "@/modules/common-module/runtime/types";
import {
  ITERATE,
  MERGE,
  IS_OBJECT,
  REMOVE_LAST_STRING,
  GET_MARK,
} from "@/modules/common-module/runtime/utils";

import { useForm } from "./useForm";
import type { IFormField } from "../types/field.interface";

export function useUrlResolver() {
  const { getRestUrlFieldsPayload } = useForm();

  /**
   * Z url vytahne nastaveni configu pro danou komponentu a prepise defaultni hodnoty
   * napr.
   * config = {syscode: test}
   * url = test={restUrl: '/123'} => config = {syscode: test, restUrl: '/123'}
   *
   * @param {RouteLocationNormalizedLoaded} route
   * @param {IConfig} config
   */
  function updateConfig(route: RouteLocationNormalizedLoaded, config: IConfig) {
    // pak upravy config dle dat z url (config)
    try {
      ITERATE(
        JSON.parse((route.query[config?.syscode] as string) || "{}"),
        (attr, name) => {
          switch (name) {
            case "fields":
              ITERATE(attr, (item, key) => {
                // najde field a provede merge do defaultni => field = {...field, ...urlField}
                const index = config.fields.findIndex(
                  (field: IFormField) => field.name === key
                );
                if (index >= 0) {
                  config.fields[index] = MERGE(config.fields[index], item);
                }
              });
              // Upravi restUrl dle prichozich dat a defaultniho nastaveni
              _updateConfigRestUrl(config, attr);
              break;

            default:
              // pokud je to objekt => provede merge
              if (IS_OBJECT(config[name] || attr)) {
                config[name] = MERGE(config[name], attr);
              }
              // jinak vlozi natvrdo
              else {
                config[name] = attr;
              }
              break;
          }
        }
      );
    } catch (error: any) {
      console.error(error);
    }
  }

  /**
   * Upravi restUrl dle prichozich dat a defaultniho nastaveni
   *
   * @param {IConfig} config
   * @param {IFormField[]} fields
   */
  function _updateConfigRestUrl(config: IConfig, fields: IFormField[]) {
    try {
      const location = "http://location";
      const path = REMOVE_LAST_STRING(config.restUrl || "", "?", true);
      const query = getRestUrlFieldsPayload(config.fields);

      // url, kde query je vytvorene z fields...value
      const newUrl = new URL(
        query ? path + GET_MARK(path) + `q={${query}}` : path,
        location
      );
      const newQuery = JSON.parse(newUrl.searchParams.get("q") || "{}");

      // puvodni restUrl, ktere je v config.restUrl
      const defaultUrl = new URL(config.restUrl!, location);
      const defaultQuery = JSON.parse(defaultUrl.searchParams.get("q") || "{}");

      // tzn. hodnoty z fields vzdy zvitezi => prepisi hodnoty z restUrl
      newUrl.searchParams.set(
        "q",
        JSON.stringify({ ...defaultQuery, ...newQuery })
      );
      config.restUrl = newUrl.pathname + newUrl.search;
    } catch (error: any) {
      console.error(error);
    }
  }

  return { updateConfig };
}
