import Vue from "vue";
import App from "./App.vue";
import VueMeta from "vue-meta";

// tailwind import
import "./assets/css/tailwind.css";

import store from "./store";

Vue.config.productionTip = false;

// middlewares

Vue.use(VueMeta);

new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
