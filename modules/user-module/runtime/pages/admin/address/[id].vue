<script setup lang="ts">
import aConfig from "../../../assets/configs/admin-address-update.json";

definePageMeta({
  layout: "admin",
  syscode: "admin_address_detail",
  title: "$.address.admin.update.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() => t((route.meta.label || route.meta.title) as string));

const { config, addresses: addressData, loading, onUpdate } = useAddressAdmin(aConfig);

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
      v-if="addressData?.data"
      :fields="config.fields"
      :item="addressData.data"
      :loading="loading"
      :actions="{ no: { link: routes.admin_address as any } }"
      :ui="{ body: 'grid md:grid-cols-2 gap-4' }"
      @submit="onUpdate($event, addressData.data)"
    />
  </div>
</template>
