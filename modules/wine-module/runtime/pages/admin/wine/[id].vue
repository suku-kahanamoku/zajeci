<script setup lang="ts">
import { useFileUpload } from "@/modules/file-module/runtime/composables/useFileUpload";

import wConfig from "../../../assets/configs/admin-wine-update.json";
import type { IWine } from "../../../types";

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

const {
  config,
  wines: wineResponse,
  loading,
  onUpdate,
  refresh,
} = useWineAdmin(wConfig);
const {
  files,
  uploadedFiles,
  tempPaths,
  removeUploadedFile,
  clearUploadedFiles,
} = useFileUpload();
const uploadField = computed(() => config.value?.uploadField as any);
const wineItem = computed<IWine | undefined>(() => {
  return wineResponse.value?.data as IWine | undefined;
});

const commitLoading = ref(false);

async function onCommitFiles() {
  if (!tempPaths.value.length || !wineItem.value?.id) return;
  commitLoading.value = true;
  try {
    const newFileIds: number[] = [];
    for (const path of tempPaths.value) {
      const res = await $fetch<{ data?: { id?: number } }>(
        "/api/files/commit",
        {
          method: "POST",
          body: {
            path,
            name: path.split("/").pop() || "upload.bin",
            visibility: wineItem.value.published === 1 ? "public" : "private",
            entity_type: "product",
            entity_id: wineItem.value.id,
          },
        },
      );
      const fileId = Number((res as any)?.data?.id || 0);
      if (fileId) newFileIds.push(fileId);
    }
    if (newFileIds.length) {
      const existingIds = wineItem.value.file_ids ?? [];
      await $fetch(`/api/admin/wine/${wineItem.value.id}`, {
        method: "PATCH",
        body: { file_ids: [...existingIds, ...newFileIds] },
      });
    }
    clearUploadedFiles();
    await refresh();
  } finally {
    commitLoading.value = false;
  }
}

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});

async function onFormSubmit(formData: Record<string, any>, wineItem: IWine) {
  await onUpdate(formData, wineItem);
}
</script>

<template>
  <div v-if="config" :id="config.syscode" class="w-full max-w-7xl mx-auto px-5">
    <UPageHeader
      :title="title"
      :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
      class="border-none"
    />

    <UTabs
      v-if="wineItem"
      :items="[
        { label: t('$.form.detail') || 'Detail', slot: 'detail' },
        { label: t('$.form.files') || 'Soubory', slot: 'files' },
      ]"
      class="mt-4"
    >
      <template #detail>
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
      </template>

      <template #files>
        <div class="space-y-6 pt-2">
          <UiFileUpload
            v-if="uploadField"
            :field="uploadField"
            :files="files"
            :uploaded-files="uploadedFiles"
            @delete="removeUploadedFile"
          />

          <div class="flex justify-end">
            <UButton
              :disabled="!tempPaths.length"
              :loading="commitLoading"
              data-testid="form-submit"
              @click="onCommitFiles"
            >
              {{ t("$.btn.submit") }}
            </UButton>
          </div>

          <div v-if="wineItem.files?.length" class="space-y-2">
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ t("$.message.existing_files") || "Nahrané soubory" }}
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div
                v-for="file in wineItem.files"
                :key="file.id"
                class="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              >
                <a
                  v-if="file.mime_type?.startsWith('image/')"
                  :href="`/api/files/${file.path}`"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    :src="`/api/files/${file.path}`"
                    :alt="file.name"
                    class="w-full h-32 object-cover"
                  />
                </a>
                <div
                  v-else
                  class="w-full h-32 flex items-center justify-center bg-gray-100 dark:bg-gray-900"
                >
                  <UIcon
                    name="i-heroicons-document"
                    class="text-4xl text-gray-400"
                  />
                </div>
                <div
                  class="p-2 text-xs text-gray-600 dark:text-gray-400 truncate"
                >
                  {{ file.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>
