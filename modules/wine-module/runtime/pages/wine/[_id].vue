<script setup lang="ts">
import wConfig from "../../assets/configs/wine-detail.json";
import type { IWine } from "../../types";

definePageMeta({
  layout: "default",
  syscode: "wine_detail",
  title: "$.wine.detail.title",
});

const { t } = useLang();
const route = useRoute();
const title = computed(() =>
  t((route.meta.label || route.meta.title) as string)
);

const { config, wines: wine, pending } = useWine(wConfig);

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});
</script>

<template>
  <section
    v-if="config"
    :id="config.syscode"
    class="max-w-screen-xl mx-auto text-gray-700 body-font overflow-hidden"
  >
    <CmpWineDetailCard :fields="config.fields" :wine="(wine?.data as IWine)" />
  </section>
</template>
