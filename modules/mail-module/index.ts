import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  addServerImportsDir,
  hasNuxtModule,
  installModule,
} from "@nuxt/kit";
import * as fs from "node:fs";

import {
  GENERATE_API_ENDPOINT,
  GENERATE_PAGES,
} from "@suku-kahanamoku/common-module/server-utils";

export interface ModuleOptions {
  /** E-mail příjemce pro testovací odeslání */
  defaultTo?: string;
  /** Předmět pro testovací odeslání */
  defaultSubject?: string;
  /** Odesílatel – e-mail */
  fromEmail?: string;
  /** Odesílatel – jméno */
  fromName?: string;
  /** Odesílatel – telefon */
  fromPhone?: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "mail-module",
    configKey: "mailModule",
  },
  defaults: {
    defaultTo: "",
    defaultSubject: "Test email",
    fromEmail: "",
    fromName: "",
    fromPhone: "",
  },

  async setup(options, _nuxt) {
    const { resolve } = createResolver(import.meta.url);

    addImportsDir(resolve("./runtime/composables"));
    addServerImportsDir(resolve("./runtime/server/utils"));

    GENERATE_PAGES("/admin", resolve);
    GENERATE_PAGES("/admin/mail", resolve);

    const apiAdminMailDir = resolve("./runtime/server/api/admin/mail");
    fs.readdirSync(apiAdminMailDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/admin/mail", resolve);
    });

    const apiEmailDir = resolve("./runtime/server/api/email");
    fs.readdirSync(apiEmailDir)?.forEach((file) => {
      GENERATE_API_ENDPOINT(file, "/api/email", resolve);
    });

    // Expose send params to the frontend via public runtimeConfig
    _nuxt.options.runtimeConfig.public =
      _nuxt.options.runtimeConfig.public || {};
    (_nuxt.options.runtimeConfig.public as any).mailModule = {
      defaultTo: options.defaultTo ?? process.env.NUXT_MAIL_DEFAULT_TO ?? "",
      defaultSubject:
        options.defaultSubject ??
        process.env.NUXT_MAIL_DEFAULT_SUBJECT ??
        "Test email",
      fromEmail: options.fromEmail ?? process.env.NUXT_MAIL_FROM_EMAIL ?? "",
      fromName: options.fromName ?? process.env.NUXT_MAIL_FROM_NAME ?? "",
      fromPhone: options.fromPhone ?? process.env.NUXT_MAIL_FROM_PHONE ?? "",
    };

    if (!hasNuxtModule("@suku-kahanamoku/common-module")) {
      await installModule("@suku-kahanamoku/common-module");
    }
    if (!hasNuxtModule("@suku-kahanamoku/lang-module")) {
      await installModule("@suku-kahanamoku/lang-module");
    }
    if (!hasNuxtModule("@suku-kahanamoku/ui-module")) {
      await installModule("@suku-kahanamoku/ui-module");
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
