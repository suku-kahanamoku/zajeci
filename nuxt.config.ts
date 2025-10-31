// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },

  modules: [
    "@suku-kahanamoku/auth-module",
    "@suku-kahanamoku/menu-module",
    "@suku-kahanamoku/form-module",
    "@suku-kahanamoku/notify-module",
    "@suku-kahanamoku/ui-module",
    "@suku-kahanamoku/mongoose-module",
    "@suku-kahanamoku/lang-module",
    "@suku-kahanamoku/common-module",
    "@suku-kahanamoku/seo-module",
    "@nuxt/image",
    "@pinia/nuxt",
    "nuxt-gtag",
    "nuxt-rating",
  ],

  css: ["@/assets/css/main.css"],

  runtimeConfig: {
    fakturoidAccountSlug: process.env.FAKTUROID_ACCOUNT_SLUG,
    fakturoidClientId: process.env.FAKTUROID_CLIENT_ID,
    fakturoidClientSecret: process.env.FAKTUROID_CLIENT_SECRET,
  },

  router: {
    options: {
      scrollBehaviorType: "smooth",
    },
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
      {
        code: "en",
        language: "en-US",
        icon: "emojione:flag-for-czechia",
        file: "./en.json",
      },
    ],
    experimental: {
      localeDetector: "./localeDetector.ts",
    },
  },

  gtag: {
    id: process.env.NUXT_PUBLIC_GTAG_ID,
  },
});
