<template>
  <div
    id="renderer"
    class="tw-w-auto tw-h-full tw-flex tw-flex-col tw-flex-grow tw-pt-5 tw-px-12 tw-pb-10 tw-overflow-y-auto tw-text-xl lg:tw-text-2xl"
    :class="[theme.text, theme.name]"
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
    ...mapGetters({ opf: "getOpf", theme: "getTheme" }),
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
    const rendererEl = this.$refs.renderer;
    // reset scroll position
    rendererEl.scrollTop = 0;
    const links = rendererEl.querySelectorAll("a[href]");
    // adding link management
    if (links > 0) {
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
};
</script>

<style>
div#renderer a {
  color: rgb(31, 65, 160);
  text-decoration: none;
}
div#renderer a:hover {
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
  background: rgba(230, 230, 230, 0.747);
}
/* ----- Track hover ----- */
::-webkit-scrollbar-track:hover {
  background: rgba(206, 206, 206, 0.911);
}
/* - dark - */
div.dark::-webkit-scrollbar-track:hover {
  background: rgb(230, 230, 230);
}

/* ----- Handle ----- */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  transition: 1s;
  background: rgb(151, 151, 151);
}
/* - dark - */
div.dark::-webkit-scrollbar-thumb {
  background: rgba(40, 50, 70, 0.849);
}

/*----- Handle hover ----- */
::-webkit-scrollbar-thumb:hover {
  background: rgb(81, 94, 119);
}

div#renderer > div p {
  font-size: 1.5rem;
}
</style>