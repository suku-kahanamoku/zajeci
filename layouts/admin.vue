<script setup lang="ts">
const { loggedIn } = useUserSession();
const localePath = useLocalePath();
const { user } = useUserSession();
const { totalItemsLength } = useCashdesk();
const { routes, route, menuItem } = useMenuItems();

const open = ref(true);

// i18n helpers for language switcher
const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const availableLocales = ["cs", "en"];

function switchToLocale(l: string) {
  try {
    const p = switchLocalePath(l as any);
    if (p) {
      navigateTo(p as any);
      locale.value = l;
    } else {
      locale.value = l;
    }
  } catch (e) {
    locale.value = l;
  }
}

useSeoMeta({
  robots: "noindex, nofollow",
});

const menuItems = computed(() => {
  const items: any[] = [];

  if (
    user.value?.role === "admin" ||
    (user.value?.role as any)?.name === "admin"
  ) {
    // Order menu items by importance for admin users
    const order = [
      "admin_order",
      "admin_invoice",
      "admin_user",
      "admin_wine",
      "admin_category",
      "admin_mail",
      "admin_enum",
      "admin_payment",
      "admin_shipping",
      "admin_address",
      "admin_role",
      "admin_text",
      "admin_taste",
      "admin_vat_rate",
    ];

    const icons: Record<string, string> = {
      admin_order: "i-heroicons-shopping-bag",
      admin_invoice: "i-heroicons-document-text",
      admin_user: "i-heroicons-users",
      admin_wine: "i-heroicons-beaker",
      admin_category: "i-heroicons-tag",
      admin_mail: "i-heroicons-envelope",
      admin_enum: "i-heroicons-list-bullet",
      admin_payment: "i-heroicons-credit-card",
      admin_shipping: "i-heroicons-truck",
      admin_address: "i-heroicons-map-pin",
      admin_role: "i-heroicons-shield-check",
      admin_text: "i-heroicons-document",
      admin_taste: "i-heroicons-beaker",
      admin_vat_rate: "i-heroicons-receipt-percent",
    };

    for (const key of order) {
      const it = menuItem(key);
      if (!it) continue;
      it.to = localePath(it.to!);
      it.icon = icons[key] || "i-heroicons-rectangle-group";
      items.push(it);
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
        <div class="flex items-center gap-2">
          <div class="text-sm text-muted hidden sm:block">{{$tt('$.admin.lang') }}</div>
          <div class="flex items-center gap-1">
            <UButton
              v-for="l in availableLocales"
              :key="l"
              :variant="locale.value === l ? 'solid' : 'ghost'"
              size="sm"
              class="px-2"
              @click="switchToLocale(l)"
            >
              {{ l.toUpperCase() }}
            </UButton>
          </div>
        </div>
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
