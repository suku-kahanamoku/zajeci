<script setup lang="ts">
const { routes } = useMenuItems();
const localePath = useLocalePath();
</script>
<template>
  <div id="intro" class="overflow-hidden relative py-24 lg:py-48 px-8 lg:px-12">
    <div class="mx-auto max-w-7xl">
      <h1 class="text-5xl lg:text-6xl font-bold tracking-tight text-white">
        {{ $tt("$.intro.title") }}
      </h1>
      <p class="lg:text-lg mt-8 max-w-xl text-white">
        {{ $tt("$.intro.subtitle") }}
      </p>
      <UButton
        :to="localePath(routes.wine?.path!)"
        color="secondary"
        class="mt-10 md:text-lg lg:text-xl dark:text-white"
        >{{ $tt("$.intro.btn") }}</UButton
      >
    </div>
    <client-only>
      <UiParallax src="/img/intro.jpg" />
    </client-only>
  </div>
</template>
