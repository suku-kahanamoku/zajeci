<script setup lang="ts">
import oConfig from "../../../assets/configs/admin-order-update.json";
import type { IOrder } from "../../../types";

definePageMeta({
  layout: "admin",
  syscode: "admin_order_detail",
  title: "$.admin.order.create_order",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() =>
  t((route.meta.label || route.meta.title) as string)
);

const { config, orders, loading, onUpdate } = useOrderAdmin(oConfig);
const order = computed(() => orders.value?.data as IOrder);
const address = computed(() => order.value?.user?.address?.main);

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

    <UCard v-if="order">
      <template #header>
        <h2 class="text-2xl font-bold text-primary-600 dark:text-primary-400">
          Objednávka #{{ order._id }}
        </h2>
      </template>

      <template #default>
        <div class="mb-4">
          <div class="font-semibold">Uživatel</div>
          <div class="text-gray-700 dark:text-gray-200">
            {{ order.user.name }} {{ order.user.surname }} ({{
              order.user.email
            }})
          </div>
          <div class="text-gray-500 dark:text-gray-400 text-sm">
            Telefon: {{ order.user.phone }}
          </div>
        </div>
        <div class="mb-4">
          <div class="font-semibold">Adresa</div>
          <div class="text-gray-700 dark:text-gray-200">
            {{ address?.street }}, {{ address?.city }}, {{ address?.zip }},
            {{ address?.state }}
          </div>
        </div>
        <div class="mb-4">
          <div class="font-semibold">Doprava</div>
          <div class="text-gray-700 dark:text-gray-200">
            {{ order.delivery.type }}
          </div>
        </div>
        <div class="mb-4">
          <div class="font-semibold">Platba</div>
          <div class="text-gray-700 dark:text-gray-200">
            {{ order.payment.type }}
          </div>
        </div>
        <div class="mb-4">
          <div class="font-semibold">Stav objednávky</div>
          <div class="text-gray-700 dark:text-gray-200">
            {{ order.status }}
          </div>
        </div>
      </template>

      <template #footer>
        <div class="mb-4">
          <div class="font-semibold">Košík</div>
          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li
              v-for="cart in order.carts"
              class="py-2 flex justify-between items-center"
            >
              <span>{{ cart.wine?.name }}</span>
              <span>{{ cart.quantity }} × {{ cart.unitPrice }} Kč</span>
              <span class="font-semibold">= {{ cart.totalPrice }} Kč</span>
            </li>
          </ul>
        </div>

        <div class="mt-6 text-right">
          <span class="text-lg font-bold text-primary-600 dark:text-primary-400"
            >Celkem: {{ order.totalPrice }} Kč</span
          >
        </div>
      </template>
    </UCard>
  </div>
</template>
