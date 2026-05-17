<script setup lang="ts">
import type { Reactive } from "vue";

import type { IFormField } from "@suku-kahanamoku/form-module/types";

const { t } = useLang();
const props = defineProps<{
  field: IFormField;
  files: Reactive<any[]>;
  uploadedFiles: Reactive<any[]>;
}>();

const emits = defineEmits<{
  (e: "delete", index: number): void;
}>();

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const getStatusText = (status: any["status"]): string => {
  const texts: Record<any["status"], string> = {
    pending: t("$.message.upload_status_pending"),
    uploading: t("$.message.upload_status_uploading"),
    uploaded: t("$.message.upload_status_uploaded"),
    error: t("$.message.upload_status_error"),
  };
  return texts[status] || "";
};
</script>
<template>
  <div class="space-y-4">
    <UiDropzone :field="props.field" :files="props.files" />

    <div v-if="props.uploadedFiles.length > 0" class="space-y-2">
      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ t("$.message.ready_files", { count: props.uploadedFiles.length }) }}
      </h3>

      <div class="space-y-2 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
        <div
          v-for="(pFile, idx) in props.uploadedFiles"
          :key="idx"
          class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
        >
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <span
                class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
              >
                {{ pFile.file.name }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                {{ formatFileSize(pFile.file.size) }}
              </span>
            </div>

            <UProgress
              :model-value="pFile.progress"
              :max="100"
              :color="
                pFile.status === 'error'
                  ? 'error'
                  : pFile.status === 'uploaded'
                    ? 'success'
                    : 'primary'
              "
            />

            <div class="mt-1 flex items-center justify-between">
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ getStatusText(pFile.status) }} ({{ pFile.progress }}%)
              </span>
              <span
                v-if="pFile.error"
                class="text-xs text-red-600 dark:text-red-400"
              >
                {{ pFile.error }}
              </span>
            </div>
          </div>

          <UButton
            data-testid="table-delete"
            color="error"
            variant="link"
            icon="i-heroicons-trash"
            aria-label="Delete button"
            :disabled="pFile.status === 'uploading'"
            @click="emits('delete', idx)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
