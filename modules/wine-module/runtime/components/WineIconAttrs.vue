<script setup lang="ts">
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";
import type { IFormField } from "@suku-kahanamoku/form-module/types";

const props = defineProps<{
  fields: IFormField[];
  wine?: IWine;
  limit?: number;
  allowedNames?: string[];
  cols?: number;
}>();

const { t } = useLang();

// Icon + color lookup by field name (short name without "data." prefix)
const fieldMeta: Record<string, { icon: string; color: string }> = {
  color: { icon: "i-heroicons-paint-brush", color: "text-pink-500" },
  year: { icon: "i-heroicons-calendar", color: "text-amber-500" },
  volume: { icon: "i-heroicons-beaker", color: "text-blue-500" },
  variant: { icon: "i-heroicons-sparkles", color: "text-green-500" },
  quality: { icon: "i-heroicons-star", color: "text-yellow-500" },
  kind: { icon: "i-heroicons-tag", color: "text-primary-500" },
  alcohol: { icon: "i-heroicons-fire", color: "text-orange-500" },
  winery: { icon: "i-heroicons-building-storefront", color: "text-purple-500" },
  region: { icon: "i-heroicons-map-pin", color: "text-red-400" },
  serving_temp: { icon: "i-heroicons-sun", color: "text-sky-500" },
};

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

  const allowed =
    props.allowedNames && props.allowedNames.length > 0
      ? props.allowedNames
      : null;

  return props.fields
    .filter((f) => !allowed || allowed.includes(f.name.replace(/^data\./, "")))
    .map((f) => {
      const short = f.name.includes(".") ? f.name.split(".")[1] : f.name;
      const meta = fieldMeta[short] ?? {
        icon: "i-heroicons-information-circle",
        color: "text-gray-400",
      };
      return {
        name: short,
        icon: meta.icon,
        color: meta.color,
        label: f.label ? t(f.label) : short,
        value: resolveValue(w, f.name),
      };
    })
    .filter((a) => a.value != null && a.value !== "")
    .slice(0, props.limit ?? Infinity);
});
</script>

<template>
  <dl
    v-if="wine"
    class="grid gap-x-4 gap-y-2 py-2 text-sm text-gray-700 dark:text-gray-200"
    :class="cols === 3 ? 'grid-cols-3' : 'grid-cols-2'"
  >
    <div
      v-for="attr in attrs"
      :key="attr.name"
      class="flex items-start gap-1.5"
    >
      <UIcon
        :name="attr.icon"
        class="mt-0.5 shrink-0 text-base"
        :class="attr.color"
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
