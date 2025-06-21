<script setup lang="ts">
const { menuItem, routes } = useMenuItems();
const localePath = useLocalePath();
const auth = useAuthStore();

const menuItems: any[] = [];
console.log(menuItems)

if (auth.isAdmin) {
  const adminWine = menuItem("admin_wine")!;
  adminWine.to = localePath(adminWine.to!);
  menuItems.push(adminWine);

  const adminOrder = menuItem("admin_order")!;
  adminOrder.to = localePath(adminOrder.to!);
  menuItems.push(adminOrder);
}
console.log(menuItems);
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <UiNavbar :menuItems="menuItems" />

    <main class="flex-1 flex">
      <UNavigationMenu
        orientation="vertical"
        :items="menuItems"
        :highlight="true"
        :ui="{
          root: 'border-r border-gray-200',
        }"
      />

      <div class="w-full">
        <slot></slot>
      </div>
    </main>

    <CmpFooter url="https://www.prasentace.cz/" name="PRASENTACE" />
  </div>
</template>
