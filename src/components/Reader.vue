<template>
  <div
    id="reader"
    class="tw-w-full tw-h-full tw-flex tw-flex-row tw-justify-center tw-overflow-hidden tw-py-5"
  >
    <Loader v-if="!isLoaded" :size="4" />
    <div
      v-else
      class="tw-h-full tw-w-11/12 tw-flex tw-flex-row tw-justify-between tw-overflow-hidden tw-shadow-lg tw-border-gray-100 tw-border moved"
    >
      <!-- PREVIOUS BUTTOn -->
      <button
        class="tw-flex tw-justify-center tw-items-center tw-text-gray-600 tw-bg-gray-200 tw-bg-opacity-50 hover:tw-bg-opacity-75 tw-w-6 tw-px-4 tw-h-full tw-self-center"
        :disabled="currentFileIndex === -1"
        :class="{disabled: currentFileIndex === -1}"
        @click="read(-1)"
        title="previous page"
      >
        <ChevronLeft :size="70" />
      </button>
      <!-- METADATA -->
      <BookMetadata v-if="currentFileIndex === -1" />
      <!-- RENDERER -->
      <Renderer v-else :src="render" />
      <!-- NEXT BUTTON -->
      <button
        :disabled="currentFileIndex === opf.package.spine.itemref.length - 1"
        :class="{disabled: currentFileIndex === opf.package.spine.itemref.length - 1}"
        class="tw-flex tw-justify-center tw-items-center tw-text-gray-600 tw-bg-gray-200 tw-bg-opacity-50 hover:tw-bg-opacity-75 tw-w-6 tw-px-4 tw-h-full tw-self-center"
        @click="read(1)"
        title="next page"
      >
        <ChevronRight :size="70" />
      </button>
    </div>

    <DefinitionPanel />

    <TableOfContents v-show="sideNav.show" />
  </div>
</template>

<script>
import JSZip from "jszip";
// import csso from "csso";
// mdi icon components
import ChevronLeft from "icons/ChevronLeft";
import ChevronRight from "icons/ChevronRight";
// local components
import TableOfContents from "./TableOfContents";
import BookMetadata from "./BookMetadata";
import Renderer from "./Renderer";
import Loader from "./Loader";
import DefinitionPanel from "./DefinitionPanel";
// vuex
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      isLoaded: false,
      render: "",
      renderCss: "",
      // stores all the asset files. This state is populated upon component creation (see created() lifecycle)
      assetFiles: [],
      // store the currently used blob urls
      requiredAssetsBlobUrls: [],
      //
    };
  },
  computed: {
    ...mapGetters({
      sideNav: "getSideNav",
      opf: "getOpf",
      ncx: "getNcx",
      epub: "getEpub",
      assets: "getAssets",
      currentFileIndex: "getCurrentFileIndex", // current file index following the opf spine, where -1 will display the Metadata component
    }),
  },

  methods: {
    ...mapMutations({ setCurrentFileIndex: "SET_CURRENT_FILE_INDEX" }),
    // updates the current file to be rendered
    // where 1 means forward, -1 means backward
    read(direction) {
      // if (direction !== 1 || direction !== -1) return;
      const epubMaxIndex = this.opf.package.spine.itemref.length - 1;
      const nextFileIndex = this.currentFileIndex + direction;
      if (nextFileIndex >= -1 && nextFileIndex <= epubMaxIndex) {
        this.setCurrentFileIndex(this.currentFileIndex + direction);
        // * render is now handled in the watcher
        // * previously was here, when the currentIndexFile was a local state
      }
      return;
    },
    renderEpub() {
      JSZip.loadAsync(this.epub)
        // resolve
        .then((epubObj) => {
          // extract asset files
          //
          // get the path of the file to be rendered
          // getCurrentFilePath uses this.currentFileIndex to determine the file path
          // a regex is needed to search the file from within the EPUB compressed files
          const filePathRegex = this.getPathRegex(this.getCurrentFilePath());

          // use the path name regex to extract the file contents from the archive
          const fileToRender = epubObj.file(filePathRegex);
          // if no results were found, throw an error
          if (!fileToRender || fileToRender.length === 0) {
            throw new Error(
              `[renderEpub] could not open file: ${this.getCurrentFilePath()}`
            );
          }
          // on success, fileToRender will contain an array of all the files that matched the regex,
          // here, only one file should be found, hence the [0] index
          fileToRender[0]
            // convert file contents to a string to be further processed
            .async("string") // async to string then
            .then(
              // async to string sucess
              (html) => {
                // parse the html string
                const render = this.htmlRegexParse(html);
                this.render = render;
              },
              // async to string fail
              (err) => {
                throw new Error(
                  `[renderEpub] contents to string conversion failed ${err}`
                );
              }
            );
        })
        // global promise catch
        .catch((err) => {
          throw new Error(
            `[renderEpub() GLOBAL CATCH] ERROR OPENING EPUB in READER ${err}`
          );
        });
    },
    htmlRegexParse(htmlString) {
      // this will contain all the assets required for the current page to render, in an organized fashion
      const requiredAssets = {
        css: [],
        otherAssets: [],
      };
      // regex for extracting attribute values that contain a path/url to a file
      // exluding xpgt files
      const regex = /="[\w./@-]*\/?([\w-]+\.(?!(xpgt|x?html?))[a-z]{1,5})"/gim;
      // const regex = /="[\w./-]*\/?([\w-]+\.(?!(xpgt|x?html?))[a-z]{1,5})"/gim;
      // const regex = /(?!https?)[^"]*\/?([\w-]+\.(?!(xpgt|x?html?))[a-z]{1,5})"/gim;
      // const regex = /[^:"]*\/?([\w-]+\.(?!(xpgt|x?html?))[a-z]{1,5})"/gim;
      // fetch for any matches with the html string
      const match = htmlString.match(regex);
      if (!match) {
        console.log("Could not find any links within the current html file"); // if no assets were found (str.match returns null in no matches were found)
      } else {
        // only needed assets for the current page to render
        // will contain only indexes of the needed files
        const requiredAssetsIndexes = match
          .map((attr) => {
            const path = attr.split(/^="([\w/.@?-]+)"$/i);

            const file = this.getFileNameFromPath(path[1]);
            const fileIndex = this.assetFiles.findIndex((asset) =>
              asset.name.includes(file)
            );
            return fileIndex;
          })
          .filter((index) => index > -1); // remove any assets that were not referenced in the opf resource but were present in the html ()

        // if no assets are found, return immediately
        if (requiredAssetsIndexes.length === 0) {
          console.log("FAILED TO EXTRACT ASSETS INDEX");
        }

        // get only the css file indexes. Needed to handle asset links inside css
        const cssOnly = requiredAssetsIndexes.filter((assetIndex) => {
          // only if the index is valid
          const file = this.assetFiles[assetIndex];
          return file.name.indexOf(".css", file.name.length - 4) > -1;
        });

        if (cssOnly.length > 0) {
          // for each css file present in the epub...
          for (let i = 0; i < cssOnly.length; i++) {
            const cssAssetIndex = cssOnly[i];
            // get the file matching the current index
            const file = this.assetFiles[cssAssetIndex];
            // -----
            // if the contents is not empty or undefined
            if (file.contents) {
              // organzie all the indexes within the requiredAssets variable
              // the css property will contain all the css assets, including indexes of font/img urls inside each css file
              requiredAssets.css.push({
                // file index
                fileIndex: cssAssetIndex,
                // and look for urls inside the css itself, otherwise it'll be null
                urls: this.extractUrlsFromCss(file.contents),
              });
            }
          }
        } else {
          console.log("no css assets");
        }

        // all assets that do not belong to css will be placed in the the "otherAssets" property
        requiredAssets.otherAssets = requiredAssetsIndexes.filter(
          // get the files that are not css
          (assetIndex) => !cssOnly.includes(assetIndex)
        );

        // console.log("All=>", requiredAssetsIndexes, "sorted=>", requiredAssets);

        // replace all links with blob urls
        // NON-CSS ASSETS REPLACING
        if (requiredAssets.otherAssets.length > 0) {
          for (let i = 0; i < requiredAssets.otherAssets.length; i++) {
            const assetIndex = requiredAssets.otherAssets[i];
            const fileName = this.getFileNameFromPath(
              this.assetFiles[assetIndex].name
            );
            const fileRegex = new RegExp(
              `="[a-zA-Z0-9_./-]*/?(${fileName})"`,
              "gmi"
            );

            const blobUrl = this.createBlobUrl(assetIndex);
            // replacing links with blobs
            htmlString = htmlString.replace(fileRegex, `="${blobUrl.url}"`);
          } // end for
        }

        // CSS REPLACING
        let replacedCss = [];
        if (requiredAssets.css.length > 0) {
          replacedCss = requiredAssets.css.map(({ fileIndex, urls }) => {
            // if there are links within the css, process them,
            if (urls.length > 0) {
              // remove duplicates
              const cssUrls = Array.from(new Set(urls));
              // raw css contents
              let css = this.assetFiles[fileIndex].contents;

              for (let j = 0; j < cssUrls.length; j++) {
                // Asset file index
                const urlIndex = cssUrls[j];
                // get the file name to use it in regex
                const urlFileName = this.getFileNameFromPath(
                  this.assetFiles[urlIndex].name
                );

                // replace regex
                const urlRegex = new RegExp(
                  `[a-z0-9_./-]*/?(${urlFileName})`,
                  "gmi"
                );
                const blobUrl = this.createBlobUrl(urlIndex);
                css = css.replace(urlRegex, blobUrl.url);
              }
              return css;
            } else {
              // if no urls are found, return the raw css to be injected in the header
              return this.assetFiles[fileIndex].contents;
            }
          });
          const mergedCss = replacedCss.join("\n");
          const finalCss = this.removeConflictingCss(mergedCss);
          if (finalCss) {
            this.renderCss = finalCss;
          }
        }
      }

      // When all the blobs are generated and links replaced, revoke unused blobs
      this.revokeUnusedBlobs(requiredAssets);

      // split at the head tag

      const html = new DOMParser().parseFromString(
        htmlString,
        "application/xhtml+xml"
      );
      return html.body.innerHTML;
    },
    // extract paths to fonts from within the css
    extractUrlsFromCss(css) {
      // const regex = /url\(([./\w]*.[a-z]+)\)/gim; // regex for minimised css
      const regex = /url\("?[./\w]*\/([\w.-]+\.[a-z]{1,5})"?\)/gim; // regex for multiline uncompressed css
      const fontUrls = css.match(regex); // format will be url("path/to/font.ttf")
      // if (!fontUrls) return null; // if no file path inside css
      if (!fontUrls) return []; // if no file path inside css
      // split the url to only leave the path i.e. remove url and the parentheses
      const fontPaths = fontUrls.map((url) => {
        const fileName = url.split(regex)[1];
        // return the index of the url file
        const fileIndex = this.assetFiles.findIndex((asset) =>
          asset.name.includes(fileName)
        );
        return fileIndex;
      });

      return fontPaths;
    },
    // remove any css rules that correspond to the rules sets
    removeConflictingCss(cssText) {
      const rules = [
        /(body|svg)[^\n\r\t]*[ \n\r\t]*{[ \w"',%()/:;.\n\r\t-]*}/gim,
        /font-size:[a-zA-Z0-9. %-]+;/gim,
      ];
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        cssText = cssText.replace(rule, "");
      }
      return cssText;
    },
    createBlobUrl(fileIndex) {
      // check if blob url already exists, and return it
      const blobIndexCheck = this.requiredAssetsBlobUrls.findIndex(
        (blob) => blob.fileIndex === fileIndex
      );
      if (blobIndexCheck > -1) {
        return this.requiredAssetsBlobUrls[blobIndexCheck];
      }
      // if the blob does not exist yet
      const file = this.assetFiles[fileIndex].contents;
      const blob = {
        fileIndex,
        url: URL.createObjectURL(file),
      };
      this.requiredAssetsBlobUrls.push(blob);
      return blob;
    },
    // will revoke all unused blob urls within the neededAssetsBlobUrls that are no longer used
    // based on the provided newly used ones
    revokeUnusedBlobs({ css, otherAssets }) {
      // init the array
      let mergedAssets = [...otherAssets];

      for (let i = 0; i < css.length; i++) {
        const cssFile = css[i];
        if (cssFile.urls) {
          mergedAssets = [...mergedAssets, ...cssFile.urls];
        }
        continue;
      }
      // remove any duplicates
      const currentlyUsedAssets = Array.from(new Set(mergedAssets));
      // get the unusedBlobs
      for (let i = 0; i < this.requiredAssetsBlobUrls.length; i++) {
        const blob = this.requiredAssetsBlobUrls[i];

        if (!currentlyUsedAssets.includes(blob.fileIndex)) {
          this.revokeBlobByIndex(i);
        }
        continue;
      }
    },
    // this will directly target the blob url based on the requiredAssetsblobUrls state index
    revokeBlobByIndex(index) {
      if (this.requiredAssetsBlobUrls[index]) {
        // revoke the blob to prevent memory leaks
        URL.revokeObjectURL(this.requiredAssetsBlobUrls[index].url);
        // remove it from the array
        this.requiredAssetsBlobUrls.splice(index, 1);
      }
    },
    // Extracts the file name from a file path string/url string
    // ex: images/path/file.jpg @returns file.jpg
    // primarily used to extract asset file names from an href or src attribute value
    getFileNameFromPath(path) {
      // splits the provided path in order to keep the file only
      const file = path.split("/");
      return file[file.length - 1] || path;
    },
    getCurrentFileName() {
      return this.getFileNameFromPath(this.getCurrentFilePath());
    },
    // get the the path of the file that is to be rendered. Mainly used to search for the file inside the epub using JSZIP.file()
    getCurrentFilePath() {
      // first get the ref id of the current file to render (specified within the currentFileIndex state) from the spine (table of contents) in the opf file
      const pageId = this.opf.package.spine.itemref[this.currentFileIndex][
        "attr_idref"
      ];
      // throw error if the file could not be found
      if (!pageId) {
        throw new Error(
          "[getCurrentFilePath] Could not extract idref from the epub spine"
        );
      }
      // once the refid is obtained, use it to fetch for the file path of the current file to render
      const filePath = this.opf.package.manifest.item.find((file) => {
        return file["attr_id"] === pageId;
      });
      if (!filePath) {
        throw new Error(
          `[getCurrentFilePath] Could not find file path from the epub manifest with refid ${pageId}`
        );
      }
      return filePath["attr_href"];
    },
    // generates a valid path regex from the provided string
    getPathRegex(filePathString) {
      // replace every / with an espaced equivalent ($& holds the replaced character(s))
      const escapedPathForRegex = filePathString.replace(/[/]/g, "\\$&");
      // create a regex object with the file path pattern
      const filePathRegex = new RegExp(`${escapedPathForRegex}$`, "i");
      return filePathRegex;
    },
    log(msg) {
      console.log(`[Reader.vue] -> ${msg}`);
    },
  },
  watch: {
    // watch for state chage, and render the corresponding epub page.
    // mostly triggered by a change in the store state when the user navigates with the side menu
    currentFileIndex(newVal, oldVal) {
      if (newVal !== oldVal) {
        // render the book
        if (newVal >= 0) {
          // a -1 value refers to the metadata component
          // therefore, only render the page to read if the new value is greater or eaquals 0
          this.renderEpub();
        }
      }
    },
  },
  metaInfo() {
    const css = this.renderCss;
    const ncx = this.ncx;
    return {
      style: [css.length > 0 ? { type: "text/css", cssText: css } : ""],
      title: `${ncx.ncx.docTitle.text} - Reader`,
    };
  },
  components: {
    TableOfContents,
    BookMetadata,
    ChevronLeft,
    ChevronRight,
    Renderer,
    Loader,
    DefinitionPanel,
  },
  // TODO (maybe) : should be handled in a prior stage, when assets file path is searched
  // handle asset file objects loading on component creation
  created() {
    // console.clear();
    JSZip.loadAsync(this.epub)
      .then((epubObj) => {
        const assetsPromises = [];
        for (let i = 0; i < this.assets.length; i++) {
          const filePath = this.assets[i];

          const path = filePath["attr_href"];
          const filePathRegex = this.getPathRegex(path);

          // if the file type is css, then return the raw content of the file
          if (path.indexOf(".css") !== -1) {
            if (epubObj.file(filePathRegex).length > 0) {
              assetsPromises.push(epubObj.file(filePathRegex)[0].async("text"));
            }
            continue;
          } else {
            // otherwise, return a blob
            assetsPromises.push(epubObj.file(filePathRegex)[0].async("blob"));
          }
        }
        return Promise.all(assetsPromises);
      })
      .then((assets) => {
        this.assetFiles = this.assets.map((assetFileName, index) => {
          return {
            name: assetFileName["attr_href"],
            contents: assets[index],
          };
        });
        // remove the loader and allow the component to display
        this.isLoaded = true;
      })
      .catch((err) => {
        console.log("something went wrong", err);
        throw new Error(`Could not load epub asset files ${err}`);
      });
  },
};
</script>

<style scoped>
button:focus {
  outline: none;
}
.moved {
  transition: all 2s ease-in-out;
}
.disabled {
  opacity: 0.3;
  cursor: default;
}
</style>