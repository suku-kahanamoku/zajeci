<script setup lang="ts">
const { menuItem, routes } = useMenuItems();
const localePath = useLocalePath();
const auth = useAuthStore();

const menuItems: any[] = [];
const isOpen = ref(false);

if (auth.isAdmin) {
  const adminWine = menuItem("admin_wine")!;
  adminWine.to = localePath(adminWine.to!);
  menuItems.push(adminWine);

  const adminOrder = menuItem("admin_order")!;
  adminOrder.to = localePath(adminOrder.to!);
  menuItems.push(adminOrder);
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <CmpMainMenu v-model:is-open="isOpen" :config="{}">
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
      <UNavigationMenu
        orientation="vertical"
        :items="menuItems"
        :highlight="true"
        :ui="{
          root: 'hidden lg:flex border-r border-gray-200',
        }"
      >
        <template #item-label="{ item }">
          {{ $tt(item.label) }}
        </template>
      </UNavigationMenu>

      <div class="w-full">
        <slot></slot>
      </div>
    </main>

    <CmpFooter url="https://www.prasentace.cz/" name="PRASENTACE" />
  </div>
</template>
