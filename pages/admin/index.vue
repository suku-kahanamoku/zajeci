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
  <div class="max-w-screen-xl mx-auto px-5 w-full">
    <div id="dashboard" class="py-10">
      <h1
        class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400"
      >
        {{ title }}
      </h1>
    </div>
  </div>
</template>
