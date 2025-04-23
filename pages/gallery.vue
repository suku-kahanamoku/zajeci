<script setup lang="ts">
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

definePageMeta({
  layout: "default",
  syscode: "gallery",
  title: "$.navbar.gallery",
});

const { $tt } = useNuxtApp();

useHead({
  title: `${$tt("$.base.title")} | ${$tt("$.gallery.title")}`,
  meta: [
    { name: "description", content: $tt("$.base.description") },
    { name: "keywords", content: $tt("$.base.description") },
  ],
});

const data: Ref<any> = ref([]);
const glob = import.meta.glob("@/public/gallery/*", { eager: true });
ITERATE(glob, (value, key) => {
  const src = (value as any).default;
  if (process.client) {
    const img = new Image();
    img.onload = function () {
      data.value.push({ src, width: this.width, height: this.height });
    };
    img.src = src;
  }
});

const lightbox = ref();

onMounted(() => {
  lightbox.value = new PhotoSwipeLightbox({
    gallery: "#gallery",
    children: "a",
    pswpModule: () => import("photoswipe"),
    spacing: 0.5,
    loop: false,
  });
  lightbox.value.init();
});

onUnmounted(() => {
  if (lightbox.value) {
    lightbox.value.destroy();
    lightbox.value = null;
  }
});
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-5 w-full">
    <div id="gallery" class="py-10">
      <h1
        class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400"
      >
        {{ $tt("$.gallery.title") }}
      </h1>
      <div
        id="gallery"
        class="d-flex grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10 items-center"
      >
        <a
          v-for="img of data"
          :href="img.src"
          target="_blank"
          rel="noreferrer"
          class="flex border-2 border-[#D8DEE9] rounded-md overflow-hidden sm:max-h-60 shadow-sm hover:shadow-lg items-center align-middle justify-center justify-items-center"
          :data-pswp-width="img.width"
          :data-pswp-height="img.height"
        >
          <img
            :src="img.src"
            alt="Gallery img"
            loading="lazy"
            format="webp"
            width="300"
          />
        </a>
      </div>
    </div>
  </div>
</template>
