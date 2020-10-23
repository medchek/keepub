<template>
  <div
    v-if="show"
    class="tw-absolute tw-w-24 tw-h-10 tw-bg-gray-200 tw-rounded-sm tw-shadow-lg tw-flex"
    :style="menuPosition"
  >
    <div
      class="tw-w-full hover:tw-bg-gray-100 tw-border-r-2 tw-border-gray-400 tw-font-bold"
    >
      <a
        class="tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center"
        :href="dictionaryLink"
        target="_blank"
        title="Search for definition"
        ><BookOpenVariant :size="23" title="Search for definition"
      /></a>
    </div>
    <div
      class="tw-flex tw-items-center tw-justify-center tw-w-full hover:tw-bg-gray-100"
    >
      <a
        class="tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center"
        :href="googleLink"
        target="_blank"
        title="Search with Google"
        ><Google :size="23" title="Search with Google"
      /></a>
    </div>
  </div>
</template>

<script>
import Google from "icons/Google";
import BookOpenVariant from "icons/BookOpenVariant";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      menuWidth: 96, // px = 6rem
    };
  },
  props: {
    selection: {
      required: true,
      default: undefined,
    },
  },
  computed: {
    ...mapGetters({
      targetDictionary: "getDictionarySource",
    }),
    show() {
      if (this.selection) {
        return true;
      } else {
        return false;
      }
    },
    dictionaryLink() {
      const dictionary = this.targetDictionary;
      let targetURL = "https://www.merriam-webster.com/dictionary/";
      const ignored = /[,.()[\]?!“”"_'-]+/gi;
      const cleansed = this.selection.selection.replace(ignored, "").trim();
      // ------
      if (dictionary === "merriam") {
        targetURL = "https://www.merriam-webster.com/dictionary/";
      } else if (dictionary === "google") {
        targetURL = "https://translate.google.com/#auto/en/";
      } else if (dictionary === "oxford") {
        targetURL =
          "https://www.oxfordlearnersdictionaries.com/us/definition/english/";
      } else if (dictionary === "cambridge") {
        targetURL = "https://dictionary.cambridge.org/us/dictionary/english/";
      }
      // -----
      return encodeURI(targetURL + cleansed);
    },
    googleLink() {
      return encodeURI(
        "https://www.google.com/search?q=" + this.selection.selection.trim()
      );
    },
    menuPosition() {
      if (!this.selection) return null;
      const { top, left, width } = this.selection.position;
      // this is where the menu will intially be placed
      const center = Math.floor(width * 0.5);
      // then it'll be pulled by half of it size to have a perfectly centered menu round the selection
      const pullLeft = Math.floor(this.menuWidth * 0.5);
      return {
        top: top - 50 + "px",
        left: left + center - pullLeft + "px",
      };
    },
  },
  components: {
    Google,
    BookOpenVariant,
  },
};
</script>
