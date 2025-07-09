<script setup lang="ts">
import { ref } from "vue";

import type { IItem } from "@suku-kahanamoku/common-module/types";

import type { IFormField } from "../types";

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

// Ui cmp element
const el = ref();

// Model pro nahraný soubor
const model = defineModel<File | FileList | null>();

// Pokud se klikne na clear button, smaže se nahraný soubor
const onClear = () => {
  model.value = null;
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

    <!-- Input pro soubor -->
    <UInput
      ref="el"
      type="file"
      :disabled="field.disabled"
      :readonly="field.readonly"
      class="w-full"
      :class="{ 'field-warning': item && model }"
      @focus="emits('focus', $event, field)"
      @blur="emits('blur', $event, field)"
      @change="console.log"
    >
      <!-- clear btn -->
      <template
        v-if="field.clearable && model && !field.disabled && !field.readonly"
        #trailing
      >
        <UButton
          variant="link"
          icon="i-heroicons-x-mark-20-solid"
          :padded="false"
          :tabIndex="-1"
          aria-hidden
          aria-label="Button to remove file"
          @click="onClear"
        />
      </template>
    </UInput>
  </UFormField>
</template>
