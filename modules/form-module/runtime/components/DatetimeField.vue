<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useDateFormat } from "@vueuse/core";

import type { IItem } from "@/modules/common-module/runtime/types";
import { GET_OBJECT_PARAM } from "@/modules/common-module/runtime/utils";

import { useField } from "../composables/useField";
import type { IFormField, IFormFieldDatetime } from "../types";

// Definice props
const props = defineProps<{
  field: IFormFieldDatetime;
  item?: IItem;
  ui?: Record<string, any>;
}>();

// Definice emit eventu submit
const emits = defineEmits<{
  (e: "focus", event: FocusEvent, field: IFormField): void;
  (e: "blur", event: FocusEvent, field: IFormField): void;
  (e: "clear", field: IFormField): void;
  (e: "select", value: any, field: IFormField): void;
}>();

// Helper funkce pro field
const { compare } = useField();

// Model pro input, tzn. hodnota, ktera se odesila
const model = defineModel<Date | string>();

// Zjisti zda puvodni hodnota a hodnota v input fieldu jsou rozdilne
const isDifferent = computed<Boolean>(() => {
  if (props.item) {
    const defaultValue = GET_OBJECT_PARAM(props.item, props.field.name);
    if (
      model.value &&
      model.value instanceof Date &&
      defaultValue &&
      !isNaN(Date.parse(defaultValue))
    ) {
      return compare(
        new Date(defaultValue)?.getTime(),
        model.value?.getTime(),
        props.field
      );
    }
    return compare(defaultValue, model.value, props.field);
  }
  return false;
});

// Input model, je jen pomocny
const inputModel = ref<string | undefined>(
  model.value && model.value instanceof Date
    ? useDateFormat(model.value, props.field.format).value
    : model.value
    ? useDateFormat(model.value, props.field.format).value
    : undefined
);

// Atributy pro data
const attributes = ref([
  {
    key: "today",
    highlight: { fillMode: "light", color: "primary" },
    dates: new Date(),
  },
]);

// Pokud se klikne na clear button, tak se smaze hodnota a provede se focus
const onClear = () => {
  model.value = "";
  emits("clear", props.field);
};

onMounted(() => {
  if (
    model.value &&
    !(model.value instanceof Date) &&
    !isNaN(Date.parse(model.value))
  ) {
    model.value = new Date(model.value);
  } else {
    model.value = "";
  }
});
</script>

<template>todo</template>

<style>
:root {
  --vc-gray-50: rgb(var(--color-gray-50));
  --vc-gray-100: rgb(var(--color-gray-100));
  --vc-gray-200: rgb(var(--color-gray-200));
  --vc-gray-300: rgb(var(--color-gray-300));
  --vc-gray-400: rgb(var(--color-gray-400));
  --vc-gray-500: rgb(var(--color-gray-500));
  --vc-gray-600: rgb(var(--color-gray-600));
  --vc-gray-700: rgb(var(--color-gray-700));
  --vc-gray-800: rgb(var(--color-gray-800));
  --vc-gray-900: rgb(var(--color-gray-900));
}

.vc-primary {
  --vc-accent-50: rgb(var(--color-primary-50));
  --vc-accent-100: rgb(var(--color-primary-100));
  --vc-accent-200: rgb(var(--color-primary-200));
  --vc-accent-300: rgb(var(--color-primary-300));
  --vc-accent-400: rgb(var(--color-primary-400));
  --vc-accent-500: rgb(var(--color-primary-500));
  --vc-accent-600: rgb(var(--color-primary-600));
  --vc-accent-700: rgb(var(--color-primary-700));
  --vc-accent-800: rgb(var(--color-primary-800));
  --vc-accent-900: rgb(var(--color-primary-900));
}
</style>
