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
      <p
        class="text-xs font-semibold tracking-widest uppercase text-secondary-500 dark:text-secondary-400 mb-3"
      >
        {{ $tt("$.wine.eyebrow") || "Naše vína" }}
      </p>
      <h2
        class="font-serif text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-300 mb-6"
      >
        {{ $tt("$.wine.title") }}
      </h2>
      <div
        class="section-divider text-primary-300 dark:text-primary-600 w-full mt-6 mb-2"
      >
        <UIcon name="ph:wine-duotone" size="18" />
      </div>
    </div>

    <UCarousel
      v-slot="{ item }"
      :items="(wines?.data as IWine[]) || []"
      arrows
      loop
      :ui="{
        item: 'basis-full md:basis-1/2 lg:basis-1/3 ps-6',
        container: '-ms-6 items-stretch',
        viewport: 'overflow-visible',
        prev: 'start-0 sm:-start-10',
        next: 'end-0 sm:-end-10',
      }"
      class="w-full px-10 py-4"
    >
      <CmpWineCard class="h-full" :fields="config.fields" :wine="item" />
    </UCarousel>

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
