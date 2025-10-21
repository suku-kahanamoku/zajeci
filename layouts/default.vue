<script setup lang="ts">
const { routes } = useMenuItems();
const localePath = useLocalePath();
const userSessionStore = useUserSession();

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

      <div class="space-x-2">
        <UButton
          v-if="routes?.login?.path"
          data-testid="menu-login"
          :to="localePath(routes?.login?.path)"
          class="text-secondary-500 dark:text-secondary-400"
          variant="outline"
          active-class="hidden"
        >
          {{
            $tt(
              (routes?.login?.meta?.label ||
                routes?.login?.meta?.title) as string
            )
          }}
        </UButton>
        <UButton
          v-if="routes?.signup?.path"
          data-testid="menu-signup"
          :to="localePath(routes?.signup?.path)"
          active-class="hidden"
        >
          {{
            $tt(
              (routes?.signup?.meta?.label ||
                routes?.signup?.meta?.title) as string
            )
          }}
        </UButton>
      </div>
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
