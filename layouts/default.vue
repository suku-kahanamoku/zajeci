<script setup lang="ts">
const localePath = useLocalePath();

useSeoMeta({
  robots: "index, follow",
});

const menuItems = [
  {
    label: "$.navbar.about",
    to: "/#about",
  },
  {
    label: "$.navbar.wine",
    to: "/wine",
  },
  {
    label: "$.navbar.taste",
    to: "/#tasting",
  },
  {
    label: "$.navbar.contact",
    to: "/#contact",
  },
  {
    label: "$.navbar.gallery",
    to: "/gallery",
  },
];
const isOpen = ref(false);
</script>

<template>
  <UHeader>
    <template #title>
      <div class="h-16 w-auto">
        <UiLogo />
      </div>
    </template>

    <UNavigationMenu :items="menuItems" />

    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>

  <CmpSlideMenu
    v-model:is-open="isOpen"
    :menu-items="menuItems"
    :config="{ side: 'right', ui: { title: 'h-8' } }"
  >
    <template #logo>
      <UiLogo />
    </template>
  </CmpSlideMenu>

  <main class="flex-1 flex">
    <slot></slot>
  </main>

  <CmpFooter url="https://www.prasentace.cz/" name="PRASENTACE" />
</template>
