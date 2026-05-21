import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  hasNuxtModule,
  installModule,
  addComponentsDir,
} from "@nuxt/kit";
import * as fs from "node:fs";

import {
  GENERATE_API_ENDPOINT,
  GENERATE_PAGES,
} from "@suku-kahanamoku/common-module/server-utils";

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "enum-module",
    configKey: "enumModule",
  },
  defaults: {},

  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url);

    // Přidání runtime komponent
    addComponentsDir({
      path: resolve("./runtime/components"),
      prefix: "Cmp",
      pathPrefix: false,
    });

    addImportsDir(resolve("./runtime/composables"));

    GENERATE_PAGES("/admin", resolve);
    GENERATE_PAGES("/admin/enum", resolve);
    GENERATE_PAGES("/admin/taste", resolve);
    GENERATE_PAGES("/admin/payment", resolve);
    GENERATE_PAGES("/admin/shipping", resolve);
    GENERATE_PAGES("/admin/vat-rate", resolve);

    // Public GET /api/enumerations (used by wine, eshop form dropdowns)
    const apiEnumDir = resolve("./runtime/server/api/enumerations");
    fs.readdirSync(apiEnumDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/enumerations", resolve);
    });

    // Admin endpoints (list GET with transform + write ops)
    const apiAdminEnumDir = resolve("./runtime/server/api/admin/enum");
    fs.readdirSync(apiAdminEnumDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/admin/enum", resolve);
    });

    if (!hasNuxtModule("@suku-kahanamoku/common-module")) {
      await installModule("@suku-kahanamoku/common-module");
    }
    if (!hasNuxtModule("@suku-kahanamoku/lang-module")) {
      await installModule("@suku-kahanamoku/lang-module");
    }
    if (!hasNuxtModule("@suku-kahanamoku/ui-module")) {
      await installModule("@suku-kahanamoku/ui-module");
    }
    if (!hasNuxtModule("@suku-kahanamoku/form-module")) {
      await installModule("@suku-kahanamoku/form-module");
    }
    if (!hasNuxtModule("@suku-kahanamoku/notify-module")) {
      await installModule("@suku-kahanamoku/notify-module");
    }
    if (!hasNuxtModule("@suku-kahanamoku/menu-module")) {
      await installModule("@suku-kahanamoku/menu-module");
    }
    if (!hasNuxtModule("@suku-kahanamoku/auth-module")) {
      await installModule("@suku-kahanamoku/auth-module");
    }

    _nuxt.hook("i18n:registerModule", (register) => {
      register({
        langDir: resolve("./runtime/assets/locales"),
        locales: [
          { code: "en", file: "en.json" },
          { code: "cs", file: "cs.json" },
        ],
      });
    });
  },
});
