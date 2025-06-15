<script setup lang="ts">
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";

definePageMeta({
  layout: "default",
  syscode: "wine",
  title: "$.wine.title",
});

const { $tt } = useNuxtApp();
const route = useRoute();

useHead({
  title: $tt("$.base.title"),
  meta: [
    { name: "description", content: $tt("$.base.description") },
    { name: "keywords", content: $tt("$.base.description") },
  ],
});

const { data: wines } = await useAsyncData(
  async (): Promise<IWine[] | undefined> => {
    try {
      return await $fetch(`/api/wine`);
    } catch (error: any) {
      console.error(error);
    }
  },
  { watch: [route] }
);
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-5 w-full">
    <div id="terms" class="py-10">
      <h1
        class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400 pb-8"
      >
        {{ $tt("$.wine.title") }}
      </h1>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 py-4">
        <CmpWineCard v-for="wine of wines?.data" :item="wine" />
      </div>
    </div>
  </div>
</template>
