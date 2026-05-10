<script setup lang="ts">
definePageMeta({
  layout: "admin",
  syscode: "admin",
  title: "$.dashboard.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-5">
    <div :id="(routes.admin?.meta?.syscode as string)">
      <UPageHeader
        :title="title"
        :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
        class="border-none"
      />
    </div>
  </div>
</template>
