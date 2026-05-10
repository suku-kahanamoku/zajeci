<script setup lang="ts">
import type { IAdminUser } from "@/modules/user-module/runtime/types/user.types";
import uConfig from "../../../assets/configs/admin-user-update.json";

definePageMeta({
  layout: "admin",
  syscode: "admin_user_detail",
  title: "$.admin.user.update.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() =>
  t((route.meta.label || route.meta.title) as string)
);

const { config, users: userData, loading, onUpdate } = useUserAdmin(uConfig);

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});
</script>

<template>
  <div v-if="config" :id="config.syscode" class="w-full max-w-7xl mx-auto px-5">
    <UPageHeader
      :title="title"
      :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
      class="border-none"
    />

    <CmpForm
      v-if="userData?.data"
      :fields="config.fields"
      :item="(userData.data as IAdminUser)"
      :loading="loading"
      :actions="{
        no: { link: routes.admin_user as any },
      }"
      :ui="{
        body: 'grid md:grid-cols-1 gap-4',
      }"
      @submit="onUpdate($event, userData?.data as IAdminUser)"
    />
  </div>
</template>
