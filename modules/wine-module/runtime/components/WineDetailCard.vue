<script setup lang="ts">
import type { IFormField } from "@suku-kahanamoku/form-module/types";

import type { ICart } from "@/modules/eshop-module/runtime/types/order.interface";
import type { IWine } from "@/modules/wine-module/runtime/types/wine.interface";

const props = defineProps<{
  fields: IFormField[];
  wine?: IWine;
}>();

const { t } = useLang();
const { addItem } = useCashdesk();
const { routes } = useMenuItems();
const carousel = useTemplateRef("carousel");

const activeIndex = ref(0);
const modal = ref(false);
const cart = ref<ICart>();
const qty = ref(1);

const carouselItems = computed(() => {
  if (props.wine?.files?.length) {
    return props.wine.files.map((f) => `/api/${f.path}`);
  }
  return [props.wine?.image?.main?.src || "/img/bottle.jpg"];
});

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

function onSelect(index: number) {
  activeIndex.value = index;
}

function selectThumb(index: number) {
  activeIndex.value = index;
  carousel.value?.emblaApi?.scrollTo(index);
}

function addToCashdesk() {
  if (props.wine) {
    cart.value = addItem(props.wine, qty.value);
    modal.value = true;
  }
}
</script>

<template>
  <div
    v-if="wine"
    class="w-full flex flex-col max-w-7xl mx-auto px-4 md:px-8 py-10 gap-16"
  >
    <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
      <!-- LEFT: Image -->
      <div>
        <div
          class="rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
        >
          <UCarousel
            ref="carousel"
            v-slot="{ item }"
            :items="carouselItems"
            class="w-full"
            @select="onSelect"
          >
            <UiImage
              :src="item"
              :alt="wine.name || 'wine'"
              class="w-full h-60 sm:h-90 md:h-120 object-contain p-7 transition-transform duration-700 hover:scale-105"
            />
          </UCarousel>
        </div>

        <!-- Thumbnails -->
        <div
          v-if="carouselItems.length > 1"
          class="flex gap-2 justify-center pt-3 flex-wrap"
        >
          <div
            v-for="(src, index) in carouselItems"
            :key="index"
            class="size-16 sm:size-20 md:size-24 opacity-30 hover:opacity-100 transition-opacity cursor-pointer rounded-lg overflow-hidden border-2 border-transparent"
            :class="{ 'opacity-100 border-primary-500': activeIndex === index }"
            @click="selectThumb(index)"
          >
            <UiImage
              :src="src"
              :alt="`thumb-${index}`"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Color badge -->
        <div v-if="wine.color" class="absolute top-4 left-4">
          <span
            class="inline-block bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-300 text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full shadow-md border border-primary-100 dark:border-primary-800"
          >
            {{ t(`$.wine.color.${wine.color}`) || wine.color }}
          </span>
        </div>
      </div>

      <!-- RIGHT: Info -->
      <div class="flex flex-col gap-6">
        <!-- Title -->
        <h1
          class="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-primary-800 dark:text-white leading-tight"
        >
          {{ wine.name }}
        </h1>

        <!-- Divider -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-px bg-secondary-300 dark:bg-secondary-700"></div>
          <UIcon name="ph:wine-duotone" class="text-secondary-400" size="18" />
          <div class="w-10 h-px bg-secondary-300 dark:bg-secondary-700"></div>
        </div>

        <!-- Description -->
        <p
          v-if="wine.description"
          class="text-gray-600 dark:text-gray-300 leading-relaxed text-base"
        >
          {{ wine.description }}
        </p>

        <!-- Attributes via WineIconAttrs -->
        <div
          class="rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 p-5"
        >
          <CmpWineIconAttrs :wine="wine" :fields="fields" />
        </div>

        <USeparator />

        <!-- Price + quantity + cart -->
        <div class="flex flex-col gap-8">
          <div class="flex items-end justify-between">
            <div class="flex flex-col gap-0.5">
              <span
                class="font-bold text-3xl text-secondary-600 dark:text-secondary-400"
              >
                <UiPrice :price="wine.price" />
              </span>
            </div>
            <!-- Qty selector -->
            <div
              class="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                class="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                @click="qty = Math.max(1, qty - 1)"
              >
                <UIcon name="i-heroicons-minus" size="14" />
              </button>
              <span class="w-8 text-center font-semibold text-sm">{{
                qty
              }}</span>
              <button
                class="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                @click="qty++"
              >
                <UIcon name="i-heroicons-plus" size="14" />
              </button>
            </div>
          </div>

          <UButton
            icon="i-heroicons-shopping-cart"
            color="primary"
            variant="solid"
            size="xl"
            block
            class="rounded-2xl font-semibold text-lg py-2"
            :ui="{ leadingIcon: 'size-6' }"
            @click="addToCashdesk"
          >
            {{ $tt("$.wine.to_cart") }}
          </UButton>
        </div>
      </div>
    </div>

    <!-- Back link -->
    <NuxtLink
      :to="routes.wine?.path"
      class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 dark:hover:text-primary-500 transition-colors mb-8"
    >
      <UIcon name="i-heroicons-arrow-left" size="16" />
      {{ $tt("$.wine.title") }}
    </NuxtLink>

    <CmpCartDialog v-model="modal" :cart="cart" />
  </div>
</template>
