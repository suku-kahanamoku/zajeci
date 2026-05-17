<script setup lang="ts">
import wConfig from "../../../assets/configs/admin-wine-update.json";
import type { IWine } from "../../../types";
import { useFileUpload } from "@/modules/file-module/runtime/composables/useFileUpload";

definePageMeta({
  layout: "admin",
  syscode: "admin_wine_detail",
  title: "$.admin.wine_detail.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() =>
  t((route.meta.label || route.meta.title) as string),
);

const { config, wines: wineResponse, loading, onUpdate } = useWineAdmin(wConfig);
const { files, uploadedFiles, tempPaths, removeUploadedFile } = useFileUpload();
const uploadField = {
  name: "paths",
  type: "file",
  multiple: true,
  required: false,
  fileSize: 20,
  fileTypes: [
    {
      label: "JPG, PNG, GIF, WEBP, PDF",
      value: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
      ],
    },
  ],
} as any;
const wineItem = computed<IWine | null>(() => {
  const raw: any = (wineResponse as any)?.value ?? (wineResponse as any);
  const data: any = raw?.data;
  return data && !Array.isArray(data) ? (data as IWine) : null;
});

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});

async function onFormSubmit(formData: Record<string, any>, wineItem: IWine) {
  await onUpdate(
    { ...formData, paths: tempPaths.value.length > 0 ? tempPaths.value : undefined },
    wineItem,
  );
}
</script>

<template>
  <div v-if="config" :id="config.syscode" class="w-full max-w-7xl mx-auto px-5">
    <UPageHeader
      :title="title"
      :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
      class="border-none"
    />

    <div v-if="wineItem" class="space-y-6">
      <UiFileUpload
        :field="uploadField"
        :files="files"
        :uploaded-files="uploadedFiles"
        @delete="removeUploadedFile"
      />

      <CmpForm
        :fields="config.fields"
        :item="wineItem as IWine"
        :loading="loading"
        :actions="{
          no: { link: routes.admin_wine as any },
        }"
        :ui="{
          body: 'grid md:grid-cols-2 gap-4',
        }"
        @submit="onFormSubmit($event, wineItem as IWine)"
      />
    </div>
  </div>
</template>
