<script setup lang="ts">
import type { Reactive } from "vue";
import { useDropZone } from "@vueuse/core";
import type { IFormField } from "@suku-kahanamoku/form-module/types";

const props = defineProps<{
  field: IFormField;
  files: Reactive<any[]>;
}>();

const { t } = useLang();
const { display } = useToastify();
const dropZoneRef = ref();
const fileInputRef = ref();

function tt(key?: string, params?: Record<string, unknown>) {
  if (!key) return undefined;
  return params ? t(key, params) : t(key);
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
  multiple: props.field.multiple,
  onDrop,
});

const fileTypes = computed(() =>
  props.field.fileTypes?.map((type: any) => type.label)?.join(", "),
);

function onDrop(data: any[] | null) {
  if (data) {
    if (!props.field.multiple) {
      props.files.splice(0, props.files.length);
    }

    const names = props.files?.map((file) => file.name) ?? [];
    const types =
      props.field.fileTypes?.flatMap((type: any) =>
        Array.isArray(type.value) ? type.value : [type.value],
      ) || [];

    for (const file of data) {
      if (!types.includes(file.type)) {
        errorHandler(file, "unsupported");
        continue;
      }

      if (
        props.field.fileSize &&
        file.size > props.field.fileSize * 1024 * 1024
      ) {
        errorHandler(file, "size");
        continue;
      }

      if (!names.includes(file.name)) {
        props.files?.push(file);
      }
    }
  }

  fileInputRef.value.value = "";
}

function errorHandler(file: any, errorType: string) {
  setTimeout(() => {
    switch (errorType) {
      case "unsupported":
        display({
          type: "error",
          message: t("$.dropzone.wrong_type", {
            name: file.name,
            types: fileTypes.value,
          }),
        });
        break;

      case "size":
        display({
          type: "error",
          message: t("$.dropzone.wrong_size", {
            name: file.name,
            size: props.field.fileSize,
          }),
        });
        break;
    }
  });
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <UFormGroup
      :name="field.name"
      :description="tt(field.description)"
      :hint="tt(field.hint)"
      :help="tt(field.help)"
      :size="field.size || 'md'"
      :required="field.required"
      :eager-validation="true"
    >
      <template #default="slotProps">
        <input
          ref="fileInputRef"
          type="file"
          :multiple="field.multiple"
          class="hidden"
          @change="(event: any) => onDrop(event.target?.files)"
        />

        <div
          ref="dropZoneRef"
          class="flex flex-col w-full bg-gray-400/10 justify-center items-center rounded border-2 border-dashed pt-2 pb-4"
          :class="{
            'opacity-50': isOverDropZone,
            'border-error-500 dark:border-error-400': !!slotProps?.error,
            'border-gray-300 dark:border-gray-600': !slotProps?.error,
          }"
          @click="fileInputRef.click"
        >
          <UIcon
            class="text-secondary-500"
            name="i-heroicons-cloud-arrow-up"
            size="64"
          />

          <div class="flex flex-col items-center gap-1">
            <div>{{ tt("$.dropzone.drag_files") }}</div>
            <div>{{ tt("$.dropzone.or") }}</div>
            <UButton color="secondary" variant="outline">
              {{ tt("$.dropzone.browse_files") }}
            </UButton>
          </div>

          <div
            class="flex flex-col gap-1 text-sm text-center text-gray-600 dark:text-gray-400 mt-4"
          >
            <div>
              {{ tt("$.dropzone.max_file_size", { size: field.fileSize }) }}
            </div>
            <div>
              {{ tt("$.dropzone.supported_formats", { types: fileTypes }) }}
            </div>
          </div>
        </div>
      </template>
    </UFormGroup>
  </div>
</template>
