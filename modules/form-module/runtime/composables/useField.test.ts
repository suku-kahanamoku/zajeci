import { describe, it, expect, vi } from "vitest";
import { useField } from "./useField";
import type { IFormField, IRestOption } from "../types";

// Mock pro useApi
vi.mock("#imports", () => ({
  useApi: vi.fn(async (url) => {
    // Mock dat pro useApi, aby simuluje odpověď z API
    if (url.includes("search")) {
      return { data: [{ value: "1", label: "Label 1" }] };
    }
    return {
      data: [
        { value: "1", label: "Label 1" },
        { value: "2", label: "Label 2" },
      ],
    };
  }),
  useDateFormat: vi.fn((date, format) => `${date}-${format}`),
}));

describe("useField", () => {
  const { compare, getObjectValues, transformToOption } = useField();

  describe("compare", () => {
    it("should return true if values are different", () => {
      expect(compare("default", "new")).toBe(true);
    });

    it("should return false if values are the same", () => {
      expect(compare("default", "default")).toBe(false);
    });

    it("should handle object arrays correctly", () => {
      const field: any = {
        isObjectArray: true,
        restoptions: { value: "id" },
      };
      expect(compare([{ id: 1 }, { id: 2 }], [1, 2], field)).toBe(false);
      expect(compare([{ id: 1 }, { id: 2 }], [2, 3], field)).toBe(true);
    });
  });

  describe("getObjectValues", () => {
    it("should return correct object value from nested object", () => {
      const record = { user: { name: "John", age: 30 } };
      const fields = [{ name: "user.name" }, { name: "user.age" }];
      const result = getObjectValues(record, fields);
      expect(result).toEqual({ "user.name": "John", "user.age": 30 });
    });

    it("should return default field value if record is undefined", () => {
      const fields = [{ name: "username", value: "guest" }];
      const result = getObjectValues(undefined, fields);
      expect(result).toEqual({ username: "guest" });
    });
  });

  describe("transformToOption", () => {
    it("should transform array data to options", () => {
      const data = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
      ];
      const restOptions: IRestOption = {
        value: "value",
        label: "label",
        url: "",
      };
      const options = transformToOption(data, restOptions);
      expect(options).toEqual([
        {
          value: "1",
          label: "Option 1",
          item: { value: "1", label: "Option 1" },
        },
        {
          value: "2",
          label: "Option 2",
          item: { value: "2", label: "Option 2" },
        },
      ]);
    });

    it("should transform single object to option", () => {
      const data = { value: "1", label: "Option 1" };
      const restOptions: IRestOption = {
        value: "value",
        label: "label",
        url: "",
      };
      const option = transformToOption(data, restOptions);
      expect(option).toEqual({
        value: "1",
        label: "Option 1",
        item: { value: "1", label: "Option 1" },
      });
    });
  });

  describe("getResolvedValue", () => {
    const { getResolvedValue } = useField();

    it("should return formatted datetime value", () => {
      const model = { date: "2024-10-04" };
      const field: IFormField = { name: "date", type: "datetime", format: "YYYY-MM-DD" };
      const result = getResolvedValue(model, field, "en-US");
      expect(result).toBe("2024-10-04");
    });

    it("should format number with specified digits", () => {
      const model = { price: 1234.5678 };
      const field: IFormField = { name: "price", type: "number", digits: 2 };
      const result = getResolvedValue(model, field, "en-US");
      expect(result).toBe("1,234.57");
    });

    it("should round number when digits is 0", () => {
      const model = { price: 1234.5678 };
      const field: IFormField = { name: "price", type: "number", digits: 0 };
      const result = getResolvedValue(model, field, "en-US");
      expect(result).toBe("1,235");
    });

    it("should return correct label from field options", () => {
      const model = { status: 1 };
      const field: IFormField = {
        name: "status",
        type: "text",
        options: [
          { value: 1, label: "Active" },
          { value: 0, label: "Inactive" },
        ],
      };
      const result = getResolvedValue(model, field, "en-US");
      expect(result).toBe("Active");
    });

    it("should return the original value if no option matches", () => {
      const model = { status: 3 };
      const field: IFormField = {
        name: "status",
        type: "text",
        options: [
          { value: 1, label: "Active" },
          { value: 0, label: "Inactive" },
        ],
      };
      const result = getResolvedValue(model, field, "en-US");
      expect(result).toBe(3);
    });
  });
});
