import { describe, it, expect } from "vitest";

import { useUrlResolver } from "./useUrlResolver";

describe("useUrlResolver", () => {
  const { updateConfig } = useUrlResolver();

  describe("updateConfig", () => {
    it("should update config with URL query parameters", () => {
      const route = {
        query: {
          test: JSON.stringify({
            fields: {
              fieldName: { label: "New Label" },
            },
            restUrl: "/new/url",
          }),
        },
      };
      const config = {
        syscode: "test",
        fields: [{ name: "fieldName", label: "Old Label" }],
        restUrl: "/default/url",
      };

      updateConfig(route as any, config);

      expect(config.fields[0].label).toBe("New Label");
      expect(config.restUrl).toBe("/new/url");
    });

    it("should merge nested objects", () => {
      const route = {
        query: {
          test: JSON.stringify({
            settings: { enabled: true },
          }),
        },
      };
      const config = {
        syscode: "test",
        settings: { enabled: false },
      };

      updateConfig(route as any, config);

      expect(config.settings.enabled).toBeTruthy();
    });

    it("should update config with URL query parameters", () => {
      const route = {
        query: {
          test: JSON.stringify({
            fields: {
              "model._id": { label: "Updated Label" },
              serial: { width: "100px" },
            },
            restUrl: "/api/aircrafts/updated",
          }),
        },
      };
      const config = {
        syscode: "test",
        restUrl: "/api/aircrafts",
        fields: [
          { name: "model._id", label: "Original Label" },
          { name: "serial", width: "60px" },
        ],
      };

      updateConfig(route as any, config);

      // Check that the fields have been updated
      expect(config.fields[0].label).toBe("Updated Label");
      expect(config.fields[1].width).toBe("100px");
      // Check that the restUrl has been updated
      expect(config.restUrl).toBe("/api/aircrafts/updated");
    });

    it("should merge nested objects in config", () => {
      const route = {
        query: {
          test: JSON.stringify({
            pagination: { page: 2 },
          }),
        },
      };
      const config = {
        syscode: "test",
        pagination: { enabled: true, page: 1, limit: 50 },
      };

      updateConfig(route as any, config);

      // Ensure the pagination page is updated while keeping the other properties intact
      expect(config.pagination.page).toBe(2);
      expect(config.pagination.limit).toBe(50);
    });

    it("should handle adding new properties to config", () => {
      const route = {
        query: {
          test: JSON.stringify({
            newProperty: "newValue",
          }),
        },
      };
      const config: any = {
        syscode: "test",
        existingProperty: "existingValue",
      };

      updateConfig(route as any, config);

      // Ensure the new property is added
      expect(config.newProperty).toBe("newValue");
      expect(config.existingProperty).toBe("existingValue");
    });

    it("should correctly handle empty query parameters", () => {
      const route = {
        query: {
          test: "",
        },
      };
      const config = {
        syscode: "test",
        fields: [{ name: "fieldName", label: "Old Label" }],
        restUrl: "/default/url",
      };

      updateConfig(route as any, config);

      expect(config.fields[0].label).toBe("Old Label");
      expect(config.restUrl).toBe("/default/url");
    });

    it("should remove default value when field value is an empty string", () => {
      const route = {
        query: {
          test: JSON.stringify({
            fields: {
              fieldName: { value: "" },
            },
            restUrl: "/new/url",
          }),
        },
      };
      const config = {
        syscode: "test",
        fields: [
          { name: "fieldName", label: "Old Label", value: "defaultValue" },
        ],
        restUrl: "/default/url",
      };

      updateConfig(route as any, config);

      expect(config.fields[0].value).toBe("");
      expect(config.restUrl).toBe("/new/url");
    });

    it("should handle nested objects correctly", () => {
      const route = {
        query: {
          test: JSON.stringify({
            nested: { level1: { level2: { enabled: true } } },
          }),
        },
      };
      const config = {
        syscode: "test",
        nested: { level1: { level2: { enabled: false } } },
      };

      updateConfig(route as any, config);

      expect(config.nested.level1.level2.enabled).toBeTruthy();
    });

    it("should handle complex restUrl modification correctly", () => {
      const route = {
        query: {
          test: JSON.stringify({
            fields: {
              fieldName: { value: "" },
              anotherField: { value: "newValue" },
            },
            restUrl: '/new/url?q={"fieldName":"defaultValue"}',
          }),
        },
      };
      const config = {
        syscode: "test",
        fields: [
          { name: "fieldName", label: "Field Name", value: "defaultValue" },
          { name: "anotherField", label: "Another Field", value: "oldValue" },
        ],
        restUrl: '/default/url?q={"fieldName":"defaultValue"}',
      };

      updateConfig(route as any, config);

      // restUrl v query prisel pozdeji, tzn. prepsal vse
      expect(config.restUrl).toBe('/new/url?q={"fieldName":"defaultValue"}');
    });
  });
});
