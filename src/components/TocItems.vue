<template>
  <ul class="tw-h-full">
    <li class="tw-w-full" v-for="(nav, index) in navPoint" :key="nav.attr_id">
      <a
        class="tw-h-16 tw-w-full tw-flex tw-pl-4 tw-items-center hover:tw-bg-gray-700 tw-font-bold tw-border-b-2 tw-border-gray-600 tw-border-opacity-25"
        href="#"
        :class="appendClass"
        @click="goToPage(index)"
      >{{decodeEntities(nav.navLabel.text)}}</a>
      <template v-if="nav.hasOwnProperty('navPoint')">
        <!-- @click="getIndexFromSrc(nav.content.attr_src)" -->
        <TocItems :nav-point="nav.navPoint" append-class="tw-pl-10 tw-text-sm tw-italic" />
      </template>
    </li>
  </ul>
</template>

<script>
import { decode } from "entities";
import { mapMutations } from "vuex";

export default {
  name: "TocItems",
  props: {
    navPoint: {
      type: Array,
      required: true,
    },
    appendClass: {
      type: String,
      required: false,
      default: "",
    },
  },
  methods: {
    ...mapMutations({ setCurrentFileIndex: "SET_CURRENT_FILE_INDEX" }),
    decodeEntities(str) {
      return decode(str);
    },
    // sets the current file index to the corresponding item index
    goToPage(index) {
      this.setCurrentFileIndex(index);
    },
    // sets the current file index based on the item href
    getIndexFromSrc(src) {
      console.log(src);
    },
  },
};
</script>

<style>
</style>