<template>
  <li
    class="tw-h-16 tw-w-full tw-flex hover:tw-bg-gray-800 hover:tw-bg-opacity-75 tw-border-b-2 tw-border-gray-800 tw-border-opacity-25"
  >
    <div
      class="tw-w-2/6 tw-border-r-4 tw-border-gray-800 tw-flex tw-items-center tw-pl-3 sm:tw-text-lg tw-text-xs tw-font-bold sm:tw-font-normal"
    >
      <slot name="settingName">setting name:</slot>
    </div>
    <div class="tw-w-2/3 tw-flex tw-justify-around tw-items-center">
      <slot></slot>
    </div>
  </li>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters({
      toc: "getToc",
      theme: "getTheme",
    }),
  },

  methods: {
    ...mapMutations({
      closeSettingsPanel: "CLOSE_SETTINGS",
      setDarkTheme: "SET_DARK_THEME",
      setLightTheme: "SET_LIGHT_THEME",
    }),
  },
};
</script>