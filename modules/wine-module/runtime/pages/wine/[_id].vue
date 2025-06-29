<script setup lang="ts">
import wConfig from "../../assets/configs/wine-detail.json";
import type { IWine } from "../../types";

definePageMeta({
  syscode: "wine_detail",
  title: "$.wine.detail.title",
});

const { config, wines: wine, pending } = useWine(wConfig);
</script>

<template>
  <section
    v-if="config"
    :id="config.syscode"
    class="max-w-screen-xl mx-auto text-gray-700 body-font overflow-hidden"
  >
    <CmpWineDetailCard
      v-if="wine?.data"
      :fields="config.fields"
      :wine="(wine?.data as IWine)"
    />
  </section>
</template>
