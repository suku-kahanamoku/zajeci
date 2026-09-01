<script setup lang="ts">
definePageMeta({
  layout: "admin",
  syscode: "admin",
  title: "$.admin.title",
});

const { t } = useLang();

useHead({
  title: computed(() => t("$.admin.title")),
  meta: [{ name: "description", content: t("$.base.description") }],
});
</script>

<template>
  <AdminDashboard />
</template>
