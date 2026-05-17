import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  addComponentsDir,
  addServerHandler,
  hasNuxtModule,
  installModule,
} from "@nuxt/kit";
import * as fs from "node:fs";

import { GENERATE_API_ENDPOINT } from "@suku-kahanamoku/common-module/server-utils";

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "file-module",
    configKey: "fileModule",
  },
  defaults: {},

  async setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url);

    addComponentsDir({
      path: resolve("./runtime/components"),
      prefix: "Ui",
      pathPrefix: false,
    });

    addImportsDir(resolve("./runtime/composables"));

    const apiFilesDir = resolve("./runtime/server/api/files");
    fs.readdirSync(apiFilesDir)?.forEach((file) => {
      if (
        !fs
          .statSync(resolve(`./runtime/server/api/files/${file}`))
          .isDirectory()
      ) {
        GENERATE_API_ENDPOINT(file, "/api/files", resolve);
      }
    });

    // Catch-all pro temp soubory – GENERATE_API_ENDPOINT nepodporuje [...path] syntax
    addServerHandler({
      route: "/api/files/temp/**",
      handler: resolve("./runtime/server/api/files/temp/[...path].get.ts"),
      method: "get",
      lazy: true,
    });

    // Preview endpoint pro committed soubory
    addServerHandler({
      route: "/api/files/:id/preview",
      handler: resolve("./runtime/server/api/files/[id].preview.get.ts"),
      method: "get",
      lazy: true,
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
    if (!hasNuxtModule("@suku-kahanamoku/auth-module")) {
      await installModule("@suku-kahanamoku/auth-module");
    }
  },
});
