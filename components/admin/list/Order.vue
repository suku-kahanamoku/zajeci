<script setup lang="ts">
import type { IOrder } from "@/server/types/order.type";

defineProps<{
  orders: IOrder[];
  pending: boolean;
}>();

const emits = defineEmits<{
  (event: "delete", row: IOrder): void;
}>();

const selected = defineModel<IOrder[]>();

const { routes } = useMenuItems();
const { kinds, colors, categories, fieldOptions } = useOrders();

const columns = fieldOptions.map((field) => ({
  ...field,
  ...{ sortable: true },
}));
</script>

<template>
  <UTable v-model="selected" :columns="columns" :rows="orders">
    <template #user.email-data="{ row }">
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
          {{ row.user.email }}
        </ULink>
      </div>
    </template>
  </UTable>
</template>
