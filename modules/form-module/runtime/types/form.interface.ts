import type {
  IConfig,
  IHttpMethod,
} from "@suku-kahanamoku/common-module/utils";

import type { IFormField } from "./field.interface";

/**
 * @interface IFormConfig
 * @description
 * Konfigurace formuláře, která definuje jeho pole, URL pro odeslání a další vlastnosti.
 */
export interface IFormConfig extends IConfig {
  /**
   * @property {IFormField[]} fields
   * Pole definující jednotlivé fieldy formuláře.
   */
  fields: IFormField[];

  /**
   * @property {IFormField[]} [infoFields]
   * Pole definující informační fieldy formuláře.
   */
  infoFields?: IFormField[];

  /**
   * @property {string} [postUrl]
   * URL, kam se má formulář odeslat metodou POST.
   */
  postUrl?: string;

  /**
   * @property {string} [patchUrl]
   * URL, kam se má formulář odeslat metodou PATCH.
   */
  patchUrl?: string;

  /**
   * @property {string} [deleteUrl]
   * URL, kam se má formulář odeslat metodou DELETE.
   */
  deleteUrl?: string;

  /**
   * @property {IHttpMethod} [method]
   * HTTP metoda, kterou se formulář odesílá.
   */
  method?: IHttpMethod;
}
