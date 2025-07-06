import {
  ITERATE,
  GET_OBJECT_PARAM,
  IS_OBJECT,
  DIFFERENCE,
  TRIM,
  IS_OBJECT_ID,
  IS_DEFINED,
  RESOLVE_MARKS,
  INTERSECTION,
} from "@suku-kahanamoku/common-module/utils";
import type { IFormField } from "../types/field.interface";

export function useForm() {
  /**
   * Vrati hodnoty fieldu daneho formulare, napr. {firstname:John,lastname:Doe}
   *
   * @param {Record<string, any>} data
   * @param {IFormField[]} [fields]
   * @return {*}  {Record<string, any>}
   */
  function getFieldsPayload(
    data: Record<string, any>,
    fields?: IFormField[],
    model?: Record<string, any>
  ): Record<string, any> {
    const result: Record<string, any> = {};
    ITERATE(data, (value, name) => {
      if (!name || typeof value === "undefined") return;

      const field = fields?.find((f) => f.name === name);
      if (field?.ignore) return;

      // If the field is an object array, construct accordingly
      let parsedValue = field?.isObjectArray
        ? _getValue(value, field)
        : _getValue(value, field);

      // Pokud existuje model, porovna hodnotu z daneho atributu s novou hodnotou
      if (model) {
        let modelValue = GET_OBJECT_PARAM(model, name);
        // Pokud jsou hodnoty (parsedValue a modelValue) pole, zkontroluje jejich rozdil
        if (
          modelValue?.length &&
          parsedValue?.length &&
          Array.isArray(modelValue) &&
          Array.isArray(parsedValue)
        ) {
          if (field?.restOptions?.value) {
            // pokud je to objekt, vrati hodnotu daneho atributu
            if (IS_OBJECT(modelValue[0])) {
              modelValue = modelValue.map((i) => i[field?.restOptions?.value]);
            }
            // pokud je to objekt, vrati hodnotu daneho atributu
            if (IS_OBJECT(parsedValue[0])) {
              parsedValue = parsedValue.map(
                (i) => i[field?.restOptions?.value]
              );
            }
          } else {
            // pokud je to objekt, vrati id
            if (IS_OBJECT(modelValue[0])) {
              modelValue = modelValue.map((i) => i._id);
            }
            // pokud je to objekt, vrati id
            if (IS_OBJECT(parsedValue[0])) {
              parsedValue = parsedValue.map((i) => i._id);
            }
          }
          // pokud v poli existuje rozdil do resultu vlozi atribut s novymi daty
          if (DIFFERENCE(parsedValue, modelValue)?.length) {
            result[name] = parsedValue;
          }
        }
        // Jinak zkontroluje zda hodnoty jsou si rovne
        else if (modelValue !== parsedValue) {
          result[name] =
            parsedValue !== null && parsedValue?.toString()?.length
              ? parsedValue
              : null;
        }
      }
      // Jinak pouzije novou hodnotu
      else {
        result[name] =
          parsedValue !== null && parsedValue?.toString()?.length
            ? parsedValue
            : null;
      }
    });
    return result;
  }

  /**
   * Vrati string fields pro url => definice fieldu v url
   *
   * @param {*} form
   * @param {IFormField[]} [fields]
   * @returns {*}  {string}
   */
  function getUrlFieldsPayload(form: any, fields?: IFormField[]): string {
    let result = "";
    if (form?.$el) {
      new FormData(form.$el)?.forEach(
        (value: any, name: string) =>
          (result += _createUrlField(
            value,
            name,
            fields?.find((field) => field.name === name)
          ))
      );
    }
    //
    else {
      ITERATE(
        form,
        (value, name) =>
          (result += _createUrlField(
            value,
            name,
            fields?.find((field) => field.name === name)
          ))
      );
    }

    return TRIM(result, ",");
  }

  /**
   * Vytvori definici fieldu pro url, ktery pak prepise defaultni url
   *
   * @param {*} value
   * @param {string} name
   * @param {IFormField} [field]
   * @returns {*}  {string}
   */
  function _createUrlField(
    value: any,
    name: string,
    field?: IFormField
  ): string {
    if (!name || typeof value === "undefined" || field?.ignore) {
      return "";
    }

    let result = "";
    value = _getValue(value, field);

    const operator = field?.operator?.value;

    switch (operator) {
      case "$null":
      case "$not_null":
        result += _createUrlFieldString(
          name,
          null,
          field?.operator?.enabled ? operator : undefined
        );
        break;

      case "$start":
        value = value === null ? "" : value;
        result += _createUrlFieldString(
          name,
          value,
          field?.operator?.enabled ? operator : undefined
        );
        break;

      case "$range":
        value = value === null ? "" : value;
        result += _createUrlRangeFieldString(
          name,
          value,
          field?.operator?.enabled ? operator : undefined
        );
        break;

      default:
        value = value === null ? "" : value;
        result += _createUrlDefaultFieldString(
          name,
          value,
          field?.operator?.enabled ? operator : undefined
        );
        break;
    }

    return result;
  }

  /**
   * Helper function to create a field string.
   *
   * @param {string} name
   * @param {*} value
   * @param {string} [operator]
   * @return {*}  {string}
   */
  function _createUrlFieldString(
    name: string,
    value: any,
    operator?: string
  ): string {
    const encodedValue = encodeURIComponent(value);
    return operator
      ? `"${name}":{"value":${
          value === null ? value : `"${encodedValue}"`
        },"operator":{"value":"${operator}"}},`
      : `"${name}":{"value":${value === null ? value : `"${encodedValue}"`}},`;
  }

  /**
   * Helper function to create a range field string.
   *
   * @param {string} name
   * @param {any[]} value
   * @param {string} [operator]
   * @return {*}  {string}
   */
  function _createUrlRangeFieldString(
    name: string,
    value: any[],
    operator?: string
  ): string {
    const rangeValue =
      Array.isArray(value) && value.length ? `["${value.join('","')}"]` : '""';
    return operator
      ? `"${name}":{"value":${rangeValue},"operator":{"value":"${operator}"}},`
      : `"${name}":{"value":${rangeValue}},`;
  }

  /**
   * Helper function to create a default field string for different value types.
   *
   * @param {string} name
   * @param {*} value
   * @param {string} [operator]
   * @return {*}  {string}
   */
  function _createUrlDefaultFieldString(
    name: string,
    value: any,
    operator?: string
    /* field?: IFormField */
  ): string {
    switch (typeof value) {
      case "undefined":
        return "";

      case "object":
        if (Array.isArray(value)) {
          const arrayOperator = operator || "$in";
          let arrayValue = '""';
          if (value.length) {
            arrayValue = "[";
            arrayValue += value
              .map((val) => (typeof val === "string" ? `"${val}"` : val))
              .join(",");
            arrayValue += "]";
          }
          return operator
            ? `"${name}":{"value":${arrayValue},"operator":{"value":"${arrayOperator}"}},`
            : `"${name}":{"value":${arrayValue}},`;
        }
        //
        else if (value === null) {
          return operator
            ? `"${name}":{"value":${value},"operator":{"value":"${operator}"}},`
            : `"${name}":{"value":${value}},`;
        }
        //
        else {
          return operator
            ? `"${name}":{"value":${JSON.stringify(
                value || []
              )},"operator":{"value":"${operator}"}},`
            : `"${name}":{"value":${JSON.stringify(value || [])}},`;
        }

      case "boolean":
      case "number":
        return operator
          ? `"${name}":{"value":${value},"operator":{"value":"${operator}"}},`
          : `"${name}":{"value":${value}},`;

      default:
        return operator
          ? `"${name}":{"value":"${encodeURIComponent(
              value
            )}","operator":{"value":"${operator || "$eq"}"}},`
          : `"${name}":{"value":"${encodeURIComponent(value)}"},`;
    }
  }

  /**
   * Vrati query pro restUrl => komunikace s backendem
   * Dle fields vytvori url string, kteremu rozumi Mongo DB
   *
   * @param {IFormField[]} fields
   * @returns {string}
   */
  function getRestUrlFieldsPayload(fields: IFormField[]): string {
    let result = "";

    fields
      .filter((field) => !field.ignore && _isFieldValueDefined(field.value))
      .forEach((field) => {
        let value = _getValue(field.value, field);
        // Pokud je to regexova hodnota, musi se escapovat tecky
        if (["$start", "$regex"].includes(field.operator?.value || "")) {
          value = value.toString().replaceAll(/[.*+?^${}()|[\]\\]/g, "\\\\$&");
        }

        // Vytvori field name
        const fieldName =
          field.isObjectArray &&
          ["search", "select"].includes(field.type!) &&
          field.restOptions.value
            ? `"${field.name}.${field.restOptions.value}"`
            : `"${field.name}"`;

        if (field.operator?.value) {
          result += _handleFieldWithOperator(value, field, fieldName);
        } else {
          result += _handleFieldWithoutOperator(value, field, fieldName);
        }
      });

    return TRIM(result, ",");
  }

  /**
   * Checks if a field value is defined and non-empty.
   *
   * @param {*} value
   * @returns {boolean}
   */
  function _isFieldValueDefined(value: any): boolean {
    return Array.isArray(value)
      ? value.length > 0
      : typeof value !== "undefined";
  }

  /**
   * Handles fields with specific operators.
   *
   * @param {*} value
   * @param {IFormField} field
   * @param {string} fieldName
   * @return {*}  {string}
   */
  function _handleFieldWithOperator(
    value: any,
    field: IFormField,
    fieldName: string
  ): string {
    switch (field.operator?.value) {
      case "$null":
        return `${fieldName}:null,`;

      case "$not_null":
        return `${fieldName}:{"$ne":null},`;

      case "$start":
        return value?.toString().length
          ? `${fieldName}:{"$regex":"^${value}","$options":"i"},`
          : "";

      case "$range":
        return Array.isArray(value) && value.length
          ? `${fieldName}:{"$gte":"${value[0] || ""}","$lte":"${
              value[1] || ""
            }"},`
          : "";

      default:
        return _handleFieldWithoutOperator(value, field, fieldName);
    }
  }

  /**
   * Handles fields without specific operators.
   *
   * @param {*} value
   * @param {IFormField} field
   * @param {string} fieldName
   * @returns {string}
   */
  function _handleFieldWithoutOperator(
    value: any,
    field: IFormField,
    fieldName: string
  ): string {
    const operator = field.operator?.value || _inferOperator(value);
    // dle hodnot vytvori query stringy
    switch (typeof value) {
      case "object":
        // pokud je to pole, musi mit hodnoty
        if (Array.isArray(value)) {
          if (value.length) {
            const tmpValue =
              field.dbType === "String" || !field.dbType
                ? `["${value.join('","')}"]`
                : `[${value.join(",")}]`;
            return `${fieldName}:{"${operator}":${tmpValue}},`;
          }
          // pokud nema hodnoty, tak vrati prazdny string
          return "";
        }
        // pokud je to null, vytvori s null
        else if (value === null) {
          return operator === "$eq"
            ? `${fieldName}:${value}`
            : `${fieldName}:{"${operator}":${value}},`;
        }
        // jinak cely objekt
        else {
          return `${fieldName}:${JSON.stringify(value) || []},`;
        }

      case "boolean":
      case "number":
        return operator === "$eq"
          ? `${fieldName}:${value},`
          : `${fieldName}:{"${operator}":${value}},`;

      case "string":
        return _handleStringField(value, field, fieldName, operator);
    }

    return "";
  }

  /**
   * Infers the default operator based on the value type.
   *
   * @param {*} value
   * @returns {string}
   */
  function _inferOperator(value: any): string {
    if (Array.isArray(value)) return "$in";
    return "$eq";
  }

  /**
   * Handles string-type fields and builds the appropriate query string.
   *
   * @param {string} value
   * @param {IFormField} field
   * @param {string} fieldName
   * @param {string} operator
   * @returns {string}
   */
  function _handleStringField(
    value: string,
    field: IFormField,
    fieldName: string,
    operator: string
  ): string {
    if (!value.length) return "";

    if (IS_OBJECT_ID(value)) {
      return `${fieldName}:"${value}",`;
    }

    const isDateType =
      field.type === "datetime" ||
      ["Date", "Timestamp"].includes(field.dbType as string);

    // pokud je to datum
    if (isDateType) {
      return operator === "$eq"
        ? `${fieldName}:"${value}",`
        : `${fieldName}:{"${operator}":"${value}"},`;
    }
    // pokud je to objectArrray
    else if (field.isObjectArray) {
      if (field.restOptions.label) {
        return `"${field.colName || field.name}":{"$elemMatch":{"${
          field.restOptions.label
        }":{"${operator}":"${value}","$options":"i"}}},`;
      }
    }

    return _buildStringQuery(value, fieldName, operator);
  }

  /**
   * Builds the query string for string fields based on the operator.
   *
   * @param {string} fieldName
   * @param {string} value
   * @param {string} operator
   * @returns {string}
   */
  function _buildStringQuery(
    value: string,
    fieldName: string,
    operator: string
  ): string {
    switch (operator) {
      case "$regex":
        return `${fieldName}:{"$regex":"${value}","$options":"i"},`;
      case "$ne":
        return `${fieldName}:{"$not":{"$regex":"${value}","$options":"i"}},`;
      default:
        return `${fieldName}:"${value}",`;
    }
  }

  /**
   * Vrati hodnotu ve spravnem typu
   *
   * @param {*} value
   * @param {IFormField} [field]
   * @return {*}  {*}
   */
  function _getValue(value: any, field?: IFormField): any {
    let result: any = TRIM(value);

    try {
      // je to multiple, ale hodnota neni pole, prevede na pole
      if (field?.multiple && !Array.isArray(result)) {
        result = IS_DEFINED(result)
          ? result
              .toString()
              .split(",")
              .map((item: any) => TRIM(item))
              .filter((item: any) => item.length)
          : [];
      }

      // pokud je to datum field, tak rozparsuje hodnotu a prevede na iso string
      if (result instanceof Date) {
        result = result.toISOString();
      }

      // Convert value based on field's dbType
      switch (field?.dbType) {
        case "Boolean":
          result = _parseBooleanValue(result);
          break;

        case "String":
        case "Timestamp":
          result = _parseStringValue(result);
          break;

        default:
          result = _parseDefaultValue(result);
          break;
      }
    } catch (error) {
      console.error("Error parsing value:", error);
    }

    return result;
  }

  /**
   * Parses value to boolean or array of booleans.
   *
   * @param {*} value
   * @returns {*} boolean or array of booleans
   */
  function _parseBooleanValue(value: any): any {
    if (Array.isArray(value)) {
      return value.map((item) => _parseToBoolean(item));
    }

    return _parseToBoolean(value);
  }

  /**
   * Converts a value to a boolean.
   *
   * @param {string} value
   * @returns {boolean|string}
   */
  function _parseToBoolean(value: string): boolean | string {
    try {
      return !!JSON.parse(value);
    } catch {
      return value; // Return original value if parsing fails
    }
  }

  /**
   * Parses value to string or array of strings.
   *
   * @param {*} value
   * @returns {*} string or array of strings
   */
  function _parseStringValue(value: any): any {
    if (Array.isArray(value)) {
      return value.map((item) => (item === null ? null : item.toString()));
    }

    return value === null ? null : value.toString();
  }

  /**
   * Parses value using JSON.parse, or returns the original value if parsing fails.
   *
   * @param {*} value
   * @returns {*} parsed value
   */
  function _parseDefaultValue(value: any): any {
    if (Array.isArray(value)) {
      return value.filter(Boolean).map((item) => _parseOrDefault(item));
    }

    return _parseOrDefault(value);
  }

  /**
   * Tries to parse a value as JSON, returning the original value if parsing fails.
   *
   * @param {string} value
   * @returns {*}
   */
  function _parseOrDefault(value: string): any {
    try {
      const parsedValue = JSON.parse(value);
      if (typeof parsedValue === "object" && value !== null) {
        return value;
      } else {
        return parsedValue;
      }
    } catch {
      return value; // Return original value if parsing fails
    }
  }

  return {
    getFieldsPayload,
    getUrlFieldsPayload,
    getRestUrlFieldsPayload,
  };
}
