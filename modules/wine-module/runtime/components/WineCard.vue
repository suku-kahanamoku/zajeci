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
const { t } = useLang();
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
    <UCard
      class="zoom-in h-full flex flex-col"
      :ui="{
        body: 'flex-1',
        footer: 'flex justify-between items-center mt-auto',
      }"
    >
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

      <template #default>
        <NuxtLink :to="wine.gen_data?.url">
          <h3
            class="text-center text-lg lg:text-xl font-bold pb-6 text-primary-600 dark:text-primary-400"
          >
            {{ wine.name }}
          </h3>
        </NuxtLink>
        <!-- Parametry vína s ikonami ve dvou řádcích -->
        <div class="space-y-1">
          <div
            class="flex flex-wrap gap-3 justify-between py-1 text-gray-700 dark:text-gray-200"
          >
            <span v-if="wine.color" class="flex items-center gap-1">
              <UIcon name="i-heroicons-paint-brush" class="text-pink-500" />
              <span>{{ getSelectLabel("color", wine.color) }}</span>
            </span>
            <span v-if="wine.kind" class="flex items-center gap-1">
              <UIcon name="i-heroicons-tag" class="text-primary-500" />
              <span>{{ getSelectLabel("kind", wine.kind) }}</span>
            </span>
            <span v-if="wine.year" class="flex items-center gap-1">
              <UIcon name="i-heroicons-calendar" class="text-amber-500" />
              <span>{{ wine.year }}</span>
            </span>
            <span v-if="wine.volume" class="flex items-center gap-1">
              <UIcon name="i-heroicons-beaker" class="text-blue-500" />
              <span>{{ wine.volume }}ml</span>
            </span>
          </div>
          <div
            class="flex flex-wrap gap-3 justify-between py-1 text-gray-700 dark:text-gray-200"
          >
            <span v-if="wine.variety" class="flex items-center gap-1">
              <UIcon name="i-heroicons-sparkles" class="text-green-500" />
              <span>{{ wine.variety }}</span>
            </span>
            <span v-if="wine.quality" class="flex items-center gap-1">
              <UIcon name="i-heroicons-star" class="text-yellow-500" />
              <span>{{ wine.quality }}</span>
            </span>
          </div>
        </div>
      </template>

      <template #footer>
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
      </template>
    </UCard>

    <CmpCartDialog v-model="modal" :cart="cart" />
  </div>
</template>
