<template>
  <div
    id="renderer"
    class="tw-w-auto tw-h-full tw-flex tw-flex-col tw-flex-grow tw-pt-5 tw-px-12 tw-pb-10 tw-overflow-y-auto tw-text-xl lg:tw-text-2xl"
    ref="renderer"
    @dblclick="getSelectedWord"
    v-html="src"
  ></div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      targetLanguage: "en",
      previousScrollPosition: 0,
      nextScrollPosition: 0,
    };
  },
  props: {
    src: {
      type: String,
      required: true,
      default: "<p>ERROR, NO RENDER CONTENT HAS BEEN PROVIDED</p>",
    },
  },
  computed: {
    ...mapGetters({ opf: "getOpf" }),
  },
  methods: {
    ...mapMutations({
      setCurrentFileIndex: "SET_CURRENT_FILE_INDEX",
      openDefinitionPanel: "OPEN_DEFINITION",
    }),
    ...mapActions(["getDefinition"]),
    async getSelectedWord() {
      const selection = document.getSelection().getRangeAt(0).toString().trim();
      if (selection.length > 0) {
        this.openDefinitionPanel();
        // removing unwanted characters
        // const [word] = selection.match(/([a-z0-9]+)'?[a-z]*/gi);
        const [word] = selection.match(/([a-z0-9]+)['s]?/gi);
        // console.log("searching", word);
        this.getDefinition(word);
      }
    },
  },
  updated() {
    const rendererEl = this.$refs.renderer;
    // reset scroll position
    rendererEl.scrollTop = 0;
    const links = rendererEl.querySelectorAll("a[href]");
    // adding link management
    for (let i = 0; i < links.length; i++) {
      const a = links[i];
      a.addEventListener("click", (e) => {
        // test if href leads to another html page from within the epub
        const isNavigationLink = /[\w-]+\.x?html?(#[\w-]+)?$/i.test(a.href);
        // only then
        if (isNavigationLink) {
          e.preventDefault();
          // file name with possible #id at the end
          const completeFileName = a.href.split("/").pop();
          // file name without the #id
          const [fileName /*, hashTag*/] = completeFileName.split("#");
          // getting the file index by file name to navigate to it

          // we must ultimately find the refId that corresponds to the file name present in the href attribute of the clicked <a> tag
          // to do so, it's a two step process
          // we must first retireve the attr_id from the manifest section of the opf that will correspond to the ref id from within the opf spine
          const refId = this.opf.package.manifest.item.find((file) =>
            file["attr_href"].includes(fileName)
          );
          // we now use the idref to search for the index of the file to render from within the spine
          const nextFileIndex = this.opf.package.spine.itemref.findIndex(
            (ref) => ref.attr_idref === refId.attr_id
          );
          if (nextFileIndex > -1) {
            this.setCurrentFileIndex(nextFileIndex);
            // scroll to the #id if there is any
          }
          return;
        }
      });
    }
  },
};
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  transition: 0.4s;
  background: rgba(206, 206, 206, 0.658);
}

/* Handle */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  transition: 1s;
  background: rgb(151, 151, 151);
  /* border-radius: 1em; */
}
::-webkit-scrollbar-track:hover {
  opacity: 0.9;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(199, 199, 199);
}
div#renderer > div p {
  font-size: 1.5rem;
}
</style>