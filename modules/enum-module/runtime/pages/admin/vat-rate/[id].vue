<script setup lang="ts">
import vConfig from "../../../assets/configs/admin-vat-rate-update.json";
import type { IEnumItem } from "../../../types/enum.types";

definePageMeta({
  layout: "admin",
  syscode: "admin_vat_rate_detail",
  title: "$.admin.vat_rate.update_vat_rate",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() => t((route.meta.label || route.meta.title) as string));

const { config, tastes: vatRate, loading, onUpdate } = useTasteAdmin(vConfig, "admin_vat_rate");

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
      v-if="vatRate?.data"
      :fields="config.fields"
      :item="vatRate.data as IEnumItem"
      :loading="loading"
      :actions="{ no: { link: (routes as any).admin_vat_rate as any } }"
      :ui="{ body: 'grid md:grid-cols-2 gap-4' }"
      @submit="onUpdate($event, vatRate?.data as IEnumItem)"
    />
  </div>
</template>
