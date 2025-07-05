<script setup lang="ts">
import { ref, computed } from "vue";
import { useApi, onMounted, type Ref } from "#imports";

import type { IItem } from "@/modules/common-module/runtime/types";
import { GET_OBJECT_PARAM } from "@/modules/common-module/runtime/utils";

import type { IFormFieldOption, IFormFieldSelect } from "../types";
import { useField } from "../composables/useField";

// Definice props
const props = defineProps<{
  field: IFormFieldSelect;
  item?: IItem;
  ui?: Record<string, any>;
}>();

// Definice emit eventu submit
const emits = defineEmits<{
  (e: "clear", field: IFormFieldSelect, options: IFormFieldOption[]): void;
  (
    e: "select",
    value: any,
    field: IFormFieldSelect,
    options: IFormFieldOption[]
  ): void;
  (
    e: "remove",
    value: any,
    field: IFormFieldSelect,
    options: IFormFieldOption[]
  ): void;
  (
    e: "click:badge",
    value: any,
    field: IFormFieldSelect,
    options: IFormFieldOption[]
  ): void;
}>();

// Helper funkce pro field
const {
  compare,
  transformToOption,
  loadOptionsWithCustomData,
  loadOptionsWithSearchData,
} = useField();

// Ui cmp element
const el = ref();

// Model pro hodnotu select pole
const model = defineModel<any>({
  get: (value: any) => {
    return props.field.multiple && value === "" ? [] : value;
  },
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
const options: Ref<IFormFieldOption[]> = ref(
  transformToOption(props.field.options || []) as IFormFieldOption[]
);

// Priznak, zda probiha load
const loading = ref(false);

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

const open = ref();

// Pokud se klikne na clear button, tak se smaze hodnota a provede se focus
const onClear = () => {
  model.value = props.field.multiple ? [] : "";
  el.value.input?.focus();
  emits("clear", props.field, options.value);
};

/**
 * Dle hledaneho vyrazu zavola jednotlive api
 **/
const onSearch = async (q: string): Promise<IFormFieldOption[]> => {
  // nacte data dle hledaneho vyrazu
  options.value = await loadOptionsWithSearchData(
    q,
    options.value,
    props.field.restOptions
  );
  // nacte objektu nastavena data
  options.value = await loadOptionsWithCustomData(
    model.value,
    options.value,
    props.field.restOptions
  );
  return (
    (q
      ? options.value
          ?.filter((item) => item.label.toLowerCase().includes(q.toLowerCase()))
          ?.sort((a, b) => a.label.localeCompare(b.label))
      : options.value) || []
  );
};

/**
 * Nacte options
 **/
async function loadOptions(): Promise<void> {
  if (props.field.restOptions?.url) {
    loading.value = true;
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
      options.value,
      props.field.restOptions
    );
    loading.value = false;
  }
}

/**
 * Pokud se vybere nejaka hodnota ze seznamu options
 **/
function onChange(value: any) {
  setTimeout(() => emits("select", value, props.field, options.value));
}

/**
 * Pokud se klikne na ten samy option, tak to vyresetuje model
 */
function onClick(event: MouseEvent | PointerEvent, value: any) {
  if (model.value === value) {
    event.preventDefault();
    setTimeout(() =>
      emits("select", (model.value = ""), props.field, options.value)
    );
  }
}

/**
 * Pokud se odstrani badge
 */
function onRemove(value: any) {
  model.value = model.value.filter((i: any) => i !== value);
  emits("remove", value, props.field, options.value);
}

/**
 * Pokud se klikne na badge
 *
 * @param value
 * @param field
 * @param options
 */
function onClickBadge(
  value: any,
  field: IFormFieldSelect,
  options: IFormFieldOption[]
) {
  emits("click:badge", value, field, options);
}

onMounted(loadOptions);
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
    <USelect
      v-model="model"
      v-model:open="open"
      :items="options"
      :multiple="field.multiple"
      :trailingIcon="
        open ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'
      "
      class="w-full"
    >
      <CmpSelectFieldLabel
        v-model="model"
        :field="field"
        :options="options"
        :onRemove="onRemove"
        :onClear="onClear"
        @click="onClickBadge"
      />

      <template #item-label="{ item }">
        {{ $tt(item.label) }}
      </template>
    </USelect>
  </UFormField>
</template>
