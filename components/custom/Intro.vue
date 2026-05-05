<script setup lang="ts">
const { routes } = useMenuItems();
const localePath = useLocalePath();
</script>
<template>
  <div id="intro" class="overflow-hidden relative py-36 lg:py-56 px-8 lg:px-12">
    <!-- Dark overlay for readability -->
    <div class="absolute inset-0 bg-black/45 z-10"></div>

    <div class="mx-auto max-w-7xl relative z-20">
      <!-- Decorative label -->
      <p class="text-xs font-semibold tracking-[0.25em] uppercase text-secondary-300 mb-4">
        {{ $tt("$.intro.eyebrow") || "Moravské vinařství" }}
      </p>
      <h1 class="font-serif text-5xl md:text-7xl font-bold leading-tight text-white max-w-3xl">
        {{ $tt("$.intro.title") }}
      </h1>
      <!-- Decorative separator -->
      <div class="mt-6 mb-6 flex items-center gap-3">
        <div class="w-12 h-px bg-secondary-400"></div>
        <UIcon name="ph:wine-duotone" class="text-secondary-400" size="22" />
        <div class="w-12 h-px bg-secondary-400"></div>
      </div>
      <p class="text-lg md:text-xl font-light mt-2 max-w-xl text-white/85 leading-relaxed">
        {{ $tt("$.intro.subtitle") }}
      </p>
      <div class="mt-10 flex flex-wrap gap-4">
        <UButton
          :to="localePath(routes.wine?.path!)"
          color="secondary"
          size="xl"
          class="font-semibold tracking-wide"
        >
          {{ $tt("$.intro.btn") }}
        </UButton>
        <UButton
          to="/#tasting"
          variant="outline"
          color="white"
          size="xl"
          class="font-semibold tracking-wide"
        >
          {{ $tt("$.intro.btn_tasting") || "Degustace" }}
        </UButton>
      </div>
    </div>

    <client-only>
      <UiParallax src="/img/intro.jpg" />
    </client-only>
  </div>
</template>

