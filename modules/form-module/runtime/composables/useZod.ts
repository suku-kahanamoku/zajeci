import { z } from "zod";
import { useNuxtApp } from "#imports";

import { IS_DEFINED } from "@/modules/common-module/runtime/utils";

import type { IFormField } from "../types/field.interface";

export function useZod() {
  const t = useNuxtApp().$tt;

  /**
   *
   *
   * @param {*} schema
   * @return {*}  {boolean}
   */
  function _isRequired(schema: any): boolean {
    return schema.refine(
      (val: string) => IS_DEFINED(val) && val.toString().length,
      t("$.message.required")
    );
  }

  /**
   *
   *
   * @param {IFormField} field
   * @return {*}
   */
  function getSchema(field: IFormField) {
    let schema: any;

    switch (field.type) {
      case "email":
        schema = field.required
          ? z
              .string()
              .min(1, t("$.message.required"))
              .email(t("$.message.invalid_email"))
          : z.union([
              z.string().email(t("$.message.invalid_email")).nullish(),
              z.literal(""),
            ]);
        break;

      case "url":
        schema = field.required
          ? z
              .string()
              .min(1, t("$.message.required"))
              .url(t("$.message.invalid_url"))
          : z.union([
              z.string().url(t("$.message.invalid_url")).nullish(),
              z.literal(""),
            ]);
        break;

      case "datetime":
        // Definuje schemu jako retezec a kontroluje validni datumovy format (ISO 8601 nebo jiný formát)
        schema = z.any();

        // Pokud je pole povinne, kontroluje zda neni undefined
        if (field.required) {
          schema = _isRequired(schema);
        } else {
          schema = schema.nullish();
        }

        // Kontrola minimalniho data
        if (IS_DEFINED(field.minDate)) {
          const minDate = field.minDate;
          schema = schema.refine(
            (val: string) => val >= minDate,
            t("$.message.date_after", { minDate })
          );
        }

        // Kontrola maximalniho data
        if (IS_DEFINED(field.maxDate)) {
          const maxDate = field.maxDate;
          schema = schema.refine(
            (val: string) => val <= maxDate,
            t("$.message.date_before", { maxDate })
          );
        }
        break;

      case "number":
        schema = z.union([z.number(), z.literal("")]);

        // Pokud je pole povinne, kontroluje zda neni undefined
        if (field.required) {
          schema = _isRequired(schema);
        } else {
          schema = schema.nullish();
        }

        // Kontrola minimální hodnoty
        if (IS_DEFINED(field.min)) {
          schema = schema.refine((val: any) => {
            // Pokud se ma kontrolovat validace, hodnota musi byt definovana
            if (IS_DEFINED(val) && val.toString().length) {
              const num = parseFloat(val);
              return !isNaN(num) && num >= field.min;
            }
            // Jinak vrati true, ze je vse v poradku
            return true;
          }, t("$.message.min_value", { min: field.min }));
        }

        // Kontrola maximální hodnoty
        if (IS_DEFINED(field.max)) {
          schema = schema.refine((val: any) => {
            // Pokud se ma kontrolovat validace, hodnota musi byt definovana
            if (IS_DEFINED(val) && val.toString().length) {
              const num = parseFloat(val);
              return !isNaN(num) && num <= field.max;
            }
            // Jinak vrati true, ze je vse v poradku
            return true;
          }, t("$.message.max_value", { max: field.max }));
        }

        // Kontrola poctu desetinnych mist
        if (IS_DEFINED(field.precision)) {
          schema = schema.refine((val: number) => {
            // Pokud se ma kontrolovat validace, hodnota musi byt definovana
            if (IS_DEFINED(val) && val.toString().length) {
              const decimalPlaces = val?.toString()?.split(".")[1]?.length || 0;
              return decimalPlaces <= field.precision;
            }
            // Jinak vrati true, ze je vse v poradku
            return true;
          }, t("$.message.decimal_places", { precision: field.precision }));
        }
        break;

      case "checkbox":
        // Definuje schemu jako boolean
        schema = z.union([z.boolean().nullish(), z.literal("")]);

        // Pokud je pole povinne, kontroluje zda je true
        if (field.required) {
          schema = schema.refine(
            (val: boolean) => val === true,
            t("$.message.required")
          );
        } else {
          schema = schema.nullish();
        }
        break;

      case "file":
        // Definuje schemu jako instance souboru
        schema = z.any();

        // Pokud je pole povinne, kontroluje zda neni null
        if (field.required) {
          schema = _isRequired(schema);
        } else {
          schema = schema.nullish();
        }

        // Pokud je nastaven typ souboru, kontroluje se typ souboru
        if (IS_DEFINED(field.accept)) {
          schema = schema.refine(
            (file: any) =>
              IS_DEFINED(file?.type) && file.type !== field.accept
                ? false
                : true,
            t("$.message.invalid_file", { type: field.accept.toString() })
          );
        }

        // Pokud je nastaven velikost souboru, kontroluje se velikost souboru v MB
        if (IS_DEFINED(field.fileSize)) {
          schema = schema.refine(
            (file: any) =>
              IS_DEFINED(file?.size) &&
              (file.size || 1) / (1024 * 1024) >= field.fileSize
                ? false
                : true,
            t("$.message.max_file", { size: field.fileSize })
          );
        }
        break;

      default:
        if (field.multiple) {
          schema = z.union([z.any().nullish(), z.any().array().nullish()]);
        } else {
          schema = z.any().nullish();
        }

        // Pokud je pole povinne, vyzaduje minimalne jeden znak
        if (field.required) {
          schema = _isRequired(schema);
        }

        // Pokud je nastavena minimalni delka, kontroluje minimalni pocet znaku
        if (IS_DEFINED(field.minLength)) {
          schema = schema.refine(
            (val: any) =>
              IS_DEFINED(val) && val.toString().length
                ? val.length >= field.minLength!
                : true,
            t("$.message.min_length")
          );
        }

        // Pokud je nastavena maximalni delka, kontroluje maximalni pocet znaku
        if (IS_DEFINED(field.maxLength)) {
          schema = schema.refine(
            (val: any) =>
              IS_DEFINED(val) && val.toString().length
                ? val.length <= field.maxLength!
                : true,
            t("$.message.max_length")
          );
        }

        // Aplikace dodatecnych pravidel validace, napr. kontrola regexu
        field.validation?.forEach((rule) => {
          if (rule.pattern) {
            const regex = new RegExp(rule.pattern);
            schema = schema.refine(
              (val: string) =>
                IS_DEFINED(val) && val.toString().length
                  ? regex.test(val)
                  : true,
              t(rule.msg)
            );
          }
        });
        break;
    }

    // Pokud je zadana vychozi hodnota, nastavi ji
    if (field.value !== undefined) {
      schema = schema.default(field.value);
    }

    return schema;
  }

  return { getSchema };
}
