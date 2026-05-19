<script setup lang="ts">
const props = defineProps<{
  item: {
    label?: string;
    name?: string;
    data?: {
      price?: number;
      drink?: string;
      food?: string;
      time?: string;
    };
  };
}>();

const displayName = computed(() => props.item.label ?? props.item.name ?? "");
const displayPrice = computed(() => props.item.data?.price ?? 0);

const features = computed(() =>
  [
    { label: props.item.data?.drink, icon: "ph:wine-duotone" },
    { label: props.item.data?.food, icon: "icon-park-outline:bread" },
    { label: props.item.data?.time, icon: "ion:hourglass-outline" },
  ].filter((f) => f.label),
);
</script>

<template>
  <div
    class="zoom-in w-full md:flex-1 md:min-w-72 md:max-w-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-500 transition-all duration-300 overflow-hidden"
  >
    <!-- Accent bar – primary blue -->
    <div class="h-1 bg-linear-to-r from-primary-400 to-primary-600"></div>

    <div
      class="p-8 text-center space-y-2 border-b border-gray-100 dark:border-gray-800"
    >
      <h3 class="font-serif text-2xl font-bold text-river-bed dark:text-white">
        {{ displayName }}
      </h3>
      <p
        class="text-secondary-500 dark:text-secondary-400 font-semibold text-lg"
      >
        {{ displayPrice }} Kč / osoba
      </p>
    </div>

    <ul class="grid gap-4 p-8">
      <li
        v-for="feature of features"
        :key="feature.label"
        class="flex items-center gap-3 text-river-bed dark:text-gray-300"
      >
        <div
          class="flex-shrink-0 w-9 h-9 rounded-full bg-athens-gray dark:bg-gray-800 flex items-center justify-center"
        >
          <UIcon class="text-primary-500" :name="feature.icon" size="20" />
        </div>
        <span class="text-sm font-medium">{{ feature.label }}</span>
      </li>
    </ul>
  </div>
</template>
