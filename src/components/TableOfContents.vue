<template>
  <transition name="slide">
    <div
      class="tw-h-full tw-w-8/12 sm:tw-w-5/12 md:tw-w-2/6 lg:tw-w-2/6 xl:tw-w-1/5 tw-bg-gray-900 tw-fixed tw-top-0 tw-left-0 tw-flex tw-flex-col tw-items-center side-nav-shadow shado tw-text-gray-100"
      ref="toc"
      v-click-outside="
        (e) => {
          if (sideNav.show) closeToc(e);
        }
      "
    >
      <!-- TOC HEADER -->
      <div
        class="tw-text-xl sm:tw-text-2xl tw-border-b-2 tw-w-full tw-text-center tw-py-2 tw-border-gray-500 tw-text-gray-100 tw-bg-blue-900 tw-flex tw-justify-around"
      >
        <div class="tw-w-6"></div>

        <div>Table of contents</div>
        <!-- CLOSE MENU ICON -->
        <MenuOpen
          :size="40"
          title="Close"
          class="tw-text-gray-300 tw-cursor-pointer hover:tw-text-white tw-select-none"
          @click="closeSideNav"
        />
      </div>
      <div
        class="tw-w-full tw-h-full tw-overflow-y-auto tw-border-r tw-border-gray-800"
      >
        <!-- TOC ITEMS -->
        <TocItems :nav-point="toc.ncx.navMap.navPoint" />
      </div>
    </div>
  </transition>
</template>

<script>
import MenuOpen from "icons/MenuOpen";
import TocItems from "./TocItems";
import vco from "v-click-outside";
// import CogOutline from "icons/CogOutline";

import { mapGetters, mapMutations } from "vuex";

export default {
  components: {
    MenuOpen,
    TocItems,
    // CogOutline
  },
  computed: {
    ...mapGetters({
      toc: "getToc",
      sideNav: "getSideNav",
    }),
  },

  methods: {
    ...mapMutations({
      closeSideNav: "CLOSE_TOC_SIDE_NAV",
    }),
    closeToc(e) {
      // this will prevent the table of contents from closing right after being opened from the header button by matching the title text with the clicked element
      if (e.target.textContent !== "Open table of contents") {
        this.closeSideNav();
      }
    },
    handleEscKeypress(e) {
      if (e.keyCode === 27) {
        this.closeSideNav();
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
  box-shadow: 2px -1px 10px -5px rgba(15, 17, 18, 0.3);
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  transition: 0.4s;
  background: rgba(255, 255, 255, 0.185);
}

/* Handle */
::-webkit-scrollbar-thumb {
  transition: 1s;
  background: rgb(156, 156, 156);
  /* border-radius: 1em; */
}
::-webkit-scrollbar-track:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(236, 236, 236);
}
/* button:focus {
  outline: none;
} */
.slide-enter-active {
  transition: all 0.2s ease;
}
.slide-leave-active {
  transition: all 0.2s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
