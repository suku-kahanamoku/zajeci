<script setup lang="ts">
import { useUrlResolver, useFormNavigable } from "#imports";

import { CLONE } from "@suku-kahanamoku/common-module/utils";

import wConfig from "../../assets/configs/wine-list.json";
import type { IWine, IWinesResponse } from "../../types";

definePageMeta({
  syscode: "wine",
  title: "$.wine.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const { updateConfig } = useUrlResolver();
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
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
  { watch: [() => route.query] },
);

/**
 * Load data
 */
const { data: wines } = await useAsyncData(
  async (): Promise<IWinesResponse | undefined> => {
    if (config.value?.restUrl) {
      try {
        let url = useCompleteUrl(config.value?.restUrl, {
          config: config.value,
          route,
        });
        url = useFactory(url, config.value.factory, routes.wine?.path);
        return await useApi(url);
      } catch (error: any) {
        console.error(error);
      }
    }
  },
  { watch: [route] },
);
</script>

<template>
  <div
    v-if="config"
    :id="config.syscode"
    class="w-full max-w-7xl mx-auto px-5 pb-16"
  >
    <div class="text-center pt-12 pb-8">
      <p
        class="text-xs font-semibold tracking-widest uppercase text-secondary-500 dark:text-secondary-400 mb-3"
      >
        {{ $tt("$.wine.eyebrow") || "Naše vína" }}
      </p>
      <h1
        class="font-serif text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-300 mb-6"
      >
        {{ title }}
      </h1>
      <div
        class="section-divider text-primary-300 dark:text-primary-600"
      >
        <UIcon name="ph:wine-duotone" size="18" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CmpWineCard
        v-for="wine of wines?.data"
        :key="wine.id"
        :fields="config.fields"
        :wine="wine"
      />
    </div>
  </div>
</template>
