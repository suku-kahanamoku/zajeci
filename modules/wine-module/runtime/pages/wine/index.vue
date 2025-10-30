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
  { watch: [() => route.query] }
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
  { watch: [route] }
);
</script>

<template>
  <div
    v-if="config"
    :id="config.syscode"
    class="w-full max-w-7xl mx-auto px-5 space-y-16 py-16"
  >
    <div :id="(routes.winde?.meta?.syscode as string)">
      <UPageHeader
        :title="title"
        :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
        class="border-none"
      />

      <div class="flex flex-wrap justify-center gap-10 items-stretch">
        <CmpWineCard
          v-for="wine of (wines?.data as IWine[])"
          :fields="config.fields"
          :wine="wine"
        />
      </div>
    </div>
  </div>
</template>
