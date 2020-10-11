<template>
  <div
    id="renderer"
    class="tw-w-auto tw-h-full tw-flex tw-flex-col tw-flex-grow tw-pt-5 tw-px-12 tw-pb-10 tw-overflow-y-auto"
    :class="[theme.text, theme.name, textSizeClass.default, textSizeClass.lg]"
    ref="renderer"
    v-html="src"
  ></div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { navigationMixins } from "../mixins";
export default {
  data() {
    return {
      previousScrollPosition: 0,
      nextScrollPosition: 0,
      allowScrollTop: false,
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
    ...mapGetters({
      opf: "getOpf",
      theme: "getTheme",
      textSize: "getTextSize",
      currentFileIndex: "getCurrentFileIndex",
    }),
    textSizeClass() {
      let textClass = "tw-text-";
      let lgTextClass = "lg:tw-text-";
      switch (this.textSize) {
        case 1:
          textClass += "sm";
          lgTextClass += "base";
          break;
        case 2:
          textClass += "base";
          lgTextClass += "xl";
          break;
        case 3:
          textClass += "xl";
          lgTextClass += "2xl";
          break;
        case 4:
          textClass += "2xl";
          lgTextClass += "3xl";
          break;
        case 5:
          textClass += "3xl";
          lgTextClass += "4xl";

          break;
        default:
          textClass += "xl";
          lgTextClass += "2xl";

          break;
      }
      return {
        default: textClass,
        lg: lgTextClass,
      };
    },
  },
  methods: {
    ...mapMutations({
      setCurrentFileIndex: "SET_CURRENT_FILE_INDEX",
      openDefinitionPanel: "OPEN_DEFINITION",
    }),
    ...mapActions(["getDefinition"]),
  },
  mixins: [navigationMixins],
  updated() {
    console.log("Renderer updated!");
    const rendererEl = this.$refs.renderer;
    // reset scroll position

    // only scroll back to top if the there's a change of file content
    if (this.allowScrollTop) {
      rendererEl.scrollTop = 0;
      // set if back to false (default) until future file index change (see watcher)
      this.allowScrollTop = false;
    }
    const links = rendererEl.querySelectorAll("a[href]");
    // adding link management
    if (links.length > 0) {
      for (let i = 0; i < links.length; i++) {
        const a = links[i];
        a.addEventListener("click", (e) => {
          // test if href leads to another html page from within the epub
          const isNavigationLink = /[\w-]+\.x?html?(#[\w.-]+)?$/i.test(a.href);
          // only then
          if (isNavigationLink) {
            e.preventDefault();
            // file name with possible #id at the end
            const completeFileName = a.href.split("/").pop();
            // file name without the #id
            const [fileName /*, hashTag*/] = completeFileName.split("#");
            // getting the file index by file name to navigate to it
            this.goToPage(fileName);
          }
          return;
        });
      }
    }
  },
  watch: {
    // tracks the previous file index to avoid scrolling to top if the same file was re-redered (after text-size or theme change for instance)
    currentFileIndex(newVal, prevVal) {
      if (prevVal !== newVal) {
        this.allowScrollTop = true;
      }
    },
  },
  // to be implemeted later
  // mounted() {
  //   const renderer = this.$refs.renderer;
  //   renderer.addEventListener("mouseup", () => {
  //     const range = window.getSelection().getRangeAt(0);
  //     const selection = range.toString().trim();
  //     const position = range.getBoundingClientRect();
  //     if (selection && selection.length > 0) {
  //       console.log(selection, position);
  //     }
  //   });
  // },
};
</script>

<style>
div.light a {
  color: rgb(71, 107, 207);
  text-decoration: none;
}
div.light a:hover {
  text-decoration: underline;
}
/* dark */
div.dark a {
  color: rgb(171, 194, 238);
  text-decoration: none;
}
div.dark a:hover {
  text-decoration: underline;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}
/* ----- Track ----- */
::-webkit-scrollbar-track {
  transition: 0.4s;
  background: rgba(206, 206, 206, 0.658);
}
/* - dark - */
div.dark::-webkit-scrollbar-track {
  background: rgba(78, 86, 102, 0.712);
}
/* ----- Track hover ----- */
::-webkit-scrollbar-track:hover {
  background: rgba(206, 206, 206, 0.911);
}
/* - dark - */
div.dark::-webkit-scrollbar-track:hover {
  background: rgba(87, 99, 122, 0.884);
}

/* ----- Handle ----- */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  transition: 1s;
  background: rgb(151, 151, 151);
}
/* - dark - */
div.dark::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.623);
}

/*----- Handle hover ----- */
::-webkit-scrollbar-thumb:hover {
  background: rgb(81, 94, 119);
}

/* div#renderer > div p {
  font-size: 1.5rem;
} */
</style>