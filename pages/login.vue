<script setup lang="ts">
definePageMeta({
  layout: "default",
  syscode: "login",
  title: "$.navbar.login",
});

const { $tt } = useNuxtApp();

useHead({
  title: `${$tt("$.base.title")} | ${$tt("$.login.title")}`,
  meta: [
    { name: "description", content: $tt("$.base.description") },
    { name: "keywords", content: $tt("$.base.description") },
  ],
});
</script>

<template>
  <div class="flex w-full">
    <div class="flex items-center justify-center mx-auto w-full">
      <CustomFormLogin />
    </div>
  </div>
</template>
