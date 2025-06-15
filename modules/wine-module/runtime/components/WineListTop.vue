<script setup lang="ts">
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";

const { data: wines } = await useAsyncData(
  async (): Promise<IWine[] | undefined> => {
    try {
      return await $fetch(`/api/wine?q={"categories":{"$in":["top"]}}`);
    } catch (error: any) {
      console.error(error);
    }
  }
);
</script>

<template>
  <div id="wine" class="py-10 lg:py-16">
    <div class="text-center pb-8 lg:pb-10">
      <h2
        class="text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400"
      >
        {{ $tt("$.wine.title") }}
      </h2>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 py-4">
      <CmpWineCard v-for="wine of wines?.data" :item="wine" />
    </div>
  </div>
</template>
