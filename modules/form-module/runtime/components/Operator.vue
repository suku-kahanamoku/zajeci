<script setup lang="ts">
import { computed } from "vue";

import type { IFormField } from "../types";
import { useOperator } from "../composables/useOperator";

// Definice props
const props = defineProps<{
  field: IFormField;
}>();

// Definice emit eventu submit
const emits = defineEmits<{
  (e: "change", value: string, field: IFormField): void;
}>();

const { operators: opers, labels } = useOperator(props.field);

const operators = computed(() => [
  opers.value
    .filter((o) => o !== model.value)
    .map((o) => ({
      label: labels[o],
      value: o,
      click: () => emits("change", (model.value = o), props.field),
    })),
]);

// Model pro hodnotu textoveho pole
const model = defineModel<string>({ get: (val) => val || opers.value[0] });
</script>

<template>
  <UDropdown
    v-model="model"
    :items="operators"
    :padded="false"
    :ui="{ width: 'w-auto' }"
  >
    <CmpTooltip>
      <UButton
        :data-testid="`${field.type || 'text'}-${field.name}-toggle-operator`"
        variant="ghost"
        size="xs"
        :tabIndex="-1"
        aria-hidden
        aria-label="Display / hide operator button"
        class="px-1 py-0"
      >
        {{ labels[model!] }}
      </UButton>

      <template #text>{{ $tt("$.info.change_operator") }}</template>
    </CmpTooltip>

    <template #item="{ item }">
      <CmpTooltip :ui="{ wrapper: 'w-full' }">
        {{ item.label }}

        <template #text>
          {{ $tt("$.operator.tooltip." + item.value) }}
        </template>
      </CmpTooltip>
    </template>
  </UDropdown>
</template>
