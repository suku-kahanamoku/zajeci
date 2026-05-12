<script setup lang="ts">
import rConfig from "../../../assets/configs/admin-role-update.json";

definePageMeta({
  layout: "admin",
  syscode: "admin_role_detail",
  title: "$.role.admin.update.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() => t((route.meta.label || route.meta.title) as string));

const { config, roles: roleData, loading, onUpdate } = useRoleAdmin(rConfig);

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
      v-if="roleData?.data"
      :fields="config.fields"
      :item="roleData.data"
      :loading="loading"
      :actions="{ no: { link: routes.admin_role as any } }"
      :ui="{ body: 'grid md:grid-cols-1 gap-4' }"
      @submit="onUpdate($event, roleData.data)"
    />
  </div>
</template>
