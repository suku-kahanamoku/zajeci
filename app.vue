<script setup lang="ts">
const {
  i18n: { locale },
} = useLang();
</script>
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UiCookieBanner />
  </UApp>
</template>
