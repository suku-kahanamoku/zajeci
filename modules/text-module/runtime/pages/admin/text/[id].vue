<script setup lang="ts">
import type { IText } from "@/modules/text-module/runtime/types/text.types";
import tConfig from "../../../assets/configs/admin-text-update.json";

definePageMeta({
  layout: "admin",
  syscode: "admin_text_detail",
  title: "$.admin.text.update.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() =>
  t((route.meta.label || route.meta.title) as string)
);

const { config, texts: textData, loading, onUpdate } = useTextAdmin(tConfig);

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
      v-if="textData?.data"
      :fields="config.fields"
      :item="(textData.data as IText)"
      :loading="loading"
      :actions="{
        no: { link: routes.admin_text as any },
      }"
      :ui="{
        body: 'grid md:grid-cols-1 gap-4',
      }"
      @submit="onUpdate($event, textData?.data as IText)"
    />
  </div>
</template>
