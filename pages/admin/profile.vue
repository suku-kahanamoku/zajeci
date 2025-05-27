<script setup lang="ts">
definePageMeta({
  layout: "admin",
  syscode: "admin_profile",
  title: "$.profile.title",
});

const { $tt } = useNuxtApp();

useHead({
  title: `${$tt("$.base.title")} | ${$tt("$.profile.title")}`,
  meta: [
    { name: "description", content: $tt("$.base.description") },
    { name: "keywords", content: $tt("$.base.description") },
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
