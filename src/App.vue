<template>
  <div
    id="app"
    class="tw-flex tw-h-screen tw-flex-col"
    :class="theme.primaryBg"
  >
    <Header />
    <SelectFile />
    <component :is="component" />
  </div>
</template>

<script>
import Header from "./components/TheHeader";
import Landing from "./components/Landing";
import SelectFile from "./components/SelectFile";
import Reader from "./components/Reader";

import { mapGetters } from "vuex";
export default {
  name: "App",
  computed: {
    ...mapGetters({
      component: "getComponent",
      theme: "getTheme",
    }),
  },
  components: {
    Header,
    Landing,
    SelectFile,
    // Reader: () => import("./components/Reader")
    Reader,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon:active {
  box-shadow: none;
  outline: none;
}
.icon:focus {
  box-shadow: none;
  outline: none;
}
</style>
