<script setup lang="ts">
import { useToNumber } from "@vueuse/core";

import { CLONE } from "@/modules/common-module/runtime/utils/modify-object.functions";
import type { ICart } from "@/modules/eshop-module/runtime/types/order.interface";

import wConfig from "../../assets/configs/wine-detail.json";
import type { IWineResponse } from "../../types";

definePageMeta({
  layout: "default",
  syscode: "wine_detail",
  title: "$.wine.detail.title",
});

const { t } = useLang();
const {
  i18n: { locale },
} = useLang();
const route = useRoute();
const { updateConfig } = useUrlResolver();
const { kinds, colors } = useWines();
const cashdesk = useCashdeskStore();
const modal = ref(false);
const cart = ref<ICart>();
const title = computed(() => t(route.meta.title as string));

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});

/**
 * Load config
 */
const { data: config } = await useAsyncData(
  async () => {
    try {
      const result = CLONE(wConfig);
      updateConfig(route, result);
      return result as typeof wConfig;
    } catch (error: any) {
      return {} as typeof wConfig;
    }
  },
  { watch: [() => route.query] }
);

/**
 * Load data
 */
const { data: wine } = await useAsyncData(
  async (): Promise<IWineResponse | undefined> => {
    if (config.value?.restUrl) {
      try {
        let url = useCompleteUrl(config.value?.restUrl, config.value);
        return await useApi(url);
      } catch (error: any) {
        console.error(error);
      }
    }
  },
  { watch: [route] }
);

function addToCashdesk() {
  if (wine.value?.data) {
    cart.value = cashdesk.addItem(wine.value.data, 1);
    modal.value = true;
  }
}
</script>

<template>
  <section
    v-if="config"
    class="max-w-screen-xl mx-auto text-gray-700 body-font overflow-hidden"
  >
    <div class="w-full px-5 py-24 mx-auto border">
      <div class="mx-auto flex flex-wrap w-full">
        <NuxtImg
          :src="wine?.data?.image?.main?.src || '/img/bottle.jpg'"
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
            {{ wine?.data?.name }}
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
            {{ wine?.data?.description }}
          </p>
          <div class="leading-relaxed mt-4">
            <p class="text-gray-600 dark:text-white">
              {{
                $tt(
                  config.fields?.find((field) => field.name === "kind")?.label!
                )
              }}:
              {{ kinds[wine?.data?.kind as string]?.label }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{
                $tt(
                  config.fields?.find((field) => field.name === "color")?.label!
                )
              }}:
              {{ colors[wine?.data?.color as string]?.label }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{
                $tt(
                  config.fields?.find((field) => field.name === "quantity")
                    ?.label!
                )
              }}: {{ wine?.data?.quality }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{
                $tt(
                  config.fields?.find((field) => field.name === "variety")
                    ?.label!
                )
              }}: {{ wine?.data?.variety }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{
                $tt(
                  config.fields?.find((field) => field.name === "volume")
                    ?.label!
                )
              }}: {{ wine?.data?.volume }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{
                $tt(
                  config.fields?.find((field) => field.name === "year")?.label!
                )
              }}: {{ wine?.data?.year }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{
                $tt(
                  config.fields?.find((field) => field.name === "quantity")
                    ?.label!
                )
              }}: {{ wine?.data?.quantity }}
            </p>
          </div>
          <USeparator class="my-4" />
          <div class="flex items-center justify-between">
            <span class="font-bold text-2xl text-gray-600 dark:text-white">
              {{
                useToNumber(
                  wine?.data?.price?.toFixed(2) || 0
                ).value.toLocaleString(locale)
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

    <UModal v-model:open="modal">
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
  </section>
</template>
