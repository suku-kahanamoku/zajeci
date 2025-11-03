<script setup lang="ts">
import { useToNumber } from "@vueuse/core";

const props = defineProps<{
  price: number;
  oldPrice?: number;
}>();

const {
  i18n: { locale },
  t,
} = useLang();
</script>

<template>
  <div class="space-x-1">
    <span
      v-if="oldPrice"
      class="line-through text-gray-400 text-sm"
      aria-label="Old price"
    >
      {{
        useToNumber(oldPrice?.toFixed(2) || 0).value.toLocaleString(locale)
      }}&nbsp;{{ t("$.czk") }}
    </span>
    <span aria-label="Current price">
      {{
        useToNumber(price?.toFixed(2) || 0).value.toLocaleString(locale)
      }}&nbsp;{{ t("$.czk") }}
    </span>
  </div>
</template>
