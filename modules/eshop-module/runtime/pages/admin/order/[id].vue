<script setup lang="ts">
import oConfig from "../../../assets/configs/admin-order-update.json";
import type { IOrder } from "../../../types";

definePageMeta({
  layout: "admin",
  syscode: "admin_order_detail",
});

const { t } = useLang();
const {
  i18n: { locale },
} = useLang();
const localePath = useLocalePath();
const { routes, route } = useMenuItems();
const title = computed(() =>
  t((route.meta.label || route.meta.title) as string),
);

const { config, orders: order, loading } = useOrderAdmin(oConfig);

const data = computed(() => order.value?.data as IOrder | undefined);

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

    <UCard v-if="data">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {{ t("$.order.title") }} {{ data.order_number }}
          </h2>
          <UBadge :label="data.status" color="primary" variant="soft" />
        </div>
      </template>

      <template #default>
        <div class="grid md:grid-cols-3 gap-6">
          <!-- Zákazník -->
          <div>
            <div class="font-semibold mb-2">{{ t("$.cashdesk.anonymous") }}</div>
            <div class="text-sm text-gray-700 dark:text-gray-300 space-y-0.5">
              <div v-if="(data as any).user?.first_name || (data as any).user?.last_name">
                {{ (data as any).user?.first_name }} {{ (data as any).user?.last_name }}
              </div>
              <div v-if="(data as any).user?.email">{{ (data as any).user?.email }}</div>
              <div v-else class="text-gray-400">ID: {{ data.user_id }}</div>
              <div v-if="data.note" class="mt-2 text-xs text-gray-400">{{ data.note }}</div>
            </div>
          </div>

          <!-- Platba -->
          <div>
            <div class="font-semibold mb-2">{{ t("$.payment.title") }}</div>
            <div class="text-sm text-gray-700 dark:text-gray-300 space-y-0.5">
              <div>{{ t("$.order.payment_type") }}: <strong>{{ data.payment_type }}</strong></div>
              <div>{{ t("$.form.currency") || "Měna" }}: <strong>{{ data.currency }}</strong></div>
            </div>
          </div>

          <!-- Doprava -->
          <div>
            <div class="font-semibold mb-2">{{ t("$.shipping.title") }}</div>
            <div class="text-sm text-gray-700 dark:text-gray-300 space-y-0.5">
              <div v-if="data.shipping_type">{{ t("$.order.shipping_type") }}: <strong>{{ data.shipping_type }}</strong></div>
              <div v-if="data.shipping_price !== undefined">
                {{ t("$.form.price") }}:
                <strong>
                  {{ data.shipping_price! > 0
                    ? `${Number(data.shipping_price).toLocaleString(locale)} ${t('$.czk')}`
                    : t('$.shipping.free') }}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <!-- Položky -->
        <div class="mb-6">
          <div class="font-semibold mb-2">{{ t("$.cart.title") }}</div>
          <UTable
            :data="data.order_items || []"
            :columns="[
              { accessorKey: 'product_name', header: t('$.form.name') },
              { accessorKey: 'sku', header: 'SKU' },
              { accessorKey: 'quantity', header: t('$.form.quantity') },
              { accessorKey: 'price', header: t('$.form.price') },
              { accessorKey: 'total_price', header: t('$.order.total_price') },
            ]"
          >
            <template #price-cell="{ row }">
              {{ Number(row.original.price).toLocaleString(locale) }} {{ t('$.czk') }}
            </template>
            <template #total_price-cell="{ row }">
              {{ Number(row.original.total_price).toLocaleString(locale) }} {{ t('$.czk') }}
            </template>
          </UTable>
        </div>

        <!-- Celkem -->
        <div class="flex justify-end text-lg font-bold text-primary-600 dark:text-primary-400 mb-4">
          {{ t("$.order.total_price") }}:
          {{ Number(data.total_price).toLocaleString(locale) }} {{ t('$.czk') }}
        </div>

        <div class="flex justify-start">
          <UButton
            :to="localePath(routes.admin_order?.path)"
            color="secondary"
            variant="outline"
            icon="i-heroicons-arrow-left"
          >
            {{ t("$.btn.back") }}
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
