<script setup lang="ts">
defineProps<{
  menuItems?: { label: string; to: string }[];
}>();

const localePath = useLocalePath();

const isOpen = ref(false);
</script>

<template>
  <div class="z-10">
    <CmpMainMenu v-model:is-open="isOpen" :config="{}" :menu-items="menuItems">
      <template #logo>
        <ULink :to="localePath('/')" class="h-full">
          <UiLogo />
        </ULink>
      </template>

      <template #after> </template>
    </CmpMainMenu>

    <CmpSlideMenu
      v-model:is-open="isOpen"
      :config="{ side: 'right' }"
      :menu-items="menuItems"
    >
    </CmpSlideMenu>
  </div>
</template>
