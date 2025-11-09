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

import { GENERATE_API_ENDPOINT } from "@suku-kahanamoku/common-module/server-utils";

/**
 * @typedef {Object} ModuleOptions
 * @description
 * Konfigurace modulu `envelope-module`.
 */
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "envelope-module",
    configKey: "envelopeModule",
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

    // Login api wine endpoints
    const apiDir = resolve("./runtime/server/api");
    fs.readdirSync(apiDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api", resolve);
    });

    // Install common module
    if (!hasNuxtModule("@suku-kahanamoku/common-module")) {
      await installModule("@suku-kahanamoku/common-module");
    }

    // Install lang module
    if (!hasNuxtModule("@suku-kahanamoku/lang-module")) {
      await installModule("@suku-kahanamoku/lang-module");
    }
  },
});
