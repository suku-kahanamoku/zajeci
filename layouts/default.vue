<script setup lang="ts">
const { loggedIn } = useUserSession();
const { totalItemsLength } = useCashdesk();
const { routes } = useMenuItems();

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
      <div class="w-24">
        <UiLogo />
      </div>
    </template>

    <UNavigationMenu :items="menuItems" variant="link" color="primary">
      <template #item-label="{ item }">
        {{ $tt(item.label) }}
      </template>
    </UNavigationMenu>

    <template #right>
      <UiProfileDropdownMenu v-if="loggedIn" />
      <UiSignBtns v-else />

      <UChip
        :show="totalItemsLength"
        :text="totalItemsLength"
        size="3xl"
        :inset="true"
        color="secondary"
      >
        <UButton
          :to="routes.cashdesk?.path"
          icon="i-heroicons-bell"
          variant="ghost"
        />
      </UChip>
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
</template>
