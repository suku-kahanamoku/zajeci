<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src?: string;
    defaultSrc?: string;
    alt?: string;
    loading?: "lazy" | "eager";
    format?: string;
    sizes?: string;
    class?: string;
  }>(),
  {
    defaultSrc: "/img/bottle.jpg",
    alt: "Alt text",
    loading: "lazy",
    format: "webp",
    sizes: "200px md:300px",
  },
);
</script>

<template>
  <img
    v-if="src"
    :src="src"
    :alt="alt"
    :loading="loading"
    :class="props.class"
  />
  <NuxtImg
    v-else
    :src="defaultSrc"
    :alt="alt"
    :loading="loading"
    :format="format"
    :sizes="sizes"
    :class="props.class"
  />
</template>
