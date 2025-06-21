<script setup lang="ts">
import { useToNumber } from "@vueuse/core";

import type { ICart } from "@/modules/eshop-module/runtime/types/order.interface";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";
import type { IFormField } from "~/modules/form-module/runtime/types";

const props = defineProps<{
  fields: IFormField[];
  wine?: IWine;
}>();

const {
  i18n: { locale },
} = useLang();
const cashdesk = useCashdeskStore();
const modal = ref(false);
const cart = ref<ICart>();

function addToCashdesk() {
  if (props.wine?.data) {
    cart.value = cashdesk.addItem(props.wine.data, 1);
    modal.value = true;
  }
}
</script>

<template>
  <div v-if="wine" :id="wine._id">
    <UCard class="zoom-in">
      <template #header>
        <NuxtImg
          :src="wine.image?.main?.src || '/img/bottle.jpg'"
          :alt="'wine'"
          loading="lazy"
          format="webp"
          height="300"
          class="mx-auto"
        />
      </template>

      <NuxtLink :to="wine.gen_data?.url">
        <h3
          class="text-lg lg:text-xl font-bold pb-4 text-primary-600 dark:text-primary-400"
        >
          {{ wine.name }}
        </h3>
      </NuxtLink>

      <template #footer>
        <div class="flex justify-between items-center">
          <div class="font-bold lg:text-lg text-gray-600 dark:text-white">
            {{
              $tt(fields?.find((field) => field.name === "price")?.label!)
            }}:&nbsp;{{
              useToNumber(wine?.price?.toFixed(2) || 0).value.toLocaleString(
                locale
              )
            }}&nbsp;{{ $tt("$.czk") }}
          </div>
          <UButton
            icon="i-heroicons-pencil-square"
            color="secondary"
            class="lg:text-lg dark:text-white"
            @click="addToCashdesk"
          >
            {{ $tt("$.wine.to_cart") }}
          </UButton>
        </div>
      </template>
    </UCard>

    <UModal
      v-model:open="modal"
      :title="$tt('$.cashdesk.cart.added')"
      close-icon="i-heroicons-x-mark"
    >
      <template #body>
        <h3
          class="font-medium text-xl lg:text-2xl text-gray-700 dark:text-primary-400"
        >
          {{ cart?.wine?.name }}
        </h3>
        <div class="mt-6 flex flex-col gap-2">
          <div>
            {{ $tt("$.form.price") }}:&nbsp;{{
              useToNumber(
                cart?.totalPrice?.toFixed(2) || 0
              ).value.toLocaleString(locale)
            }}&nbsp;{{ $tt("$.czk") }}
          </div>
          <div>
            {{ $tt("$.form.quantity") }}:&nbsp;{{
              useToNumber(cart?.quantity || 1).value.toLocaleString(locale)
            }}&nbsp;{{ $tt("$.pcs") }}
          </div>
          <div>
            {{ $tt("$.cashdesk.cart.total") }}:&nbsp;{{
              useToNumber(
                cashdesk?.totalPrice?.toFixed(2) || 0
              ).value.toLocaleString(locale)
            }}&nbsp;{{ $tt("$.czk") }}
          </div>
        </div>
        <UAlert
          icon="i-heroicons-truck"
          :title="$tt('$.cashdesk.delivery.limit_free')"
          color="info"
          class="mt-5"
        />
      </template>
    </UModal>
  </div>
</template>
