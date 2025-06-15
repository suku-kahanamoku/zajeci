<script setup lang="ts">
import { CLONE } from "@/modules/common-module/runtime/utils/modify-object.functions";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";
import wConfig from "../../assets/configs/wine-list.json";

definePageMeta({
  layout: "default",
  syscode: "wine",
  title: "$.wine.title",
});

const { t } = useLang();
const route = useRoute();
const { updateConfig } = useUrlResolver();

const title = computed(() => t(route.meta.title as string));

useHead({
  title: title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});

/**
 * Load config
 */
const { data: config } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(wConfig);
      updateConfig(route, result);
      return result as typeof wConfig;
    } catch (error: any) {
      return {} as typeof wConfig;
    }
  },
  { watch: [() => route.query] }
);

/**
 * Load data
 */
const { data: wines } = await useAsyncData(
  async (): Promise<IWine[] | undefined> => {
    if (config.value?.restUrl) {
      try {
        return await $fetch(config.value?.restUrl);
      } catch (error: any) {
        console.error(error);
      }
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
