<script setup lang="ts">
definePageMeta({
  layout: "default",
  syscode: "terms_conditions",
  title: "$.terms_conditions.title",
});

const { $tt } = useNuxtApp();

useHead({
  title: $tt("$.base.title"),
  meta: [
    { name: "description", content: $tt("$.base.description") },
    { name: "keywords", content: $tt("$.base.description") },
  ],
});
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-5 w-full">
    <div id="terms" class="py-10">
      <h1
        class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400"
      >
        {{ $tt("$.terms_conditions.title") }}
      </h1>
    </div>
  </div>
</template>
