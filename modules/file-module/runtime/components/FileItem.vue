<script setup lang="ts">
const { t } = useLang();

const props = defineProps<{
  file: any;
}>();

const emits = defineEmits<{
  (e: "delete"): void;
}>();

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    pending: t("$.message.upload_status_pending"),
    uploading: t("$.message.upload_status_uploading"),
    uploaded: t("$.message.upload_status_uploaded"),
    error: t("$.message.upload_status_error"),
  };
  return texts[status] || "";
};
</script>

<template>
  <div
    class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
  >
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-2">
        <a
          v-if="file.path"
          :href="file.path ? `/api/files/${file.path}` : undefined"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-medium text-primary-600 dark:text-primary-500 hover:underline truncate"
        >
          {{ file.file.name }}
        </a>
        <span
          v-else
          class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
        >
          {{ file.file.name }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400 shrink-0">
          {{ formatFileSize(file.file.size) }}
        </span>
      </div>

      <UProgress
        :model-value="file.progress"
        :max="100"
        :color="
          file.status === 'error'
            ? 'error'
            : file.status === 'uploaded'
              ? 'success'
              : 'primary'
        "
      />

      <div class="mt-1 flex items-center justify-between">
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ getStatusText(file.status) }} ({{ file.progress }}%)
        </span>
        <span v-if="file.error" class="text-xs text-red-600 dark:text-red-400">
          {{ file.error }}
        </span>
      </div>
    </div>

    <UButton
      data-testid="table-delete"
      color="error"
      variant="link"
      icon="i-heroicons-trash"
      aria-label="Delete button"
      :disabled="file.status === 'uploading'"
      @click="emits('delete')"
    />
  </div>
</template>
