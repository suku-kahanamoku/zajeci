<script setup lang="ts">
import { ref, computed } from "vue";
import { useApi, onMounted, type Ref } from "#imports";

import type { IItem } from "@suku-kahanamoku/common-module/utils";
import { GET_OBJECT_PARAM } from "@suku-kahanamoku/common-module/utils";

import type { IFormFieldOption, IFormFieldRadio } from "../types";
import { useField } from "../composables/useField";

// Definice props
const props = defineProps<{
  field: IFormFieldRadio;
  item?: IItem;
  ui?: Record<string, any>;
}>();

// Helper funkce pro field
const { compare, transformToOption, loadOptionsWithCustomData } = useField();

// Ui cmp element
const el = ref();

// Model pro hodnotu radio pole
const model = defineModel<any>({
  set: (value: any) => {
    if (Array.isArray(value)) {
      return options.value
        ?.filter((option) => value.includes(option.value))
        ?.map((option) => option.value);
    } else {
      return options.value?.find((option) => option.value === value)?.value;
    }
  },
});

// Options pro selectbox
const options: Ref<IFormFieldOption[] | undefined> = ref(
  transformToOption(props.field.options || []) as IFormFieldOption[]
);

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

/**
 * Nacte options
 **/
async function loadOptions(): Promise<void> {
  if (props.field.restOptions?.url) {
    try {
      const { data: result } = (await useApi(props.field.restOptions.url))!;
      if (result?.length) {
        options.value = transformToOption(
          result,
          props.field.restOptions
        ) as IFormFieldOption[];
      }
    } catch (error: any) {}
    // nacte objektu nastavena data
    options.value = await loadOptionsWithCustomData(
      model.value,
      options.value!,
      props.field.restOptions
    );
  }
}

onMounted(async () => {
  await loadOptions();
});
</script>

<template>
  <UFormField
    :data-testid="`${field.type}-${field.name}`"
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
    <template #default="{ error }">
      <URadioGroup
        ref="el"
        v-model="model"
        :disabled="field.disabled"
        :color="field.color"
        :items="options"
        :optionAttribute="field.optionAttribute || 'label'"
        :valueAttribute="field.valueAttribute || 'value'"
        :size="field.size || 'md'"
        :uiRadio="{ label: error && 'text-red-500' }"
        :autofocus="field.autofocus"
        :class="{ 'field-warning': isDifferent }"
      />
    </template>
  </UFormField>
</template>
