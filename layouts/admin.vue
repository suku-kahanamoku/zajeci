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

  const adminCategory = menuItem("admin_category")!;
  adminCategory.to = localePath(adminCategory.to!);
  menuItems.push(adminCategory);

  const adminUser = menuItem("admin_user")!;
  adminUser.to = localePath(adminUser.to!);
  menuItems.push(adminUser);

  const adminText = menuItem("admin_text")!;
  adminText.to = localePath(adminText.to!);
  menuItems.push(adminText);

  const adminEnum = menuItem("admin_enum")!;
  adminEnum.to = localePath(adminEnum.to!);
  menuItems.push(adminEnum);
}
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
      <UChip
        :show="!!totalItemsLength"
        :text="totalItemsLength"
        size="3xl"
        :inset="true"
        color="secondary"
      >
        <UButton
          :to="routes?.cashdesk?.path"
          icon="i-heroicons-shopping-cart"
          variant="ghost"
        />
      </UChip>
      <!-- <UColorModeButton /> -->

      <UiProfileDropdownMenu v-if="loggedIn" />
      <UiSignBtns v-else />
    </template>

    <template #body>
      <UNavigationMenu
        :items="menuItems"
        variant="link"
        color="primary"
        orientation="vertical"
        :ui="{
          list: 'space-y-1',
          link: 'text-lg',
        }"
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
