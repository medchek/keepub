<template>
  <div
    class="tw-text-center tw-w-auto tw-h-full tw-flex tw-flex-col tw-justify-center tw-pb-40"
    :class="theme.text"
  >
    <div id="book-title" class="tw-text-5xl tw-italic">{{ title }}</div>
    <div id="book-author" class="tw-text-2xl tw-italic">by {{ author }}</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({ opf: "getOpf", theme: "getTheme" }),
    author() {
      const author = this.opf.package.metadata["dc:creator"];
      // if it's just a plain string, return it directly
      if (typeof author === "string") {
        return author;
      } else if (Array.isArray(author)) {
        let authorsNames = author.map((singleAuthor) => singleAuthor["#text"]);
        return authorsNames.length === 1
          ? authorsNames[0]
          : authorsNames.join(" & ");
      } else {
        // otherwise, it sould be further nested in #text property
        return author["#text"];
      }
    },
    title() {
      const title = this.opf.package.metadata["dc:title"];
      return typeof title === "object" ? title["#text"] : title;
    },
  },
};
</script>

<style>
</style>