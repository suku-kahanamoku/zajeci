<script setup lang="ts">
import { ref, computed } from "vue";
import defu from "defu";

import type { IItem } from "@suku-kahanamoku/common-module/types";
import {
  IS_DEFINED,
  GET_OBJECT_PARAM,
} from "@suku-kahanamoku/common-module/utils";

import type { IFormField } from "../types";
import { useField } from "../composables/useField";

// Definice props
const props = defineProps<{
  field: IFormField;
  item?: IItem;
  ui?: Record<string, any>;
}>();

// Definice emit eventu submit
const emits = defineEmits<{
  (e: "focus", event: FocusEvent, field: IFormField): void;
  (e: "blur", event: FocusEvent, field: IFormField): void;
}>();

// Helper funkce pro field
const { compare } = useField();

// Ui cmp element
const el = ref();

// Model pro hodnotu textoveho pole
const model = defineModel<boolean>();

// Zjisti zda puvodni hodnota a hodnota v input fieldu jsou rozdilne
const isDifferent = computed(() => {
  if (props.item && IS_DEFINED(model.value)) {
    const value = GET_OBJECT_PARAM(props.item, props.field.name);
    return compare(IS_DEFINED(value) ? value : false, model.value, props.field);
  }
});
</script>

<template>
  <UFormField
    :name="field.name"
    :description="$tt(field.description!)"
    :hint="$tt(field.hint!)"
    :help="$tt(field.help!)"
    :size="field.size || 'md'"
    :required="field.required"
    :ui="ui"
  >
    <!-- Slot pro hint -->
    <template #hint>
      <slot
        v-if="$slots.hint"
        name="hint"
        v-bind:field="field"
        v-bind:model="model"
      />
    </template>

    <!-- Slot pro help -->
    <template v-if="$slots.help" #help>
      <slot name="help" v-bind:field="field" v-bind:model="model" />
    </template>

    <UCheckbox
      :data-testid="`${field.type}-${field.name}`"
      ref="el"
      v-model="model"
      :default-value="field.value"
      :type="field.type"
      :name="field.name"
      :required="field.required"
      :disabled="field.disabled"
      :color="field.color"
      :autofocus="field.autofocus"
      :label="$tt(field.label!)"
      :help="$tt(field.help!)"
      :class="{ 'field-warning': isDifferent }"
      aria-label="Checkbox"
      @focus="emits('focus', $event, field)"
      @blur="emits('blur', $event, field)"
    >
      <!-- Slot pro label -->
      <template v-if="$slots.label" #label>
        <slot name="label" v-bind:field="field" v-bind:model="model" />
      </template>

      <!-- Slot pro description -->
      <template v-if="$slots.description" #description>
        <slot name="description" v-bind:field="field" v-bind:model="model" />
      </template>
    </UCheckbox>
  </UFormField>
</template>
