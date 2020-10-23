<template>
  <div class="tw-w-auto tw-h-full tw-flex tw-flex-grow">
    <div
      id="renderer"
      class="tw-w-auto tw-h-full tw-flex tw-flex-col tw-flex-grow tw-pt-5 tw-px-2 md:tw-px-12 tw-pb-10 tw-overflow-y-auto tw-overflow-x-hidden"
      :class="[theme.text, theme.name, textSizeClass.default, textSizeClass.lg]"
      ref="renderer"
      v-html="src"
    ></div>
    <SelectionMenu
      v-click-outside="clickOutsideRemoveSelection"
      :selection="selectionMenuData"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { navigationMixins } from "../mixins";
import SelectionMenu from "./SelectionMenu";

import vco from "v-click-outside";

export default {
  data() {
    return {
      previousScrollPosition: 0,
      nextScrollPosition: 0,
      allowScrollTop: false,
      selectionMenuData: undefined,
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
          textClass += "xs";
          lgTextClass += "base";
          break;
        case 2:
          textClass += "sm";
          lgTextClass += "xl";
          break;
        case 3:
          textClass += "base";
          lgTextClass += "2xl";
          break;
        case 4:
          textClass += "xl";
          lgTextClass += "3xl";
          break;
        case 5:
          textClass += "2xl";
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
    // checks if the new selection is different from the previous one by comparing their x and y positions the position
    isDifferentSelection(newSelPosition) {
      if (!this.selectionMenuData) return true;
      const oldSel = this.selectionMenuData.position;
      const { x, y, width } = newSelPosition;
      return oldSel.x !== x || oldSel.y !== y || oldSel.width !== width;
    },
    // checks whether the selection position is out of the renderer frame
    isOutOfRenderer(selectionPosition) {
      const renderer = this.$refs.renderer.getBoundingClientRect();
      const { top, bottom } = selectionPosition;
      return renderer.top > bottom || renderer.bottom < top;
    },
    setSelection() {
      const globalSelection = window.getSelection();

      const range = globalSelection.getRangeAt(0);
      const selection = range.toString().trim();
      const position = range.getBoundingClientRect();
      const ignored = /^[,.()[\]?!“”"_'-]+$/gi;

      if (
        selection &&
        selection.length > 0 &&
        !ignored.test(selection) &&
        this.isDifferentSelection(position) &&
        !this.isOutOfRenderer(position)
      ) {
        this.selectionMenuData = {
          selection,
          position,
        };
      } else {
        this.removeSelection();
      }
    },
    clickOutsideRemoveSelection(e) {
      if (!this.$refs.renderer.contains(e.target)) {
        this.removeSelection();
      }
    },
    removeSelection() {
      this.selectionMenuData = undefined;
    },
  },
  directives: {
    clickOutside: vco.directive,
  },
  mixins: [navigationMixins],
  updated() {
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
  components: {
    SelectionMenu,
  },
  mounted() {
    const renderer = this.$refs.renderer;

    renderer.addEventListener("mouseup", () => {
      this.setSelection();
    });

    let scrollTimeout;
    renderer.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.setSelection();
      }, 150);
    });
  },
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