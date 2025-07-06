<script setup lang="ts">
import { ref } from "vue";
import type { ButtonProps } from "#ui/types";

import type { IItem } from "@suku-kahanamoku/common-module/utils";
import type { IBtn } from "@/modules/ui-module/runtime/types";

import type { IFormField, IFormFieldOption } from "../types/field.interface";

const props = defineProps<{
  fields: IFormField[];
  item?: IItem;
  loading?: boolean;
  color?: ButtonProps["color"];
  actions?: {
    yes?: IBtn;
    no?: IBtn;
  };
  ui?: Record<string, any>;
}>();

// Definice emit eventu submit
const emits = defineEmits<{
  (e: "submit", payload: Record<string, any>): void;
  (e: "cancel", payload?: Record<string, any>): void;
  (
    e: "change",
    payload: Record<string, any>,
    value?: any,
    field?: IFormField,
    options?: IFormFieldOption[]
  ): void;
  (
    e: "focus",
    payload: Record<string, any>,
    event: FocusEvent,
    field: IFormField,
    options?: IFormFieldOption[]
  ): void;
  (
    e: "blur",
    payload: Record<string, any>,
    event: FocusEvent,
    field: IFormField,
    options?: IFormFieldOption[]
  ): void;
}>();

// open model pro zobrazovani / schovavani dialogoveho okna
const open = defineModel<boolean>("open");
const formCmp = ref();

defineExpose({ formCmp });
</script>

<template>
  <UModal v-model="open">
    <CmpForm
      ref="formCmp"
      :fields="fields"
      :item="item"
      :color="color"
      :actions="actions"
      :ui="ui"
      :loading="loading"
      @submit="(payload: Record<string, any>) => emits('submit', payload)"
      @cancel="(payload: Record<string, any> | undefined | undefined) => emits('cancel', payload)"
      @change="
        (payload: Record<string, any>, value: any, field: IFormField | undefined, options: IFormFieldOption[] | undefined) =>
          emits('change', payload, value, field, options)
      "
      @focus="
        (payload: Record<string, any>, event: FocusEvent, field: IFormField, options: IFormFieldOption[] | undefined) =>
          emits('focus', payload, event, field, options)
      "
      @blur="
        (payload: Record<string, any>, event: FocusEvent, field: IFormField, options: IFormFieldOption[] | undefined) =>
          emits('blur', payload, event, field, options)
      "
    >
      <template #header>
        <h3
          class="px-4 py-4 text-base font-semibold leading-6"
          :class="`text-${color || 'primary'}-600`"
        >
          <slot name="title" />
        </h3>
        <div>
          <UButton
            data-testid="dialog-close"
            :color="color"
            variant="ghost"
            size="xl"
            icon="i-heroicons-x-mark-20-solid"
            @click="open = false"
          />
        </div>
      </template>

      <template v-if="$slots.default" #default="{ model }">
        <slot v-bind:model="model" />
      </template>

      <template v-for="(slot, name) in $slots" v-slot:[name]="{ field, model }">
        <slot :name="name" v-bind:field="field" v-bind:model="model" />
      </template>

      <template v-if="$slots.actions" #actions="{ form, model }">
        <slot name="actions" v-bind:form="form" v-bind:model="model" />
      </template>
    </CmpForm>
  </UModal>
</template>
