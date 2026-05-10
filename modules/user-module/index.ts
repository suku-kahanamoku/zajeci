import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  hasNuxtModule,
  installModule,
} from "@nuxt/kit";
import * as fs from "node:fs";

import {
  GENERATE_API_ENDPOINT,
  GENERATE_PAGES,
} from "@suku-kahanamoku/common-module/server-utils";

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "user-module",
    configKey: "userModule",
  },
  defaults: {},

  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url);

    addImportsDir(resolve("./runtime/composables"));

    GENERATE_PAGES("/admin", resolve);
    GENERATE_PAGES("/admin/user", resolve);

    // Admin only — no public user endpoints
    const apiAdminUserDir = resolve("./runtime/server/api/admin/user");
    fs.readdirSync(apiAdminUserDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/admin/user", resolve);
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
