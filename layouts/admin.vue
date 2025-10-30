<script setup lang="ts">
const { loggedIn } = useUserSession();
const localePath = useLocalePath();
const { user } = useUserSession();
const { totalItemsLength } = useCashdesk();
const { routes, menuItem } = useMenuItems();

const menuItems: any[] = [];

useSeoMeta({
  robots: "noindex, nofollow",
});

if (user.value?.role === "admin") {
  const adminWine = menuItem("admin_wine")!;
  adminWine.to = localePath(adminWine.to!);
  menuItems.push(adminWine);

  const adminOrder = menuItem("admin_order")!;
  adminOrder.to = localePath(adminOrder.to!);
  menuItems.push(adminOrder);
}
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
          :to="routes?.cashdesk?.path"
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
