<script setup lang="ts">
import {
  definePageMeta,
  useLang,
  useHead,
  computed,
  onMounted,
  useMenuItems,
} from "#imports";

definePageMeta({
  syscode: "login",
  title: "$.login.title",
  label: "$.login.label",
});

const { t } = useLang();
const { route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.login.description") },
    { name: "keywords", content: t("$.login.keywords") },
  ],
});

onMounted(() => {
  const inputs = document.querySelectorAll<HTMLInputElement>(
    "input[type='email'], input[type='text'][autocomplete='email']",
  );
  const passwords = document.querySelectorAll<HTMLInputElement>(
    "input[type='password']",
  );
  inputs.forEach((el) => {
    el.value = "admin@example.com";
    el.dispatchEvent(new Event("input"));
  });
  passwords.forEach((el) => {
    el.value = "12345678";
    el.dispatchEvent(new Event("input"));
  });
});
</script>

<template>
  <div class="flex items-center justify-center mt-10">
    <CmpLogin :ui="{ root: 'w-96' }" />
  </div>
</template>
