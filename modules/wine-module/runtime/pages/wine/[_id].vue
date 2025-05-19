<script setup lang="ts">
import { useToNumber } from "@vueuse/core";

import type { ICart } from "@/server/types/order.type";
import type { IWine } from "~/modules/wine-module/runtime/types/wine.interface";

definePageMeta({
  layout: "default",
  syscode: "wine_detail",
  title: "$.wine.detail.title",
});

const { $tt } = useNuxtApp();
const {
  i18n: { locale },
} = useLang();

useHead({
  title: `${$tt("$.base.title")} | ${$tt("$.forgot_password.title")}`,
  meta: [
    { name: "description", content: $tt("$.base.description") },
    { name: "keywords", content: $tt("$.base.description") },
  ],
});

const route = useRoute();
const { fields, kinds, colors } = useWines();
const cashdesk = useCashdeskStore();
const modal = ref(false);
const cart = ref<ICart>();

const { data: wine, pending } = await useAsyncData(
  async (): Promise<IWine | undefined> => {
    try {
      return await $fetch(`/api/wine/${route.params._id}`);
    } catch (error: any) {
      console.error(error);
    }
  }
);

function addToCashdesk() {
  if (wine.value) {
    cart.value = cashdesk.addItem(wine.value, 1);
    modal.value = true;
  }
}
</script>

<template>
  <section
    class="max-w-screen-xl mx-auto text-gray-700 body-font overflow-hidden"
  >
    <div class="px-5 py-24 mx-auto">
      <div class="mx-auto flex flex-wrap w-full">
        <NuxtImg
          :src="wine?.image?.main?.src || '/img/bottle.jpg'"
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
            {{ wine?.name }}
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
            {{ wine?.description }}
          </p>
          <div class="leading-relaxed mt-4">
            <p class="text-gray-600 dark:text-white">
              {{ fields.kind.label }}: {{ kinds[wine?.kind as string]?.label }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{ fields.color.label }}:
              {{ colors[wine?.color as string]?.label }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{ fields.quality.label }}: {{ wine?.quality }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{ fields.variety.label }}: {{ wine?.variety }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{ fields.volume.label }}: {{ wine?.volume }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{ fields.year.label }}: {{ wine?.year }}
            </p>
            <p class="text-gray-600 dark:text-white">
              {{ fields.quantity.label }}: {{ wine?.quantity }}
            </p>
          </div>
          <USeparator class="my-4" />
          <div class="flex items-center justify-between">
            <span class="font-bold text-2xl text-gray-600 dark:text-white">
              {{
                useToNumber(wine?.price?.toFixed(2) || 0).value.toLocaleString(
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

    <UiModalCart v-model="modal">
      <div>
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
      </div>
    </UiModalCart>
  </section>
</template>
