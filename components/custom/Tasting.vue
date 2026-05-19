<script setup lang="ts">
import TasteCard from "./TasteCard.vue";

const { data: tasting } = await useAsyncData("tasting", async () => {
  try {
    const r = await $fetch<{ data: any[] }>(
      '/api/enumerations?q={"type":{"value":"taste"}}&limit=100',
    );
    return r.data ?? [];
  } catch {
    return [];
  }
});
</script>

<template>
  <div id="tasting">
    <div class="text-center pt-20 pb-8">
      <p
        class="text-xs font-semibold tracking-widest uppercase text-secondary-500 dark:text-secondary-400 mb-3"
      >
        {{ $tt("$.tasting.eyebrow") || "Zažijte nás naživo" }}
      </p>
      <h2
        class="font-serif text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-300 mb-6"
      >
        {{ $tt("$.tasting.title") }}
      </h2>
      <div
        class="section-divider text-bittersweet w-full mt-6 mb-2"
      >
        <span class="flex">
          <UIcon name="ph:cheese-duotone" size="16" />
          <UIcon name="lucide:wine" size="16" />
        </span>
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-4 items-stretch">
      <TasteCard v-for="(item, index) of tasting" :item="item" />
    </div>
  </div>
</template>
