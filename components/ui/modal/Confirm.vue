<script setup lang="ts">
import type { Button, ButtonColor } from "#ui/types";

const props = defineProps<{
  color?: ButtonColor;
  btns?: {
    cancel?: Button;
    ok?: Button;
  };
}>();

const emits = defineEmits<{
  (e: "confirm", value: any): void;
}>();

const model = defineModel<boolean>();

watch(model, (value) => {
  if (value === false) {
    emits("confirm", false);
  }
});
</script>

<template>
  <UModal v-model="model">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h3
            class="text-lg lg:text-xl font-bold"
            :class="`text-${color || 'primary'}-600 dark:text-${
              color || 'primary'
            }-400`"
          >
            <slot name="header"></slot>
          </h3>
          <UButton
            icon="i-heroicons-x-mark"
            color="white"
            square
            variant="solid"
            :aria-label="$tt('$.aria.close')"
            @click="model = false"
          />
        </div>
      </template>

      <slot></slot>

      <template #footer>
        <div class="flex justify-between">
          <UButton
            :icon="btns?.cancel?.icon"
            :color="btns?.cancel?.color || 'gray'"
            :variant="btns?.cancel?.variant || 'soft'"
            @click="model = false"
          >
            {{ $tt(btns?.cancel?.label || "$.btn.cancel") }}
          </UButton>
          <UButton
            :icon="btns?.ok?.icon"
            :color="btns?.ok?.color || color"
            :variant="btns?.ok?.variant"
            @click="
              emits('confirm', true);
              model = false;
            "
          >
            {{ $tt(btns?.ok?.label || "$.btn.delete") }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
