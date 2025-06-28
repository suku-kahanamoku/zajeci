<script setup lang="ts">
import { useLocalePath } from "#imports";

import { type IMainMenu } from "../types/MainMenu.interface";

/**
 * @component MainMenu
 * @description
 * Komponenta pro hlavní menu (MainMenu).
 *
 * @props {IMainMenu} props - Konfigurace a data pro hlavní menu.
 *
 * @example
 * ```vue
 * <MainMenu :menuItems="menuItems" :config="{ langMenu: { disabled: false } }" />
 * ```
 */
defineProps<IMainMenu>();

const isOpen = defineModel<boolean>("isOpen");
const auth = useAuthStore();
const { routes, menuItem } = useMenuItems();
const cashdesk = useCashdeskStore();
const localePath = useLocalePath();

const userMenuItems = computed(() => {
  const admin = menuItem("admin")!;
  admin.to = localePath(admin.to!);
  const profile = menuItem("admin_profile")!;
  profile.to = localePath(profile.to!);
  return [
    [admin, profile],
    [
      {
        label: "$.navbar.logout",
        onSelect: auth.logout,
      },
    ],
  ];
});
</script>

<template>
  <header
    class="shadow-md bg-gray-50 dark:bg-gray-800 dark:border dark:border-gray-900 dark:border-b-gray-700"
  >
    <div
      class="max-w-screen-xl mx-auto px-5 w-full h-16 flex flex-row justify-between items-center gap-4"
    >
      <!-- logo -->
      <ULink :to="localePath('/')" class="h-full">
        <UiLogo />
      </ULink>

      <!-- prostredni menu -->
      <nav v-if="menuItems?.length" class="hidden w-auto lg:flex">
        <ul class="flex flex-row gap-6">
          <li v-for="item of menuItems" :key="item.to">
            <ULink :to="localePath(item.to!)" @click="isOpen = false">
              {{ $tt(item.label!) }}
            </ULink>
          </li>
        </ul>
      </nav>

      <!-- menu napravo -->
      <div class="flex items-center gap-4">
        <!-- pokud je to prihlasene, zobrazi uzivatelske menu -->
        <UDropdownMenu
          v-if="auth.loggedIn"
          :items="userMenuItems"
          :popper="{ placement: 'bottom-start' }"
        >
          <UAvatar
            v-if="(auth.user as any)?.picture"
            :src="(auth.user as any)?.picture"
            size="md"
            aria-label="avatar"
            alt="avatar"
          />
          <UButton
            v-else
            icon="i-heroicons-user"
            class="rounded-full cursor-pointer"
            aria-label="avatar"
          />

          <template #item="{ item }">
            <span class="truncate">{{ $tt(item.label!) }}</span>
          </template>
        </UDropdownMenu>

        <!-- jinak zobrazi login a signup menu -->
        <div v-else class="hidden lg:flex items-center gap-4">
          <UButton
            :to="localePath(routes.login?.path)"
            class="text-secondary-500 dark:text-secondary-400"
            variant="outline"
            active-class="hidden"
            >{{ $tt(routes.login?.meta?.title as string) }}</UButton
          >
          <UButton
            :to="localePath(routes.signup?.path)"
            class="dark:text-white"
            active-class="hidden"
            >{{ $tt(routes.signup?.meta?.title as string) }}</UButton
          >
        </div>

        <!-- shopping cart -->
        <client-only>
          <UChip
            :show="cashdesk.carts?.length ? true : false"
            color="secondary"
            :text="cashdesk.carts?.length"
            size="3xl"
          >
            <UButton
              :to="routes.cashdesk?.path"
              icon="i-heroicons-shopping-cart"
              class="rounded-full cursor-pointer"
              variant="ghost"
              :aria-label="$tt('$.aria.cart')"
            />
          </UChip>
        </client-only>

        <!-- toggle light & dark mode -->
        <UButton
          :icon="
            $colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'
          "
          class="rounded-full cursor-pointer"
          variant="ghost"
          :aria-label="$tt('$.aria.mode')"
          @click="
            $colorMode.preference =
              $colorMode.value === 'dark' ? 'light' : 'dark'
          "
        />

        <!-- hamburger icon -->
        <UButton
          v-if="!config?.hamburgerMenu?.disabled"
          class="flex lg:hidden cursor-pointer"
          icon="i-heroicons-bars-3"
          square
          variant="ghost"
          :aria-label="$tt('$.aria.hamburger')"
          @click="isOpen = true"
        />
      </div>
    </div>
  </header>
</template>
