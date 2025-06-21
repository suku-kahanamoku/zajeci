<script setup lang="ts">
import wConfig from "../../assets/configs/wine-list.json";
import type { IWine } from "../../types";

definePageMeta({
  layout: "default",
  syscode: "wine",
  title: "$.wine.title",
});

const { t } = useLang();
const { routes, route } = useMenuItems();
const title = computed(() => t(route.meta.title as string));

const { config, wines, pending } = useWine(wConfig);

useHead({
  title,
  meta: [
    { name: "description", content: t("$.base.description") },
    { name: "keywords", content: t("$.base.description") },
  ],
});
</script>

<template>
  <div
    v-if="config"
    :id="config.syscode"
    class="max-w-screen-xl mx-auto px-5 w-full"
  >
    <div id="terms" class="py-10">
      <h1
        class="text-center text-primary-600 text-4xl lg:text-5xl font-bold tracking-tight dark:text-primary-400 pb-8"
      >
        {{ title }}
      </h1>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 py-4">
        <CmpWineCard
          v-for="wine of (wines?.data as IWine[])"
          :fields="config.fields"
          :wine="wine"
        />
      </div>
    </div>
  </div>
</template>
