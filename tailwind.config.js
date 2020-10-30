// config file
module.exports = {
  theme: {
    // preps for tailwind 2.0
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "1" }],
      "6xl": ["4rem", { lineHeight: "1" }],
    },
  },
  plugins: [require("tailwindcss"), require("autoprefixer")],
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "active"],
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
  purge: {
    content: ["./src/**/*.html", "./src/**/*.vue", "./src/**/*.jsx"],
    options: {
      whitelist: [
        "tw-bg-gray-800",
        "tw-bg-white",
        "tw-text-gray-800",
        "tw-text-gray-600",
        "tw-text-gray-200",
        "tw-text-xs",
        "tw-text-xl",
        "tw-text-sm",
        "lg:tw-text-base",
        "lg:tw-text-3xl",
        "lg:tw-text-xl",
      ],
    },
  },
  prefix: "tw-",
};
