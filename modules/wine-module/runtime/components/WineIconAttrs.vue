<script setup lang="ts">
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";
import type { IFormField } from "@suku-kahanamoku/form-module/types";

const props = defineProps<{
  fields: IFormField[];
  wine?: IWine;
}>();

const { getSelectLabel } = useField();
</script>

<template>
  <div v-if="wine" class="space-y-1">
    <div
      class="flex flex-wrap gap-4 justify-between py-1 text-gray-700 dark:text-gray-200"
    >
      <span v-if="wine.color" class="flex items-center gap-1">
        <UIcon name="i-heroicons-paint-brush" class="text-pink-500" />
        <span>{{ getSelectLabel(fields, "color", wine.color) }}</span>
      </span>
      <span v-if="wine.kind" class="flex items-center gap-1">
        <UIcon name="i-heroicons-tag" class="text-primary-500" />
        <span>{{ getSelectLabel(fields, "kind", wine.kind) }}</span>
      </span>
      <span v-if="wine.year" class="flex items-center gap-1">
        <UIcon name="i-heroicons-calendar" class="text-amber-500" />
        <span>{{ wine.year }}</span>
      </span>
      <span v-if="wine.volume" class="flex items-center gap-1">
        <UIcon name="i-heroicons-beaker" class="text-blue-500" />
        <span>{{ wine.volume }}ml</span>
      </span>
    </div>
    <div
      class="flex flex-wrap gap-3 justify-between py-1 text-gray-700 dark:text-gray-200"
    >
      <span v-if="wine.variety" class="flex items-center gap-1">
        <UIcon name="i-heroicons-sparkles" class="text-green-500" />
        <span>{{ getSelectLabel(fields, "variety", wine.variety) }}</span>
      </span>
      <span v-if="wine.quality" class="flex items-center gap-1">
        <UIcon name="i-heroicons-star" class="text-yellow-500" />
        <span>{{ getSelectLabel(fields, "quality", wine.quality) }}</span>
      </span>
    </div>
  </div>
</template>
