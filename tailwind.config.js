// config file
// currently used only to enable the tailwind intellisense vscode extension
module.exports = {
  // important: true,
  theme: {},
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "active"],
  },
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: ["./src/**/*.html", "./src/**/*.vue", "./src/**/*.jsx"],
  // corePlugins: {
  //   preflight: false,
  // },
  prefix: "tw-",
};
