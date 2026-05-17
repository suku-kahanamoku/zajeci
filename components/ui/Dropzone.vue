<script setup lang="ts">
import { useDropZone } from "@vueuse/core";

const props = withDefaults(
  defineProps<{
    multiple?: boolean;
    maxSizeMB?: number;
    accept?: string[];
    title?: string;
    subtitle?: string;
  }>(),
  {
    multiple: true,
    maxSizeMB: 20,
    accept: () => [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ],
    title: "Pretahnete soubory sem",
    subtitle: "nebo kliknete pro vyber",
  },
);

const model = defineModel<File[]>({ default: () => [] });

const emits = defineEmits<{
  (e: "error", message: string): void;
}>();

const dropZoneRef = ref<HTMLElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const isOverDropZone = ref(false);

function getFileKey(file: File): string {
  return `${file.name}|${file.size}|${file.lastModified}`;
}

function updateFiles(nextFiles: File[]): void {
  model.value = nextFiles;
}

function validateFile(file: File): string | null {
  if (props.accept.length > 0 && !props.accept.includes(file.type)) {
    return `Soubor ${file.name} ma nepodporovany format.`;
  }

  if (props.maxSizeMB > 0 && file.size > props.maxSizeMB * 1024 * 1024) {
    return `Soubor ${file.name} prekrocil limit ${props.maxSizeMB} MB.`;
  }

  return null;
}

function processFiles(input: File[]): void {
  const base = props.multiple ? [...model.value] : [];
  const known = new Set(base.map(getFileKey));

  for (const file of input) {
    const error = validateFile(file);
    if (error) {
      emits("error", error);
      continue;
    }

    const key = getFileKey(file);
    if (!known.has(key)) {
      base.push(file);
      known.add(key);
    }
  }

  updateFiles(base);

  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
}

function onDrop(files: File[] | null): void {
  if (!files || files.length === 0) return;
  processFiles(files);
}

function onFileInputChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  const selected = target.files ? Array.from(target.files) : [];
  if (selected.length) {
    processFiles(selected);
  }
}

useDropZone(dropZoneRef, {
  multiple: props.multiple,
  onDrop,
  onEnter: () => {
    isOverDropZone.value = true;
  },
  onLeave: () => {
    isOverDropZone.value = false;
  },
});
</script>

<template>
  <div class="space-y-2">
    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      :multiple="multiple"
      :accept="accept.join(',')"
      @change="onFileInputChange"
    />

    <div
      ref="dropZoneRef"
      class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition cursor-pointer"
      :class="
        isOverDropZone
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 opacity-80'
          : 'border-gray-300 dark:border-gray-600 bg-gray-50/70 dark:bg-gray-900/40'
      "
      @click="fileInputRef?.click()"
    >
      <UIcon
        name="i-heroicons-cloud-arrow-up"
        size="56"
        class="text-primary-500"
      />
      <p class="mt-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
        {{ title }}
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-400">{{ subtitle }}</p>
      <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Max {{ maxSizeMB }} MB · {{ accept.join(", ") }}
      </p>
    </div>
  </div>
</template>
