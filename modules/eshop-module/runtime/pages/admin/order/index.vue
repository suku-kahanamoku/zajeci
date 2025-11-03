<script setup lang="ts">
import oConfig from "../../../assets/configs/admin-order-list.json";
import type { IOrder } from "../../../types";

definePageMeta({
  layout: "admin",
  syscode: "admin_order",
  title: "$.order.title",
});

const { t } = useLang();
const localePath = useLocalePath();
const { routes, route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));

const { config, orders, loading, columns, selected, isOpen, onDelete } =
  useOrderAdmin(oConfig);

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});
</script>

<template>
  <div v-if="config" :id="config.syscode" class="w-full max-w-7xl mx-auto px-5">
    <UPageHeader
      :title="title"
      :ui="{ title: 'mx-auto text-primary-600 dark:text-white' }"
      class="border-none"
    />

    <div class="flex justify-end">
      <UButton
        icon="i-heroicons-trash"
        color="error"
        variant="ghost"
        :aria-label="$tt('$.aria.delete_selected')"
        :disabled="!selected.length"
        :loading="loading"
        @click="isOpen = true"
      />
      <UButton
        :to="localePath(routes.admin_order_create?.path!)"
        icon="i-heroicons-plus-circle"
        color="secondary"
        variant="ghost"
        :aria-label="$tt('$.aria.delete_selected')"
        :loading="loading"
      />
    </div>

    <UTable
      v-if="orders?.data"
      :data="(orders.data as IOrder[])"
      :columns="columns"
      class="flex-1"
    >
      <template #_id-cell="{ row }">
        <NuxtLink :to="row.original?.gen_data?.url">
          {{ row.original?._id }}
        </NuxtLink>
      </template>
    </UTable>

    <CmpConfirmDialog
      v-model="isOpen"
      :title="$tt('$.btn.delete')"
      color="error"
      :btns="{
        ok: {
          icon: 'i-heroicons-trash',
        },
      }"
      @confirm="onDelete"
    >
      {{
        selected?.length > 1
          ? $tt("$.message.delete_question_multi", {
              length: selected?.length,
            })
          : $tt("$.message.delete_question", { name: selected?.[0]?._id })
      }}
    </CmpConfirmDialog>
  </div>
</template>
