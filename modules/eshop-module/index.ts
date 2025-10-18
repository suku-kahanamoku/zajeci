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
} from "@suku-kahanamoku/common-module/server-utils";

/**
 * @typedef {Object} ModuleOptions
 * @description
 * Konfigurace modulu `eshop-module`.
 */
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "eshop-module",
    configKey: "eshopModule",
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
    GENERATE_PAGES("/admin", resolve);
    GENERATE_PAGES("/admin/order", resolve);

    // Login api order endpoints
    const apiDir = resolve("./runtime/server/api");
    fs.readdirSync(apiDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api", resolve);
    });

    // Login api order endpoints
    const apiAdminDir = resolve("./runtime/server/api/admin/order");
    fs.readdirSync(apiAdminDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/admin/order", resolve);
    });

    // Install common module
    if (!hasNuxtModule("@suku-kahanamoku/common-module")) {
      await installModule("@suku-kahanamoku/common-module");
    }

    // Install lang module
    if (!hasNuxtModule("@suku-kahanamoku/lang-module")) {
      await installModule("@suku-kahanamoku/lang-module");
    }

    // Install ui module
    if (!hasNuxtModule("@suku-kahanamoku/ui-module")) {
      await installModule("@suku-kahanamoku/ui-module");
    }

    // Install form module
    if (!hasNuxtModule("@suku-kahanamoku/form-module")) {
      await installModule("@suku-kahanamoku/form-module");
    }

    // Install notify module
    if (!hasNuxtModule("@suku-kahanamoku/notify-module")) {
      await installModule("@suku-kahanamoku/notify-module");
    }

    // Install menu module
    if (!hasNuxtModule("@suku-kahanamoku/menu-module")) {
      await installModule("@suku-kahanamoku/menu-module");
    }

    // Install auth module
    if (!hasNuxtModule("@suku-kahanamoku/auth-module")) {
      await installModule("@suku-kahanamoku/auth-module");
    }

    _nuxt.hook("i18n:registerModule", (register) => {
      register({
        langDir: resolve("./runtime/assets/locales"),
        locales: [
          {
            code: "en",
            file: "en.json",
          },
          {
            code: "cs",
            file: "cs.json",
          },
        ],
      });
    });
  },
});
