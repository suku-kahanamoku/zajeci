<script setup lang="ts">
import oConfig from "../../../assets/configs/admin-order-list.json";
import type { IOrder } from "../../../types";

definePageMeta({
  layout: "admin",
  syscode: "admin_order",
  title: "$.admin.order.title",
});

const { t } = useLang();
const localePath = useLocalePath();
const { routes, route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));

const { config, orders, pending, columns, selected, isOpen, onDelete } =
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
  <div
    v-if="config"
    :id="config.syscode"
    class="max-w-screen-xl mx-auto px-5 w-full"
  >
    <div class="flex flex-col gap-8 py-10">
      <h1
        class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400"
      >
        {{ title }}
      </h1>

      <div class="flex justify-end">
        <UButton
          icon="i-heroicons-trash"
          color="error"
          variant="ghost"
          :aria-label="$tt('$.aria.delete_selected')"
          :disabled="!selected.length"
          :loading="pending"
          @click="isOpen = true"
        />
        <UButton
          :to="localePath(routes.admin_order_create?.path)"
          icon="i-heroicons-plus-circle"
          color="secondary"
          variant="ghost"
          :aria-label="$tt('$.aria.delete_selected')"
          :loading="pending"
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
    </div>

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
