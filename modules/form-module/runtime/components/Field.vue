<script setup lang="ts">
import type { IItem } from "@suku-kahanamoku/common-module/utils";

import type {
  IFormField,
  IFormFieldNumber,
  IFormFieldTextarea,
  IFormFieldSelect,
  IFormFieldRadio,
  IFormFieldDatetime,
  IFormFieldOption,
} from "../types";

const props = defineProps<{
  field:
    | IFormField
    | IFormFieldNumber
    | IFormFieldTextarea
    | IFormFieldSelect
    | IFormFieldRadio
    | IFormFieldDatetime;
  item?: IItem;
  ui?: Record<string, any>;
}>();

// Definice emit eventu submit
const emits = defineEmits<{
  (
    e: "focus",
    event: FocusEvent,
    field: IFormField,
    options?: IFormFieldOption[]
  ): void;
  (
    e: "blur",
    event: FocusEvent,
    field: IFormField,
    options?: IFormFieldOption[]
  ): void;
  (e: "clear", field: IFormField, options?: IFormFieldOption[]): void;
  (
    e: "remove",
    value: any,
    field: IFormField,
    options?: IFormFieldOption[]
  ): void;
  (
    e: "select",
    value: any,
    field: IFormField,
    options?: IFormFieldOption[]
  ): void;
  (
    e: "click:badge",
    value: any,
    field: IFormFieldSelect,
    options: IFormFieldOption[]
  ): void;
}>();

// Model pro hodnotu textoveho pole, tzn. hodnota, ktera se odesila
const model = defineModel<any>();
</script>

<template>
  <CmpTextareaField
    v-if="field.type === 'textarea'"
    v-model="model"
    :field="(field as IFormFieldTextarea)"
    :item="item"
    :ui="ui"
    @focus="(event: FocusEvent, _field: IFormField) => emits('focus', event, _field)"
    @blur="(event: FocusEvent, _field: IFormField) => emits('blur', event, _field)"
    @clear="(_field: IFormField) => emits('clear', _field)"
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
    <template v-if="$slots.hint" #hint>
      <slot name="hint" v-bind:field="field" v-bind:model="model" />
    </template>

    <!-- Slot pro help -->
    <template v-if="$slots.help" #help>
      <slot name="help" v-bind:field="field" v-bind:model="model" />
    </template>
  </CmpTextareaField>

  <CmpSelectField
    v-else-if="['select', 'search'].includes(field.type!)"
    v-model="model"
    :field="(field as IFormField)"
    :item="item"
    :ui="ui"
    @clear="(_field: IFormField, options: IFormFieldOption[]) => emits('clear', _field, options)"
    @select="
      (event: any, _field: IFormField, options: IFormFieldOption[]) => emits('select', event, _field, options)
    "
    @remove="
      (event: any, _field: IFormField, options: IFormFieldOption[]) => emits('remove', event, _field, options)
    "
    @click:badge="
      (event: any, _field: IFormField, options: IFormFieldOption[]) => emits('click:badge', event, _field, options)
    "
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
    <template v-if="$slots.hint" #hint>
      <slot name="hint" v-bind:field="field" v-bind:model="model" />
    </template>

    <!-- Slot pro help -->
    <template v-if="$slots.help" #help>
      <slot name="help" v-bind:field="field" v-bind:model="model" />
    </template>
  </CmpSelectField>

  <CmpRadioField
    v-else-if="field.type === 'radio'"
    v-model="model"
    :field="(field as IFormField)"
    :item="item"
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
    <template v-if="$slots.hint" #hint>
      <slot name="hint" v-bind:field="field" v-bind:model="model" />
    </template>

    <!-- Slot pro help -->
    <template v-if="$slots.help" #help>
      <slot name="help" v-bind:field="field" v-bind:model="model" />
    </template>
  </CmpRadioField>

  <CmpCheckboxField
    v-else-if="field.type === 'checkbox'"
    v-model="model"
    :field="(field as IFormField)"
    :item="item"
    :ui="ui"
    @focus="(event: FocusEvent, _field: IFormField) => emits('focus', event, _field)"
    @blur="(event: FocusEvent, _field: IFormField) => emits('blur', event, _field)"
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
    <template v-if="$slots.hint" #hint>
      <slot name="hint" v-bind:field="field" v-bind:model="model" />
    </template>

    <!-- Slot pro help -->
    <template v-if="$slots.help" #help>
      <slot name="help" v-bind:field="field" v-bind:model="model" />
    </template>
  </CmpCheckboxField>

  <CmpDatetimeField
    v-else-if="field.type === 'datetime'"
    v-model="model"
    :field="(field as IFormField)"
    :item="item"
    :ui="ui"
    @focus="(event: FocusEvent, _field: IFormField) => emits('focus', event, _field)"
    @blur="(event: FocusEvent, _field: IFormField) => emits('blur', event, _field)"
    @clear="(_field: IFormField) => emits('clear', _field)"
    @select="(event: any, _field: IFormField) => emits('select', event, _field)"
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
    <template v-if="$slots.hint" #hint>
      <slot name="hint" v-bind:field="field" v-bind:model="model" />
    </template>

    <!-- Slot pro help -->
    <template v-if="$slots.help" #help>
      <slot name="help" v-bind:field="field" v-bind:model="model" />
    </template>
  </CmpDatetimeField>

  <CmpFileField
    v-else-if="field.type === 'file'"
    v-model="model"
    :field="(field as IFormField)"
    :item="item"
    :ui="ui"
    @focus="(event: FocusEvent, _field: IFormField) => emits('focus', event, _field)"
    @blur="(event: FocusEvent, _field: IFormField) => emits('blur', event, _field)"
    @clear="(_field: IFormField) => emits('clear', _field)"
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
    <template v-if="$slots.hint" #hint>
      <slot name="hint" v-bind:field="field" v-bind:model="model" />
    </template>

    <!-- Slot pro help -->
    <template v-if="$slots.help" #help>
      <slot name="help" v-bind:field="field" v-bind:model="model" />
    </template>
  </CmpFileField>

  <CmpTextField
    v-else
    v-model="model"
    :field="(field as IFormField)"
    :item="item"
    :ui="ui"
    @focus="(event: FocusEvent, _field: IFormField) => emits('focus', event, _field)"
    @blur="(event: FocusEvent, _field: IFormField) => emits('blur', event, _field)"
    @clear="(_field: IFormField) => emits('clear', _field)"
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
    <template v-if="$slots.hint" #hint>
      <slot name="hint" v-bind:field="field" v-bind:model="model" />
    </template>

    <!-- Slot pro help -->
    <template v-if="$slots.help" #help>
      <slot name="help" v-bind:field="field" v-bind:model="model" />
    </template>
  </CmpTextField>
</template>
