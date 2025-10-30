<script setup lang="ts">
import { useUrlResolver } from "#imports";

import { CLONE } from "@suku-kahanamoku/common-module/utils";

import wConfig from "../assets/configs/wine-list-top.json";
import type { IWine, IWinesResponse } from "../types";

const { t } = useLang();
const { routes, route } = useMenuItems();
const { updateConfig } = useUrlResolver();

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
  <div v-if="config" :id="config.syscode">
    <div class="text-center pt-20 pb-10">
      <h2
        class="text-primary-600 text-4xl font-bold tracking-tight dark:text-primary-400"
      >
        {{ $tt("$.wine.title") }}
      </h2>
    </div>

    <div class="flex flex-wrap justify-center gap-10 items-stretch">
      <CmpWineCard
        v-for="wine of wines?.data"
        :fields="config.fields"
        :wine="(wine as IWine)"
      />
    </div>
  </div>
</template>
