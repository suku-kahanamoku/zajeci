<script setup lang="ts">
import wConfig from "../../../assets/configs/admin-wine-create.json";
import type { IWine } from "../../../types";

definePageMeta({
  layout: "admin",
  syscode: "admin_wine_create",
  title: "$.admin.wine.create_wine",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() =>
  t((route.meta.label || route.meta.title) as string)
);

const { config, loading, onCreate } = useWineAdmin(wConfig);

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});
</script>

<template>
  <div v-if="config" :id="config.syscode" class="max-w-7xl mx-auto px-5 w-full">
  <div class="flex flex-col gap-8">
      <UPageHeader
        :title="title"
        :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
        class="border-none"
      />

      <CmpForm
        :fields="config.fields"
        :loading="loading"
        :ui="{
          body: 'grid md:grid-cols-2 gap-4',
        }"
        @submit="onCreate"
      />
    </div>
  </div>
</template>
