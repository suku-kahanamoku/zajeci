<script setup lang="ts">
import eConfig from "../../../assets/configs/admin-enum-create.json";

definePageMeta({
  layout: "admin",
  syscode: "admin_enum_create",
  title: "$.admin.enum.create_enum",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() =>
  t((route.meta.label || route.meta.title) as string)
);

const { config, loading, onCreate } = useEnumAdmin(eConfig);

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
      :actions="{
        no: { link: routes.admin_enum as any },
      }"
      :ui="{
        body: 'grid md:grid-cols-1 gap-4',
      }"
      @submit="onCreate"
    />
  </div>
</template>
