<template>
  <div class="tw-flex tw-w-full tw-h-full tw-items-center tw-justify-center">
    <div
      class="tw-rounded-full spin loader"
      :style="{width: sizeClass, height: sizeClass, borderColor: bColor }"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      required: false,
      default: 20,
    },
    bgColor: {
      type: String,
      required: false,
      default: "rgba(82, 82, 82, 0.137)",
    },
    color: {
      type: String,
      required: false,
      default: "rgb(51, 60, 90)",
    },
  },
  computed: {
    sizeClass() {
      return `${this.size}rem`;
    },
    bColor() {
      return `${this.color} ${this.bgColor} ${this.bgColor}`;
    },
  },
};
</script>

<style scoped>
.loader {
  /* border: 4px solid rgba(82, 82, 82, 0.137);
  border-top: 4px solid rgb(51, 60, 90); */
  border-width: 4px;
  border-style: solid;
}
.spin {
  animation: spin cubic-bezier(0.455, 0.03, 0.515, 0.955) 1s infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>