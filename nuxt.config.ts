import vue from "@vitejs/plugin-vue";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },

  modules: [
    "@nuxt/ui",
    "@nuxt/image",
    "@pinia/nuxt",
    "nuxt-auth-utils",
    "nuxt-gtag",
    "nuxt-rating",
  ],

  css: ["@/assets/css/main.css"],

  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

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
      {
        code: "en",
        language: "en-UK",
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

  nitro: {
    rollupConfig: {
      plugins: [vue()],
    },
  },

  compatibilityDate: "2025-04-23",
});
