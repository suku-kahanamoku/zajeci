<script setup lang="ts">
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";
import type { IFormField } from "@suku-kahanamoku/form-module/types";

const props = defineProps<{
  fields: IFormField[];
  wine?: IWine;
}>();

const { t } = useLang();
const { getSelectLabel } = useField();

function fieldLabel(name: string): string {
  const field = props.fields?.find((f) => f.name === name);
  return field?.label ? t(field.label) : name;
}

const attrs = computed(() => {
  const w = props.wine;
  if (!w) return [];
  return [
    {
      name: "color",
      icon: "i-heroicons-paint-brush",
      color: "text-pink-500",
      label: fieldLabel("color"),
      value: getSelectLabel(props.fields, "color", w.color) || w.color,
    },
    {
      name: "year",
      icon: "i-heroicons-calendar",
      color: "text-amber-500",
      label: fieldLabel("year"),
      value: w.data?.year,
    },
    {
      name: "volume",
      icon: "i-heroicons-beaker",
      color: "text-blue-500",
      label: fieldLabel("volume"),
      value: w.data?.volume != null ? `${w.data.volume} l` : null,
    },
    {
      name: "grape",
      icon: "i-heroicons-sparkles",
      color: "text-green-500",
      label: fieldLabel("data.grape"),
      value: w.data?.grape,
    },
    {
      name: "quality",
      icon: "i-heroicons-star",
      color: "text-yellow-500",
      label: fieldLabel("quality"),
      value: w.data?.quality,
    },
    {
      name: "sugar",
      icon: "i-heroicons-tag",
      color: "text-primary-500",
      label: fieldLabel("data.sugar"),
      value: w.data?.sugar,
    },
    {
      name: "alcohol",
      icon: "i-heroicons-fire",
      color: "text-orange-500",
      label: fieldLabel("data.alcohol"),
      value: w.data?.alcohol != null ? `${w.data.alcohol} %` : null,
    },
    {
      name: "winery",
      icon: "i-heroicons-building-storefront",
      color: "text-purple-500",
      label: fieldLabel("data.winery"),
      value: w.data?.winery,
    },
    {
      name: "region",
      icon: "i-heroicons-map-pin",
      color: "text-red-400",
      label: fieldLabel("data.region"),
      value: w.data?.region,
    },
    {
      name: "serving_temp",
      icon: "i-heroicons-sun",
      color: "text-sky-500",
      label: fieldLabel("data.serving_temp"),
      value: w.data?.serving_temp,
    },
  ].filter((a) => a.value != null && a.value !== "");
});
</script>

<template>
  <dl
    v-if="wine"
    class="grid grid-cols-2 gap-x-4 gap-y-2 py-2 text-sm text-gray-700 dark:text-gray-200"
  >
    <div
      v-for="attr in attrs"
      :key="attr.name"
      class="flex items-start gap-1.5"
    >
      <UIcon :name="attr.icon" class="mt-0.5 shrink-0 text-base" :class="attr.color" />
      <div class="min-w-0">
        <span class="text-xs text-gray-400 dark:text-gray-500 block leading-tight">{{ attr.label }}</span>
        <span class="font-medium leading-tight">{{ attr.value }}</span>
      </div>
    </div>
  </dl>
</template>

