<script setup lang="ts">
import { CLONE } from "@suku-kahanamoku/common-module/utils";

import wConfig from "../../assets/configs/wine-detail.json";
import type { IWine, IWineResponse } from "../../types";

definePageMeta({
  syscode: "wine_detail",
  title: "$.wine.detail.title",
});

const { t } = useLang();
const route = useRoute();
const { updateConfig } = useUrlResolver();
const title = computed(() =>
  t((wine.value?.data?.name || route.meta.label || route.meta.title) as string)
);

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
const { data: wine } = await useAsyncData(
  async (): Promise<IWineResponse | undefined> => {
    if (config.value?.restUrl) {
      try {
        let url = useCompleteUrl(config.value?.restUrl, {
          config: config.value,
          route,
        });
        return await useApi(url);
      } catch (error: any) {
        console.error(error);
      }
    }
  },
  { watch: [route] }
);

useHead({
  title,
  meta: [
    {
      name: "description",
      content: wine.value?.data?.description || t("$.base.description"),
    },
    {
      name: "keywords",
      content: wine.value?.data?.description || t("$.base.description"),
    },
  ],
});
</script>

<template>
  <section
    v-if="config"
    :id="config.syscode"
    class="max-w-screen-xl mx-auto text-gray-700 body-font overflow-hidden"
  >
    <CmpWineDetailCard
      v-if="wine?.data"
      :fields="config.fields"
      :wine="(wine?.data as IWine)"
    />
  </section>
</template>
