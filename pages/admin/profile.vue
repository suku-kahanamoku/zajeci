<script setup lang="ts">
definePageMeta({
  layout: "admin",
  syscode: "admin_profile",
  title: "$.profile.title",
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
  <div class="w-full mx-auto px-5 py-5 flex flex-col gap-10">
    <div class="w-full h-full flex justify-center items-center">
      <CmpProfile />
    </div>
  </div>
</template>
