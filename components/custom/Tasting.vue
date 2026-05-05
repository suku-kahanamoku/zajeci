<script setup lang="ts">
import TasteCard from "./TasteCard.vue";

const tasting = [
  {
    name: "$.tasting.basic.title",
    price: {
      value: "250 Kč / osoba",
    },
    popular: false,
    features: [
      { label: "$.tasting.basic.drink", icon: "ph:wine-duotone" },
      { label: "$.tasting.basic.food", icon: "icon-park-outline:bread" },
      { label: "$.tasting.basic.time", icon: "ion:hourglass-outline" },
    ],
  },
  {
    name: "$.tasting.standard.title",
    price: {
      value: "500 Kč / osoba",
    },
    popular: true,
    features: [
      { label: "$.tasting.standard.drink", icon: "ph:wine-duotone" },
      { label: "$.tasting.standard.food", icon: "icon-park-outline:bread" },
      { label: "$.tasting.standard.time", icon: "ion:hourglass-outline" },
    ],
  },
  {
    name: "$.tasting.premium.title",
    price: {
      value: "900 Kč / osoba",
    },
    popular: false,
    features: [
      { label: "$.tasting.premium.drink", icon: "ph:wine-duotone" },
      { label: "$.tasting.premium.food", icon: "icon-park-outline:bread" },
      { label: "$.tasting.premium.time", icon: "ion:hourglass-outline" },
    ],
  },
];
</script>

<template>
  <div id="tasting">
    <div class="text-center pt-20 pb-8">
      <p class="text-xs font-semibold tracking-[0.25em] uppercase text-secondary-500 dark:text-secondary-400 mb-3">
        {{ $tt("$.tasting.eyebrow") || "Zažijte nás naživo" }}
      </p>
      <h2 class="font-serif text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-300 mb-6">
        {{ $tt("$.tasting.title") }}
      </h2>
      <div class="section-divider text-primary-300 dark:text-primary-600 w-full mt-6 mb-2">
        <UIcon name="ph:wine-duotone" size="16" />
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-4 items-stretch">
      <TasteCard v-for="(item, index) of tasting" :item="item" />
    </div>
  </div>
</template>
