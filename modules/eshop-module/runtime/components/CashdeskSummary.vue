<script setup lang="ts">
import { useToNumber } from "@vueuse/core";
import type { TableColumn } from "@nuxt/ui";
import { useUrlResolver } from "#imports";

import { CLONE } from "@suku-kahanamoku/common-module/utils";
import type { IFormConfig } from "@suku-kahanamoku/form-module/types";

import cConfig from "../assets/configs/cart.json";

const { t } = useLang();
const {
  i18n: { locale },
} = useLang();
const localePath = useLocalePath();
const { routes, route } = useMenuItems();
const { updateConfig } = useUrlResolver();
const { carts, user, shipping, payment, totalPrice } = useCashdesk();

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
  { watch: [() => route.query] },
);

// Columns
const headerClass: any = {
  quantity: "text-center",
  price: "text-right",
  vat: "text-right",
  total_price: "text-right",
};
const columns: Ref<TableColumn<any>[]> = computed(
  () =>
    config?.value?.fields
      ?.filter((f) =>
        ["name", "quantity", "price", "vat", "total_price"].includes(f.name),
      )
      ?.map((f) => ({
        accessorKey: f.name,
        header: ({ table }: any) =>
          h("div", {
            innerHTML: t(f.label!),
            class: headerClass[f.name],
          }),
      })) ?? [],
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
      <div class="flex gap-3 items-center">
        <UiImage
          :src="
            row.original?.wine?.files?.[0]
              ? `/api/${row.original.wine.files[0].path}`
              : undefined
          "
          :alt="row.original?.wine?.name || 'wine'"
          class="object-cover rounded-lg w-16"
        />

        <div class="w-full flex flex-col gap-2">
          <NuxtLink
            :to="
              localePath(
                `${routes.wine?.path}/${row.original?.wine?.name}--$${row.original?.wine?.id}`,
              )
            "
            class="flex items-center"
          >
            <h3 class="font-semibold text-pretty">
              {{ row.original?.wine?.name }}
            </h3>
          </NuxtLink>

          <CmpWineIconAttrs
            :wine="row.original?.wine"
            :fields="config.fields.filter((f) => f.iconName)"
            item-class="md:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      </div>
    </template>

    <template #quantity-cell="{ row }">
      <div class="w-full text-end">
        <UBadge class="font-semibold">
          {{
            useToNumber(
              row.original?.quantity?.toFixed(2) || 0,
            ).value.toLocaleString(locale)
          }}
        </UBadge>
      </div>
    </template>

    <template #price-cell="{ row }">
      <p class="font-semibold text-end w-full">
        <UiPrice :price="row.original?.total_price" :showOldPrice="false" />
      </p>
    </template>

    <template #vat-cell="{ row }">
      <p class="font-semibold text-end w-full">
        {{
          row.original?.wine?.vat_rate != null
            ? `${row.original.wine.vat_rate} %`
            : "–"
        }}
      </p>
    </template>

    <template #total_price-cell="{ row }">
      <p class="font-semibold text-end w-full">
        <UiPrice
          :price="
            row.original?.total_price_with_vat ?? row.original?.total_price!
          "
          :showOldPrice="false"
        />
      </p>
    </template>

    <template #body-bottom>
      <tr>
        <td colspan="4" class="p-4">
          <h3 class="font-semibold text-pretty">
            {{ t("$.shipping.title") }}
          </h3>
        </td>
        <td class="p-4">
          <div
            class="text-end font-bold text-secondary-600 dark:text-secondary-400"
          >
            {{
              shipping.price! > 0
                ? `${Number(shipping.price).toLocaleString(locale)} ${t("$.czk")}`
                : t("$.shipping.free")
            }}
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="99" class="p-4">
          <p class="font-semibold min-w-24 text-end">
            <UiPrice :price="totalPrice" :showOldPrice="false" />
          </p>
        </td>
      </tr>
    </template>
  </UTable>

  <div v-if="config" class="sm:hidden flex flex-col gap-4">
    <div
      v-for="cart in carts"
      :key="cart.wine?.id"
      class="flex flex-col items-center justify-between text-gray-900 dark:text-gray-100 px-4 pt-4 pb-4 rounded-lg shadow space-y-4 dark:border dark:border-gray-700"
    >
      <div class="flex gap-3 items-center w-full">
        <NuxtLink
          :to="
            localePath(
              `${routes.wine?.path}/${cart.wine?.name}--$${cart.wine?.id}`,
            )
          "
        >
          <UiImage
            :src="
              cart.wine?.files?.[0]
                ? `/api/${cart.wine.files[0].path}`
                : undefined
            "
            :alt="cart.wine?.name || 'wine'"
            class="object-cover rounded-lg w-16"
          />
        </NuxtLink>

        <div class="flex flex-col flex-1 min-w-0">
          <h3 class="font-semibold">{{ cart.wine?.name }}</h3>
          <CmpWineIconAttrs
            :wine="cart.wine"
            :fields="config.fields"
            item-class="sm:grid-cols-1 md:grid-cols-3"
          />
        </div>
      </div>

      <div class="flex items-center justify-between gap-4 w-full">
        <div class="font-semibold flex gap-2">
          <p>{{ t("$.form.quantity") }}:</p>
          <p>
            {{
              useToNumber(cart.quantity?.toFixed(2) || 0).value.toLocaleString(
                locale,
              )
            }}
          </p>
        </div>
        <div class="flex flex-col gap-1 text-sm">
          <p class="font-semibold flex gap-2">
            <span>{{ t("$.form.price_without_vat") }}:</span>
            <UiPrice :price="cart?.total_price" :showOldPrice="false" />
          </p>
          <p
            v-if="cart?.wine?.vat_rate != null"
            class="text-gray-500 dark:text-gray-400 flex gap-2"
          >
            <span>{{ t("$.form.vat") }}:</span>
            <span>{{ cart.wine.vat_rate }} %</span>
          </p>
          <p class="font-bold flex gap-2">
            <span>{{ t("$.form.price_with_vat") }}:</span>
            <UiPrice
              :price="cart.total_price_with_vat ?? cart.total_price"
              :showOldPrice="false"
            />
          </p>
        </div>
      </div>
    </div>

    <!-- Doprava a celková cena -->
    <div class="flex items-center justify-between gap-4 px-4 font-semibold">
      <p>{{ t("$.shipping.title") }}:</p>
      <p class="text-secondary-600 dark:text-secondary-400 font-bold">
        {{
          shipping.price! > 0
            ? `${Number(shipping.price).toLocaleString(locale)} ${t("$.czk")}`
            : t("$.shipping.free")
        }}
      </p>
    </div>
    <div
      class="flex items-center justify-between gap-4 px-4 pb-4 font-semibold"
    >
      <p>{{ t("$.order.total_price") }}:</p>
      <p>
        <UiPrice :price="totalPrice" :showOldPrice="false" />
      </p>
    </div>
  </div>

  <div class="grid gap-4 my-8 md:grid-cols-2 lg:grid-cols-3">
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
          {{ (user as any)?.first_name }}&nbsp;{{ (user as any)?.last_name }}
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
          {{ t("$.shipping.title") }}
        </h3>
      </template>

      <div class="flex flex-col gap-y-1">
        <h4 class="font-semibold">
          {{ shipping.label }}
        </h4>

        <p class="text-gray-600 dark:text-white">
          {{ user.address?.shipping?.name }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ user.address?.shipping?.street }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ user.address?.shipping?.city }}
        </p>

        <p class="text-gray-600 dark:text-white">
          {{ user.address?.shipping?.zip }}
        </p>

        <UAlert
          v-if="shipping?.value === 'free'"
          :description="t('$.shipping.brno_free')"
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
        <h4 class="font-semibold">{{ payment.label }}</h4>

        <div v-if="payment.value === 'bank'">
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
