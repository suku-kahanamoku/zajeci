<script setup lang="ts">
import type { ITaste } from "@/types/taste.interface";

const props = defineProps<{
  item: ITaste;
}>();
</script>

<template>
  <UCard
    variant="solid"
    class="zoom-in flex-1 min-w-80 divide-none bg-transparent hover:shadow-lg dark:hover:shadow-xl"
  >
    <template #header>
      <div class="text-center space-y-2">
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $tt(item.name) }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          {{
            item.price && typeof item.price === "object"
              ? item.price.value
              : item.price
          }}
        </p>
      </div>
    </template>

    <ul class="grid text-left gap-4">
      <li
        v-for="feature of item.features"
        class="flex items-center gap-3 text-primary-600 dark:text-white"
      >
        <div>
          <Icon class="text-secondary-400" :name="feature.icon" size="32" />
        </div>
        <div>
          {{ $tt(feature.label) }}
        </div>
      </li>
    </ul>
  </UCard>
</template>
