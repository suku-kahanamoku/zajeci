<script setup lang="ts">
import type { Reactive } from "vue";

import type { IFormField } from "@suku-kahanamoku/form-module/types";

const props = defineProps<{
  field: IFormField;
  files: Reactive<any[]>;
  uploadedFiles: Reactive<any[]>;
}>();

const { t } = useLang();

const emits = defineEmits<{
  (e: "delete", index: number): void;
}>();
</script>
<template>
  <div class="space-y-4">
    <UiDropzone :field="props.field" :files="props.files" />

    <div v-if="props.uploadedFiles.length > 0" class="space-y-2">
      <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ t("$.message.ready_files", { count: props.uploadedFiles.length }) }}
      </h3>

      <div class="space-y-2 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
        <UiFileItem
          v-for="(pFile, idx) in props.uploadedFiles"
          :key="idx"
          :file="pFile"
          @delete="emits('delete', idx)"
        />
      </div>
    </div>
  </div>
</template>
