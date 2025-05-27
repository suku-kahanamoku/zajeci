<script lang="ts" setup>
import { useLang } from "#imports";

/**
 * @component SwitchLang
 * @description
 * Komponenta pro přepínání jazykových mutací.
 *
 * @props {string} [icon] - Ikona pro tlačítko přepínání jazyka.
 * @props {string} [color] - Barva tlačítka.
 * @props {string} [variant] - Varianta tlačítka.
 * @props {string} [aria] - ARIA popisek tlačítka.
 *
 * @example
 * ```vue
 * <SwitchLang icon="i-heroicons-globe" color="blue" variant="solid" />
 * ```
 */
const props = defineProps<{
  icon?: string;
  color?: string;
  variant?: string;
  aria?: string;
}>();

const { filtredLangs, lang } = useLang();
</script>

<template>
  <UDropdown :items="[filtredLangs]">
    <UButton :icon="lang.icon" variant="ghost" aria-label="Switch language" />

    <template #item="{ item }">
      <UIcon :name="item.icon" class="w-5 h-5" />
    </template>
  </UDropdown>
</template>
