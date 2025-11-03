<script setup lang="ts">
import { useToNumber } from "@vueuse/core";
import type { TableColumn } from "@nuxt/ui";
import { useUrlResolver } from "#imports";

import { CLONE } from "@suku-kahanamoku/common-module/utils";
import type { IFormConfig } from "@suku-kahanamoku/form-module/types";

import cConfig from "../assets/configs/cart.json";
import dConfig from "../assets/configs/delivery.json";

const { t } = useLang();
const {
  i18n: { locale },
} = useLang();
const localePath = useLocalePath();
const { routes, route } = useMenuItems();
const { updateConfig } = useUrlResolver();
const { carts, user, delivery, payment, totalPrice } = useCashdesk();

/**
 * Load config
 */
const { data: config } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(cConfig);
      updateConfig(route, result);
      return result as IFormConfig;
    } catch (error: any) {
      return {} as IFormConfig;
    }
  },
  { watch: [() => route.query] }
);

/**
 * Load config
 */
const { data: deliveryConfig } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(dConfig);
      updateConfig(route, result);
      return result as IFormConfig;
    } catch (error: any) {
      return {} as IFormConfig;
    }
  },
  { watch: [() => route.query] }
);

// Columns
const columns: Ref<TableColumn<any>[]> = computed(
  () =>
    config?.value?.fields
      ?.filter((f) => ["name", "quantity", "price"].includes(f.name))
      ?.map((f) => ({
        accessorKey: f.name,
        header: ({ table }) =>
          h("div", {
            innerHTML: t(f.label!),
            class: f.type === "number" ? "text-end" : "",
          }),
      })) ?? []
);
</script>

<template>
  <UTable
    v-if="config && carts?.length"
    :columns="columns"
    :data="carts"
    class="hidden sm:block"
  >
    <template #name-cell="{ row }">
      <div class="flex gap-4 items-center">
        <NuxtImg
          :src="row.original?.wine?.image?.main?.src || '/img/bottle.jpg'"
          :alt="'wine'"
          loading="lazy"
          format="webp"
          height="100"
          class="object-cover rounded-lg"
        />

        <div class="flex flex-col gap-2">
          <NuxtLink
            :to="
              localePath(
                `${routes.wine?.path}/${row.original?.wine?.name}--$${row.original?.wine?._id}`
              )
            "
            class="flex items-center"
          >
            <h3 class="font-semibold text-pretty">
              {{ row.original?.wine?.name }}
            </h3>
          </NuxtLink>

          <!-- Parametry vína s ikonami ve dvou řádcích -->
          <CmpWineIconAttrs
            :wine="row.original?.wine"
            :fields="config.fields"
          />
        </div>
      </div>
    </template>

    <template #quantity-cell="{ row }">
      <div class="w-full font-semibold text-end">
        {{
          useToNumber(
            row.original?.quantity?.toFixed(2) || 0
          ).value.toLocaleString(locale)
        }}
      </div>
    </template>

    <template #price-cell="{ row }">
      <p class="font-semibold min-w-24 text-end">
        {{
          useToNumber(
            row.original?.totalPrice?.toFixed(2) || 0
          ).value.toLocaleString(locale)
        }}&nbsp;{{ t("$.czk") }}
      </p>
    </template>

    <template #body-bottom>
      <tr>
        <td colspan="99" class="p-4">
          <p class="font-semibold min-w-24 text-end">
            {{
              useToNumber(totalPrice?.toFixed(2) || 0).value.toLocaleString(
                locale
              )
            }}&nbsp;{{ t("$.czk") }}
          </p>
        </td>
      </tr>
    </template>
  </UTable>

  <div v-if="config" class="sm:hidden">
    <div
      v-for="cart in carts"
      :key="cart.wine?._id"
      class="flex flex-col md:flex-row items-center justify-between text-gray-500 px-4 pt-2 pb-4 rounded-lg shadow space-x-0 md:space-x-4 space-y-4 md:space-y-0 dark:border dark:border-gray-700"
    >
      <NuxtLink
        :to="
          localePath(
            `${routes.wine?.path}/${cart.wine?.name}--$${cart.wine?._id}`
          )
        "
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
        <h3 class="font-semibold">{{ cart.wine?.name }}</h3>
      </NuxtLink>

      <!-- Parametry vína s ikonami ve dvou řádcích -->
      <CmpWineIconAttrs :wine="cart.wine" :fields="config.fields" />

      <div class="flex items-center justify-between space-x-4 sm:space-x-12">
        <div class="w-full text-center font-semibold flex gap-2">
          <p>{{ t("$.form.quantity") }}:</p>
          <p>
            {{
              useToNumber(cart.quantity?.toFixed(2) || 0).value.toLocaleString(
                locale
              )
            }}
          </p>
        </div>
        <div class="w-full text-center font-semibold flex gap-2">
          <p>{{ t("$.form.price") }}:</p>
          <p>
            {{
              useToNumber(
                cart.totalPrice?.toFixed(2) || 0
              ).value.toLocaleString(locale)
            }}&nbsp;{{ t("$.czk") }}
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
          {{ t("$.cashdesk.billing_address") }}
        </h3>
      </template>

      <div class="flex flex-col gap-y-1">
        <h4 class="font-semibold">
          {{ user.email }}
        </h4>

        <p class="text-gray-600 dark:text-white">
          {{ user?.givenName }}&nbsp;{{ user?.surname }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ user.address?.main?.street }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ user.address?.main?.city }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ user.address?.main?.zip }}
        </p>
      </div>
    </UCard>

    <UCard variant="subtle">
      <template #header>
        <h3
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
        >
          {{ t("$.delivery.title") }}
        </h3>
      </template>

      <div class="flex flex-col gap-y-1">
        <h4 class="font-semibold">
          {{ t(`$.delivery.${delivery.type}`) }}
        </h4>

        <p class="text-gray-600 dark:text-white">
          {{ delivery.address?.name }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ delivery.address?.street }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ delivery.address?.city }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ delivery.address?.zip }}
        </p>

        <UAlert
          v-if="delivery?.type === 'free'"
          :description="t('$.delivery.brno_free')"
          color="info"
          variant="outline"
        />
      </div>
    </UCard>

    <UCard variant="subtle">
      <template #header>
        <h3
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
        >
          {{ t("$.payment.title") }}
        </h3>
      </template>

      <div class="flex flex-col gap-y-1">
        <h4 class="font-semibold">{{ t(`$.payment.${payment.type}`) }}</h4>

        <div v-if="payment.type === 'bank'">
          <div>
            <h3 class="font-semibold text-gray-700 dark:text-white">
              {{ t("$.payment.account_num") }}:
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
              {{ t("$.payment.variable_sym") }}:
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
