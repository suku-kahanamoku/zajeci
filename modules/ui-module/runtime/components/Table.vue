<script setup lang="ts">
import { h, resolveComponent, nextTick } from "vue";
import type { TableColumn } from "@nuxt/ui";

import type { IFormConfig } from "~/modules/form-module/runtime/types";
import type { IItem } from "~/modules/common-module/runtime/types";

const UCheckbox = resolveComponent("UCheckbox");
const UButton = resolveComponent("UButton");

const props = defineProps<{
  config: IFormConfig;
  data?: IItem[];
  loading?: boolean;
}>();

const emits = defineEmits<{
  (e: "delete", value: IItem): void;
}>();

const selected = defineModel("selected");

const tableEl = useTemplateRef("tableEl");
const selection = ref({});
const { t } = useLang();

const columns = computed<TableColumn<IItem>[]>(() => {
  const result: TableColumn<IItem>[] =
    props.config?.fields?.map((f) => ({
      accessorKey: f.name,
      header: t(f.label!),
    })) ?? [];

  result.unshift({
    id: "select",
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected()
          ? "indeterminate"
          : table.getIsAllPageRowsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") => {
          table.toggleAllPageRowsSelected(!!value);
          nextTick(() => {
            selected.value = table
              .getSelectedRowModel()
              .rows.map((r) => r.original);
          });
        },
        "aria-label": "Select all",
      }),
    cell: ({ table, row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") => {
          row.toggleSelected(!!value);
          nextTick(() => {
            selected.value = table
              .getSelectedRowModel()
              .rows.map((r) => r.original);
          });
        },
        "aria-label": "Select row",
      }),
  });

  result.push({
    id: "actions",
    cell: ({ row }) =>
      h(UButton, {
        icon: "i-heroicons-trash",
        color: "error",
        variant: "ghost",
        "aria-label": "Delete",
        onClick: () => {
          selected.value = [row.original];
          emits("delete", row.original);
        },
      }),
  });

  return result;
});

defineExpose({ tableEl });
</script>

<template>
  <div class="flex-1 w-full">
    <UTable
      ref="tableEl"
      v-model:row-selection="selection"
      :data="props.data"
      :columns="columns"
      :loading="loading"
    />

    <div class="px-4 py-3.5 border-t border-accented text-sm text-muted">
      {{ tableEl?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }}
      of {{ tableEl?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s)
      selected.
    </div>
  </div>
</template>
