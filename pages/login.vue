<script setup lang="ts">
import {
  definePageMeta,
  useLang,
  useHead,
  computed,
  useMenuItems,
} from "#imports";

useSeoMeta({
  robots: "noindex, nofollow",
});

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

const loginConfig = {
  syscode: "login",
  restUrl: "/api/login",
  fields: [
    {
      name: "email",
      type: "email",
      label: "$.form.email",
      placeholder: "admin@vinozezajeci.cz",
      required: true,
      clearable: true,
      size: "lg",
      value: "",
    },
    {
      name: "password",
      type: "password",
      label: "$.form.password",
      required: true,
      clearable: true,
      minLength: 5,
      size: "lg",
      value: "",
    },
    {
      name: "remember",
      type: "checkbox",
      label: "$.login.remember",
      value: false,
    },
  ],
};

</script>

<template>
  <div class="flex items-center justify-center mt-10">
    <CmpLogin :config="loginConfig" :ui="{ root: 'w-96' }" />
  </div>
</template>
