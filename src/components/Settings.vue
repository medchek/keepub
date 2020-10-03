<template>
  <transition name="slide">
    <div
      class="tw-h-full tw-w-8/12 sm:tw-w-5/12 md:tw-w-2/6 lg:tw-w-2/6 xl:tw-w-1/5 tw-bg-gray-900 tw-fixed tw-top-0 tw-right-0 tw-flex tw-flex-col tw-items-center side-nav-shadow shado tw-text-gray-100"
      ref="toc"
      v-click-outside="
        (e) => {
          if (showSettings) closeSettings(e);
        }
      "
    >
      <!-- TOC HEADER -->
      <div
        class="tw-text-xl sm:tw-text-2xl tw-border-b-2 tw-w-full tw-text-center tw-py-2 tw-border-gray-700 tw-text-gray-100 tw-bg-blue-900 tw-flex tw-justify-between"
      >
        <div class="tw-w-6"></div>
        <div>Settings</div>
        <Close
          :size="40"
          title="Close"
          class="tw-text-gray-300 tw-cursor-pointer hover:tw-text-white tw-select-none"
          @click="closeSettings"
        />
        <!-- CLOSE MENU ICON -->
      </div>
      <div class="tw-w-full tw-h-full tw-overflow-y-auto">
        <!-- TOC ITEMS -->
        <ul class="tw-h-full">
          <li
            class="tw-h-16 tw-w-full tw-flex tw-pl-4 tw-items-center hover:tw-bg-gray-800 hover:tw-bg-opacity-75 tw-font-bold tw-text-xl tw-border-b-2 tw-border-gray-800 tw-border-opacity-25"
          >
            Theme :
            <button
              class="tw-h-12 tw-w-12 tw-flex tw-justify-center tw-items-center tw-mx-5 hover:tw-text-gray-200"
              :class="{ 'active-theme': theme.name === 'light' }"
              title="Light theme"
              @click="setLightTheme"
            >
              <LightThemeIcon :size="35" title="Light theme" />
            </button>
            <button
              class="tw-h-12 tw-w-12 tw-flex tw-justify-center tw-items-center hover:tw-text-blue-200"
              :class="{ 'active-theme': theme.name === 'dark' }"
              title="Dark theme"
              @click="setDarkTheme"
            >
              <DarkThemeIcon :size="35" title="Dark theme" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
import Close from "icons/Close";
import vco from "v-click-outside";
import Brightness5 from "icons/Brightness5";
import Brightness4 from "icons/Brightness4";
// import CogOutline from "icons/CogOutline";

import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    Close,
    LightThemeIcon: Brightness5,
    DarkThemeIcon: Brightness4,
    // CogOutline
  },
  computed: {
    ...mapGetters({
      toc: "getToc",
      showSettings: "getIsShowSettings",
      theme: "getTheme",
    }),
  },

  methods: {
    ...mapMutations({
      closeSettingsPanel: "CLOSE_SETTINGS",
      setDarkTheme: "SET_DARK_THEME",
      setLightTheme: "SET_LIGHT_THEME",
    }),
    closeSettings(e) {
      // this will prevent the table of contents from closing right after being opened from the header button by matching the title text with the clicked element
      if (e.target.textContent != "Open settings") {
        this.closeSettingsPanel();
      }
    },
  },
  directives: {
    clickOutside: vco.directive,
  },
};
</script>

<style scoped>
.side-nav-shadow {
  box-shadow: 1px 1px 15px 5px rgba(15, 17, 18, 0.3);
}
.active-theme {
  border: 2px solid #fff;
  border-radius: 100%;
}
button:focus {
  outline: none;
}
/* ANIMATION */
.slide-enter-active {
  transition: all 0.2s ease;
}
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
