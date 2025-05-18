import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  addRouteMiddleware,
  hasNuxtModule,
  installModule,
  addComponentsDir,
} from "@nuxt/kit";
import defu from "defu";

/**
 * @typedef {Object} ModuleOptions
 * @description
 * Konfigurace modulu `menu-module`.
 */
export interface ModuleOptions {}

/**
 * @module menu-module
 * @description
 * Tento modul poskytuje podporu pro správu menu v Nuxt aplikaci.
 * Přidává runtime komponenty, middleware, a další konfigurace.
 *
 * @default
 * Výchozí konfigurace:
 * - `langModule`: Přidává lokalizace pro `en` a `cs`.
 * - `tailwindcss`: Konfiguruje TailwindCSS pro runtime komponenty.
 *
 * @example
 * ```typescript
 * export default defineNuxtConfig({
 *   menuModule: {
 *     // vlastní konfigurace
 *   },
 * });
 * ```
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "menu-module",
    configKey: "menuModule",
  },
  // Výchozí možnosti konfigurace Nuxt modulu
  defaults: {},

  /**
   * @function setup
   * @description
   * Hlavní funkce modulu, která nastavuje konfiguraci a přidává potřebné součásti.
   *
   * @param {ModuleOptions} _options - Uživatelské možnosti konfigurace.
   * @param {Nuxt} _nuxt - Instance Nuxt aplikace.
   */
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const nuxtOpt = _nuxt.options as any;

    // Konfigurace pro lang-module
    nuxtOpt.langModule = defu(nuxtOpt.langModule || {}, {
      locales: [
        /* {
          code: "en",
          files: [{ path: resolve("./runtime/assets/locales/en.json") }],
        }, */
        {
          code: "cs",
          files: [{ path: resolve("./runtime/assets/locales/cs.json") }],
        },
      ],
    });

    // Konfigurace TailwindCSS pro runtime komponenty
    nuxtOpt.tailwindcss = defu(nuxtOpt.tailwindcss || {}, {
      config: {
        content: [
          resolve("./runtime/components/**/*.{vue,mjs,js,ts}"),
          resolve("./runtime/layouts/**/*.{vue,mjs,js,ts}"),
          resolve("./runtime/pages/**/*.{vue,mjs,js,ts}"),
          resolve("./runtime/*.{mjs,js,ts}"),
        ],
      },
    });

    // Přidání runtime komponent
    addComponentsDir({
      path: resolve("./runtime/components"),
      prefix: "Cmp",
      pathPrefix: false,
    });

    // Přidání runtime composables
    addImportsDir(resolve("./runtime/composables"));

    // Přidání client middleware
    addRouteMiddleware(
      {
        name: "path",
        path: resolve("./runtime/middleware/path"),
        global: true,
      },
      { prepend: true }
    );
  },
});
