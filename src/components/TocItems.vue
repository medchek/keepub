<template>
  <ul class="tw-h-full">
    <li class="tw-w-full" v-for="(nav) in navPoint" :key="nav.attr_id">
      <a
        class="tw-h-16 tw-w-full tw-flex tw-pl-4 tw-items-center hover:tw-bg-gray-700 tw-font-bold tw-border-b-2 tw-border-gray-600 tw-border-opacity-25"
        href="#"
        :class="appendClass"
        @click="goToPage(nav.content.attr_src)"
      >{{decodeEntities(nav.navLabel.text)}}</a>
      <template v-if="nav.hasOwnProperty('navPoint')">
        <TocItems :nav-point="nav.navPoint" append-class="tw-pl-10 tw-text-sm tw-italic" />
      </template>
    </li>
  </ul>
</template>

<script>
import { decode } from "entities";
import { mapGetters, mapMutations } from "vuex";

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
  methods: {
    ...mapMutations({ setCurrentFileIndex: "SET_CURRENT_FILE_INDEX" }),
    decodeEntities(str) {
      return decode(str);
    },
    goToPage(fileName) {
      // before getting the corret file index, we need to retireve the id used in the opf spine by matching the fileName (toc.content.attr_src) with any of the items in the opf.manifest.item.href
      const { attr_id } = this.opf.package.manifest.item.find(
        (item) => item.attr_href === fileName
      );
      // once the attr_id if found then we can proceed to retrive the correct file index to be rendered
      // the renderer follows the order in the opf.package.spine, hence searching it
      const fileIndex = this.opf.package.spine.itemref.findIndex(
        (item) => item.attr_idref === attr_id
      );
      // check to avoid uncessary re-renders
      if (fileIndex && fileIndex !== this.currentFileIndex) {
        this.setCurrentFileIndex(fileIndex);
      }
    },
  },
};
</script>

<style>
</style>