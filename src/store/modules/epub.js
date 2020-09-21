export default {
  state: {
    isLoaded: false,
    epub: null, // hold the whole epub
    opf: null, // holds the complete architecture, html files, and assets of the epub
    ncx: null, // holds the table of contents (toc.ncx),
    assets: [],
  },
  getters: {
    getIsEpubLoaded: (state) => state.isLoaded,
    getEpub: (state) => state.epub,
    getOpf: (state) => state.opf,
    getNcx: (state) => state.ncx,
    getToc: (state) => state.ncx, // alias of the above
    getAssets: (state) => state.assets,
  },
  mutations: {
    SET_EPUB(state, epub) {
      state.epub = epub;
    },
    SET_OPF(state, opfObj) {
      state.opf = opfObj;
    },
    SET_NCX(state, ncxObj) {
      state.ncx = ncxObj;
    },
    // alias of SET_NCX
    SET_TOC(state, tocObj) {
      state.ncx = tocObj;
    },
    SET_ASSETS(state, assetArray) {
      state.assets = assetArray;
    },
    SET_ALL(state, epubContent) {
      Object.assign(state, epubContent);
    },
    RESET_EPUB(state) {
      state.isLoaded = false;
      state.epub = null;
      state.opf = null;
      state.ncx = null;
    },
  },
  actions: {
    resetEpub({ commit }) {
      commit("RESET_EPUB");
      commit("SET_CURRENT_FILE_INDEX", -1);
    },
  },
};
