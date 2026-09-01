<script setup lang="ts">
const { loggedIn, user } = useUserSession();
const localePath = useLocalePath();
const { t } = useLang();
const { totalItemsLength } = useCashdesk();
const { routes, route, menuItem } = useMenuItems();
const colorMode = useColorMode();

const open = ref(true);

useSeoMeta({ robots: "noindex, nofollow" });

const adminMenu = [
  ["admin_wine", "i-heroicons-beaker"],
  ["admin_taste", "i-heroicons-sparkles"],
  ["admin_category", "i-heroicons-tag"],
  ["admin_order", "i-heroicons-shopping-bag"],
  ["admin_invoice", "i-heroicons-document-text"],
  ["admin_user", "i-heroicons-users"],
  ["admin_address", "i-heroicons-map-pin"],
  ["admin_role", "i-heroicons-shield-check"],
  ["admin_text", "i-heroicons-document"],
  ["admin_mail", "i-heroicons-envelope"],
  ["admin_enum", "i-heroicons-list-bullet"],
  ["admin_payment", "i-heroicons-credit-card"],
  ["admin_shipping", "i-heroicons-truck"],
  ["admin_vat_rate", "i-heroicons-receipt-percent"],
] as const;

const menuItems = computed(() => {
  if (user.value?.role?.name !== "admin") return [];

  const items: any[] = [
    {
      label: "$.admin.title",
      to: localePath("/admin"),
      icon: "i-heroicons-squares-2x2",
    },
  ];

  for (const [syscode, icon] of adminMenu) {
    const item = menuItem(syscode);
    if (!item?.to) continue;

    items.push({ ...item, to: localePath(item.to), icon });
  }

  return items;
});

function toggleColorMode(): void {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <div class="crm-admin-shell min-h-screen">
    <UHeader
      mode="slideover"
      :toggle="{ size: 'xl' }"
      :ui="{
        root: 'sticky top-0 z-40 border-b border-default/70 bg-default/75 backdrop-blur-xl',
        container: 'max-w-full px-4 sm:px-6',
      }"
    >
      <template #title>
        <div class="w-24 -ms-2"><UiLogo /></div>
      </template>

      <template #right>
        <div
          class="hidden items-center gap-2 rounded-full border border-default bg-elevated/70 px-3 py-1.5 text-xs font-bold text-muted lg:flex"
        >
          <span
            class="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgb(16_185_129_/_12%)]"
          />
          {{ t("$.layout.admin_online") }}
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
            color="neutral"
            variant="ghost"
            :aria-label="t('$.layout.cart')"
          />
        </UChip>

        <UButton
          :icon="
            colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'
          "
          color="neutral"
          variant="ghost"
          :aria-label="t('$.layout.toggle_color_mode')"
          @click="toggleColorMode"
        />

        <UiProfileDropdownMenu v-if="loggedIn" />
        <UiSignBtns v-else />
      </template>

      <template #body>
        <UNavigationMenu
          :items="menuItems"
          orientation="vertical"
          :ui="{ link: 'text-base font-bold' }"
        >
          <template #item-label="{ item }">{{ $tt(item.label) }}</template>
        </UNavigationMenu>
      </template>
    </UHeader>

    <div
      class="flex min-h-[calc(100vh-var(--ui-header-height))] gap-4 p-3 sm:p-4"
    >
      <USidebar
        v-model:open="open"
        collapsible="icon"
        rail
        class="overflow-hidden rounded-2xl border border-default/70 bg-default/80 shadow-xl shadow-slate-900/5 backdrop-blur-xl dark:shadow-black/20"
      >
        <template #default>
          <UNavigationMenu
            :items="menuItems"
            orientation="vertical"
            :ui="{
              list: 'space-y-1.5 p-2',
              link: 'w-full rounded-xl px-3.5 py-3 text-sm font-bold transition-all data-[active]:bg-primary data-[active]:text-white data-[active]:shadow-lg data-[active]:shadow-primary/20',
              linkLeadingIcon: 'size-5',
            }"
          >
            <template #item-label="{ item }">{{ $tt(item.label) }}</template>
          </UNavigationMenu>
        </template>

        <template #footer>
          <div class="m-2 rounded-xl bg-primary/8 p-3 text-xs text-muted">
            <div
              class="mb-2 flex items-center gap-2 font-extrabold text-highlighted"
            >
              <UIcon name="i-heroicons-chart-bar" class="size-4 text-primary" />
              {{ t("$.layout.vineyard_overview") }}
            </div>
            <p class="group-data-[collapsed=true]:hidden">
              {{ t("$.layout.vineyard_overview_description") }}
            </p>
          </div>
        </template>
      </USidebar>

      <main
        class="min-w-0 flex-1 overflow-auto rounded-2xl border border-white/50 bg-white/35 shadow-sm backdrop-blur-[2px] dark:border-white/5 dark:bg-slate-950/25"
      >
        <div
          v-if="route.meta?.syscode !== 'admin'"
          class="mx-auto w-full max-w-7xl px-5 pt-5 sm:px-7"
        >
          <UiBreadcrumb />
        </div>
        <slot />
      </main>
    </div>
  </div>
</template>
