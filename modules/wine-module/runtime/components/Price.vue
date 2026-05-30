<script setup lang="ts">
// replaced useToNumber with Number() for performance

const props = defineProps<{
  price: number | string;
  showOldPrice?: boolean;
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
      v-if="showOldPrice !== false"
      class="line-through text-gray-400 dark:text-gray-500 text-sm font-normal"
      aria-label="Old price"
    >
      {{ Number(oldPrice.toFixed(2)).toLocaleString(locale) }}&nbsp;{{ t("$.czk") }}
    </span>
    <span
      class="font-bold text-secondary-600 dark:text-secondary-400"
      aria-label="Current price"
    >
      {{ Number(numericPrice.toFixed(2)).toLocaleString(locale) }}&nbsp;{{ t("$.czk") }}
    </span>
  </span>
</template>
