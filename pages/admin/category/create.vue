<script setup lang="ts">
import cConfig from "@/assets/configs/admin-category-create.json";

definePageMeta({
  layout: "admin",
  syscode: "admin_category_create",
  title: "$.admin.category.create_category",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() =>
  t((route.meta.label || route.meta.title) as string)
);

const { config, loading, onCreate } = useCategoryAdmin(cConfig);

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
        no: { link: routes.admin_category as any },
      }"
      :ui="{
        body: 'grid md:grid-cols-1 gap-4',
      }"
      @submit="onCreate"
    />
  </div>
</template>
