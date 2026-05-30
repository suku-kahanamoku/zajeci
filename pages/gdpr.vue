<script setup lang="ts">
definePageMeta({
  syscode: "gdpr",
  title: "$.gdpr.title",
  label: "$.gdpr.label",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.gdpr.description") },
    { name: "keywords", content: t("$.gdpr.keywords") },
  ],
});
</script>

<template>
  <div
    :id="routes.terms?.meta?.syscode as string"
    class="w-full max-w-7xl mx-auto px-5 py-10"
  >
    <UPageHeader
      :title="title"
      :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
      class="border-none"
    />
  </div>
</template>
