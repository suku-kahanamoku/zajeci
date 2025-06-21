<script setup lang="ts">
import { useToNumber } from "@vueuse/core";

import type { ICart } from "@/modules/eshop-module/runtime/types/order.interface";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";
import type {
  IFormField,
  IFormFieldOption,
} from "~/modules/form-module/runtime/types";

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
  if (props.wine) {
    cart.value = cashdesk.addItem(props.wine, 1);
    modal.value = true;
  }
}
</script>

<template>
  <div v-if="wine" :id="wine._id">
    <div class="w-full px-5 py-24 mx-auto">
      <div class="mx-auto flex flex-wrap w-full">
        <NuxtImg
          :src="wine.image?.main?.src || '/img/bottle.jpg'"
          :alt="'wine'"
          loading="lazy"
          format="webp"
          height="500"
          class="mx-auto"
        />
        <div class="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
          <h1
            class="text-3xl title-font font-medium mb-1 text-primary-600 dark:text-primary-400"
          >
            {{ wine.name }}
          </h1>
          <div class="flex mb-4">
            <span class="flex items-center">
              <NuxtRating
                :read-only="false"
                :ratingValue="4.5"
                rating-size="30px"
                class="w-36"
              />
            </span>
            <span class="flex ml-3 pl-3 py-2 border-l-2 border-gray-200">
              <UButton variant="ghost">
                <Icon name="logos:facebook" size="20" />
              </UButton>
              <UButton variant="ghost">
                <Icon name="logos:twitter" size="20" />
              </UButton>
              <UButton variant="ghost">
                <Icon name="mdi:chat-processing-outline" size="20" />
              </UButton>
            </span>
          </div>
          <p class="text-lg leading-relaxed dark:text-white">
            {{ wine.description }}
          </p>
          <div class="leading-relaxed mt-4">
            <p class="text-gray-600 dark:text-white">
              {{ $tt(fields?.find((field) => field.name === "kind")?.label!) }}:
              {{
                fields
                  ?.find((field) => field.name === "kind")
                  ?.options?.find(
                    (option: IFormFieldOption) => option.value === wine?.kind
                  )?.label
              }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{
                $tt(fields?.find((field) => field.name === "color")?.label!)
              }}:
              {{
                fields
                  ?.find((field) => field.name === "color")
                  ?.options?.find(
                    (option: IFormFieldOption) => option.value === wine?.color
                  )?.label
              }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{
                $tt(fields?.find((field) => field.name === "quantity")?.label!)
              }}: {{ wine.quality }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{
                $tt(fields?.find((field) => field.name === "variety")?.label!)
              }}: {{ wine.variety }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{
                $tt(fields?.find((field) => field.name === "volume")?.label!)
              }}: {{ wine.volume }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{ $tt(fields?.find((field) => field.name === "year")?.label!) }}:
              {{ wine.year }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{
                $tt(fields?.find((field) => field.name === "quantity")?.label!)
              }}: {{ wine.quantity }}
            </p>
          </div>
          <USeparator class="my-4" />
          <div class="flex items-center justify-between">
            <span class="font-bold text-2xl text-gray-600 dark:text-white">
              {{
                useToNumber(wine.price?.toFixed(2) || 0).value.toLocaleString(
                  locale
                )
              }}&nbsp;{{ $tt("$.czk") }}
            </span>
            <div>
              <UButton
                icon="i-heroicons-pencil-square"
                color="secondary"
                class="lg:text-lg dark:text-white"
                @click="addToCashdesk"
              >
                {{ $tt("$.wine.to_cart") }}
              </UButton>
              <UButton icon="i-heroicons-heart" class="ml-4" size="lg" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <CmpCartDialog v-model="modal" :cart="cart" />
  </div>
</template>
