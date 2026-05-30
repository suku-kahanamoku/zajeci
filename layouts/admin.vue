<script setup lang="ts">
const { loggedIn } = useUserSession();
const localePath = useLocalePath();
const { user } = useUserSession();
const { totalItemsLength } = useCashdesk();
const { routes, route, menuItem } = useMenuItems();

const open = ref(true);

useSeoMeta({
  robots: "noindex, nofollow",
});

const menuItems = computed(() => {
  const items: any[] = [];

  if (user.value?.role?.name === "admin") {
    const adminWine = menuItem("admin_wine");
    if (adminWine) {
      adminWine.to = localePath(adminWine.to!);
      adminWine.icon = "i-heroicons-beaker";
      items.push(adminWine);
    }

    const adminOrder = menuItem("admin_order");
    if (adminOrder) {
      adminOrder.to = localePath(adminOrder.to!);
      adminOrder.icon = "i-heroicons-shopping-bag";
      items.push(adminOrder);
    }

    const adminInvoice = menuItem("admin_invoice");
    if (adminInvoice) {
      adminInvoice.to = localePath(adminInvoice.to!);
      adminInvoice.icon = "i-heroicons-document-text";
      items.push(adminInvoice);
    }

    const adminAddress = menuItem("admin_address");
    if (adminAddress) {
      adminAddress.to = localePath(adminAddress.to!);
      adminAddress.icon = "i-heroicons-map-pin";
      items.push(adminAddress);
    }

    const adminRole = menuItem("admin_role");
    if (adminRole) {
      adminRole.to = localePath(adminRole.to!);
      adminRole.icon = "i-heroicons-shield-check";
      items.push(adminRole);
    }

    const adminCategory = menuItem("admin_category");
    if (adminCategory) {
      adminCategory.to = localePath(adminCategory.to!);
      adminCategory.icon = "i-heroicons-tag";
      items.push(adminCategory);
    }

    const adminUser = menuItem("admin_user");
    if (adminUser) {
      adminUser.to = localePath(adminUser.to!);
      adminUser.icon = "i-heroicons-users";
      items.push(adminUser);
    }

    const adminText = menuItem("admin_text");
    if (adminText) {
      adminText.to = localePath(adminText.to!);
      adminText.icon = "i-heroicons-document";
      items.push(adminText);
    }

    const adminMail = menuItem("admin_mail");
    if (adminMail) {
      adminMail.to = localePath(adminMail.to!);
      adminMail.icon = "i-heroicons-envelope";
      items.push(adminMail);
    }

    const adminEnum = menuItem("admin_enum");
    if (adminEnum) {
      adminEnum.to = localePath(adminEnum.to!);
      adminEnum.icon = "i-heroicons-list-bullet";
      items.push(adminEnum);
    }

    const adminTaste = menuItem("admin_taste");
    if (adminTaste) {
      adminTaste.to = localePath(adminTaste.to!);
      adminTaste.icon = "i-heroicons-beaker";
      items.push(adminTaste);
    }

    const adminPayment = menuItem("admin_payment");
    if (adminPayment) {
      adminPayment.to = localePath(adminPayment.to!);
      adminPayment.icon = "i-heroicons-credit-card";
      items.push(adminPayment);
    }

    const adminShipping = menuItem("admin_shipping");
    if (adminShipping) {
      adminShipping.to = localePath(adminShipping.to!);
      adminShipping.icon = "i-heroicons-truck";
      items.push(adminShipping);
    }

    const adminVatRate = menuItem("admin_vat_rate");
    if (adminVatRate) {
      adminVatRate.to = localePath(adminVatRate.to!);
      adminVatRate.icon = "i-heroicons-receipt-percent";
      items.push(adminVatRate);
    }
  }

  return items;
});
</script>

<template>
  <UHeader
    mode="slideover"
    :toggle="{ size: 'xl' }"
    :ui="{ container: 'max-w-full' }"
  >
    <template #title>
      <div class="w-24 -ms-4 sm:-ms-6 lg:-ms-8">
        <UiLogo />
      </div>
    </template>

    <template #right>
      <div class="flex items-center gap-3">
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
            size="xl"
          />
        </UChip>
      </div>

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

  <div class="flex flex-1 min-h-0">
    <USidebar
      v-model:open="open"
      collapsible="icon"
      rail
      :ui="{
        gap: 'h-[calc(100%-var(--ui-header-height))]',
        container:
          'absolute top-(--ui-header-height) bottom-0 h-[calc(100%-var(--ui-header-height))]',
      }"
    >
      <template #default="{ state }">
        <UNavigationMenu
          :key="state"
          :items="menuItems"
          orientation="vertical"
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        >
          <template #item-label="{ item }">
            {{ $tt(item.label) }}
          </template>
        </UNavigationMenu>
      </template>
    </USidebar>

    <div class="flex-1 flex flex-col min-w-0 overflow-auto">
      <div v-if="route.meta?.syscode !== 'home'" class="w-full px-5 pt-4">
        <UiBreadcrumb />
      </div>
      <slot />
    </div>
  </div>
</template>
