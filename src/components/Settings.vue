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
          <SettingsItem>
            <template v-slot:settingName>Theme</template>
            <button
              class="tw-h-10 tw-w-10 tw-flex tw-justify-center tw-items-center tw-mx-5 hover:tw-text-gray-200"
              :class="{ 'active-theme': theme.name === 'light' }"
              title="Light theme"
              @click="setLightTheme"
            >
              <LightThemeIcon :size="31" title="Light theme" />
            </button>
            <button
              class="tw-h-10 tw-w-10 tw-flex tw-justify-center tw-items-center hover:tw-text-blue-200"
              :class="{ 'active-theme': theme.name === 'dark' }"
              title="Dark theme"
              @click="setDarkTheme"
            >
              <DarkThemeIcon :size="31" title="Dark theme" />
            </button>
          </SettingsItem>
          <SettingsItem>
            <template v-slot:settingName>Text Size</template>
            A-
            <input
              type="range"
              min="1"
              max="5"
              class="tw-w-1/2 md:tw-w-auto"
              @input="setSize"
              value="3"
            />
            A+
          </SettingsItem>
          <SettingsItem>
            <template v-slot:settingName>Dictionary</template>
            <select
              class="tw-text-gray-900 tw-h-8 tw-w-11/12 tw-font-bold tw-rounded-sm"
              @input="setDictionary($event.target.value)"
            >
              <option value="merriam">Merriam Webster</option>
              <option value="google">Google Translate</option>
              <option value="oxford">Oxford Dictionary</option>
              <option value="cambridge">Cambridge Dictionary</option>
            </select>
          </SettingsItem>
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

import SettingsItem from "./SettingsItem";
// import CogOutline from "icons/CogOutline";

import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    Close,
    LightThemeIcon: Brightness5,
    DarkThemeIcon: Brightness4,
    SettingsItem,
    // CogOutline
  },
  computed: {
    ...mapGetters({
      toc: "getToc",
      showSettings: "getIsShowSettings",
      theme: "getTheme",
      dictionary: "getDictionarySource",
    }),
  },

  methods: {
    ...mapMutations({
      closeSettingsPanel: "CLOSE_SETTINGS",
      setDarkTheme: "SET_DARK_THEME",
      setLightTheme: "SET_LIGHT_THEME",
      setTextSize: "SET_TEXT_SIZE",
      setDictionary: "SET_DICTIONARY",
    }),
    closeSettings(e) {
      // this will prevent the table of contents from closing right after being opened from the header button by matching the title text with the clicked element
      if (e.target.textContent != "Open settings") {
        this.closeSettingsPanel();
      }
    },
    setSize(e) {
      let size = parseInt(e.target.value);
      if (!Number.isInteger(size)) {
        size = 3;
      } else if (size >= 5) {
        size = 5;
      } else if (size <= 0) {
        size = 0;
      }
      this.setTextSize(size);
    },
    handleEscKeypress(e) {
      if (e.keyCode === 27) {
        this.closeSettingsPanel();
      }
    },
  },
  directives: {
    clickOutside: vco.directive,
  },
  created() {
    window.addEventListener("keydown", this.handleEscKeypress);
  },
  destroyed() {
    window.removeEventListener("keydown", this.handleEscKeypress);
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
