import {
  defineNuxtModule,
  createResolver,
  hasNuxtModule,
  installModule,
  addServerImportsDir,
} from "@nuxt/kit";
import vue from "@vitejs/plugin-vue";

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

    // Nitro konfigurace
    _nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.rollupConfig = nitroConfig.rollupConfig || {};
      nitroConfig.rollupConfig.plugins = [vue()];
    });

    // Pridani server composables
    addServerImportsDir(resolve("./runtime/server/composables"));

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
