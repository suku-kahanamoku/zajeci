import defaultTheme from "tailwindcss/defaultTheme";

import theme from "./assets/css/theme.json";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        custom: theme.colors.primary,
        secondary: theme.colors.secondary,
        success: theme.colors.success,
        info: theme.colors.info,
        warning: theme.colors.warning,
        error: theme.colors.error,
      },
    },
  },
};
