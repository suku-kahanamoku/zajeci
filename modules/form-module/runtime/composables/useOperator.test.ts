import { describe, it, expect, vi } from "vitest";

import { useOperator } from "./useOperator";
import type { IFormField } from "../types/field.interface";

// Mock useLang
vi.mock("#imports", () => ({
  useLang: () => ({
    t: (key: string) => key,
  }),
}));

describe("useOperator composable", () => {
  describe("operators", () => {
    it("should return ARRAY_OPERATORS for multiple fields", () => {
      const field = { multiple: true } as IFormField;
      const { operators } = useOperator(field);
      expect(operators.value).toEqual(["$in", "$nin", "$null", "$not_null"]);
    });

    it("should return NUMBER_OPERATORS for dbType 'Integer'", () => {
      const field = { dbType: "Integer" } as IFormField;
      const { operators } = useOperator(field);
      expect(operators.value).toEqual([
        "$eq",
        "$gt",
        "$lt",
        "$gte",
        "$lte",
        "$ne",
        "$null",
        "$not_null",
      ]);
    });

    it("should return BOOL_OPERATORS for dbType 'Boolean'", () => {
      const field = { dbType: "Boolean" } as IFormField;
      const { operators } = useOperator(field);
      expect(operators.value).toEqual(["$eq", "$ne", "$null", "$not_null"]);
    });

    it("should return DATE_OPERATORS for dbType 'Timestamp'", () => {
      const field = { dbType: "Timestamp" } as IFormField;
      const { operators } = useOperator(field);
      expect(operators.value).toEqual([
        "$gt",
        "$lt",
        "$gte",
        "$lte",
        "$eq",
        "$range",
        "$null",
        "$not_null",
      ]);
    });

    it("should return STRING_OPERATORS for default case", () => {
      const field = { dbType: "String" } as IFormField;
      const { operators } = useOperator(field);
      expect(operators.value).toEqual([
        "$start",
        "$regex",
        "$eq",
        "$ne",
        "$null",
        "$not_null",
      ]);
    });

    it("should return NUMBER_OPERATORS for type 'number' without dbType", () => {
      const field = { type: "number" } as IFormField;
      const { operators } = useOperator(field);
      expect(operators.value).toEqual([
        "$eq",
        "$gt",
        "$lt",
        "$gte",
        "$lte",
        "$ne",
        "$null",
        "$not_null",
      ]);
    });

    it("should return DATE_OPERATORS for type 'datetime' without dbType", () => {
      const field = { type: "datetime" } as IFormField;
      const { operators } = useOperator(field);
      expect(operators.value).toEqual([
        "$gt",
        "$lt",
        "$gte",
        "$lte",
        "$eq",
        "$range",
        "$null",
        "$not_null",
      ]);
    });
  });

  describe("getDefaultOperator", () => {
    it("should return '$in' for multiple fields", () => {
      const field = { multiple: true } as IFormField;
      const { getDefaultOperator } = useOperator(field);
      expect(getDefaultOperator()).toBe("$in");
    });

    it("should return the first operator in operators for non-multiple fields", () => {
      const field = { dbType: "Integer" } as IFormField;
      const { getDefaultOperator } = useOperator(field);
      expect(getDefaultOperator()).toBe("$eq");
    });
  });

  describe("isNullableOperator", () => {
    it("should return true for '$null' operator", () => {
      const field = {} as IFormField;
      const { isNullableOperator } = useOperator(field);
      expect(isNullableOperator("$null")).toBeTruthy();
    });

    it("should return true for '$not_null' operator", () => {
      const field = {} as IFormField;
      const { isNullableOperator } = useOperator(field);
      expect(isNullableOperator("$not_null")).toBeTruthy();
    });

    it("should return false for non-nullable operators", () => {
      const field = {} as IFormField;
      const { isNullableOperator } = useOperator(field);
      expect(isNullableOperator("$eq")).toBeFalsy();
    });

    it("should return false for undefined value", () => {
      const field = {} as IFormField;
      const { isNullableOperator } = useOperator(field);
      expect(isNullableOperator()).toBeFalsy();
    });
  });
});
