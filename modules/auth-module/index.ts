import {
  defineNuxtModule,
  hasNuxtModule,
  installModule,
  createResolver,
  addImportsDir,
  addServerHandler,
  addRouteMiddleware,
  addComponentsDir,
} from "@nuxt/kit";
import defu from "defu";
import * as fs from "node:fs";

import {
  GENERATE_PAGES,
  GENERATE_API_ENDPOINT,
  READ_FILE,
} from "@suku-kahanamoku/common-module/server-utils";

// Module options TypeScript interface definition
export interface ModuleOptions {
  disablePages?: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "auth-module",
    configKey: "authModule",
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url);
    const nuxtOpt = _nuxt.options as any;
    const runtimeConfig = nuxtOpt.runtimeConfig;

    // nastaveni auth session
    runtimeConfig.session = defu(runtimeConfig.session || {}, {
      maxAge: 60 * 60 * 24,
      enableRefreshOnWindowFocus: true,
      password: "b8d172bdf0bc45d38329605e0420653c",
    });

    // Config pro lang-module
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

    // Vynuti tailwind pro runtime komponenty
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

    // Pridani jednotlivych pages
    if (!_options.disablePages) {
      // Dynamicky nacitat vsechny pages z runtime/pages
      GENERATE_PAGES("/", resolve);
      GENERATE_PAGES("/pz", resolve);
      GENERATE_PAGES("/admin", resolve);
    }

    // Pridani komponent
    addComponentsDir({
      path: resolve("./runtime/components"),
      prefix: "Cmp",
      pathPrefix: false,
    });

    // Pridani composables
    addImportsDir(resolve("./runtime/composables"));

    // Pridani client middleware
    addRouteMiddleware({
      name: "auth",
      path: resolve("./runtime/middleware/auth"),
      global: true,
    });

    // Pridani server middleware
    addServerHandler({
      handler: resolve("./runtime/server/middleware/auth"),
      middleware: true,
    });

    // Login api login endpoints
    const apiLoginDir = resolve("./runtime/server/api/login");
    fs.readdirSync(apiLoginDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/login", resolve);
    });

    // Login api auth endpoints
    const apiAuthDir = resolve("./runtime/server/api/auth");
    fs.readdirSync(apiAuthDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/auth", resolve);
    });

    // Login api auth endpoints
    const apiAdminDir = resolve("./runtime/server/api/admin/user");
    fs.readdirSync(apiAdminDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/admin/user", resolve);
    });

    // Install common module
    if (!hasNuxtModule("@suku-kahanamoku/common-module")) {
      await installModule("@suku-kahanamoku/common-module");
    }

    // Install pinia module
    if (!hasNuxtModule("@pinia/nuxt")) {
      await installModule("@pinia/nuxt");
    }

    // Install auth utils module
    if (!hasNuxtModule("nuxt-auth-utils")) {
      await installModule("nuxt-auth-utils");
    }
  },
});
