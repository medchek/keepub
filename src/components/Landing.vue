<template>
  <div class="tw-flex tw-justify-center tw-items-center tw-h-full tw-w-full">
    <div
      class="tw-flex tw-flex-col tw-h-56 tw-w-3/4 xl:tw-w-1/2 tw-items-center tw-justify-center tw-border-8 tw-border-gray-800 tw-shadow-xl"
    >
      <div
        class="tw-text-center tw-font-bold tw-text-xl sm:tw-font-normal sm:tw-text-3xl lg:tw-text-4xl tw-mb-3 tw-mx-1 tw-text-gray-900"
      >The EPUB reader that you need</div>

      <label
        for="select-epub"
        class="tw-w-40 tw-h-12 tw-flex tw-justify-center tw-items-center tw-rounded-sm tw-cursor-pointer tw-bg-gray-900 tw-text-white hover:tw-bg-white hover:tw-text-gray-900 tw-font-semibold tw-shadow-md tw-transition-all tw-duration-150"
      >Open epub</label>

      <div
        v-if="error.show"
        id="landing-error-reporter"
        class="tw-bg-red-700 tw-text-white tw-w-full tw-text-center tw-font-semibold tw-bottom-0 tw-absolute"
        style="justify-self: end;"
      >{{error.message}}</div>
    </div>
  </div>
</template>

<script>
// import SelectFile from "./SelectFile";
import { mapGetters } from "vuex";

export default {
  name: "Landing",
  computed: {
    ...mapGetters({
      error: "getError",
    }),
  },
  components: {
    // SelectFile,
  },
};
</script>
