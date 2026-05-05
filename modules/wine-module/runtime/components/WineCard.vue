<script setup lang="ts">
import type { IFormField } from "@suku-kahanamoku/form-module/types";

import type { ICart } from "@/modules/eshop-module/runtime/types/order.interface";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";

const props = defineProps<{
  fields: IFormField[];
  wine?: IWine;
}>();

const { getSelectLabel } = useField();
const { addItem } = useCashdesk();
const modal = ref(false);
const cart = ref<ICart>();

function addToCashdesk() {
  if (props.wine) {
    cart.value = addItem(props.wine, 1);
    modal.value = true;
  }
}
</script>

<template>
  <div v-if="wine" :id="String(wine.id)" class="zoom-in flex flex-col w-full max-w-72">
    <!-- Card -->
    <div class="group relative flex flex-col h-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300">

      <!-- Image area -->
      <NuxtLink :to="wine.gen_data?.url" class="relative block overflow-hidden bg-gray-50 dark:bg-gray-800">
        <NuxtImg
          :src="wine.image?.main?.src || '/img/bottle.jpg'"
          :alt="wine.name || 'wine'"
          loading="lazy"
          format="webp"
          sizes="200px md:300px"
          class="mx-auto h-[240px] md:h-[280px] object-contain transition-transform duration-500 group-hover:scale-105"
        />
        <!-- Color badge -->
        <div v-if="wine.color" class="absolute top-3 left-3">
          <span class="inline-block bg-white/90 dark:bg-gray-900/90 text-primary-600 dark:text-primary-300 text-xs font-semibold tracking-wide px-2 py-1 rounded-full shadow-sm">
            {{ getSelectLabel(fields, 'color', wine.color) }}
          </span>
        </div>
      </NuxtLink>

      <!-- Content -->
      <div class="flex flex-col flex-1 p-5 gap-3">
        <NuxtLink :to="wine.gen_data?.url">
          <h3 class="font-serif text-lg font-bold text-primary-700 dark:text-white leading-snug hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors">
            {{ wine.name }}
          </h3>
        </NuxtLink>

        <!-- Icon attrs -->
        <CmpWineIconAttrs :wine="wine" :fields="fields" class="flex-1" />

        <!-- Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {{ $tt(fields?.find((field) => field.name === "price")?.label!) }}
            </span>
            <span class="font-bold text-lg text-secondary-600 dark:text-secondary-400">
              <UiPrice :price="wine.price" />
            </span>
          </div>
          <UButton
            icon="i-heroicons-shopping-cart"
            color="secondary"
            variant="solid"
            size="sm"
            class="rounded-xl font-semibold"
            @click="addToCashdesk"
          >
            {{ $tt("$.wine.to_cart") }}
          </UButton>
        </div>
      </div>
    </div>

    <CmpCartDialog v-model="modal" :cart="cart" />
  </div>
</template>

