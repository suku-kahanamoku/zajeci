<script setup lang="ts">
import type { ButtonColor } from "#ui/types";

import type { IBtn } from "../types/cmp.interface";

defineProps<{
  /**
   * @description Barva dialogu
   */
  color?: ButtonColor;

  /**
   * @description Akce pro tlačítka dialogu
   */
  actions?: {
    yes?: IBtn;
    no?: IBtn;
  };
}>();

const emits = defineEmits<{
  (e: "confirm", value: boolean): void;
}>();

const model = defineModel<boolean>();
</script>

<template>
  <!-- Dialogové okno -->
  <UModal v-model="model">
    <UCard :ui="{ header: '' }">
      <!-- Hlavička dialogu -->
      <template #header>
        <div class="flex items-start justify-between">
          <h3
            class="px-4 py-4 text-base font-semibold leading-6"
            :class="`text-${color || 'primary'}-600`"
          >
            <slot name="title" />
          </h3>
          <!-- Zavírací tlačítko -->
          <UButton
            data-testid="dialog-close"
            :color="color"
            variant="ghost"
            size="xl"
            icon="i-heroicons-x-mark-20-solid"
            :ui="{ rounded: 'rounded-tr-lg' }"
            @click="model = false"
          />
        </div>
      </template>

      <!-- Obsah dialogu -->
      <slot />

      <!-- Patička dialogu -->
      <template #footer>
        <div class="flex items-start justify-between">
          <!-- Tlačítko "Ne" -->
          <UButton
            data-testid="dialog-no"
            :color="actions?.no?.color || 'gray'"
            :variant="actions?.no?.variant"
            :size="actions?.no?.size"
            @click="model = false"
          >
            {{ $tt(actions?.no?.label || "$.btn.cancel") }}
          </UButton>
          <!-- Tlačítko "Ano" -->
          <UButton
            data-testid="dialog-yes"
            :color="actions?.yes?.color || color"
            :variant="actions?.yes?.variant || 'solid'"
            :size="actions?.yes?.size"
            @click="
              emits('confirm', true);
              model = false;
            "
          >
            {{ $tt(actions?.yes?.label || "$.btn.yes") }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
