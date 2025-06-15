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
import * as fs from "node:fs";

import {
  GENERATE_API_ENDPOINT,
  GENERATE_PAGES,
} from "@/modules/common-module/runtime/utils/module.functions";

/**
 * @typedef {Object} ModuleOptions
 * @description
 * Konfigurace modulu `wine-module`.
 */
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "wine-module",
    configKey: "wineModule",
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

    // Dynamicky nacitat vsechny pages z runtime/pages
    GENERATE_PAGES("/", resolve);
    GENERATE_PAGES("/wine", resolve);
    GENERATE_PAGES("/admin", resolve);
    GENERATE_PAGES("/admin/wine", resolve);

    // Login api wine endpoints
    const apiAuthDir = resolve("./runtime/server/api/wine");
    fs.readdirSync(apiAuthDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/wine", resolve);
    });

    // Login api wine endpoints
    const apiAdminDir = resolve("./runtime/server/api/admin/wine");
    fs.readdirSync(apiAdminDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/admin/wine", resolve);
    });
  },
});
