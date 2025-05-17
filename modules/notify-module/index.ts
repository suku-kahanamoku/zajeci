import {
  defineNuxtModule,
  createResolver,
  hasNuxtModule,
  installModule,
  addServerImportsDir,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "notify-module",
    configKey: "notifyModule",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // Pridani server composables
    addServerImportsDir(resolve("./runtime/server/composables"));
  },
});
