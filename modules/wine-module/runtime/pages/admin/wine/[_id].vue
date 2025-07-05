<script setup lang="ts">
import wConfig from "../../../assets/configs/admin-wine-update.json";
import type { IWine } from "../../../types";

definePageMeta({
  layout: "admin",
  syscode: "admin_wine_detail",
  title: "$.admin.wine_detail.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() =>
  t((route.meta.label || route.meta.title) as string)
);

const { config, wines: wine, loading, onUpdate } = useWineAdmin(wConfig);

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});
</script>

<template>
  <div
    v-if="config"
    :id="config.syscode"
    class="max-w-screen-xl mx-auto px-5 w-full"
  >
    <div class="flex flex-col gap-8 py-10">
      <h1
        class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400"
      >
        {{ title }}
      </h1>

      <CmpForm
        v-if="wine?.data"
        :fields="config.fields"
        :item="(wine.data as IWine)"
        :loading="loading"
        :ui="{
          body: 'grid md:grid-cols-2 gap-4',
        }"
        @submit="onUpdate($event, wine?.data as IWine)"
      />
    </div>
  </div>
</template>
