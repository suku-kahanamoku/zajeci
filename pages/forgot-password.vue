<script setup lang="ts">
definePageMeta({
  layout: "default",
  syscode: "forgot_password",
  title: "$.forgot_password.title",
});

const { $tt } = useNuxtApp();

useHead({
  title: `${$tt("$.base.title")} | ${$tt("$.forgot_password.title")}`,
  meta: [
    { name: "description", content: $tt("$.base.description") },
    { name: "keywords", content: $tt("$.base.description") },
  ],
});
</script>

<template>
  <div class="flex w-full">
    <div class="flex items-center justify-center mx-auto w-full">
      <CustomFormForgotPassword />
    </div>
  </div>
</template>
