<script setup lang="ts">
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";
import type { IFormField } from "@suku-kahanamoku/form-module/types";

const props = defineProps<{
  fields: IFormField[];
  wine?: IWine;
}>();

const { t } = useLang();

// Fields that need i18n enum translation: fieldShortName → namespace
const enumNamespaces: Record<string, string> = {
  color: "color",
  kind: "kind",
  quality: "quality",
};

function resolveValue(wine: IWine, fieldName: string): string | number | null {
  // dot-notation: "data.quality" → wine.data?.quality
  const [top, sub] = fieldName.split(".");
  const raw = sub ? (wine as any)[top]?.[sub] : (wine as any)[top];

  if (raw == null || raw === "") return null;

  const short = sub ?? top;
  const ns = enumNamespaces[short];
  if (ns) {
    const key = `$.wine.${ns}.${raw}`;
    const translated = t(key);
    return translated === key ? raw : translated;
  }

  // Volume: append unit
  if (short === "volume") return `${raw} l`;
  // Alcohol: append unit
  if (short === "alcohol") return `${raw} %`;

  return raw;
}

const attrs = computed(() => {
  const w = props.wine;
  if (!w || !props.fields) return [];

  return props.fields
    .map((f) => {
      const short = f.name.includes(".") ? f.name.split(".")[1] : f.name;
      const ff = f as any;
      return {
        name: short,
        icon: ff.iconName ?? "i-heroicons-information-circle",
        color: ff.iconColor ?? "text-gray-400",
        label: f.label ? t(f.label) : short,
        value: resolveValue(w, f.name),
      };
    })
    .filter((a) => a.value != null && a.value !== "");
});
</script>

<template>
  <dl
    v-if="wine"
    class="grid grid-cols-3 gap-x-4 gap-y-2 py-2 text-sm text-gray-700 dark:text-gray-200"
  >
    <div
      v-for="attr in attrs"
      :key="attr.name"
      class="flex items-start gap-1.5"
    >
      <UIcon
        :name="attr.icon"
        class="mt-0.5 shrink-0 text-base text-gray-400 dark:text-gray-500"
      />
      <div class="min-w-0">
        <span
          class="text-xs text-gray-400 dark:text-gray-500 block leading-tight"
          >{{ attr.label }}</span
        >
        <span class="font-medium leading-tight">{{ attr.value }}</span>
      </div>
    </div>
  </dl>
</template>
