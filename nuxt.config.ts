// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },

  modules: [
    "@nuxt/image",
    "@pinia/nuxt",
    "nuxt-gtag",
    "nuxt-rating",
    "@suku-kahanamoku/common-module",
    "@suku-kahanamoku/lang-module",
    "@suku-kahanamoku/mongoose-module",
    "@suku-kahanamoku/ui-module",
    "@suku-kahanamoku/notify-module",
    "@suku-kahanamoku/form-module",
    "@suku-kahanamoku/menu-module",
    "@suku-kahanamoku/auth-module",
  ],

  css: ["@/assets/css/main.css"],

  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24,
      enableRefreshOnWindowFocus: true,
    },
    fakturoidAccountSlug: process.env.FAKTUROID_ACCOUNT_SLUG,
    fakturoidClientId: process.env.FAKTUROID_CLIENT_ID,
    fakturoidClientSecret: process.env.FAKTUROID_CLIENT_SECRET,
  },

  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
  },

  pinia: {
    storesDirs: ["./stores/**"],
  },

  i18n: {
    defaultLocale: "cs",
    langDir: "locales/",
    locales: [
      {
        code: "cs",
        language: "cs-CZ",
        icon: "emojione:flag-for-czechia",
        file: "./cs.json",
      },
    ],
    experimental: {
      localeDetector: "./localeDetector.ts",
    },
  },

  gtag: {
    id: process.env.NUXT_PUBLIC_GTAG_ID,
  },

  compatibilityDate: "2025-04-23",
});
