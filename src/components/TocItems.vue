<template>
  <ul class="tw-h-full">
    <template v-if="Array.isArray(navPoint)">
      <li class="tw-w-full" v-for="nav in navPoint" :key="nav.attr_id">
        <a
          class="tw-h-16 tw-w-full tw-flex tw-pl-4 tw-items-center hover:tw-bg-gray-700 tw-font-bold tw-border-b tw-border-gray-600 tw-border-opacity-25"
          :href="nav.content.attr_src"
          :class="appendClass"
          @click.prevent="goToPage(nav.content.attr_src)"
          >{{ decodeEntities(nav.navLabel.text) }}</a
        >
        <template v-if="nav.hasOwnProperty('navPoint')">
          <TocItems
            :nav-point="nav.navPoint"
            append-class="tw-pl-10 tw-text-sm tw-italic"
          />
        </template>
      </li>
    </template>
    <template v-else>
      <a
        class="tw-h-16 tw-w-full tw-flex tw-pl-4 tw-items-center hover:tw-bg-gray-700 tw-font-bold tw-border-b tw-border-gray-600 tw-border-opacity-25"
        :href="navPoint.content.attr_src"
        :class="appendClass"
        @click.prevent="goToPage(navPoint.content.attr_src)"
        >{{ decodeEntities(navPoint.navLabel.text) }}</a
      >
      <template v-if="navPoint.hasOwnProperty('navPoint')">
        <TocItems
          :nav-point="navPoint.navPoint"
          append-class="tw-pl-10 tw-text-sm tw-italic"
        />
      </template>
    </template>
  </ul>
</template>

<script>
import { decode } from "entities";
import { navigationMixins } from "../mixins";

export default {
  name: "TocItems",
  props: {
    navPoint: {
      type: [Array, Object],
      required: true,
    },
    appendClass: {
      type: String,
      required: false,
      default: "",
    },
  },
  mixins: [navigationMixins],
  methods: {
    decodeEntities(str) {
      return decode(str);
    },
  },
};
</script>

<style>
</style>