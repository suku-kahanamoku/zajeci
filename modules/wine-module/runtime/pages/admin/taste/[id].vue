<script setup lang="ts">
import tConfig from "../../../assets/configs/admin-taste-update.json";
import type { IEnumItem } from "@/modules/enum-module/runtime/types/enum.types";

definePageMeta({
  layout: "admin",
  syscode: "admin_taste_detail",
  title: "$.admin.taste_detail.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() =>
  t((route.meta.label || route.meta.title) as string),
);

const { config, tastes: taste, loading, onUpdate } = useTasteAdmin(tConfig);

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});
</script>

<template>
  <div v-if="config" :id="config.syscode" class="w-full max-w-7xl mx-auto px-5">
    <UPageHeader
      :title="title"
      :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
      class="border-none"
    />

    <CmpForm
      v-if="taste?.data"
      :fields="config.fields"
      :item="taste.data as IEnumItem"
      :loading="loading"
      :actions="{
        no: { link: routes.admin_taste as any },
      }"
      :ui="{
        body: 'grid md:grid-cols-2 gap-4',
      }"
      @submit="onUpdate($event, taste?.data as IEnumItem)"
    />
  </div>
</template>
