<script setup lang="ts">
definePageMeta({
  layout: "default",
  syscode: "signup",
  title: "$.navbar.signup",
});

const { $tt } = useNuxtApp();

useHead({
  title: `${$tt("$.base.title")} | ${$tt("$.signup.title")}`,
  meta: [
    { name: "description", content: $tt("$.base.description") },
    { name: "keywords", content: $tt("$.base.description") },
  ],
});
</script>

<template>
  <div class="flex w-full">
    <div class="flex items-center justify-center mx-auto w-full">
      <CustomFormSignup />
    </div>
  </div>
</template>
