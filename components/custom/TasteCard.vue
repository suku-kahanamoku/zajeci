<script setup lang="ts">
import type { ITaste } from "@/types/taste.interface";

const props = defineProps<{
  item: ITaste;
}>();
</script>

<template>
  <UCard class="zoom-in">
    <template #header>
      <div class="text-center">
        <h3
          class="mt-3 text-2xl lg:text-3xl font-bold text-gray-900 dark:text-primary-300"
        >
          {{ $tt(item.name) }}
        </h3>
        <p class="mt-2 text-gray-600 dark:text-gray-300">
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
        class="flex items-center gap-3 text-gray-600 dark:text-white"
      >
        <div>
          <Icon class="text-secondary-400" :name="feature.icon" size="32" />
        </div>
        <div class="font-semibold lg:text-lg">
          {{ $tt(feature.label) }}
        </div>
      </li>
    </ul>
  </UCard>
</template>
