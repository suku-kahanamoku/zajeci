<script setup lang="ts">
import sConfig from "../../../assets/configs/admin-shipping-create.json";

definePageMeta({
  layout: "admin",
  syscode: "admin_shipping_create",
  title: "$.admin.shipping.create_shipping",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() => t((route.meta.label || route.meta.title) as string));

const { config, loading, onCreate } = useTasteAdmin(sConfig, "admin_shipping");

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
      :fields="config.fields"
      :loading="loading"
      :actions="{ no: { link: routes.admin_shipping as any } }"
      :ui="{ body: 'grid md:grid-cols-2 gap-4' }"
      @submit="onCreate"
    />
  </div>
</template>
