<template>
  <ul class="tw-h-full">
    <li class="tw-w-full" v-for="nav in navPoint" :key="nav.attr_id">
      <a
        class="tw-h-16 tw-w-full tw-flex tw-pl-4 tw-items-center hover:tw-bg-gray-700 tw-font-bold tw-border-b tw-border-gray-600 tw-border-opacity-25"
        :href="nav.content.attr_src"
        :class="appendClass"
        @click="goToPage(nav.content.attr_src)"
        >{{ decodeEntities(nav.navLabel.text) }}</a
      >
      <template v-if="nav.hasOwnProperty('navPoint')">
        <TocItems
          :nav-point="nav.navPoint"
          append-class="tw-pl-10 tw-text-sm tw-italic"
        />
      </template>
    </li>
  </ul>
</template>

<script>
import { decode } from "entities";
import { mapGetters, mapMutations } from "vuex";
import { navigationMixins } from "../mixins";

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
  computed: mapGetters({
    opf: "getOpf",
    currentFileIndex: "getCurrentFileIndex",
  }),
  mixins: [navigationMixins],
  methods: {
    ...mapMutations({ setCurrentFileIndex: "SET_CURRENT_FILE_INDEX" }),
    decodeEntities(str) {
      return decode(str);
    },
  },
};
</script>

<style>
</style>