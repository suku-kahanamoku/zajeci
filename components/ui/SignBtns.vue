<script setup lang="ts">
const localePath = useLocalePath();
const { routes } = useMenuItems();
</script>

<template>
  <div class="space-x-2 me-4">
    <UButton
      v-if="routes?.login?.path"
      data-testid="menu-login"
      :to="localePath(routes?.login?.path!)"
      class="text-secondary-500 dark:text-secondary-400"
      variant="outline"
      active-class="hidden"
    >
      {{
        $tt(
          (routes?.login?.meta?.label || routes?.login?.meta?.title) as string
        )
      }}
    </UButton>
    <UButton
      v-if="routes?.signup?.path"
      data-testid="menu-signup"
      :to="localePath(routes?.signup?.path!)"
      variant="ghost"
      active-class="hidden"
    >
      {{
        $tt(
          (routes?.signup?.meta?.label || routes?.signup?.meta?.title) as string
        )
      }}
    </UButton>
  </div>
</template>
