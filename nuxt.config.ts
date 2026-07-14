// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2026-05-04",
  ssr: true,

  site: {
    url: process.env.FRONTEND_HOST,
    name: "ZAJECI - VÍNO ZE ZAJECÍ",
  },

  devtools: { enabled: true },

  colorMode: {
    classSuffix: "",
    preference: "light",
    fallback: "light",
  },

  modules: [
    "@nuxt/image",
    "@nuxtjs/seo",
    "@suku-kahanamoku/auth-module",
    "@suku-kahanamoku/menu-module",
    "@suku-kahanamoku/form-module",
    "@suku-kahanamoku/ui-module",
    "@suku-kahanamoku/lang-module",
    "@suku-kahanamoku/common-module",
    "@suku-kahanamoku/seo-module",
    "nuxt-gtag",
    "nuxt-rating",
  ],

  authModule: {
    protectedPages: ["/admin"],
  },

  css: ["@/assets/css/main.css"],

  ui: {
    prefix: "U",
  },

  runtimeConfig: {
    phpApiBaseUrl: process.env.PHP_API_BASE_URL,
    phpFileRoot: process.env.PHP_FILE_ROOT,
    mailingFrom: process.env.NUXT_MAILING_FROM,
    mailingFromName: process.env.NUXT_MAILING_FROM_NAME,
    mailingFromPhone: process.env.NUXT_MAILING_FROM_PHONE,
  },

  nitro: {
    prerender: {
      crawlLinks: true,
    },
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

  pwa: {
    manifest: {
      name: "Víno ze Zaječí",
      short_name: "Zaječí",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "ukiyojs",
        "@vueuse/core",
        "nuxt-storage",
        "workbox-window",
      ],
    },
  },
});
