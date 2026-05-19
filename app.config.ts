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
          color: "primary",
          variant: "outline",
          class:
            "ring ring-inset ring-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100 dark:text-primary-500 dark:hover:bg-primary-950",
        },
        {
          color: "secondary",
          variant: "outline",
          class:
            "ring ring-inset ring-secondary-500 text-secondary-600 hover:bg-secondary-50 active:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-secondary-950",
        },
        {
          color: "secondary",
          variant: "solid",
          class:
            "bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 shadow-sm hover:shadow-md",
        },
        {
          color: "gold",
          variant: "solid",
          class:
            "bg-gold text-white hover:bg-gold/85 active:bg-gold/70 shadow-sm hover:shadow-md",
        },
        {
          color: "gold",
          variant: "outline",
          class:
            "border border-gold text-gold hover:bg-gold/10",
        },
      ],
    },
  },
});
