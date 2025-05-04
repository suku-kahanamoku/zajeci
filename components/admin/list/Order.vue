<script setup lang="ts">
import type { OrderDocument } from "@/server/types/order.type";

defineProps<{
  orders: OrderDocument[];
  pending: boolean;
}>();

const emits = defineEmits<{
  (event: "delete", row: OrderDocument): void;
}>();

const selected = defineModel<OrderDocument[]>();

const { routes } = useMenuItems();
const { kinds, colors, categories, fieldOptions } = useOrders();

const columns = fieldOptions.map((field) => ({
  ...field,
  ...{ sortable: true },
}));
</script>

<template>
  <UTable v-model="selected" :columns="columns" :rows="orders">
    <template #name-data="{ row }">
      <div class="flex items-center gap-1">
        <UButton
          icon="i-heroicons-trash"
          color="error"
          :ui="{ rounded: 'rounded-full' }"
          variant="ghost"
          :aria-label="$tt('$.aria.delete')"
          @click="emits('delete', row)"
          :loading="pending"
        />
        <ULink
          :to="routes.admin_order_update?.path?.replace(':_id()', row._id)"
        >
          {{ row.name }}
        </ULink>
      </div>
    </template>
    <template #kind-data="{ row }"> {{ kinds[row.kind]?.label }} </template>
    <template #color-data="{ row }"> {{ colors[row.color]?.label }} </template>
    <template #categories-data="{ row }">
      {{
        row.categories
          ?.map((category: string) => categories[category]?.label)
          ?.join(",&nbsp;")
      }}
    </template>
  </UTable>
</template>
