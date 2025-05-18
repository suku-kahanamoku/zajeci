<script setup lang="ts">
import Ukiyo from "ukiyojs";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

defineProps(["src"]);

const parallax = ref();

onMounted(() => {
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const lgAndLarger = breakpoints.greaterOrEqual("lg");
  new Ukiyo(parallax.value, { speed: lgAndLarger.value ? 5 : 1 });
});
</script>

<template>
  <div
    ref="parallax"
    class="parallax absolute top-0 left-0 -z-10 w-full h-full"
    :style="{ 'background-image': `url(${src})` }"
  >
    <div class="overlay absolute top-0 left-0 w-full h-full"></div>
  </div>
</template>

<style scoped>
.parallax {
  background-repeat: no-repeat;
  background-size: cover;
}
.overlay {
  background-color: rgba(46, 48, 70, 0.6);
}

@media (min-width: 768px) {
  .overlay {
    background: linear-gradient(to right, rgba(46, 48, 70, 0.6), transparent);
  }
}
</style>
