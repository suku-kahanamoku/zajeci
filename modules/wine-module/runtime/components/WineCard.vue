<script setup lang="ts">
import { useToNumber } from "@vueuse/core";

import type { ICart } from "@/modules/eshop-module/runtime/types/order.interface";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";
import type { IFormField } from "@suku-kahanamoku/form-module/types";

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
  <div v-if="wine" :id="wine._id" class="zoom-in flex-1 flex min-w-80 max-w-96">
    <UCard
      variant="soft"
      class="w-full flex flex-col divide-none bg-transparent hover:shadow-lg dark:hover:shadow-xl"
      :ui="{
        footer: 'flex justify-between items-center mt-auto',
      }"
    >
      <template #header>
        <NuxtLink :to="wine.gen_data?.url">
          <NuxtImg
            :src="wine.image?.main?.src || '/img/bottle.jpg'"
            :alt="wine.name || 'wine'"
            loading="lazy"
            format="webp"
            sizes="200px md:300px"
            class="mx-auto h-[200px] md:h-[300px]"
          />
        </NuxtLink>
      </template>

      <template #default>
        <NuxtLink :to="wine.gen_data?.url">
          <h3
            class="text-center text-xl font-bold pb-6 text-primary-600 dark:text-white"
          >
            {{ wine.name }}
          </h3>
          <!-- Parametry vína s ikonami ve dvou řádcích -->
          <CmpWineIconAttrs :wine="wine" :fields="fields" />
        </NuxtLink>
      </template>

      <template #footer>
        <div class="flex flex-wrap font-bold text-gray-600 dark:text-white">
          {{
            $tt(fields?.find((field) => field.name === "price")?.label!)
          }}:&nbsp;<UiPrice :price="wine.price" :old-price="wine.oldPrice" />
        </div>
        <UButton
          icon="i-heroicons-pencil-square"
          color="secondary"
          class="dark:text-white"
          variant="outline"
          @click="addToCashdesk"
        >
          {{ $tt("$.wine.to_cart") }}
        </UButton>
      </template>
    </UCard>

    <CmpCartDialog v-model="modal" :cart="cart" />
  </div>
</template>
