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
  <div v-if="config" :id="config.syscode" class="relative">
    <div class="text-center pt-20 pb-8">
      <p class="text-xs font-semibold tracking-[0.25em] uppercase text-secondary-500 dark:text-secondary-400 mb-3">
        {{ $tt("$.wine.eyebrow") || "Naše vína" }}
      </p>
      <h2 class="font-serif text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-300 mb-6">
        {{ $tt("$.wine.title") }}
      </h2>
      <div class="section-divider text-primary-300 dark:text-primary-600 w-full mt-6 mb-2">
        <UIcon name="ph:wine-duotone" size="18" />
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-6 items-stretch">
      <CmpWineCard
        v-for="wine of wines?.data"
        :key="(wine as IWine).id"
        :fields="config.fields"
        :wine="(wine as IWine)"
      />
    </div>

    <div class="text-center mt-10">
      <UButton
        :to="routes.wine?.path"
        variant="outline"
        color="primary"
        size="lg"
        class="font-semibold tracking-wide"
        trailing-icon="i-heroicons-arrow-right"
      >
        {{ $tt("$.wine.show_all") || "Zobrazit všechna vína" }}
      </UButton>
    </div>
  </div>
</template>
