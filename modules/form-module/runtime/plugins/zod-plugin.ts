import { defineNuxtPlugin } from "#app";
import { z } from "zod";

/**
 * @plugin zod-plugin
 * @description
 * Plugin poskytující knihovnu `zod` pro validaci dat v Nuxt aplikaci.
 *
 * @example
 * ```typescript
 * const schema = z.object({
 *   name: z.string(),
 *   age: z.number(),
 * });
 * const result = schema.safeParse({ name: "John", age: 30 });
 * console.log(result.success); // true
 * ```
 */
export default defineNuxtPlugin(() => {
  return {
    provide: {
      zod: z,
    },
  };
});
