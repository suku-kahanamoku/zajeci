<script setup lang="ts">
import { useUrlResolver, useFormNavigable } from "#imports";

import { CLONE } from "@suku-kahanamoku/common-module/utils";

import wConfig from "../../assets/configs/wine-detail.json";
import type { IWine, IWineResponse } from "../../types";

definePageMeta({
  syscode: "wine_detail",
  title: "$.wine.detail.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const { updateConfig } = useUrlResolver();
const runtimeConfig = useRuntimeConfig();
const title = computed(() =>
  t((wine.value?.data?.name || route.meta.label || route.meta.title) as string),
);
const wineId = computed(() => String(route.meta.id || route.params.id || ""));

/**
 * Load config
 */
const config = computed(() => {
  const result = CLONE(wConfig);
  updateConfig(route, result);
  return result as typeof wConfig;
});

/**
 * Load data
 */
const { data: wine } = await useAsyncData(
  computed(() => `wine-detail-data-${wineId.value}`),
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
  { watch: [() => route.params, () => route.query] },
);

const socialImage = computed(() => {
  const siteUrl = String(runtimeConfig.public.FRONTEND_HOST).replace(/\/$/, "");
  const imagePath = wine.value?.data?.files?.[0]?.path;

  return imagePath
    ? `${siteUrl}/api/${imagePath.replace(/^\/+/, "")}`
    : `${siteUrl}/img/intro.jpg`;
});

useSeoMeta({
  ogImage: socialImage,
  ogImageAlt: title,
  twitterImage: socialImage,
  twitterImageAlt: title,
});

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
    class="max-w-7xl mx-auto overflow-hidden"
  >
    <CmpWineDetailCard
      v-if="wine?.data"
      :fields="config.fields"
      :actions="{
        no: { link: routes.admin_wine as any },
      }"
      :wine="wine?.data as IWine"
    />
  </section>
</template>
