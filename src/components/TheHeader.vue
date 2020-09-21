<template>
  <div
    class="tw-w-full tw-h-auto tw-text-center sm:tw-text-5xl tw-text-4xl tw-text tw-font-bold tw-bg-white tw-text-gray-800 tw-flex tw-items-center tw-px-3 tw-shadow-xs"
    :class="opf === null ? 'tw-justify-center': 'tw-justify-between'"
  >
    <!-- OPEN MENU ICON -->
    <Menu
      v-if="opf"
      :size="40"
      id="open-side"
      class="tw-cursor-pointer hover:tw-text-gray-600 tw-select-none tw-absolute"
      title="Open table of contents"
      @click="openSideNav"
    />
    <!-- READER LOGO -->
    <label
      v-if="opf"
      for="select-epub"
      class="tw-cursor-pointer hover:tw-opacity-75 tw-mx-auto"
      title="Open a new epub"
    >Reader</label>
    <span v-else>Reader</span>
    <!-- SETTINGS ICON -->
    <CogOutline v-if="opf" :size="30" class="tw-absolute tw-right-0 tw-mr-3" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import Menu from "icons/Menu";
import CogOutline from "icons/CogOutline";
export default {
  computed: {
    ...mapGetters({ opf: "getOpf" }),
  },
  components: {
    Menu,
    CogOutline,
  },
  methods: {
    ...mapMutations({
      openSideNav: "OPEN_TOC_SIDE_NAV",
    }),
  },
  props: {
    height: {
      required: false,
      default: "auto",
      type: String,
    },
  },
};
</script>

