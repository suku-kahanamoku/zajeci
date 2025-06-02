<script setup lang="ts">
import type { ModalProps } from "#ui/types";

import type { IBtn } from "../types/cmp.interface";

defineProps<
  {
    /**
     * @description Akce pro tlačítka dialogu
     */
    actions?: {
      yes?: IBtn;
      no?: IBtn;
    };
  } & ModalProps
>();

const emits = defineEmits<{
  (e: "confirm", value: boolean): void;
}>();

const model = defineModel<boolean>();
</script>

<template>
  <!-- Dialogové okno -->
  <UModal v-model:open="model">
    <!-- Obsah dialogu -->
    <slot />

    <!-- Patička dialogu -->
    <template #footer>
      <div class="flex items-start justify-between">
        <!-- Tlačítko "Ne" -->
        <UButton
          data-testid="dialog-no"
          :color="actions?.no?.color"
          :variant="actions?.no?.variant"
          :size="actions?.no?.size"
          @click="model = false"
        >
          {{ $tt(actions?.no?.label || "$.btn.cancel") }}
        </UButton>
        <!-- Tlačítko "Ano" -->
        <UButton
          data-testid="dialog-yes"
          :color="actions?.yes?.color"
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
  </UModal>
</template>
