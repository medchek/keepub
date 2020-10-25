import Vue from "vue";
import Vuex from "vuex";

// MODULES
import epub from "./modules/epub";
import navigation from "./modules/navigation";
import settings from "./modules/settings";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    epub,
    navigation,
    settings,
  },
});
