<script setup lang="ts">
const today = new Date();
</script>

<template>
  <footer class="py-4 bg-gray-50 dark:bg-gray-800">
    <p class="text-center text-sm text-gray-600 dark:text-gray-300">
      {{ $tt("$.footer.copyright") }} © {{ today.getFullYear() }}
      <ULink to="/" class="font-bold"> VINOZEZAJECI </ULink>.
      {{ $tt("$.footer.reserved") }}.
    </p>
    <p class="text-center text-xs text-gray-600 dark:text-gray-300 mt-1">
      {{ $tt("$.footer.made_by") }}
      <a
        href="https://www.prasentace.cz/"
        target="_blank"
        rel="noopener"
        class="hover:underline"
        >Prasentace</a
      >
    </p>
  </footer>
</template>
