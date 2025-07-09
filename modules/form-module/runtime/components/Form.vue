<script setup lang="ts">
import {
  ref,
  computed,
  reactive,
  useField,
  triggerRef,
  useLocalePath,
} from "#imports";
import type { ButtonProps, CardProps } from "#ui/types";
import { z } from "zod";
import defu from "defu";

import type { IItem } from "@suku-kahanamoku/common-module/types";
import { CLONE, ITERATE } from "@suku-kahanamoku/common-module/utils";
import type { IBtn } from "@/modules/ui-module/runtime/types";

import type { IFormField, IFormFieldOption } from "../types/field.interface";
import { useZod } from "../composables/useZod";

// Definice props
const props = defineProps<{
  fields: IFormField[];
  item?: IItem;
  loading?: boolean;
  variant?: CardProps["variant"];
  color?: ButtonProps["color"];
  actions?: {
    yes?: IBtn;
    no?: IBtn;
    disabled?: boolean;
  };
  ui?: Record<string, any>;
}>();

// Definice emit eventu
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
  (
    e: "click:badge",
    payload: Record<string, any>,
    value: any,
    field: IFormField,
    options?: IFormFieldOption[]
  ): void;
}>();

const localePath = useLocalePath();
const { getObjectValues } = useField();
const { getSchema } = useZod();
const form = ref();

/**
 * Vygeneruje schema pro formular
 */
const schema = computed(() => {
  const result: any = {};
  props.fields?.forEach((field) => (result[field.name] = getSchema(field)));
  return z.object(result);
});

/**
 * Vygeneruje model pro formular
 */
const model = reactive<Record<string, any>>(
  getObjectValues(props.item, props.fields)
);

/**
 *
 */
const elRef = ref();

/**
 * Pokud se odstrani z select fieldu option, tak se musi zavolat change, pac to nativne nefunguje
 *
 * @param value
 * @param field
 * @param options
 */
function onChange(
  value: any,
  field?: IFormField,
  options?: IFormFieldOption[]
): void {
  emits("change", model, value, field, options);
  triggerRef(form);
}

/**
 * Pred odeslanim prevede datumove fieldy do iso stringu
 *
 * @param event
 */
function onSubmit(event: Record<string, any>): void {
  const payload = CLONE(event.data);
  ITERATE(payload, (val, name) => {
    if (val instanceof Date) {
      payload[name] = val.toISOString();
    }
  });
  emits("submit", payload);
}

//
defineExpose({ form, model, schema, onChange });
</script>

<template>
  <div ref="elRef">
    <UForm
      ref="form"
      :schema="schema"
      :state="model"
      @submit.prevent="onSubmit"
      @change="emits('change', model, $event)"
    >
      <UCard
        :variant="variant"
        :ui="
          defu(ui || {}, {
            root: 'bg-transparent',
            body: 'flex flex-col gap-4',
            footer: 'flex justify-between items-center'
          })
        "
      >
        <template v-if="$slots.header" #header>
          <slot name="header" />
        </template>

        <!-- default slot -->
        <slot v-if="$slots.default" v-bind:model="model" />

        <!-- Renderuj pole z props.fields nebo vlastni obsah slotu -->
        <template v-else>
          <slot
            v-for="field in fields"
            :key="field.name + (field.key || '')"
            :name="field.name"
            v-bind:field="field"
            v-bind:model="model"
          >
            <CmpField
              v-model="model[field.name]"
              :field="field"
              :item="item"
              :ui="ui?.fields && ui.fields[field.name]"
              @focus="
                (event: FocusEvent, _field: IFormField, options?: IFormFieldOption[]) =>
                  emits('focus', model, event, _field, options)
              "
              @blur="
                (event: FocusEvent, _field: IFormField, options?: IFormFieldOption[]) =>
                  emits('blur', model, event, _field, options)
              "
              @clear="(_field: IFormField, options?: IFormFieldOption[]) => onChange('', _field, options)"
              @select="onChange"
              @remove="
                (value: any, _field: IFormField, options?: IFormFieldOption[]) =>
                  emits('change', model, value, _field, options)
              "
              @click:badge="
                (value: any, _field: IFormField, options?: IFormFieldOption[]) =>
                  emits('click:badge', model, value, _field, options)
              "
            />
          </slot>
        </template>

        <template v-if="!actions?.disabled" #footer>
          <slot name="actions" v-bind:form="form" v-bind:model="model">
            <UButton
              data-testid="form-cancel"
              :to="localePath(actions?.no?.link!)"
              type="button"
              :color="actions?.no?.color"
              :variant="actions?.no?.variant"
              :size="actions?.no?.size"
              :icon="actions?.no?.icon"
              @click="actions?.no?.link ? undefined : emits('cancel', model)"
            >
              {{ $tt(actions?.no?.label || "$.btn.cancel") }}
            </UButton>

            <UButton
              v-if="actions?.yes?.link"
              data-testid="form-next"
              :to="localePath(actions?.yes?.link!)"
              type="button"
              :color="actions?.yes?.color || color"
              :variant="actions?.yes?.variant || 'solid'"
              :size="actions?.yes?.size"
              :icon="actions?.yes?.icon"
              :loading="loading"
            >
              {{ $tt(actions?.yes?.label || "$.btn.submit") }}
            </UButton>
            <UButton
              v-else
              data-testid="form-submit"
              type="submit"
              :color="actions?.yes?.color || color"
              :variant="actions?.yes?.variant || 'solid'"
              :size="actions?.yes?.size"
              :icon="actions?.yes?.icon"
              :disabled="
                item
                  ? !elRef?.querySelector('.field-warning')
                    ? true
                    : false
                  : form?.getErrors()?.length
                  ? true
                  : false
              "
              :loading="loading"
            >
              {{ $tt(actions?.yes?.label || "$.btn.submit") }}
            </UButton>
          </slot>
        </template>
      </UCard>
    </UForm>
  </div>
</template>
