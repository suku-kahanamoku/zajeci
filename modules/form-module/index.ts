import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addComponentsDir,
  addImportsDir,
  hasNuxtModule,
  installModule,
} from "@nuxt/kit";
import defu from "defu";

/**
 * @typedef {Object} ModuleOptions
 * @description
 * Konfigurace modulu `form-module`.
 */
export interface ModuleOptions {}

/**
 * @module form-module
 * @description
 * Tento modul poskytuje podporu pro práci s formuláři v Nuxt aplikaci.
 * Přidává runtime komponenty, pluginy a další konfigurace.
 *
 * @default
 * Výchozí konfigurace:
 * - `langModule`: Přidává lokalizace pro `en` a `cs`.
 * - `tailwindcss`: Konfiguruje TailwindCSS pro runtime komponenty.
 *
 * @example
 * ```typescript
 * export default defineNuxtConfig({
 *   formModule: {
 *     // vlastní konfigurace
 *   },
 * });
 * ```
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "form-module",
    configKey: "formModule",
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
        {
          code: "en",
          files: [{ path: resolve("./runtime/assets/locales/en.json") }],
        },
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

    // Přidání pluginů
    addPlugin({
      src: resolve("./runtime/plugins/zod-plugin"),
    });

    // Nacte unload-plugin
    addPlugin({
      src: resolve("./runtime/plugins/unload-plugin"),
      mode: "client",
    });

    // Instalace Pinia modulu, pokud není již nainstalován
    if (!hasNuxtModule("@pinia/nuxt")) {
      await installModule("@pinia/nuxt");
    }
  },
});
