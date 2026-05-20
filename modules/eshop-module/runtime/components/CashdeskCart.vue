<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { useUrlResolver } from "#imports";

import type { ICart } from "@/modules/eshop-module/runtime/types/order.interface";
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
const {
  carts,
  addItem,
  removeItem: removeCartItem,
  setQuantity: setCartQuantity,
  deleteItem: deleteCartItem,
  shipping,
  shippingOptions,
  setShipping,
} = useCashdesk();
const isOpen = ref(false);
const deleted = ref();
const headerClass: any = {
  quantity: "text-center",
  price: "text-right",
  vat: "text-right",
  total_price: "text-right",
};

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
const columns: Ref<TableColumn<any>[]> = computed(() => [
  ...(config?.value?.fields
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
    })) ?? []),
  {
    accessorKey: "actions",
    header: () => h("div", ""),
  },
]);

const increaseQuantity = (cart: ICart) => {
  addItem(cart.wine, 1);
  setShipping(
    shippingOptions.value.find((d) => d.value === shipping.value.value),
  );
};

const decreaseQuantity = (cart: ICart) => {
  if (cart.quantity > 1) {
    removeCartItem(cart.wine?.id);
  } else {
    openRemoveDialog(cart);
  }
  setShipping(
    shippingOptions.value.find((d) => d.value === shipping.value.value),
  );
};

const openRemoveDialog = (cart: ICart) => {
  deleted.value = cart;
  setShipping(
    shippingOptions.value.find((d) => d.value === shipping.value.value),
  );
  isOpen.value = true;
};

const handleSetQuantity = (value: number, cart: ICart) => {
  if (!isNaN(value) && value > 0) {
    setCartQuantity(cart.wine?.id, value);
  } else if (!isNaN(value) && value <= 0) {
    openRemoveDialog(cart);
  }
  setShipping(
    shippingOptions.value.find((d) => d.value === shipping.value.value),
  );
};
</script>

<template>
  <UTable
    v-if="config && carts?.length"
    :columns="columns"
    :data="carts"
    class="hidden md:block text-gray-900 dark:text-gray-100"
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
            <h3
              class="font-semibold text-pretty text-gray-900 dark:text-gray-100"
            >
              {{ row.original?.wine?.name }}
            </h3>
          </NuxtLink>

          <!-- Parametry vína s ikonami ve dvou řádcích -->
          <CmpWineIconAttrs
            :wine="row.original?.wine"
            :fields="config.fields.filter((f) => f.iconName)"
            item-class="md:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      </div>
    </template>

    <template #quantity-cell="{ row }">
      <div class="flex items-center justify-between space-x-2 w-36 mx-auto">
        <UButton
          icon="i-heroicons-minus"
          @click="decreaseQuantity(row.original)"
        />
        <UInput
          :model-value="row.original?.quantity"
          type="number"
          :min="1"
          @change="
            handleSetQuantity(
              parseInt(
                ($event as InputEvent).target
                  ? (($event as InputEvent).target as HTMLInputElement).value
                  : String($event),
              ),
              row.original,
            )
          "
        />
        <UButton
          icon="i-heroicons-plus"
          color="success"
          @click="increaseQuantity(row.original)"
        />
      </div>
    </template>

    <template #price-cell="{ row }">
      <p class="font-semibold text-end w-full">
        <UiPrice :price="row.original?.total_price" :showOldPrice="false" />
      </p>
    </template>

    <template #vat-cell="{ row }">
      <p class="font-semibold text-end w-full text-gray-900 dark:text-gray-100">
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
          :price="row.original?.total_price_with_vat"
          :showOldPrice="false"
        />
      </p>
    </template>

    <template #actions-cell="{ row }">
      <div class="flex justify-end">
        <UButton
          icon="i-heroicons-trash"
          color="error"
          @click="openRemoveDialog(row.original)"
        />
      </div>
    </template>
  </UTable>

  <div v-if="config" class="md:hidden flex flex-col gap-4">
    <div
      v-for="cart in carts"
      :key="cart.wine?.id"
      class="flex flex-col items-center justify-between text-gray-900 dark:text-gray-100 px-4 pt-4 pb-4 rounded-lg shadow space-x-0 md:space-x-4 space-y-4 md:space-y-0 dark:border dark:border-gray-700"
    >
      <div class="w-full flex flex-row items-center gap-4">
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
            :fields="config.fields.filter((f) => f.iconName)"
          />
        </div>
      </div>

      <div class="w-full flex items-center justify-between space-x-4">
        <div class="flex items-center justify-between space-x-2">
          <UButton icon="i-heroicons-minus" @click="decreaseQuantity(cart)" />
          <UInput
            :model-value="cart.quantity"
            type="number"
            :min="1"
            @change="
              handleSetQuantity(
                parseInt(
                  ($event as InputEvent).target
                    ? (($event as InputEvent).target as HTMLInputElement).value
                    : String($event),
                ),
                cart,
              )
            "
          />
          <UButton
            icon="i-heroicons-plus"
            color="success"
            @click="increaseQuantity(cart)"
          />
        </div>
        <div class="grid grid-cols-[3fr_1fr]">
          <div class="w-full flex flex-col gap-1 text-sm">
            <p class="font-semibold">
              {{ t("$.form.price_without_vat") }}:
              <UiPrice :price="cart?.total_price" :showOldPrice="false" />
            </p>
            <p
              v-if="cart?.wine?.vat_rate != null"
              class="text-gray-500 dark:text-gray-400"
            >
              {{ t("$.form.vat") }}: {{ cart.wine.vat_rate }} %
            </p>
            <p class="font-bold">
              {{ t("$.form.price_with_vat") }}:
              <UiPrice
                :price="cart?.total_price_with_vat ?? cart?.total_price!"
                :showOldPrice="false"
              />
            </p>
          </div>
          <div class="flex justify-end items-center">
            <UButton
              icon="i-heroicons-trash"
              color="error"
              @click="openRemoveDialog(cart)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <UAlert
    icon="i-heroicons-truck"
    :title="t('$.shipping.limit_free')"
    color="info"
    variant="outline"
    class="my-4"
  />

  <CmpConfirmDialog
    v-model="isOpen"
    :title="t('$.cart.remove_from_cart')"
    @confirm="$event && deleteCartItem(deleted?.wine?.id)"
  >
    {{ t("$.cart.remove", { name: deleted?.wine?.name }) }}
  </CmpConfirmDialog>
</template>
