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
    class: "text-primary",
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
    class: "text-primary",
  },
];
</script>

<template>
  <UHeader mode="slideover">
    <template #title>
      <div class="h-16 w-auto">
        <UiLogo />
      </div>
    </template>

    <UNavigationMenu :items="menuItems" variant="link" color="primary">
      <template #item-label="{ item }">
        {{ $tt(item.label) }}
      </template>
    </UNavigationMenu>

    <template #right>
      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu
        :items="menuItems"
        variant="link"
        color="primary"
        orientation="vertical"
      >
        <template #item-label="{ item }">
          {{ $tt(item.label) }}
        </template>
      </UNavigationMenu>
    </template>
  </UHeader>

  <UMain>
    <slot></slot>
  </UMain>

  <CmpFooter url="https://www.prasentace.cz/" name="PRASENTACE" />
</template>
