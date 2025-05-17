import { ref } from "vue";

import type { IFormField } from "../types/field.interface";

/**
 * @composable useOperator
 * @description
 * Poskytuje funkce a data pro práci s operátory v rámci formulářových polí.
 *
 * @param {IFormField} field - Formulářové pole, pro které se operátory generují.
 * @return {*} Objekt obsahující seznam operátorů, jejich popisky a pomocné funkce.
 *
 * @example
 * ```typescript
 * const { operators, labels, getDefaultOperator, isNullableOperator } = useOperator(field);
 * console.log(operators.value); // ["$eq", "$ne", "$null", "$not_null"]
 * ```
 */
export function useOperator(field: IFormField) {
  const STRING_OPERATORS = [
    "$start",
    "$regex",
    "$eq",
    "$ne",
    "$null",
    "$not_null",
  ];

  const NUMBER_OPERATORS = [
    "$eq",
    "$gt",
    "$lt",
    "$gte",
    "$lte",
    "$ne",
    "$null",
    "$not_null",
  ];

  const BOOL_OPERATORS = ["$eq", "$ne", "$null", "$not_null"];

  const ARRAY_OPERATORS = ["$in", "$nin", "$null", "$not_null"];

  const DATE_OPERATORS = [
    "$gt",
    "$lt",
    "$gte",
    "$lte",
    "$eq",
    "$range",
    "$null",
    "$not_null",
  ];

  /**
   * @property {Ref<string[]>} operators
   * Seznam dostupných operátorů pro dané pole.
   */
  const operators = ref(field.operator?.options || _getOperators(field));

  /**
   * @property {Record<string, string>} labels
   * Popisky pro jednotlivé operátory.
   */
  const labels: Record<string, string> = {
    $eq: "=",
    $ne: "NOT",
    $regex: "*",
    $start: "^",
    $gt: ">",
    $gte: ">=",
    $lt: "<",
    $lte: "<=",
    $in: "OR",
    $nin: "NOT",
    $all: "AND",
    $null: "NULL",
    $not_null: "!NULL",
    $range: "RANGE",
  };

  /**
   * @function _getOperators
   * @description
   * Vrací seznam operátorů na základě typu pole.
   *
   * @param {IFormField} field - Formulářové pole.
   * @return {*}  {string[]} Seznam operátorů.
   *
   * @example
   * ```typescript
   * const operators = _getOperators(field);
   * console.log(operators); // ["$eq", "$ne", "$null", "$not_null"]
   * ```
   */
  function _getOperators(field: IFormField): string[] {
    if (field.multiple) {
      return ARRAY_OPERATORS;
    } else {
      if (field.dbType) {
        switch (field.dbType) {
          case "Date":
          case "Double":
          case "Integer":
            return NUMBER_OPERATORS;

          case "Boolean":
          case "Null":
            return BOOL_OPERATORS;

          case "Timestamp":
            return DATE_OPERATORS;

          default:
            return STRING_OPERATORS;
        }
      } else {
        switch (field.type) {
          case "number":
            return NUMBER_OPERATORS;

          case "datetime":
            return DATE_OPERATORS;

          default:
            return STRING_OPERATORS;
        }
      }
    }
  }

  /**
   * @function getDefaultOperator
   * @description
   * Vrací výchozí operátor pro dané pole.
   *
   * @return {*}  {string} Výchozí operátor.
   *
   * @example
   * ```typescript
   * const defaultOperator = getDefaultOperator();
   * console.log(defaultOperator); // "$eq"
   * ```
   */
  function getDefaultOperator() {
    return field.multiple ? "$in" : operators.value[0];
  }

  /**
   * @function isNullableOperator
   * @description
   * Kontroluje, zda je operátor typu `NULL` nebo `NOT NULL`.
   *
   * @param {string} [value] - Operátor.
   * @return {*}  {boolean} `true`, pokud je operátor typu `NULL` nebo `NOT NULL`.
   *
   * @example
   * ```typescript
   * const isNullable = isNullableOperator("$null");
   * console.log(isNullable); // true
   * ```
   */
  function isNullableOperator(value?: string) {
    return ["$null", "$not_null"].includes(value || "");
  }

  return { operators, labels, getDefaultOperator, isNullableOperator };
}
