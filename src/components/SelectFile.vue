<template>
  <input
    type="file"
    accept=".epub, application/epub+zip"
    id="select-epub"
    @change="handleSelectFile"
    class="tw-hidden"
  />
</template>

<script>
import { mapMutations, mapActions } from "vuex";

import { loadAsync } from "jszip";
import { parse } from "fast-xml-parser";

export default {
  methods: {
    ...mapMutations({
      setEpub: "SET_EPUB",
      setEpubPacakge: "SET_ALL",
      loadReader: "LOAD_READER",
    }),
    ...mapActions({
      triggerError: "showError",
    }),
    handleSelectFile(event) {
      const files = event.target.files;
      if (files.length === 0 || files.length > 1) {
        this.triggerError("You cannot select more than one file");
        return console.log(
          "[DEBUG - SelectFile] Not allowed. 0 file or more than one file selected"
        );
      }
      // if only one filed is selected
      // extract it from the array
      const file = files[0];
      // check if the file has an epub extension
      const validFileExtRegex = /^.+\.epub$/i;
      if (validFileExtRegex.test(file.name)) {
        // handle epub file
        this.openEpub(file);
        this.setEpub(file);
      } else {
        this.triggerError("Invalid file extension (must be .epub)");
        throw new Error("WRONG FILE EXTENSION");
      }
    },
    openEpub(file) {
      loadAsync(file, { createFolders: false })
        .then((epub) => {
          const opf = epub.file(/^.+\.opf$/);
          const ncx = epub.file(/^.+\.ncx$/);
          // the opf file basically hold all the information concerning the ebook (files, metadata) while the ncx holds the table of contents and the reading order
          // No opf/ncx file or the existence of more than one means that the ebook is invalid
          // in such case throw an error
          if (opf.length === 0 || ncx.length === 0) {
            this.triggerError(
              "Invalid epub content. OPF and NCX files could not be found"
            );
            throw new Error("Error getting OPF/NCX files.");
          }
          // otherwise, the files array will be holding two entries
          // return it as a promise, in order to get the content of the files as a string
          const promiseReturn = [
            opf[0].async("string"),
            ncx[0].async("string"),
          ];
          // exectue all the promises ---------------------------------------------------------------------------------------
          Promise.all(promiseReturn)
            .then(
              // ON PROMISE ALL SUCCESS
              ([opf, ncx]) => {
                // IF EVERYTHING GOES AS PLANNED, THEN SAVE DATA TO THE STORE
                const parsedOpf = this.parseXML(opf);
                const parsedNcx = this.parseXML(ncx);
                const assets = this.getEpubAssets(opf);

                this.setEpubPacakge({
                  // epub,
                  opf: parsedOpf,
                  ncx: parsedNcx,
                  assets,
                });
                // displays the reader component
                this.loadReader();
                console.log("SUCCESSFULLY LOADED EPUB");
              }
            )
            .catch(
              // ON PROMISE ALL FAIL
              (err) => {
                this.triggerError("Failed to open OPF or NCX files");
                throw new Error(`OPF/NCX FILE OPENING ERROR ${err}`);
              }
            );
        }) // then() end
        // global catch
        .catch((err) => {
          this.triggerError("Could not prase epub content");
          throw new Error(`Error parsing epub ${err}`);
        });
    },
    getEpubAssets(opf) {
      const parsedOpf = this.parseXML(opf);
      const itemsArray = parsedOpf.package.manifest.item;
      // Filter files that are conciderd assets (images, fonts, css) by looking into the media-type attribute
      const assetsArray = itemsArray.filter((item) => {
        return (
          /image|css/gi.test(item["attr_media-type"]) ||
          /^.+\.(ttf|otf|woff|eot|svg)$/i.test(item["attr_href"])
        );
      });
      // if no assets were present then throw an error
      if (assetsArray.length === 0) {
        this.triggerError("No assets were found in the epub");
        throw new Error("No assets could be found");
      }
      // otherwise, if all goes well, return the asset array
      return assetsArray;
    },
    parseXML(xml) {
      try {
        const opfJson = parse(xml, {
          ignoreAttributes: false,
          attributeNamePrefix: "attr_",
        });
        return opfJson;
      } catch (err) {
        this.triggerError("Error while processing XML");
        throw new Error(`Error while processing XML ${err}`);
      }
    },
  },
};
</script>

<style>
</style>