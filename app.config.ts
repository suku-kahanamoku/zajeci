// app.config.ts
export default defineAppConfig({
  ui: {
    colors: {
      primary: "primary",
      secondary: "secondary",
      tertiary: "tertiary",
      info: "blue",
      success: "green",
      warning: "yellow",
      error: "red",
      neutral: "zinc",
    },
    button: {
      slots: {
        base: "rounded-lg font-semibold inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 shadow-sm transition-all duration-200",
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class:
            "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow-md",
        },
        {
          color: "secondary",
          variant: "solid",
          class:
            "bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 shadow-sm hover:shadow-md",
        },
      ],
    },
  },
});
