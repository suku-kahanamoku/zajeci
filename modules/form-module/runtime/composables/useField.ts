import { useApi } from "#imports";
import { useDateFormat } from "@vueuse/core";

import type { IItem } from "@/modules/common-module/runtime/types";
import {
  DIFFERENCE,
  GET_OBJECT_PARAM,
  IS_DEFINED,
} from "@/modules/common-module/runtime/utils";

import type {
  IFormField,
  IFormFieldOption,
  IRestOption,
} from "../types/field.interface";

/**
 * @composable useField
 * @description
 * Poskytuje funkce pro práci s formulářovými poli, včetně porovnávání hodnot, transformace dat a načítání možností.
 *
 * @return {*} Objekt obsahující funkce pro práci s poli.
 *
 * @example
 * ```typescript
 * const { compare, getObjectValues, transformToOption } = useField();
 * const isDifferent = compare(defaultValue, newValue, field);
 * const objectValues = getObjectValues(model, fields);
 * const options = transformToOption(data, restOptions);
 * ```
 */
export function useField() {
  const { t } = useLang();

  /**
   * @function compare
   * @description
   * Porovnává dvě hodnoty a určuje, zda jsou odlišné.
   *
   * @param {*} defValue - Výchozí hodnota.
   * @param {*} newValue - Nová hodnota.
   * @param {IFormField} [field] - Formulářové pole.
   * @return {*}  {boolean} `true`, pokud jsou hodnoty odlišné.
   *
   * @example
   * ```typescript
   * const isDifferent = compare(defaultValue, newValue, field);
   * console.log(isDifferent); // true nebo false
   * ```
   */
  const compare = (
    defValue: any,
    newValue: any,
    field?: IFormField
  ): boolean => {
    if (field?.type !== "hidden") {
      if (field?.isObjectArray) {
        return !!DIFFERENCE(
          Array.isArray(defValue)
            ? defValue?.map((record: IItem) =>
                GET_OBJECT_PARAM(record, field.restoptions?.value || "_id")
              )
            : [],
          newValue || []
        ).length;
      } else {
        return (
          (IS_DEFINED(newValue) ? newValue?.toString() : "") !==
          (IS_DEFINED(defValue) ? defValue.toString() : "")
        );
      }
    }
    return false;
  };

  /**
   * @function getObjectValues
   * @description
   * Vrací hodnoty polí z daného objektu.
   *
   * @param {Record<string, any>} model - Objekt obsahující data.
   * @param {IFormField[]} fields - Pole formulářových polí.
   * @return {*}  {Record<string, any>} Objekt obsahující hodnoty polí.
   *
   * @example
   * ```typescript
   * const values = getObjectValues(model, fields);
   * console.log(values); // { fieldName: value, ... }
   * ```
   */
  function getObjectValues(
    model: Record<string, any> | any,
    fields: IFormField[]
  ): Record<string, any> {
    return Object.fromEntries(
      fields.map((field) => {
        let value = model ? GET_OBJECT_PARAM(model, field.name) : field.value;
        if (field?.isObjectArray) {
          if (Array.isArray(value)) {
            value = field.multiple
              ? value
                  ?.map((i: IItem) =>
                    GET_OBJECT_PARAM(i, field.restOptions?.value || "_id")
                  )
                  .filter(Boolean)
              : value?.filter(Boolean)?.join(", ");
          } else {
            value = field.multiple ? [value].filter(Boolean) : value;
          }
        }
        return [field.name, value];
      })
    );
  }

  /**
   * @function transformToOption
   * @description
   * Transformuje data na možnosti pro select nebo search pole.
   *
   * @param {*} data - Data k transformaci.
   * @param {IRestOption} [restOptions] - Možnosti pro transformaci.
   * @return {*}  {(IFormFieldOption[] | IFormFieldOption)} Transformované možnosti.
   *
   * @example
   * ```typescript
   * const options = transformToOption(data, restOptions);
   * console.log(options); // [{ value: ..., label: ... }, ...]
   * ```
   */
  function transformToOption(
    data: any,
    restOptions?: IRestOption
  ): IFormFieldOption[] | IFormFieldOption {
    if (Array.isArray(data)) {
      return data
        ?.map((option) => ({
          value: GET_OBJECT_PARAM(option, restOptions?.value || "value"),
          label: GET_OBJECT_PARAM(option, restOptions?.label || "label"),
          description: GET_OBJECT_PARAM(
            option,
            restOptions?.description || "description"
          ),
          disabled: option.disabled,
          item: option.item || option,
        }))
        ?.filter((option) => typeof option.value !== "undefined");
    } else {
      return {
        value: GET_OBJECT_PARAM(data, restOptions?.value || "value"),
        label: GET_OBJECT_PARAM(data, restOptions?.label || "label"),
        description: GET_OBJECT_PARAM(
          data,
          restOptions?.description || "description"
        ),
        disabled: data.disabled,
        item: data.item || data,
      };
    }
  }

  /**
   * @function loadOptionsWithCustomData
   * @description
   * Načítá možnosti z backendu na základě vlastních dat.
   *
   * @param {*} values - Hodnoty pro dotaz.
   * @param {IFormFieldOption[]} options - Stávající možnosti.
   * @param {IRestOption} [restOptions] - Možnosti pro dotaz.
   * @return {*}  {Promise<any[]>} Načtené možnosti.
   *
   * @example
   * ```typescript
   * const options = await loadOptionsWithCustomData(values, existingOptions, restOptions);
   * console.log(options); // [{ value: ..., label: ... }, ...]
   * ```
   */
  async function loadOptionsWithCustomData(
    values: any,
    options: IFormFieldOption[],
    restOptions?: IRestOption
  ): Promise<any[]> {
    if (values && restOptions?.url) {
      try {
        const urlObj = new URL(restOptions.url, "http://location");
        if (Array.isArray(values) && values.length) {
          urlObj.searchParams.set(
            "q",
            `{"${restOptions.value}":{"$in":["${values.join('","')}"]}}`
          );
        } else if (values.length) {
          urlObj.searchParams.set("q", `{"${restOptions.value}":"${values}"}`);
        }
        const { data: result } = (await useApi(
          urlObj.pathname + urlObj.search
        ))!;
        const items = options?.map((record: any) => record.value) || [];
        result.forEach((record: any) => {
          if (
            !items.includes(
              IS_DEFINED(record) &&
                (typeof record === "object" || Array.isArray(record))
                ? record[restOptions.value]
                : record
            )
          ) {
            options?.unshift(
              transformToOption(record, restOptions) as IFormFieldOption
            );
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
    return options;
  }

  /**
   * @function loadOptionsWithSearchData
   * @description
   * Načítá možnosti z backendu na základě vyhledávací hodnoty.
   *
   * @param {string} value - Vyhledávací hodnota.
   * @param {IFormFieldOption[]} options - Stávající možnosti.
   * @param {IRestOption} [restOptions] - Možnosti pro dotaz.
   * @return {*}  {Promise<any[]>} Načtené možnosti.
   *
   * @example
   * ```typescript
   * const options = await loadOptionsWithSearchData(searchValue, existingOptions, restOptions);
   * console.log(options); // [{ value: ..., label: ... }, ...]
   * ```
   */
  async function loadOptionsWithSearchData(
    value: string,
    options: IFormFieldOption[],
    restOptions?: IRestOption
  ): Promise<any[]> {
    if (typeof value !== "undefined" && value?.length > 1 && restOptions?.url) {
      try {
        const urlObj = new URL(restOptions.url, "http://location");
        const attrName = restOptions.searchValue || restOptions.label;
        const escapedValue = value.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\\\$&");
        urlObj.searchParams.set(
          "q",
          `{"${attrName}":{"$regex":"${escapedValue}","$options":"i"}}`
        );
        const { data: result } = (await useApi(
          urlObj.pathname + urlObj.search
        ))!;
        const items = options?.map((record: any) => record.value) || [];
        result.forEach((record: any) => {
          if (!items.includes(record[restOptions.value])) {
            options?.unshift(
              transformToOption(record, restOptions) as IFormFieldOption
            );
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
    return options;
  }

  /**
   * @function getResolvedValue
   * @description
   * Vrací zpracovanou hodnotu atributu z daného modelu.
   *
   * @param {Record<string, any>} model - Model obsahující data.
   * @param {IFormField} field - Formulářové pole.
   * @param {string} locale - Jazykové nastavení.
   * @return {*}  {*} Zpracovaná hodnota.
   *
   * @example
   * ```typescript
   * const value = getResolvedValue(model, field, "en");
   * console.log(value); // Zpracovaná hodnota
   * ```
   */
  function getResolvedValue(
    model: Record<string, any>,
    field: IFormField,
    locale: string
  ): any {
    let result = GET_OBJECT_PARAM(model, field.colName || field.name);
    if (Array.isArray(result)) {
      return result.map((i) =>
        _getResolvedValue(
          field.isObjectArray
            ? GET_OBJECT_PARAM(
                i,
                field.restOptions?.label || field.restOptions?.value || "_id"
              )
            : i,
          field,
          locale
        )
      );
    }
    return _getResolvedValue(result, field, locale);
  }

  /**
   * @function _getResolvedValue
   * @description
   * Vrací zpracovanou hodnotu atributu z daného modelu.
   *
   * @param {*} value - Hodnota atributu.
   * @param {IFormField} field - Formulářové pole.
   * @param {string} locale - Jazykové nastavení.
   * @return {*}  {*} Zpracovaná hodnota.
   */
  function _getResolvedValue(
    value: any,
    field: IFormField,
    locale: string
  ): any {
    switch (field.type) {
      case "datetime":
        if (IS_DEFINED(value) && value.toString().length && field.format) {
          return useDateFormat(value, field.format).value;
        }
        break;

      case "number":
        if (field.digits) {
          return Number((+(value || 0)).toFixed(field.digits)).toLocaleString(
            locale,
            {
              minimumFractionDigits: field.digits,
            }
          );
        } else if (field.digits === 0) {
          const tmpValue = Math.round(Number(+(value || 0)));
          return isNaN(tmpValue)
            ? value?.toLocaleString()
            : tmpValue.toLocaleString();
        } else {
          const tmpValue = Number(+(value || 0));
          return isNaN(tmpValue)
            ? value?.toLocaleString()
            : tmpValue.toLocaleString();
        }

      default:
        if (field.options) {
          const option = field.options.find(
            (o: IFormFieldOption) => o.value === value
          );
          if (option) {
            return option.label;
          }
        }
    }
    return value;
  }

  function getSelectLabel(
    fields: IFormField[],
    fieldName: string,
    value: string | string[] | undefined
  ) {
    const field = fields.find((f) => f.name === fieldName);
    if (!field || field.type !== "select" || !field.options) return value;
    if (Array.isArray(value)) {
      return value
        .map((v) => {
          const opt = (field.options as IFormFieldOption[]).find(
            (o: IFormFieldOption) => o.value === v
          );
          return opt ? t(opt.label) : v;
        })
        .join(", ");
    } else {
      const opt = (field.options as IFormFieldOption[]).find(
        (o: IFormFieldOption) => o.value === value
      );
      return opt ? t(opt.label) : value;
    }
  }

  return {
    compare,
    getObjectValues,
    transformToOption,
    loadOptionsWithCustomData,
    loadOptionsWithSearchData,
    getResolvedValue,
    getSelectLabel,
  };
}
