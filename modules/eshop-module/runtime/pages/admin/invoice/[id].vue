<script setup lang="ts">
import iConfig from "../../../assets/configs/admin-invoice-update.json";

definePageMeta({
  layout: "admin",
  syscode: "admin_invoice_detail",
  title: "$.admin.invoice.update.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() => t((route.meta.label || route.meta.title) as string));

const { config, invoices: invoiceData, loading, onUpdate } = useInvoiceAdmin(iConfig);

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
      v-if="invoiceData?.data"
      :fields="config.fields"
      :item="invoiceData.data"
      :loading="loading"
      :actions="{ no: { link: routes.admin_invoice as any } }"
      :ui="{ body: 'grid md:grid-cols-1 gap-4' }"
      @submit="onUpdate($event, invoiceData.data)"
    />
  </div>
</template>
