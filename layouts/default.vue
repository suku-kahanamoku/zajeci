<script setup lang="ts">
const localePath = useLocalePath();

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
  <div class="min-h-screen flex flex-col">
    <CmpMainMenu v-model:is-open="isOpen" :config="{}" :menu-items="menuItems">
      <template #logo>
        <ULink :to="localePath('/')" class="h-full">
          <UiLogo />
        </ULink>
      </template>
    </CmpMainMenu>

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
  </div>
</template>
