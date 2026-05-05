<script setup lang="ts">
import { useToNumber } from "@vueuse/core";

const props = defineProps<{
  price: number | string;
}>();

const numericPrice = computed(() => Number(props.price) || 0);
const oldPrice = computed(() => numericPrice.value * 1.1);

const {
  i18n: { locale },
  t,
} = useLang();
</script>

<template>
  <span class="inline-flex items-baseline gap-1.5">
    <span
      class="line-through text-gray-400 dark:text-gray-500 text-sm font-normal"
      aria-label="Old price"
    >
      {{ useToNumber(oldPrice.toFixed(2)).value.toLocaleString(locale) }}&nbsp;{{ t("$.czk") }}
    </span>
    <span class="font-bold text-secondary-600 dark:text-secondary-400" aria-label="Current price">
      {{ useToNumber(numericPrice.toFixed(2)).value.toLocaleString(locale) }}&nbsp;{{ t("$.czk") }}
    </span>
  </span>
</template>
