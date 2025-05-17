<script setup lang="ts">
definePageMeta({
  layout: "default",
  syscode: "home",
  title: "$.home.title",
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
  <div class="w-full overflow-hidden">
    <CustomIntro />

    <div class="max-w-screen-xl mx-auto px-5 w-full">
      <CustomAbout />
      <USeparator  />
      <CustomWine />
      <USeparator  />
      <CustomTasting />
      <USeparator  />
      <CustomContact />
    </div>

    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1133.8470187599103!2d16.77301701287706!3d48.872071975484374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4712d1808ab9b27b%3A0x56188032580edada!2zxaBrb2xuw60gMTU2LCA2OTEgMDUgWmFqZcSNw60!5e0!3m2!1scs!2scz!4v1715605676127!5m2!1scs!2scz"
      width="100%"
      height="600"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</template>
