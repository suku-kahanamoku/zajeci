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
  t,
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

function getSelectLabel(
  fieldName: string,
  value: string | string[] | undefined
) {
  const field = props.fields.find((f) => f.name === fieldName);
  if (!field || field.type !== "select" || !field.options) return value;
  if (Array.isArray(value)) {
    return value
      .map((v) => {
        const opt = (field.options as IFormFieldOption[]).find(
          (o: IFormFieldOption) => o.value === v
        );
        return opt ? t(opt.label) : v;
      })
      .join(", ");
  } else {
    const opt = (field.options as IFormFieldOption[]).find(
      (o: IFormFieldOption) => o.value === value
    );
    return opt ? t(opt.label) : value;
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
        <div class="flex flex-col lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0 gap-3">
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
                  $tt(fields?.find((field) => field.name === "kind")?.label!)
                }}
              </span>
              <span class="font-semibold text-sm">
                {{ getSelectLabel("kind", wine.kind) }}
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
                  $tt(fields?.find((field) => field.name === "color")?.label!)
                }}
              </span>
              <span class="font-semibold text-sm">
                {{ getSelectLabel("color", wine.color) }}
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
                  $tt(fields?.find((field) => field.name === "quality")?.label!)
                }}
              </span>
              <span class="font-semibold text-sm">{{ wine.quality }}</span>
            </div>
            <div
              v-if="wine.variety"
              class="flex flex-col items-center bg-green-50 dark:bg-green-900/30 rounded-xl px-3 py-2 flex-1 min-w-[120px]"
            >
              <UIcon
                name="i-heroicons-sparkles"
                class="text-green-500 mb-1"
                size="20"
              />
              <span class="text-xs text-gray-500 dark:text-gray-300">
                {{
                  $tt(fields?.find((field) => field.name === "variety")?.label!)
                }}
              </span>
              <span class="font-semibold text-sm">{{ wine.variety }}</span>
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
                  $tt(fields?.find((field) => field.name === "volume")?.label!)
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
                  $tt(fields?.find((field) => field.name === "year")?.label!)
                }}
              </span>
              <span class="font-semibold text-sm">{{ wine.year }}</span>
            </div>
            <div
              v-if="wine.quantity"
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
                    fields?.find((field) => field.name === "quantity")?.label!
                  )
                }}
              </span>
              <span class="font-semibold text-sm">{{ wine.quantity }}</span>
            </div>
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
