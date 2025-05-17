<script setup lang="ts">
import { ref, computed } from "vue";

import type { IItem } from "@/modules/common-module/runtime/types";
import { GET_OBJECT_PARAM } from "@/modules/common-module/runtime/utils";

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
  (e: "clear", field: IFormField): void;
}>();

// Helper funkce pro field
const { compare } = useField();

// Ui cmp element
const el = ref();

// Model pro hodnotu textoveho pole
const model = defineModel<any>();

// Zjisti zda puvodni hodnota a hodnota v input fieldu jsou rozdilne
const isDifferent = computed(
  () =>
    props.item &&
    compare(
      GET_OBJECT_PARAM(props.item, props.field.name),
      model.value,
      props.field
    )
);

// Pokud se klikne na clear button, tak se smaze hodnota a provede se focus
const onClear = () => {
  model.value = props.field.multiple ? [] : "";
  el.value.input?.focus();
  emits("clear", props.field);
};
</script>

<template>
  <UFormField
    :name="field.name"
    :label="$tt(field.label!)"
    :description="$tt(field.description!)"
    :hint="$tt(field.hint!)"
    :help="$tt(field.help!)"
    :size="field.size || 'md'"
    :required="field.required"
    :ui="ui"
  >
    <!-- Slot pro label -->
    <template v-if="$slots.label" #label>
      <slot name="label" v-bind:field="field" v-bind:model="model" />
    </template>

    <!-- Slot pro description -->
    <template v-if="$slots.description" #description>
      <slot name="description" v-bind:field="field" v-bind:model="model" />
    </template>

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

    <!-- Input -->
    <UInput
      :data-testid="`${field.type || 'text'}-${field.name}`"
      ref="el"
      v-model="model"
      :type="field.type"
      :disabled="field.disabled"
      :readonly="field.readonly"
      :color="field.color"
      :variant="field.variant"
      :placeholder="$tt(field.placeholder!)"
      :autocomplete="field.autocomplete"
      :autofocus="field.autofocus"
      :maxLength="field.maxLength"
      :minLength="field.minLength"
      :max="field.max"
      :min="field.min"
      :class="isDifferent ? 'field-warning' : ''"
      @focus="emits('focus', $event, field)"
      @blur="emits('blur', $event, field)"
    >
      <!-- clear btn -->
      <template
        v-if="
          field.clearable &&
          model?.toString()?.length &&
          !field.disabled &&
          !field.readonly
        "
        #trailing
      >
        <UButton
          :data-testid="`${field.type || 'text'}-${field.name}-clear`"
          variant="link"
          icon="i-heroicons-x-mark-20-solid"
          :padded="false"
          :tabIndex="-1"
          aria-hidden
          aria-label="Button to remove field value"
          @click="onClear"
        />
      </template>
    </UInput>
  </UFormField>
</template>
