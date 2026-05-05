<script setup lang="ts">
import type { IFormField } from "@suku-kahanamoku/form-module/types";

import type { ICart } from "@/modules/eshop-module/runtime/types/order.interface";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";

const props = defineProps<{
  fields: IFormField[];
  wine?: IWine;
}>();

const {
  i18n: { locale },
  t,
} = useLang();
const { getSelectLabel } = useField();
const { addItem } = useCashdesk();
const modal = ref(false);
const cart = ref<ICart>();

useHead({
  title: props.wine?.name,
  meta: [
    {
      name: "description",
      content: props.wine?.description || t("$.base.description"),
    },
    {
      name: "keywords",
      content: props.wine?.description || t("$.base.description"),
    },
  ],
});

function addToCashdesk() {
  if (props.wine) {
    cart.value = addItem(props.wine, 1);
    modal.value = true;
  }
}
</script>

<template>
  <div v-if="wine" :id="String(wine.id)">
    <div class="w-full flex flex-wrap mx-auto px-5">
      <NuxtImg
        :src="wine.image?.main?.src || '/img/bottle.jpg'"
        :alt="'wine'"
        loading="lazy"
        format="webp"
        sizes="300px md:500px"
        class="mx-auto h-[300px] md:h-[500px]"
      />
      <div
        class="flex flex-col lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0 gap-3"
      >
        <h1 class="font-serif text-3xl md:text-4xl font-bold text-primary-700 dark:text-primary-300 leading-tight">
          {{ wine.name }}
        </h1>
        <div class="flex mb-4">
          <span class="flex items-center">
            <NuxtRating
              :read-only="false"
              :ratingValue="4.5"
              rating-size="30px"
            />
          </span>
          <span class="flex ml-3 pl-3 py-2 border-l-2 border-gray-200">
            <UButton variant="ghost">
              <UIcon name="logos:facebook" size="20" />
            </UButton>
            <UButton variant="ghost">
              <UIcon name="logos:twitter" size="20" />
            </UButton>
            <UButton variant="ghost">
              <UIcon name="mdi:chat-processing-outline" size="20" />
            </UButton>
          </span>
        </div>
        <p class="leading-relaxed dark:text-white">
          {{ wine.description }}
        </p>
        <!-- Moderní badge styl pro atributy vína, roztažené bloky -->
        <div class="flex flex-wrap gap-3 mt-4 w-full">
          <div
            v-if="wine.kind"
            class="flex flex-col items-center bg-primary-50 dark:bg-primary-900/30 rounded-xl px-3 py-2 flex-1 min-w-[120px]"
          >
            <UIcon
              name="i-heroicons-tag"
              class="text-primary-500 mb-1"
              size="20"
            />
            <span class="text-xs text-gray-500 dark:text-gray-300">
              {{
                $tt(
                  fields?.find((field: IFormField) => field.name === "kind")
                    ?.label!
                )
              }}
            </span>
            <span class="font-semibold text-sm">
              {{ getSelectLabel(fields, "kind", wine.kind) }}
            </span>
          </div>
          <div
            v-if="wine.color"
            class="flex flex-col items-center bg-pink-50 dark:bg-pink-900/30 rounded-xl px-3 py-2 flex-1 min-w-[120px]"
          >
            <UIcon
              name="i-heroicons-paint-brush"
              class="text-pink-500 mb-1"
              size="20"
            />
            <span class="text-xs text-gray-500 dark:text-gray-300">
              {{
                $tt(
                  fields?.find((field: IFormField) => field.name === "color")
                    ?.label!
                )
              }}
            </span>
            <span class="font-semibold text-sm">
              {{ getSelectLabel(fields, "color", wine.color) }}
            </span>
          </div>
          <div
            v-if="wine.quality"
            class="flex flex-col items-center bg-yellow-50 dark:bg-yellow-900/30 rounded-xl px-3 py-2 flex-1 min-w-[120px]"
          >
            <UIcon
              name="i-heroicons-star"
              class="text-yellow-500 mb-1"
              size="20"
            />
            <span class="text-xs text-gray-500 dark:text-gray-300">
              {{
                $tt(
                  fields?.find((field: IFormField) => field.name === "quality")
                    ?.label!
                )
              }}
            </span>
            <span class="font-semibold text-sm">
              {{ getSelectLabel(fields, "quality", wine.quality) }}
            </span>
          </div>
          <div
            v-if="wine.variant"
            class="flex flex-col items-center bg-green-50 dark:bg-green-900/30 rounded-xl px-3 py-2 flex-1 min-w-[120px]"
          >
            <UIcon
              name="i-heroicons-sparkles"
              class="text-green-500 mb-1"
              size="20"
            />
            <span class="text-xs text-gray-500 dark:text-gray-300">
              {{
                $tt(
                  fields?.find((field: IFormField) => field.name === "variant")
                    ?.label!
                )
              }}
            </span>
            <span class="font-semibold text-sm"
              >{{ getSelectLabel(fields, "variant", wine.variant) }}
            </span>
          </div>
          <div
            v-if="wine.volume"
            class="flex flex-col items-center bg-blue-50 dark:bg-blue-900/30 rounded-xl px-3 py-2 flex-1 min-w-[120px]"
          >
            <UIcon
              name="i-heroicons-beaker"
              class="text-blue-500 mb-1"
              size="20"
            />
            <span class="text-xs text-gray-500 dark:text-gray-300">
              {{
                $tt(
                  fields?.find((field: IFormField) => field.name === "volume")
                    ?.label!
                )
              }}
            </span>
            <span class="font-semibold text-sm">{{ wine.volume }}</span>
          </div>
          <div
            v-if="wine.year"
            class="flex flex-col items-center bg-amber-50 dark:bg-amber-900/30 rounded-xl px-3 py-2 flex-1 min-w-[120px]"
          >
            <UIcon
              name="i-heroicons-calendar"
              class="text-amber-500 mb-1"
              size="20"
            />
            <span class="text-xs text-gray-500 dark:text-gray-300">
              {{
                $tt(
                  fields?.find((field: IFormField) => field.name === "year")
                    ?.label!
                )
              }}
            </span>
            <span class="font-semibold text-sm">{{ wine.year }}</span>
          </div>
          <div
            v-if="wine.stock_quantity"
            class="flex flex-col items-center bg-gray-100 dark:bg-gray-900/30 rounded-xl px-3 py-2 flex-1 min-w-[120px]"
          >
            <UIcon
              name="i-heroicons-archive-box"
              class="text-gray-500 mb-1"
              size="20"
            />
            <span class="text-xs text-gray-500 dark:text-gray-300">
              {{
                $tt(
                  fields?.find((field: IFormField) => field.name === "stock_quantity")
                    ?.label!
                )
              }}
            </span>
            <span class="font-semibold text-sm">{{ wine.stock_quantity }}</span>
          </div>
        </div>

        <USeparator class="my-4" />

        <div class="flex items-center justify-between pt-2">
          <div class="flex flex-col gap-0.5">
            <span class="text-xs text-gray-500 uppercase tracking-wide">
              {{ $tt(fields?.find((field) => field.name === "price")?.label!) }}
            </span>
            <span class="font-bold text-2xl">
              <UiPrice :price="wine.price" />
            </span>
          </div>
          <div class="flex gap-2">
            <UButton
              icon="i-heroicons-shopping-cart"
              color="secondary"
              variant="solid"
              size="lg"
              class="rounded-xl font-semibold"
              @click="addToCashdesk"
            >
              {{ $tt("$.wine.to_cart") }}
            </UButton>
            <UButton
              icon="i-heroicons-heart"
              size="lg"
              variant="outline"
              color="secondary"
              class="rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>

    <CmpCartDialog v-model="modal" :cart="cart" />
  </div>
</template>
