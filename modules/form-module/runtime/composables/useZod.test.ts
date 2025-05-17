import { describe, it, expect, vi } from "vitest";

import { useZod } from "./useZod";
import type { IFormField } from "../types/field.interface";

// Mockovani useNuxtApp funkce
vi.mock("#imports", () => ({
  useNuxtApp: () => ({
    $tt: (key: string) => key, // Jednoducha mock funkce, ktera vrati klic
  }),
}));

describe("useZod - getSchema", () => {
  const { getSchema } = useZod();

  it("should validate text field with required and minLength/maxLength", () => {
    const field: IFormField = {
      name: "username",
      type: "text",
      required: true,
      minLength: 5,
      maxLength: 10,
    };
    const schema = getSchema(field);
    expect(schema.safeParse("test").success).toBeFalsy(); // Prilis kratky
    expect(schema.safeParse("longusername").success).toBeFalsy(); // Prilis dlouhy
    expect(schema.safeParse("valid").success).toBeTruthy(); // spravne
  });

  it("should validate email field with correct format", () => {
    const field: IFormField = {
      name: "email",
      type: "email",
      required: true,
    };
    const schema = getSchema(field);
    expect(schema.safeParse("invalidemail").success).toBeFalsy(); // Spatny format
    expect(schema.safeParse("test@example.com").success).toBeTruthy(); // Spravny format
  });

  it("should validate URL field", () => {
    const field: IFormField = {
      name: "website",
      type: "url",
      required: true,
    };
    const schema = getSchema(field);
    expect(schema.safeParse("invalidurl").success).toBeFalsy(); // Neplatny url
    expect(schema.safeParse("https://example.com").success).toBeTruthy(); // Platny url
  });

  it("should validate datetime field with min and max date", () => {
    const field: IFormField = {
      name: "appointment",
      type: "datetime",
      required: true,
      minDate: "2023-01-01",
      maxDate: "2023-12-31",
    };
    const schema = getSchema(field);
    expect(schema.safeParse("2022-12-31").success).toBeFalsy(); // Mene nez min
    expect(schema.safeParse("2023-06-01").success).toBeTruthy(); // Spravny format
    expect(schema.safeParse("2024-01-01").success).toBeFalsy(); // Vice nez max
  });

  it("should validate number field with gte (min) and lte (max)", () => {
    const field: IFormField = {
      name: "age",
      type: "number",
      required: true,
      min: 18, // Min hodnota
      max: 100, // Max hodnota
    };

    const schema = getSchema(field);

    // Test hodnoty pod minimem
    expect(schema.safeParse(17).success).toBeFalsy(); // Mene nez min

    // Test hodnoty na minimu
    expect(schema.safeParse(18).success).toBeTruthy(); // Presne na min

    // Test hodnoty na maximu
    expect(schema.safeParse(100).success).toBeTruthy(); // Presne na max

    // Test hodnoty nad maximem
    expect(schema.safeParse(101).success).toBeFalsy(); // Vice nez max
  });

  it("should validate number field with decimal precision", () => {
    const field: IFormField = {
      name: "price",
      type: "number",
      precision: 2,
    };
    const schema = getSchema(field);
    expect(schema.safeParse(10.123).success).toBeFalsy(); // Prilis mnoho desetinnych mist
    expect(schema.safeParse(10.12).success).toBeTruthy(); // Spravna presnost
  });

  it("should validate checkbox field", () => {
    const field: IFormField = {
      name: "terms",
      type: "checkbox",
      required: true,
    };
    const schema = getSchema(field);
    expect(schema.safeParse(false).success).toBeFalsy(); // Neni zaskrtnuty
    expect(schema.safeParse(true).success).toBeTruthy(); // Zaskrtnuty
  });

  it("should validate file field", () => {
    const field: IFormField = {
      name: "profilePicture",
      type: "file",
      required: true,
    };
    const schema = getSchema(field);
    const file = new File(["content"], "image.png", { type: "image/png" });
    expect(schema.safeParse(file).success).toBeTruthy(); // Spravny soubor
    expect(schema.safeParse(null).success).toBeFalsy(); // Prazdne
  });

  it("should validate custom regex pattern", () => {
    const field: IFormField = {
      name: "username",
      type: "text",
      validation: [
        { pattern: "^[a-zA-Z0-9]+$", msg: "Only alphanumeric allowed" },
      ],
    };
    const schema = getSchema(field);
    expect(schema.safeParse("validUsername123").success).toBeTruthy(); // Platne
    expect(schema.safeParse("invalid@username").success).toBeFalsy(); // Neplatne (obsahuje @)
  });

  it("should apply default value if provided", () => {
    const field: IFormField = {
      name: "username",
      type: "text",
      value: "defaultUser",
    };
    const schema = getSchema(field);
    expect(schema.parse(undefined)).toBe("defaultUser"); // Vyzchozi hodnota
  });
});
