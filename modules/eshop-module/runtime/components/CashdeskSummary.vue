<script setup lang="ts">
import { useToNumber } from "@vueuse/core";

import type { ICart } from "@/modules/eshop-module/runtime/types/order.interface";
import { UCard } from "#components";

const { t } = useLang();
const {
  i18n: { locale },
} = useLang();
const localePath = useLocalePath();
const { routes } = useMenuItems();
const cashdesk = useCashdeskStore();
const isOpen = ref(false);
const deleted = ref();

const increaseQuantity = (cart: ICart) => {
  cashdesk.addItem(cart.wine, 1);
};

const decreaseQuantity = (cart: ICart) => {
  if (cart.quantity > 1) {
    cashdesk.removeItem(cart.wine?._id);
  } else {
    removeItem(cart);
  }
};

const removeItem = (cart: ICart) => {
  deleted.value = cart;
  isOpen.value = true;
};

const setQuantity = (value: number, cart: ICart) => {
  if (value > 0) {
    cashdesk.setQuantity(cart.wine?._id, value);
  } else {
    removeItem(cart);
  }
};

const columns = [
  { accessorKey: "name", header: t("$.admin.wine.form.name") },
  { accessorKey: "quantity", header: t("$.form.quantity") },
  { accessorKey: "price", header: t("$.form.price") },
];
</script>

<template>
  <UTable
    v-if="cashdesk?.carts?.length"
    :columns="columns"
    :data="cashdesk.carts"
    class="hidden sm:block"
  >
    <template #name-cell="{ row }">
      <NuxtLink
        :to="localePath(`${routes.wine.path}/${row.original?.wine?._id}`)"
        class="flex items-center"
      >
        <NuxtImg
          :src="row.original?.wine?.image?.main?.src || '/img/bottle.jpg'"
          :alt="'wine'"
          loading="lazy"
          format="webp"
          height="100"
          class="object-cover rounded-lg"
        />
        <h3 class="text-lg font-semibold text-pretty">
          {{ row.original?.wine?.name }}
        </h3>
      </NuxtLink>
    </template>
    <template #quantity-data="{ row }">
      <div class="w-full text-center text-lg font-semibold">
        {{ row.original?.quantity }}
      </div>
    </template>
    <template #price-data="{ row }">
      <p class="text-lg font-semibold min-w-24 text-end">
        {{
          useToNumber(
            row.original?.totalPrice?.toFixed(2) || 0
          ).value.toLocaleString(locale)
        }}&nbsp;{{ $tt("$.czk") }}
      </p>
    </template>
  </UTable>

  <div class="sm:hidden">
    <div
      v-for="cart in cashdesk.carts"
      :key="cart.wine?._id"
      class="flex flex-col md:flex-row items-center justify-between text-gray-500 px-4 pt-2 pb-4 rounded-lg shadow space-x-0 md:space-x-4 space-y-4 md:space-y-0 dark:border dark:border-gray-700"
    >
      <NuxtLink
        :to="localePath(`${routes.wine.path}/${cart.wine?._id}`)"
        class="flex flex-col md:flex-row items-center"
      >
        <NuxtImg
          :src="cart.wine?.image?.main?.src || '/img/bottle.jpg'"
          :alt="'wine'"
          loading="lazy"
          format="webp"
          height="100"
          class="object-cover rounded-lg"
        />
        <h3 class="text-lg font-semibold">{{ cart.wine?.name }}</h3>
      </NuxtLink>
      <div class="flex items-center justify-between space-x-4 sm:space-x-12">
        <div class="w-full text-center text-lg font-semibold flex gap-2">
          <p>{{ $tt("$.form.quantity") }}:</p>
          <p>{{ cart.quantity }}</p>
        </div>
        <div class="w-full text-center text-lg font-semibold flex gap-2">
          <p>{{ $tt("$.form.price") }}:</p>
          <p>
            {{
              useToNumber(
                cart?.totalPrice?.toFixed(2) || 0
              ).value.toLocaleString(locale)
            }}&nbsp;{{ $tt("$.czk") }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="grid gap-2 sm:gap-4 my-8 md:grid-cols-2 lg:grid-cols-3">
    <UCard variant="subtle">
      <template #header>
        <h3
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
        >
          {{ $tt("$.cashdesk.billing_address") }}
        </h3>
      </template>

      <div class="flex flex-col gap-y-2">
        <p class="text-gray-600 dark:text-white">
          {{ cashdesk.user.email }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ cashdesk.user?.givenName }}&nbsp;{{ cashdesk.user?.surname }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ cashdesk.user.address?.main?.street }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ cashdesk.user.address?.main?.city }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ cashdesk.user.address?.main?.zip }}
        </p>
      </div>
    </UCard>

    <UCard variant="subtle">
      <template #header>
        <h3
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
        >
          {{ $tt("$.cashdesk.delivery.title") }}
        </h3>
      </template>

      <div class="flex flex-col gap-y-2">
        <h4 class="font-semibold text-lg">
          {{
            $tt(
              cashdesk.delivery?.type === "free"
                ? "$.cashdesk.delivery.brno_free"
                : cashdesk.deliveries[cashdesk.delivery?.type]?.label
            )
          }}
        </h4>

        <p class="text-gray-600 dark:text-white">
          {{ cashdesk.delivery.address?.name }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ cashdesk.delivery.address?.street }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ cashdesk.delivery.address?.city }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ cashdesk.delivery.address?.zip }}
        </p>
      </div>
    </UCard>

    <UCard variant="subtle">
      <template #header>
        <h3
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
        >
          {{ $tt("$.cashdesk.delivery.title") }}
        </h3>
      </template>

      <div class="flex flex-col gap-y-2">
        <h4 class="font-semibold text-lg">
          {{ $tt("$.cashdesk.payment.account_num") }}:
        </h4>

        <div v-if="cashdesk.payment.type === 'bank'">
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">
              {{ $tt("$.cashdesk.payment.account_num") }}:
            </h3>
            <p class="text-gray-600 dark:text-white">1234567890/1234</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">IBAN:</h3>
            <p class="text-gray-600 dark:text-white">
              CZ6508000000001234567890
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">
              SWIFT/BIC:
            </h3>
            <p class="text-gray-600 dark:text-white">ABCDEFGH</p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">
              {{ $tt("$.cashdesk.payment.variable_sym") }}:
            </h3>
            <p class="text-gray-600 dark:text-white">12345</p>
          </div>
          <div>
            <p class="text-gray-600 dark:text-white">Číslo objednávky 12345</p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
