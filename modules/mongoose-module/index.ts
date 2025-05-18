import { defineNuxtModule, createResolver, addServerPlugin } from "@nuxt/kit";
import * as fs from "node:fs";

import { GENERATE_API_ENDPOINT } from "@/modules/common-module/runtime/utils/module.functions";

/**
 * @typedef {Object} ModuleOptions
 * @description
 * Rozhraní pro možnosti konfigurace modulu `mongoose-module`.
 */
export interface ModuleOptions {}

/**
 * @module mongoose-module
 * @description
 * Tento modul poskytuje integraci s MongoDB pomocí Mongoose v Nuxt aplikaci.
 * Přidává serverový plugin pro připojení k databázi a generuje API endpointy pro kontrolu zdraví.
 *
 * @example
 * ```typescript
 * export default defineNuxtConfig({
 *   mongooseModule: {},
 * });
 * ```
 */
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "mongoose-module", // Název modulu
    configKey: "mongooseModule", // Klíč pro konfiguraci v Nuxt configu
  },
  // Výchozí možnosti konfigurace Nuxt modulu
  defaults: {},

  /**
   * @function setup
   * @description
   * Hlavní funkce modulu, která nastavuje serverový plugin a generuje API endpointy.
   *
   * @param {ModuleOptions} _options - Uživatelské možnosti konfigurace.
   * @param {Nuxt} _nuxt - Instance Nuxt aplikace.
   */
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // Přidání serverového pluginu pro připojení k MongoDB
    addServerPlugin(resolve("./runtime/server/plugins/mongoose"));

    // Generování API endpointů pro kontrolu zdraví
    const apiDir = resolve("./runtime/server/api/health");
    fs.readdirSync(apiDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/health", resolve);
    });
  },
});
