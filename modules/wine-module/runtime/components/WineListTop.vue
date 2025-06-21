<script setup lang="ts">
import wConfig from "../assets/configs/wine-list-top.json";
import type { IWine } from "../types";

const { config, wines, pending } = useWine(wConfig);
</script>

<template>
  <div v-if="config" :id="config.syscode" class="py-10 lg:py-16">
    <div class="text-center pb-8 lg:pb-10">
      <h2
        class="text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400"
      >
        {{ $tt("$.wine.title") }}
      </h2>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 py-4">
      <CmpWineCard
        v-for="wine of wines?.data"
        :fields="config.fields"
        :wine="(wine as IWine)"
      />
    </div>
  </div>
</template>
