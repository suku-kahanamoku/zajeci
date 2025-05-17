<script setup lang="ts">
const { menuItem } = useMenuItems();
const localePath = useLocalePath();
const auth = useAuthStore();

const admin = menuItem("admin");
admin.to = localePath(admin.to);

const menuItems = [admin];

if (auth.isAdmin) {
  const adminWine = menuItem("admin_wine");
  adminWine.to = localePath(adminWine.to);
  menuItems.push(adminWine);
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <UiNavbar :menuItems="menuItems" />

    <main class="flex-1 flex">
      <slot></slot>
    </main>

    <CmpFooter url="https://www.prasentace.cz/" name="PRASENTACE" />
  </div>
</template>
