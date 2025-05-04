<script setup lang="ts">
import type { WineDocument } from "@/server/types/wine.type";

defineProps<{
  columns: any[];
  rows: WineDocument[];
  kinds: Record<string, { label: string }>;
  colors: Record<string, { label: string }>;
  categories: Record<string, { label: string }>;
  routes: Record<string, any>;
  pending: boolean;
}>();

const emits = defineEmits<{
  (event: "delete", row: WineDocument): void;
}>();

const selected = defineModel<WineDocument[]>();
</script>

<template>
  <UTable v-model="selected" :columns="columns" :rows="rows">
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
        <ULink :to="routes.admin_wine_update?.path?.replace(':_id()', row._id)">
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
