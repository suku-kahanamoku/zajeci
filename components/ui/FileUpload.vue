<script setup lang="ts">
import { useFileUpload } from "@/composables/useFileUpload";
import type {
  UploadedFileRecord,
  FileUploadItem,
} from "@/composables/useFileUpload";

const props = withDefaults(
  defineProps<{
    entityType?: string;
    entityId?: number | null;
    visibility?: "public" | "private";
    multiple?: boolean;
    maxSizeMB?: number;
    accept?: string[];
  }>(),
  {
    entityType: "file",
    entityId: null,
    visibility: "private",
    multiple: true,
    maxSizeMB: 20,
    accept: () => [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ],
  },
);

const model = defineModel<UploadedFileRecord[]>("modelValue", {
  default: () => [],
});

const emits = defineEmits<{
  (e: "uploaded", file: UploadedFileRecord): void;
  (e: "error", message: string): void;
}>();

const { display } = useToastify();

const {
  files,
  items,
  uploadedFiles,
  tempPaths,
  addFiles,
  removeItem,
  clear,
  commitTempFiles,
} = useFileUpload({
  entityType: props.entityType,
  entityId: props.entityId,
  visibility: props.visibility,
});

const tempFilePaths = computed<string[]>(() =>
  tempPaths.value.map((item) => item.path),
);

// IDs of files already committed (status=uploaded)
const uploadedFileIds = computed<number[]>(() =>
  uploadedFiles.value.map((f) => f.id)
);

// Expose for parent: call commitTempFiles(entityId) then read uploadedFileIds
defineExpose({
  commitTempFiles,
  uploadedFileIds,
  tempFilePaths,
});

const localFiles = computed<File[]>({
  get: () => files,
  set: (value) => {
    addFiles(value);
  },
});

function formatFileSize(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const order = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, order);
  return `${value.toFixed(value >= 10 || order === 0 ? 0 : 1)} ${units[order]}`;
}

function statusColor(
  status: FileUploadItem["status"],
): "primary" | "success" | "error" | "neutral" {
  if (status === "uploaded") return "success";
  if (status === "ready") return "success";
  if (status === "error") return "error";
  if (status === "uploading") return "primary";
  return "neutral";
}

function statusText(status: FileUploadItem["status"]): string {
  if (status === "uploaded") return "Uloženo";
  if (status === "ready") return "Připraveno";
  if (status === "error") return "Chyba";
  if (status === "uploading") return "Nahrávám";
  return "Čeká";
}

function onDropzoneError(message: string): void {
  display({ type: "error", message });
  emits("error", message);
}

watch(
  uploadedFiles,
  (value) => {
    model.value = [...value];
    const last = value[value.length - 1];
    if (last) {
      emits("uploaded", last);
    }
  },
  { deep: true },
);
</script>

<template>
  <div class="space-y-4">
    <UiDropzone
      v-model="localFiles"
      :multiple="multiple"
      :max-size-m-b="maxSizeMB"
      :accept="accept"
      title="Pretahnete soubory pro nahrani"
      subtitle="soubor se po vyberu automaticky nahraje"
      @error="onDropzoneError"
    />

    <div
      v-if="items.length"
      class="space-y-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-900/50"
    >
      <div
        v-for="(item, index) in items"
        :key="`${item.file.name}-${item.file.lastModified}-${index}`"
        class="flex items-center gap-3 rounded border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="min-w-0 flex-1">
          <div class="mb-1 flex items-center gap-2">
            <span
              class="truncate text-sm font-medium text-gray-900 dark:text-gray-100"
              >{{ item.file.name }}</span
            >
            <span class="shrink-0 text-xs text-gray-500 dark:text-gray-400">{{
              formatFileSize(item.file.size)
            }}</span>
          </div>

          <UProgress
            :model-value="item.progress"
            :max="100"
            :color="statusColor(item.status)"
          />

          <div class="mt-1 flex items-center justify-between text-xs">
            <span class="text-gray-600 dark:text-gray-400"
              >{{ statusText(item.status) }} ({{ item.progress }}%)</span
            >
            <span
              v-if="item.error"
              class="text-error-600 dark:text-error-400"
              >{{ item.error }}</span
            >
          </div>
        </div>

        <UButton
          icon="i-heroicons-trash"
          color="error"
          variant="ghost"
          :disabled="item.status === 'uploading'"
          @click="removeItem(index)"
        />
      </div>
    </div>

    <div
      v-if="uploadedFiles.length"
      class="text-xs text-gray-600 dark:text-gray-400"
    >
      Uspesne nahrano: {{ uploadedFiles.length }}
    </div>

    <div class="flex justify-end" v-if="items.length">
      <UButton color="neutral" variant="soft" @click="clear">
        Vymazat seznam
      </UButton>
    </div>
  </div>
</template>
