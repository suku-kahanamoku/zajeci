<script setup lang="ts">
import pConfig from "../../../assets/configs/admin-payment-update.json";
import type { IEnumItem } from "../../../types/enum.types";

definePageMeta({
  layout: "admin",
  syscode: "admin_payment_detail",
  title: "$.admin.payment.update_payment",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() => t((route.meta.label || route.meta.title) as string));

const { config, tastes: payment, loading, onUpdate } = useTasteAdmin(pConfig);

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
      v-if="payment?.data"
      :fields="config.fields"
      :item="payment.data as IEnumItem"
      :loading="loading"
      :actions="{ no: { link: routes.admin_payment as any } }"
      :ui="{ body: 'grid md:grid-cols-2 gap-4' }"
      @submit="onUpdate($event, payment?.data as IEnumItem)"
    />
  </div>
</template>
