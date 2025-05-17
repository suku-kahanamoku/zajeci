<script setup lang="ts">
import type { PopperOptions } from "#ui/types";
import defu from "defu";

defineProps<{
  /**
   * @description Možnosti pro Popper.js
   */
  popper?: PopperOptions;

  /**
   * @description Zpoždění při otevření tooltipu (v ms)
   */
  openDelay?: number;

  /**
   * @description Zpoždění při zavření tooltipu (v ms)
   */
  closeDelay?: number;

  /**
   * @description Přizpůsobení vzhledu tooltipu
   */
  ui?: Record<string, any>;
}>();
</script>

<template>
  <!-- Tooltip komponenta -->
  <UTooltip
    :popper="popper"
    :open-delay="openDelay"
    :close-delay="closeDelay"
    :ui="
      defu(ui || {}, {
        background: 'bg-gray-700 dark:bg-white',
        color: 'text-white dark:text-gray-900',
        arrow: { background: 'dark:before:bg-gray-200 before:bg-gray-800' },
      })
    "
  >
    <!-- Obsah tooltipu -->
    <template #default>
      <slot />
    </template>

    <!-- Text tooltipu -->
    <template #text>
      <slot name="text" />
    </template>
  </UTooltip>
</template>
