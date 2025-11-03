<script setup lang="ts">
import { useToNumber } from "@vueuse/core";
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
} = useCashdesk();
const isOpen = ref(false);
const deleted = ref();
const headerClass: any = {
  quantity: "text-center",
  price: "text-right",
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
  { watch: [() => route.query] }
);

// Columns
const columns: Ref<TableColumn<any>[]> = computed(
  () =>
    config?.value?.fields
      ?.filter((f) =>
        ["name", "quantity", "price", "total_price"].includes(f.name)
      )
      ?.map((f) => ({
        accessorKey: f.name,
        header: ({ table }) =>
          h("div", {
            innerHTML: t(f.label!),
            class: headerClass[f.name],
          }),
      })) ?? []
);

const increaseQuantity = (cart: ICart) => {
  addItem(cart.wine, 1);
};

const decreaseQuantity = (cart: ICart) => {
  if (cart.quantity > 1) {
    removeCartItem(cart.wine?._id);
  } else {
    openRemoveDialog(cart);
  }
};

const openRemoveDialog = (cart: ICart) => {
  deleted.value = cart;
  isOpen.value = true;
};

const handleSetQuantity = (value: number, cart: ICart) => {
  if (value > 0) {
    setCartQuantity(cart.wine?._id, value);
  } else {
    openRemoveDialog(cart);
  }
};
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
      <div class="flex items-center justify-between space-x-2 w-36 mx-auto">
        <UButton
          icon="i-heroicons-minus"
          @click="decreaseQuantity(row.original)"
        />
        <UInput
          :model-value="row.original?.quantity"
          type="number"
          :min="1"
          @change="handleSetQuantity(parseInt($event as any), row.original)"
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
        {{
          useToNumber(
            row.original?.unitPrice?.toFixed(2) || 0
          ).value.toLocaleString(locale)
        }}&nbsp;{{ t("$.czk") }}
      </p>
    </template>

    <template #total_price-cell="{ row }">
      <div class="flex justify-between items-center space-x-4">
        <p class="font-semibold text-end w-full">
          {{
            useToNumber(
              row.original?.totalPrice?.toFixed(2) || 0
            ).value.toLocaleString(locale)
          }}&nbsp;{{ t("$.czk") }}
        </p>
        <UButton
          icon="i-heroicons-trash"
          color="error"
          @click="openRemoveDialog(row.original)"
        />
      </div>
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
            `${routes.wine?.path}/${cart.wine?._id}--$${cart.wine?._id}`
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
        <div class="flex items-center justify-between space-x-2">
          <UButton icon="i-heroicons-minus" @click="decreaseQuantity(cart)" />
          <UInput
            :model-value="cart.quantity"
            type="number"
            :min="1"
            @change="handleSetQuantity(parseInt($event as any), cart)"
          />
          <UButton
            icon="i-heroicons-plus"
            color="success"
            @click="increaseQuantity(cart)"
          />
        </div>
        <div class="flex justify-between items-center space-x-4 sm:space-x-12">
          <p class="font-semibold text-end">
            {{
              useToNumber(
                cart?.totalPrice?.toFixed(2) || 0
              ).value.toLocaleString(locale)
            }}&nbsp;{{ t("$.czk") }}
          </p>
          <UButton
            icon="i-heroicons-trash"
            color="error"
            @click="openRemoveDialog(cart)"
          />
        </div>
      </div>
    </div>
  </div>

  <UAlert
    icon="i-heroicons-truck"
    :title="t('$.delivery.limit_free')"
    color="info"
    variant="outline"
    class="my-4"
  />

  <CmpConfirmDialog
    v-model="isOpen"
    :title="t('$.cart.remove_from_cart')"
    @confirm="$event && deleteCartItem(deleted?.wine?._id)"
  >
    {{ t("$.cart.remove", { name: deleted?.wine?.name }) }}
  </CmpConfirmDialog>
</template>
