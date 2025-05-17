import { describe, it, expect } from "vitest";

import { useForm } from "./useForm";
import type { IFormField } from "../types/field.interface";

describe("useForm", () => {
  const { getFieldsPayload, getUrlFieldsPayload, getRestUrlFieldsPayload } =
    useForm();

  describe("getFieldsPayload - Extended Test Suite", () => {
    it("should handle ignored fields properly", () => {
      const model = {
        field1: "value1",
        field2: "value2",
      };

      const fields: IFormField[] = [
        { name: "field1", ignore: true },
        { name: "field2" },
      ];

      const result = getFieldsPayload(model, fields);
      expect(result).toEqual({
        field2: "value2",
      });
    });

    it("should include checkbox fields", () => {
      const model = {
        checkboxField: true,
      };

      const fields: IFormField[] = [
        { name: "checkboxField", type: "checkbox" },
      ];
      const result = getFieldsPayload(model, fields);
      expect(result).toEqual({
        checkboxField: true,
      });
    });

    it("should handle normal fields correctly", () => {
      const model = {
        field3: "normalValue",
      };

      const fields: IFormField[] = [{ name: "field3" }];
      const result = getFieldsPayload(model, fields);
      expect(result).toEqual({
        field3: "normalValue",
      });
    });

    it("should parse object array fields correctly", () => {
      const model = {
        field4: "1,2,3",
      };

      const fields: IFormField[] = [
        {
          name: "field4",
          isObjectArray: true,
          restOptions: { value: "id" },
          multiple: true,
        },
      ];
      const result = getFieldsPayload(model, fields);
      expect(result).toEqual({
        /* field4: [{ id: 1 }, { id: 2 }, { id: 3 }], */
        field4: [1, 2, 3],
      });
    });

    it("should return an empty object when model data is empty", () => {
      const model = {};
      const fields: IFormField[] = [{ name: "field5" }];
      const result = getFieldsPayload(model, fields);
      expect(result).toEqual({});
    });

    it("should handle undefined fields array properly", () => {
      const model = {
        field6: "someValue",
      };
      const fields = undefined;
      const result = getFieldsPayload(model, fields);
      expect(result).toEqual({
        field6: "someValue",
      });
    });

    it("should handle special characters in field names and values", () => {
      const model = {
        "special:field8": "value/with special=chars",
      };

      const fields: IFormField[] = [{ name: "special:field8" }];
      const result = getFieldsPayload(model, fields);
      expect(result).toEqual({
        "special:field8": "value/with special=chars",
      });
    });

    it("should handle nested field values properly", () => {
      const model = {
        field9: { nested: "value" },
      };

      const fields: IFormField[] = [{ name: "field9" }];
      const result = getFieldsPayload(model, fields);
      expect(result).toEqual({
        field9: { nested: "value" },
      });
    });

    it("should handle different field types correctly", () => {
      const model = {
        field10: "textValue",
        field11: 123,
        field12: true,
        field13: "2021-10-10",
      };

      const fields: IFormField[] = [
        { name: "field10", type: "text" },
        { name: "field11", type: "number" },
        { name: "field12", type: "checkbox" },
        { name: "field13", type: "datetime" },
      ];
      const result = getFieldsPayload(model, fields);
      expect(result).toEqual({
        field10: "textValue",
        field11: 123,
        field12: true,
        field13: "2021-10-10",
      });
    });

    it("should treat fields with only whitespace values as empty", () => {
      const model = {
        field14: "   ",
      };

      const fields: IFormField[] = [{ name: "field14" }];
      const result = getFieldsPayload(model, fields);
      expect(result).toEqual({
        field14: null,
      });
    });

    it("should handle array values in normal fields correctly", () => {
      const model = {
        field15: ["val1", "val2"],
      };

      const fields: IFormField[] = [{ name: "field15" }];
      const result = getFieldsPayload(model, fields);
      expect(result).toEqual({
        field15: ["val1", "val2"],
      });
    });

    it("should handle missing fields gracefully", () => {
      const model = {};
      const fields: IFormField[] = [{ name: "field16" }];
      const result = getFieldsPayload(model, fields);
      expect(result).toEqual({});
    });
  });

  describe("getUrlFieldsPayload", () => {
    it("should create URL field string with $null operator", () => {
      const form = { field1: null };
      const fields: IFormField[] = [
        { name: "field1", operator: { enabled: true, value: "$null" } },
      ];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe(
        '"field1":{"value":null,"operator":{"value":"$null"}}'
      );
    });

    it("should create URL field string with $not_null operator", () => {
      const form = { field2: "someValue" };
      const fields: IFormField[] = [
        { name: "field2", operator: { enabled: true, value: "$not_null" } },
      ];
      const result = getUrlFieldsPayload(form, fields);
      // dava se null, pac se restartuje puvodni hodnota
      expect(result).toBe(
        '"field2":{"value":null,"operator":{"value":"$not_null"}}'
      );
    });

    it("should create URL field string with $start operator", () => {
      const form = { field3: "startValue" };
      const fields: IFormField[] = [
        { name: "field3", operator: { enabled: true, value: "$start" } },
      ];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe(
        '"field3":{"value":"startValue","operator":{"value":"$start"}}'
      );
    });

    it("should create URL field string with $range operator", () => {
      const form = { field4: [10, 20] };
      const fields: IFormField[] = [
        { name: "field4", operator: { enabled: true, value: "$range" } },
      ];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe(
        '"field4":{"value":["10","20"],"operator":{"value":"$range"}}'
      );
    });

    it("should handle fields with default operators", () => {
      const form = { field5: "someValue" };
      const fields: IFormField[] = [{ name: "field5" }];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe('"field5":{"value":"someValue"}');
    });

    it("should handle array values with inferred $in operator", () => {
      const form = { field6: ["value1", "value2"] };
      const fields: IFormField[] = [{ name: "field6" }];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe('"field6":{"value":["value1","value2"]}');
    });

    it("should handle boolean values", () => {
      const form = { field7: true, field8: false };
      const fields: IFormField[] = [{ name: "field7" }, { name: "field8" }];
      expect(getUrlFieldsPayload(form, fields)).toBe(
        '"field7":{"value":true},"field8":{"value":false}'
      );
    });

    it("should handle number values", () => {
      const form = { field9: 123 };
      const fields: IFormField[] = [{ name: "field9" }];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe('"field9":{"value":123}');
    });

    it("should handle empty string values", () => {
      const form = { field10: "" };
      const fields: IFormField[] = [{ name: "field10" }];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe('"field10":{"value":""}');
    });

    it("should handle ignored fields", () => {
      const form = {
        field11: "shouldNotBeIncluded",
        field12: "shouldBeIncluded",
      };
      const fields: IFormField[] = [
        { name: "field11", ignore: true },
        { name: "field12" },
      ];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe('"field12":{"value":"shouldBeIncluded"}');
    });

    it("should handle empty form and fields", () => {
      const form = {};
      const fields: IFormField[] = [];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe("");
    });

    it("should trim trailing commas", () => {
      const form = { field13: " value1", field14: " value2 " };
      const fields: IFormField[] = [{ name: "field13" }, { name: "field14" }];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe(
        '"field13":{"value":"value1"},' + '"field14":{"value":"value2"}'
      );
    });

    it("should handle nested objects in form values gracefully", () => {
      const form = { field1: { nested: "value" } };
      const fields: IFormField[] = [{ name: "field1" }];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe('"field1":{"value":{"nested":"value"}}'); // Assuming nested objects are ignored
    });

    it("should exclude fields with undefined values", () => {
      const form = { field2: undefined };
      const fields: IFormField[] = [{ name: "field2" }];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe(""); // undefined fields should be ignored
    });

    it("should handle a mix of different types in form values", () => {
      const form = {
        field3: "string",
        field4: 100,
        field5: false,
        field6: ["array"],
        field7: null,
      };
      const fields: IFormField[] = [
        { name: "field3" },
        { name: "field4" },
        { name: "field5" },
        { name: "field6" },
        { name: "field7" },
      ];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe(
        '"field3":{"value":"string"},' +
          '"field4":{"value":100},"field5":{"value":false},' +
          '"field6":{"value":["array"]},' +
          '"field7":{"value":""}'
      );
    });

    it("should handle form with empty string or whitespace-only values", () => {
      const form = { field10: "   " };
      const fields: IFormField[] = [{ name: "field10" }];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe('"field10":{"value":""}');
    });

    it("should handle null form input gracefully", () => {
      const form = null;
      const fields: IFormField[] = [{ name: "field12" }];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe(""); // Should return empty string
    });

    it("should handle null or undefined fields array gracefully", () => {
      const form = { field13: "someValue" };
      let fields = null;
      let result = getUrlFieldsPayload(form, fields!);
      expect(result).toBe('"field13":{"value":"someValue"}');

      fields = undefined;
      result = getUrlFieldsPayload(form, fields);
      expect(result).toBe('"field13":{"value":"someValue"}');
    });

    it("should encode special characters in field names and values", () => {
      const form = { "field:name": "value/with special=chars" };
      const fields: IFormField[] = [{ name: "field:name" }];
      const result = getUrlFieldsPayload(form, fields);
      expect(result).toBe(
        '"field:name":{"value":"value%2Fwith%20special%3Dchars"}'
      );
    });
  });

  describe("getRestUrlFieldsPayload", () => {
    // Helper function to create form fields
    function createField(
      name: string,
      value: any,
      operator?: { value: string },
      options?: any
    ) {
      return { name, value, operator, ...options } as IFormField;
    }

    it("should handle fields with $null operator", () => {
      const fields: IFormField[] = [
        createField("field1", null, { value: "$null" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe('"field1":null');
    });

    it("should handle fields with $not_null operator", () => {
      const fields: IFormField[] = [
        createField("field2", "someValue", { value: "$not_null" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe('"field2":{"$ne":null}');
    });

    it("should handle fields with $start operator", () => {
      const fields: IFormField[] = [
        createField("field3", "startValue", { value: "$start" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"field3":{"$regex":"^startValue","$options":"i"}'
      );
    });

    it("should handle fields with undefined dbType but with operators", () => {
      const fields: IFormField[] = [
        createField("fieldNoDbType", "value", { value: "$regex" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"fieldNoDbType":{"$regex":"value","$options":"i"}'
      );
    });

    it("should handle fields with $range operator", () => {
      const fields: IFormField[] = [
        createField("field4", ["10", "20"], { value: "$range" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"field4":{"$gte":"10","$lte":"20"}'
      );
    });

    it("should handle fields with $lt operator only", () => {
      const fields: IFormField[] = [
        createField("fieldLessThan", "10", { value: "$lt" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"fieldLessThan":{"$lt":10}'
      );
    });

    it("should handle fields with $gt operator only", () => {
      const fields: IFormField[] = [
        createField("fieldGreaterThan", "10", { value: "$gt" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"fieldGreaterThan":{"$gt":10}'
      );
    });

    it("should handle fields with $lte operator only", () => {
      const fields: IFormField[] = [
        createField("fieldLessThanOrEqual", "10", { value: "$lte" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"fieldLessThanOrEqual":{"$lte":10}'
      );
    });

    it("should handle fields with $gte operator only", () => {
      const fields: IFormField[] = [
        createField("fieldGreaterThanOrEqual", "10", { value: "$gte" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"fieldGreaterThanOrEqual":{"$gte":10}'
      );
    });

    it("should handle fields without specific operator", () => {
      const fields: IFormField[] = [createField("field5", "someValue")];
      expect(getRestUrlFieldsPayload(fields)).toBe('"field5":"someValue"');
    });

    it("should handle fields with array values and inferred $in operator", () => {
      const fields: IFormField[] = [
        createField("field6", ["value1", "value2"]),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"field6":{"$in":["value1","value2"]}'
      );
    });

    it("should handle fields with array values and $all operator", () => {
      const fields: IFormField[] = [
        createField("field6", ["value1", "value2"], { value: "$all" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"field6":{"$all":["value1","value2"]}'
      );
    });

    it("should handle boolean values", () => {
      const fields: IFormField[] = [
        createField("field7", true, { value: "$eq" }),
        createField("field8", false, { value: "$eq" }),
        createField("field9", true, { value: "$ne" }),
        createField("field10", false, { value: "$ne" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"field7":true,"field8":false,"field9":{"$ne":true},"field10":{"$ne":false}'
      );
    });

    it("should handle number values", () => {
      const fields: IFormField[] = [createField("field9", "123")];
      expect(getRestUrlFieldsPayload(fields)).toBe('"field9":123');
    });

    it("should handle empty string values", () => {
      const fields: IFormField[] = [createField("field10", "")];
      expect(getRestUrlFieldsPayload(fields)).toBe("");
    });

    it("should handle fields with empty values", () => {
      const fields: IFormField[] = [
        createField("field13", undefined),
        createField("field14", null),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe('"field14":null');
    });

    it("should trim trailing commas", () => {
      const fields: IFormField[] = [
        createField("field15", " value1"),
        createField("field16", " value2 "),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"field15":"value1","field16":"value2"'
      );
    });

    it("should convert comma-separated string to array when field.multiple is true", () => {
      const fields: IFormField[] = [
        createField("field17", "aa, bb, cc", undefined, { multiple: true }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"field17":{"$in":["aa","bb","cc"]}'
      );
    });

    it("should not alter array when field.multiple is true and value is already an array", () => {
      const fields: IFormField[] = [
        createField("field18", [1, 2, 3], undefined, {
          multiple: true,
          dbType: "Double",
        }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe('"field18":{"$in":[1,2,3]}');
    });

    it("should parse Boolean values correctly", () => {
      const fields: IFormField[] = [
        createField("field19", "true", undefined, { dbType: "Boolean" }),
        createField("field20", "false", undefined, {
          dbType: "Boolean",
          operator: { value: "$ne" },
        }),
        createField("field21", "invalid", undefined, { dbType: "Boolean" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"field19":true,"field20":{"$ne":false},"field21":"invalid"'
      );
    });

    it("should parse Integer values correctly", () => {
      const fields: IFormField[] = [
        createField("field22", "123", undefined, { dbType: "Integer" }),
        createField("field23", "not-a-number", undefined, {
          dbType: "Integer",
        }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"field22":123,"field23":"not-a-number"'
      );
    });

    it("should parse Double values correctly", () => {
      const fields: IFormField[] = [
        createField("field24", "123.456", undefined, { dbType: "Double" }),
        createField("field25", "not-a-number", undefined, { dbType: "Double" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"field24":123.456,"field25":"not-a-number"'
      );
    });

    it("should parse String values correctly", () => {
      const fields: IFormField[] = [
        createField("field26", 123, undefined, { dbType: "String" }),
        createField("field27", true, undefined, { dbType: "String" }),
        createField("field28", ["array"], undefined, { dbType: "String" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"field26":"123","field27":"true","field28":{"$in":["array"]}'
      );
    });

    it("should parse Date values correctly", () => {
      const date = new Date().toISOString();
      const fields: IFormField[] = [
        createField("field29", date, undefined, { dbType: "Date" }),
        createField("field30", "invalid-date", undefined, { dbType: "Date" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        `"field29":"${date}","field30":"invalid-date"`
      );
    });

    it("should handle Timestamp dbType as String", () => {
      const date = new Date().toISOString();
      const fields: IFormField[] = [
        createField("field31", date, undefined, { dbType: "Timestamp" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(`"field31":"${date}"`);
    });

    it("should parse Null values correctly", () => {
      const fields: IFormField[] = [
        createField("field32", null, undefined, { dbType: "Null" }),
        createField("field33", "", undefined, { dbType: "Null" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe('"field32":null');
    });

    it("should parse Default values correctly", () => {
      const fields: IFormField[] = [
        createField("field34", '{"key": "value"}'),
        createField("field35", "invalid json"),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"field34":"{"key": "value"}","field35":"invalid json"'
      );
    });

    it("should handle arrays with Default dbType", () => {
      const fields: IFormField[] = [
        createField("field36", ['{"key": "value"}']),
        createField("field37", ["invalid json"]),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"field36":{"$in":["{"key": "value"}"]},"field37":{"$in":["invalid json"]}'
      );
    });

    it("should return empty array when field.multiple is true but value is undefined or null", () => {
      const fields: IFormField[] = [
        createField("field38", undefined, undefined, { multiple: true }),
        createField("field39", null, undefined, { multiple: true }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe("");
    });

    it("should handle empty strings correctly", () => {
      const fields: IFormField[] = [
        createField("field43", "", undefined, { multiple: true }),
        createField("field44", "", undefined, { dbType: "String" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe("");
    });

    it("should handle array with mixed types correctly", () => {
      const fields: IFormField[] = [
        createField("fieldMixedArray", [1, "two", true], undefined, {
          multiple: true,
        }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"fieldMixedArray":{"$in":["1","two","true"]}'
      );
    });

    it("should handle field with complex object value", () => {
      const complexObject = { key1: "value1", key2: 123 };
      const fields: IFormField[] = [
        createField("fieldComplexObject", complexObject, undefined),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        `"fieldComplexObject":${JSON.stringify(complexObject)}`
      );
    });

    it("should handle fields with deeply nested objects", () => {
      const nestedObject = { key1: { subkey: "value" }, key2: [1, 2, 3] };
      const fields: IFormField[] = [
        createField("fieldNestedObject", nestedObject),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        `"fieldNestedObject":${JSON.stringify(nestedObject)}`
      );
    });

    it("should handle fields with empty arrays", () => {
      const fields: IFormField[] = [
        createField("fieldEmptyArray", [], { value: "$in" }),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(""); // Ensure it correctly results in an empty payload
    });

    it("should handle mismatched dbType and operator combinations gracefully", () => {
      const fields: IFormField[] = [
        createField(
          "fieldMismatch",
          "string",
          { value: "$lt" },
          { dbType: "String" }
        ),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe('"fieldMismatch":"string"');
    });

    it("should handle fields with $elemMatch operator", () => {
      const fields: IFormField[] = [
        createField(
          "references",
          "pdf",
          { value: "$regex" },
          {
            isObjectArray: true,
            colName: "references",
            restOptions: { label: "file_id" },
          }
        ),
      ];
      expect(getRestUrlFieldsPayload(fields)).toBe(
        '"references":{"$elemMatch":{"file_id":{"$regex":"pdf","$options":"i"}}}'
      );
    });
  });
});
