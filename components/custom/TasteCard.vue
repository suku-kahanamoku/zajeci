<script setup lang="ts">
import type { ITaste } from "@/types/taste.interface";

const props = defineProps<{
  item: ITaste;
}>();
</script>

<template>
  <div
    class="zoom-in w-full md:flex-1 md:min-w-72 md:max-w-sm rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:border-secondary-300 dark:hover:border-secondary-600 transition-all duration-300 overflow-hidden"
  >
    <!-- Accent bar -->
    <div class="h-1 bg-gradient-to-r from-secondary-400 to-secondary-600"></div>

    <div class="p-8 text-center space-y-2 border-b border-gray-100 dark:border-gray-800">
      <h3 class="font-serif text-2xl font-bold text-gray-900 dark:text-white">
        {{ $tt(item.name) }}
      </h3>
      <p class="text-secondary-600 dark:text-secondary-400 font-semibold text-lg">
        {{
          item.price && typeof item.price === "object"
            ? item.price.value
            : item.price
        }}
      </p>
    </div>

    <ul class="grid gap-4 p-8">
      <li
        v-for="feature of item.features"
        :key="feature.label"
        class="flex items-center gap-3 text-gray-700 dark:text-gray-300"
      >
        <div class="flex-shrink-0 w-9 h-9 rounded-full bg-secondary-50 dark:bg-secondary-900/30 flex items-center justify-center">
          <UIcon class="text-secondary-500" :name="feature.icon" size="20" />
        </div>
        <span class="text-sm font-medium">{{ $tt(feature.label) }}</span>
      </li>
    </ul>
  </div>
</template>

