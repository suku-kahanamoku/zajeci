<script setup lang="ts">
import { useToNumber } from "@vueuse/core";

import { PaymentServices } from "@/server/types/order.type";

const { $tt } = useNuxtApp();
const { locale } = useI18n();
const localePath = useLocalePath();
const { routes } = useMenuItems();
const cashdesk = useCashdeskStore();
const auth = useAuthStore();

const columns = [
  { key: "name", label: $tt("$.admin.wine.form.name") },
  { key: "quantity", label: $tt("$.form.quantity") },
  { key: "price", label: $tt("$.form.price") },
];
</script>
<template>
  <UTable :columns="columns" :rows="cashdesk.carts" class="hidden sm:block">
    <template #quantity-header="{ column }">
      <div class="text-center">
        {{ column.label }}
      </div>
    </template>
    <template #price-header="{ column }">
      <div class="text-right">
        {{ column.label }}
      </div>
    </template>

    <template #name-data="{ row }">
      <NuxtLink
        :to="localePath(`${routes.wine.path}/${row.wine._id}`)"
        class="flex items-center"
      >
        <NuxtImg
          :src="row.wine.image?.main?.src || '/img/bottle.jpg'"
          :alt="'wine'"
          loading="lazy"
          format="webp"
          height="100"
          class="object-cover rounded-lg"
        />
        <h3 class="text-lg font-semibold text-pretty">{{ row.wine.name }}</h3>
      </NuxtLink>
    </template>
    <template #quantity-data="{ row }">
      <div class="w-full text-center text-lg font-semibold">
        {{ row.quantity }}
      </div>
    </template>
    <template #price-data="{ row }">
      <p class="text-lg font-semibold min-w-24 text-end">
        {{
          useToNumber(row?.totalPrice?.toFixed(2) || 0).value.toLocaleString(
            locale
          )
        }}&nbsp;{{ $tt("$.czk") }}
      </p>
    </template>
  </UTable>

  <div class="sm:hidden">
    <div
      v-for="cart in cashdesk.carts"
      :key="cart.wine._id"
      class="flex flex-col md:flex-row items-center justify-between text-gray-500 px-4 pt-2 pb-4 rounded-lg shadow space-x-0 md:space-x-4 space-y-4 md:space-y-0 dark:border dark:border-gray-700"
    >
      <NuxtLink
        :to="localePath(`${routes.wine.path}/${cart.wine._id}`)"
        class="flex flex-col md:flex-row items-center"
      >
        <NuxtImg
          :src="cart.wine.image?.main?.src || '/img/bottle.jpg'"
          :alt="'wine'"
          loading="lazy"
          format="webp"
          height="100"
          class="object-cover rounded-lg"
        />
        <h3 class="text-lg font-semibold">{{ cart.wine.name }}</h3>
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
    <div
      class="w-full border rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="p-4 md:p-6 space-y-4">
        <h3
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
        >
          {{ $tt("$.cashdesk.billing_address") }}
        </h3>

        <div class="flex flex-col gap-y-2">
          <h3 class="font-semibold text-lg">
            {{ cashdesk.user?.email }}
          </h3>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">
              {{ $tt(auth.fields.name.label) }}:
            </h3>
            <p class="text-gray-600 dark:text-white">
              {{ cashdesk.user?.givenName }}&nbsp;{{ cashdesk.user?.surname }}
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">
              {{ $tt(auth.fields.street.label) }}:
            </h3>
            <p class="text-gray-600 dark:text-white">
              {{ cashdesk.user.address?.main?.street }}
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">
              {{ $tt(auth.fields.city.label) }}:
            </h3>
            <p class="text-gray-600 dark:text-white">
              {{ cashdesk.user.address?.main?.city }}
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">
              {{ $tt(auth.fields.zip.label) }}:
            </h3>
            <p class="text-gray-600 dark:text-white">
              {{ cashdesk.user.address?.main?.zip }}
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">
              {{ $tt(auth.fields.state.label) }}:
            </h3>
            <p class="text-gray-600 dark:text-white">
              {{
                $tt(
                  auth.states[cashdesk.user.address?.main?.state || "cz"]?.label
                )
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="w-full border rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="p-4 md:p-6 space-y-4">
        <h3
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
        >
          {{ $tt("$.cashdesk.delivery.title") }}
        </h3>

        <div class="flex flex-col gap-y-2">
          <h3 class="font-semibold text-lg">
            {{
              $tt(
                cashdesk.delivery?.type === "free"
                  ? "$.cashdesk.delivery.brno_free"
                  : cashdesk.deliveries[cashdesk.delivery?.type]?.label
              )
            }}
          </h3>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">
              {{ $tt(auth.fields.name.label) }}:
            </h3>
            <p class="text-gray-600 dark:text-white">
              {{ cashdesk.delivery.address?.name }}
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">
              {{ $tt(auth.fields.street.label) }}:
            </h3>
            <p class="text-gray-600 dark:text-white">
              {{ cashdesk.delivery.address?.street }}
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">
              {{ $tt(auth.fields.city.label) }}:
            </h3>
            <p class="text-gray-600 dark:text-white">
              {{ cashdesk.delivery.address?.city }}
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">
              {{ $tt(auth.fields.zip.label) }}:
            </h3>
            <p class="text-gray-600 dark:text-white">
              {{ cashdesk.delivery.address?.zip }}
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">
              {{ $tt(auth.fields.state.label) }}:
            </h3>
            <p class="text-gray-600 dark:text-white">
              {{
                $tt(
                  auth.states[cashdesk.delivery.address?.state || "cz"]?.label
                )
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="w-full border rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="p-4 md:p-6 space-y-4">
        <h3
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
        >
          {{ $tt("$.cashdesk.payment.title") }}
        </h3>

        <div class="flex flex-col gap-y-2">
          <h3 class="font-semibold text-lg">
            {{ $tt(cashdesk.payments[cashdesk.payment?.type]?.label) }}
          </h3>
          <template v-if="cashdesk.payment.type === PaymentServices.bank">
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
              <h3 class="font-semibold text-gray-700 dark:text-white">
                {{ $tt("$.cashdesk.payment.recipient_msg") }}:
              </h3>
              <p class="text-gray-600 dark:text-white">
                Číslo objednávky 12345
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>

  <div
    class="py-4 px-4 mt-2 text-lg font-semibold text-end text-gray-600 dark:text-white border border-gray-200 dark:border-gray-700"
  >
    <div class="flex justify-end items-center gap-4">
      <p class="w-40 sm:w-44 text-left">
        {{ $tt("$.cashdesk.delivery.title") }}:
      </p>
      <p class="w-32 sm:w-44 text-right">
        {{
          useToNumber(
            cashdesk.delivery?.totalPrice?.toFixed(2) || 0
          ).value.toLocaleString(locale)
        }}&nbsp;{{ $tt("$.czk") }}
      </p>
    </div>

    <div class="flex justify-end items-center gap-4">
      <p class="w-40 sm:w-44 text-left">
        {{ $tt("$.cashdesk.payment.title") }}:
      </p>
      <p class="w-32 sm:w-44 text-right">
        {{
          useToNumber(
            cashdesk.payment?.totalPrice?.toFixed(2) || 0
          ).value.toLocaleString(locale)
        }}&nbsp;{{ $tt("$.czk") }}
      </p>
    </div>

    <div class="flex justify-end items-center gap-4">
      <p class="w-40 sm:w-44 text-left">
        {{ $tt("$.cashdesk.cart.total_price") }}:
      </p>
      <p class="w-32 sm:w-44 text-right">
        {{
          useToNumber(
            cashdesk.totalPrice?.toFixed(2) || 0
          ).value.toLocaleString(locale)
        }}&nbsp;{{ $tt("$.czk") }}
      </p>
    </div>
  </div>
</template>
