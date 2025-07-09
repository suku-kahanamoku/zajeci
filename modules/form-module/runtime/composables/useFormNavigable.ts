import { useForm } from "./useForm";
import type { IFormConfig, IFormField } from "../types";
import type { IResponse, IHttpMethod } from "@suku-kahanamoku/common-module/types";
import {
  CLONE,
  CONVERT_DOT_TO_OBJECT,
} from "@suku-kahanamoku/common-module/utils";

/**
 * @composable useFormNavigable
 * @description
 * Poskytuje funkce pro navigaci a práci s formuláři včetně odesílání dat a správy upravených záznamů.
 *
 * @return {*} Objekt obsahující funkce pro práci s formuláři a navigací.
 *
 * @example
 * ```typescript
 * const { onNavigate, onSubmit } = useFormNavigable();
 * await onNavigate(config, data);
 * const response = await onSubmit(config, data);
 * ```
 */
export function useFormNavigable() {
  const route = useRoute();
  const t = useNuxtApp().$tt;
  const { getUrlFieldsPayload, getFieldsPayload } = useForm();
  const navigable = useNavigable();
  const { display } = useToastify();

  // Store pro pamatování naposledy upraveného záznamu
  const modifiedStore = useModifiedItemStore();

  /**
   * @function onNavigate
   * @description
   * Naviguje na novou URL na základě dat z formuláře.
   *
   * @param {IFormConfig} config - Konfigurace formuláře.
   * @param {Record<string, any>} data - Data z formuláře.
   * @param {Record<string, string>} [operators] - Operátory pro jednotlivá pole.
   * @return {*}  {Promise<void>}
   *
   * @example
   * ```typescript
   * await onNavigate(config, data);
   * ```
   */
  async function onNavigate(
    config: IFormConfig,
    data: Record<string, any>,
    operators?: Record<string, string>
  ): Promise<void> {
    const result = _getParams(config, data, operators);
    navigable.navigate(result.config, result.params);
  }

  /**
   * @function onFilterChange
   * @description
   * Naviguje na novou URL při změně filtru a resetuje stránkování.
   *
   * @param {IFormConfig} config - Konfigurace formuláře.
   * @param {Record<string, any>} data - Data z formuláře.
   * @param {Record<string, string>} [operators] - Operátory pro jednotlivá pole.
   * @return {*}  {Promise<void>}
   *
   * @example
   * ```typescript
   * await onFilterChange(config, data);
   * ```
   */
  async function onFilterChange(
    config: IFormConfig,
    data: Record<string, any>,
    operators?: Record<string, string>
  ): Promise<void> {
    const result = _getParams(config, data, operators);
    const pagination = result.config.pagination || {};
    pagination.page = 1;
    navigable.navigate(result.config, result.params);
  }

  /**
   * @function _getParams
   * @description
   * Vrací konfiguraci a parametry pro vytvoření URL query stringu.
   *
   * @param {IFormConfig} config - Konfigurace formuláře.
   * @param {Record<string, any>} data - Data z formuláře.
   * @param {Record<string, string>} [operators] - Operátory pro jednotlivá pole.
   * @return {*}  {{ config: IFormConfig; params: Record<string, any> }}
   *
   * @example
   * ```typescript
   * const result = _getParams(config, data);
   * console.log(result.params);
   * ```
   */
  function _getParams(
    config: IFormConfig,
    data: Record<string, any>,
    operators?: Record<string, string>
  ): { config: IFormConfig; params: Record<string, any> } {
    config = CLONE(config);
    if (operators) {
      config.fields?.forEach((field: IFormField) => {
        if (field.operator?.enabled) {
          const operator = operators[field.name];
          if (operator) {
            field.operator.value = operator;
          }
        }
      });
    }
    const params = data
      ? { fields: JSON.parse(`{${getUrlFieldsPayload(data, config.fields)}}`) }
      : {};
    return { config, params };
  }

  /**
   * @function onSubmit
   * @description
   * Odesílá data formuláře na server pomocí POST nebo PATCH.
   *
   * @param {IFormConfig} config - Konfigurace formuláře.
   * @param {Record<string, any>} data - Data z formuláře.
   * @param {Record<string, any>} [model] - Model dat.
   * @return {*}  {(Promise<IResponse | undefined>)}
   *
   * @example
   * ```typescript
   * const response = await onSubmit(config, data);
   * console.log(response);
   * ```
   */
  async function onSubmit(
    config: IFormConfig,
    body: Record<string, any>,
    model?: Record<string, any>
  ): Promise<IResponse | undefined> {
    let result;
    const method = config.method || "POST";
    const data = getFieldsPayload(body, config.fields, model);
    CONVERT_DOT_TO_OBJECT(data);
    const options: Record<string, any> = { method, body: data };
    let url = method === "PATCH" ? config.patchUrl : config.postUrl;
    if (url) {
      url = useUrl(url, { route, item: model || data });
      url = useFactory(url, config.factory, route.path);
      try {
        const response = await useApi(url, options);
        onSubmitSuccess(response!, method, config);
        result = response;
      } catch (error: any) {
        onSubmitError(error, method, config, options.body);
      }
    }
    return result;
  }

  /**
   * @function onSubmitSuccess
   * @description
   * Callback při úspěšném odeslání formuláře.
   *
   * @param {IResponse} result - Odpověď serveru.
   * @param {IHttpMethod} [method] - HTTP metoda.
   * @param {IFormConfig} [config] - Konfigurace formuláře.
   *
   * @example
   * ```typescript
   * onSubmitSuccess(response, "POST", config);
   * ```
   */
  function onSubmitSuccess(
    result: IResponse,
    method?: IHttpMethod,
    config?: IFormConfig
  ): void {
    if (config?.modelType && result?.data?._id) {
      modifiedStore.setItem(config.modelType, method!, result.data);
    }
    if (config && method) {
      const successMsg = config[`${method?.toLowerCase()}_success`];
      display(
        result?.msgs?.length
          ? result?.msgs
          : successMsg && { type: "success", message: successMsg }
      );
    }
  }

  /**
   * @function onSubmitError
   * @description
   * Callback při chybě při odeslání formuláře.
   *
   * @param {IResponse} error - Chyba serveru.
   * @param {IHttpMethod} [method] - HTTP metoda.
   * @param {IFormConfig} [config] - Konfigurace formuláře.
   * @param {*} [item] - Data formuláře.
   *
   * @example
   * ```typescript
   * onSubmitError(error, "POST", config, data);
   * ```
   */
  function onSubmitError(
    error: IResponse,
    method?: IHttpMethod,
    config?: IFormConfig,
    item?: any
  ): void {
    let msgs = error?.data?.msgs || error?.data?.data?.msgs;
    if (!msgs?.length && config) {
      const errorMsg = config[`${method?.toLowerCase()}_error`];
      if (errorMsg) {
        msgs = [{ type: "error", message: errorMsg }];
      }
    }
    if (!msgs?.length) {
      msgs = { type: "error", message: "" };
      switch (error.statusCode) {
        case 401:
        case 403:
          msgs.message = t("$.message.403_error", {
            name: item?.gen_data?.name || item?.description,
          });
          break;

        default:
          msgs.message = t("$.message.default_error", {
            name: item?.gen_data?.name || item?.description,
          });
          break;
      }
    }
    display(msgs);
  }

  return {
    onNavigate,
    onFilterChange,
    onSubmit,
    onSubmitSuccess,
    onSubmitError,
    modifiedStore,
    ...navigable,
  };
}
