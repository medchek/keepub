const defaultTheme = {
  name: "light",
  // each value represents a class
  primary: "tw-text-gray-900",
  primaryBg: "tw-bg-white",
  text: "tw-text-black",
  headerBg: "tw-bg-white",
  headerText: "tw-text-gray-800",
  readerBg: "tw-bg-transparent",
  readerBorder: "tw-border-gray-100",
  readerArrows: "tw-text-gray-600",
};
export default {
  state: {
    show: false,
    theme: defaultTheme,
    textSize: 3,
  },
  getters: {
    getTheme: (state) => state.theme,
    getIsShowSettings: (state) => state.show,
    getTextSize: (state) => state.textSize,
  },
  mutations: {
    SET_DARK_THEME(state) {
      if (state.theme.name === "dark") return;
      state.theme = {
        name: "dark",
        primary: "tw-text-gray-900",
        primaryBg: "tw-bg-gray-800",
        text: "tw-text-white",
        headerBg: "tw-bg-white",
        headerText: "tw-text-gray-800",
        readerBg: "tw-bg-gray-900",
        readerBorder: "tw-border-gray-700",
        readerArrows: "tw-text-gray-200",
      };
    },
    SET_LIGHT_THEME(state) {
      if (state.theme.name === "light") return;
      state.theme = defaultTheme;
    },
    OPEN_SETTINGS(state) {
      if (state.show === true) return;
      state.show = true;
    },
    CLOSE_SETTINGS(state) {
      if (state.show === false) return;
      state.show = false;
    },
    SET_TEXT_SIZE(state, newTextSize) {
      state.textSize = newTextSize;
    },
  },
};
