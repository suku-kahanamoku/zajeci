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
      <!-- eyebrow removed for cleaner design -->
      <h1
        class="font-serif text-5xl md:text-7xl font-bold leading-tight text-white max-w-3xl"
      >
        {{ $tt("$.intro.title") }}
      </h1>
      <!-- Decorative separator hidden for cleaner visual -->
      <div class="hidden mt-6 mb-6 flex items-center gap-3">
        <div class="w-12 h-px bg-secondary-400"></div>
        <UIcon name="ph:wine-duotone" class="text-secondary-400" size="22" />
        <div class="w-12 h-px bg-secondary-400"></div>
      </div>
      <!-- subtitle removed for cleaner design -->
      <div class="mt-10 flex flex-wrap gap-4">
        <UButton
          :to="localePath(routes.wine?.path!)"
          color="secondary"
          variant="solid"
          size="xl"
          class="font-semibold tracking-wide uppercase"
        >
          {{ $tt("$.intro.btn") }}
        </UButton>
        <UButton
          to="/#tasting"
          color="gold"
          variant="solid"
          size="xl"
          class="font-semibold tracking-wide uppercase"
        >
          {{ $tt("$.intro.btn_tasting") || "CHCI DEGUSTACI" }}
        </UButton>
      </div>
    </div>

    <client-only>
      <UiParallax src="/img/intro.jpg" />
    </client-only>
  </div>
</template>
