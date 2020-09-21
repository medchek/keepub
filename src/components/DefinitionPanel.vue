<template>
  <transition name="slide-r-l">
    <div
      class="tw-bg-gray-900 tw-flex-col flex tw-text-white tw-w-5/12 lg:tw-w-1/3 xl:tw-w-1/5"
      v-if="definitionPanel.show"
    >
      <div class="tw-flex tw-justify-between tw-p-1 tw-content-center">
        <span class="tw-font-semibold tw-text-lg">Definition</span>
        <button title="Close definition" @click="closeDefinition">
          <Close :size="30" title="Close definition" />
        </button>
      </div>
      <div>
        <Loader :size="3" bg-color="rgba(255, 255, 255, 0.8)" v-if="isFetching" />
      </div>
    </div>
  </transition>
</template>

<script>
import Close from "icons/Close";
import Loader from "./Loader";
import { mapMutations, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      definitionPanel: "getDefinitionPanel",
      isFetching: "getIsFetching",
    }),
  },
  methods: {
    ...mapMutations({ closeDefinition: "CLOSE_DEFINITION" }),
  },
  components: {
    Close,
    Loader,
  },
};
</script>

<style scoped>
.slide-r-l-enter-active {
  transition: all 0.2s ease;
}
.slide-r-l-leave-active {
  transition: all 0.2s ease;
}
.slide-r-l-enter,
.slide-r-l-leave-to {
  transform: translateX(100%);
}
</style>

