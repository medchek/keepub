import { mapGetters, mapMutations } from "vuex";

export const navigationMixins = {
  computed: {
    ...mapGetters({
      opf: "getOpf",
      currentFileIndex: "getCurrentFileIndex",
    }),
  },
  methods: {
    ...mapMutations({
      setCurrentFileIndex: "SET_CURRENT_FILE_INDEX",
      setLinkId: "SET_LINK_ID",
    }),
    goToPage(filePath) {
      // remove any potential #id reference
      const [fileName, id] = filePath.split("#");
      // set the url id so that the reader scrolls to the appropriate position
      this.setLinkId(id);

      // before getting the corret file index, we need to retireve the id used in the opf spine by matching the fileName (toc.content.attr_src) with any of the items in the opf.manifest.item.href
      const { attr_id } = this.opf.package.manifest.item.find((item) =>
        item.attr_href.includes(fileName)
      );
      // once the attr_id if found then we can proceed to retrive the correct file index to be rendered
      // the renderer follows the order in the opf.package.spine, hence searching it
      const fileIndex = this.opf.package.spine.itemref.findIndex(
        (item) => item.attr_idref === attr_id
      );
      // check to avoid uncessary re-renders
      if (fileIndex >= 0 && fileIndex !== this.currentFileIndex) {
        this.setCurrentFileIndex(fileIndex);
      }
    },
  },
};
