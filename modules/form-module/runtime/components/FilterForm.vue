<script lang="ts" setup>
import { ref, reactive, useOperator } from "#imports";
import type { DropdownMenuItem } from "#ui/types";

import type { IFormField, IFormFieldOption } from "../types/field.interface";

const props = defineProps<{
  fields: IFormField[];
  displayFields: IFormField[];
  otherFields: IFormField[] | DropdownMenuItem[];
}>();

// Definice emit eventu submit
const emits = defineEmits<{
  (
    e: "change:operator",
    payload: Record<string, any>,
    operators: Record<string, any>,
    event: { name: string; value: any }
  ): void;
  (
    e: "change",
    payload: Record<string, any>,
    operators: Record<string, any>,
    value?: any,
    field?: IFormField,
    options?: IFormFieldOption[]
  ): void;
  (e: "remove:field", field: IFormField): void;
  (
    e: "click:badge",
    payload: Record<string, any>,
    value: any,
    field: IFormField,
    options?: IFormFieldOption[]
  ): void;
}>();

const form = ref();

const open = defineModel<boolean>("open");
const fixModel = defineModel<boolean>("fix");

/**
 * Model s operatory
 */
const operators = reactive<Record<string, any>>(
  Object.fromEntries(
    props.fields.map((field) => [
      field.name,
      field.operator?.value || useOperator(field).getDefaultOperator(),
    ])
  )
);

defineExpose({ form });
</script>

<template>
  <UAccordion
    :items="[{ label: $tt('$.btn.filters'), icon: '', slot: 'filter' }]"
    :default-open="open"
  >
    <template #default="{ item, open }">
      <div
        class="flex flex-col sm:flex-row-reverse justify-between items-center align-middle gap-4"
      >
        <slot name="header" />

        <div class="w-full">
          <UButton
            variant="ghost"
            class="w-full rounded-md text-sm gap-x-1.5 px-2.5 text-primary-500 dark:text-primary-400 bg-primary-50 hover:bg-primary-100 disabled:bg-primary-50 aria-disabled:bg-primary-50 dark:bg-primary-950 dark:hover:bg-primary-900 dark:disabled:bg-primary-950 dark:aria-disabled:bg-primary-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400 inline-flex items-center py-2"
            data-testid="filter-form-collapse"
          >
            <span class="truncate">{{ item.label }}</span>

            <template #trailing>
              <UIcon
                name="i-heroicons-chevron-right-20-solid"
                class="w-5 h-5 ms-auto transform transition-transform duration-200"
                :class="[open && 'rotate-90']"
              />
            </template>
          </UButton>
        </div>
      </div>
    </template>

    <template #filter>
      <CmpForm
        ref="form"
        :fields="fields"
        :actions="{ disabled: true }"
        :ui="{
          ring: '',
          shadow: '',
          divide: '',
          background: 'bg-gray-50',
          body: {
            base: 'flex flex-col sm:flex-row flex-wrap gap-2',
            padding: '',
          },
          form: 'block',
        }"
        @change="
          (payload: Record<string, any>, value: any, field: IFormField, options: IFormFieldOption[]) =>
            emits('change', payload, operators, value, field, options)
        "
        @submit="(payload: Record<string, any>) => emits('change', payload, operators)"
      >
        <template #default="{ model }">
          <!-- jednotlive fieldy -->
          <CmpField
            v-for="field in displayFields"
            v-model="model[field.name]"
            :field="field"
            :ui="{
              wrapper: 'sm:w-52',
              hint: 'flex',
              label: { base: 'truncate', wrapper: 'min-h-6' },
            }"
            :key="field.name + field.key"
            @clear="form?.onChange"
            @select="form?.onChange"
            @remove="form?.onChange"
            @click:badge="
                (value: any, _field: IFormField, options?: IFormFieldOption[]) =>
                  emits('click:badge', model, value, _field, options)
              "
          >
            <!-- tlacitko pro odstraneni fieldu z filtru -->
            <template #hint>
              <CmpOperator
                v-if="field.operator?.enabled"
                v-model="operators[field.name]"
                :field="field"
                @change="
                  emits('change:operator', model, operators, {
                    name: field.name,
                    value: $event,
                  })
                "
              />

              <CmpTooltip v-if="!field.static && displayFields.length > 1">
                <UButton
                  data-testid="filter-form-rm-field"
                  variant="ghost"
                  size="xs"
                  color="error"
                  icon="i-heroicons-minus-circle"
                  aria-hidden
                  aria-label="Remove field button"
                  @click="emits('remove:field', field)"
                />

                <template #text>
                  {{ $tt("$.info.remove_field") }}
                </template>
              </CmpTooltip>
            </template>
          </CmpField>

          <div class="flex flex-row gap-2">
            <!-- tlacitko pro pridani fieldu do filtru -->
            <UDropdown
              :items="[otherFields as DropdownMenuItem[]]"
              :ui="{ wrapper: 'flex flex-col justify-end align-middle mb-1' }"
            >
              <CmpTooltip>
                <UButton
                  data-testid="filter-form-add-field"
                  size="xs"
                  icon="i-heroicons-plus"
                  :disabled="!otherFields.length"
                  :ui="{
                    base: 'flex justify-center w-full sm:w-auto sm:mb-0.5',
                  }"
                  aria-hidden
                  aria-label="Add field button"
                />

                <template #text>{{ $tt("$.info.add_fields") }}</template>
              </CmpTooltip>
            </UDropdown>

            <!-- tlacitko pro propojeni fieldu se sloupcem -->
            <CmpTooltip
              :ui="{
                wrapper: 'flex flex-col justify-end align-middle mb-1.5',
              }"
            >
              <UToggle
                v-model="fixModel"
                size="lg"
                data-testid="filter-form-fix-fields"
              />

              <template #text>{{ $tt("$.info.fix_field_col") }}</template>
            </CmpTooltip>
          </div>
        </template>
      </CmpForm>
    </template>
  </UAccordion>
</template>
