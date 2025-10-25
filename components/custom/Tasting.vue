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
  <div id="tasting" class="lg:py-12">
    <div class="text-center pb-8 lg:pb-10">
      <h2
        class="text-4xl  font-bold tracking-tight text-primary-600 dark:text-primary-400"
      >
        {{ $tt("$.tasting.title") }}
      </h2>
    </div>

    <div
      class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 py-4 items-stretch"
    >
      <TasteCard
        v-for="(item, index) of tasting"
        :item="item"
        :class="{ 'sm:col-span-2 md:col-auto': index === 2 }"
      />
    </div>
  </div>
</template>
