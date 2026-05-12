<script setup lang="ts">
import oConfig from "../../../assets/configs/admin-order-update.json";
import type { IOrder } from "../../../types";

definePageMeta({
  layout: "admin",
  syscode: "admin_order_detail",
});

const { t } = useLang();
const localePath = useLocalePath();
const { routes, route } = useMenuItems();
const title = computed(() =>
  t((route.meta.label || route.meta.title) as string),
);

const { config, orders: order, loading } = useOrderAdmin(oConfig);

/** Parse delivery/address info from the note field (e.g. "Doprava: DPD | Adresa: ...") */
const noteLines = computed(() =>
  ((order.value?.data as IOrder)?.note || "").split(" | ").filter(Boolean),
);

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

    <UCard v-if="order?.data">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Objednávka {{ order.data.order_number }}
          </h2>
          <UBadge :label="order.data.status" color="primary" variant="soft" />
        </div>
      </template>

      <template #default>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <div class="font-semibold mb-1">Zákazník</div>
            <div class="text-sm text-gray-700 dark:text-gray-300 space-y-0.5">
              <div
                v-if="
                  (order.data as any).user?.first_name ||
                  (order.data as any).user?.last_name
                "
              >
                {{ (order.data as any).user?.first_name }}
                {{ (order.data as any).user?.last_name }}
              </div>
              <div v-if="(order.data as any).user?.email">
                {{ (order.data as any).user?.email }}
              </div>
              <div v-else class="text-gray-400">
                ID: {{ order.data.user_id }}
              </div>
            </div>
            <ul
              class="text-sm text-gray-600 dark:text-gray-400 space-y-0.5 mt-1"
            >
              <li v-for="line in noteLines" :key="line">{{ line }}</li>
            </ul>
          </div>
          <div>
            <div class="font-semibold mb-1">Platba / Doprava</div>
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Platba:
              <strong>{{ order.data.payment_method }}</strong>
            </div>
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Měna: <strong>{{ order.data.currency }}</strong>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="mb-4">
          <div class="font-semibold mb-2">Položky objednávky</div>
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li
              v-for="item in order.data.order_items"
              :key="item.id"
              class="py-2 flex justify-between items-center text-sm"
            >
              <span class="font-medium">
                {{ (item as any).product_name || item.product_id }}
                <span
                  v-if="(item as any).sku"
                  class="text-gray-400 text-xs ml-1"
                  >({{ (item as any).sku }})</span
                >
              </span>
              <span>{{ item.quantity }} × {{ item.unit_price }} Kč</span>
              <span class="font-semibold">= {{ item.total_price }} Kč</span>
            </li>
          </ul>
        </div>
        <div
          class="mt-4 text-right text-lg font-bold text-primary-600 dark:text-primary-400"
        >
          Celkem: {{ order.data.total_amount }} Kč
        </div>
        <div class="mt-4 flex justify-start">
          <UButton
            :to="localePath(routes.admin_order?.path)"
            color="secondary"
            variant="outline"
            icon="i-heroicons-arrow-left"
          >
            Zpět na seznam
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
