<script setup lang="ts">
defineProps<{
  menuItems?: { label: string; to: string }[];
}>();

const { $tt } = useNuxtApp();
const {
  i18n: { locale, locales },
} = useLang();
const localePath = useLocalePath();
const switchLocale = useSwitchLocalePath();
const { routes, menuItem } = useMenuItems();
const auth = useAuthStore();
const cashdesk = useCashdeskStore();

const isOpen = ref(false);

const userMenuItems = computed(() => {
  const admin = menuItem("admin");
  admin.to = localePath(admin.to);
  const profile = menuItem("admin_profile");
  profile.to = localePath(profile.to);
  return [
    [admin, profile],
    [
      {
        label: "$.navbar.logout",
        click: async () => await auth.logout(),
      },
    ],
  ];
});
</script>

<template>
  <div class="z-10">
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
          <ul class="flex flex-row">
            <li v-for="item of menuItems" :key="item.to">
              <ULink
                :to="localePath(item.to)"
                class="flex lg:px-3 py-2 hover:text-gray-900 dark:text-white dark:hover:text-gray-300"
                @click="isOpen = false"
              >
                {{ $tt(item.label) }}
              </ULink>
            </li>
          </ul>
        </nav>

        <!-- menu napravo -->
        <client-only>
          <div class="flex items-center gap-4">
            <!-- pokud je to prihlasene, zobrazi uzivatelske menu -->
            <UDropdown
              v-if="auth.loggedIn"
              :items="userMenuItems"
              :ui="{ item: { disabled: 'cursor-text select-text' } }"
              :popper="{ placement: 'bottom-start' }"
            >
              <UChip
                size="2xl"
                color="secondary"
                :text="auth.initials"
                :show="auth.initials?.length ? true : false"
              >
                <UAvatar
                  v-if="(auth.user as any)?.picture"
                  :src="(auth.user as any)?.picture"
                  aria-label="avatar"
                  alt="avatar"
                />
                <UAvatar v-else icon="i-heroicons-user" />
              </UChip>

              <template #item="{ item }">
                <span class="truncate">{{ $tt(item.label) }}</span>
              </template>
            </UDropdown>

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
            <UChip
              size="2xl"
              color="secondary"
              :text="cashdesk.carts?.length"
              :show="cashdesk.carts?.length ? true : false"
            >
              <UButton
                :to="routes.cashdesk?.path"
                icon="i-heroicons-shopping-cart"
                class="text-gray-600 dark:text-gray-400"
                :ui="{ rounded: 'rounded-full' }"
                variant="ghost"
                :aria-label="$tt('$.aria.cart')"
              />
            </UChip>

            <!-- toggle light & dark mode -->
            <UButton
              :icon="
                $colorMode.value === 'dark'
                  ? 'i-heroicons-moon'
                  : 'i-heroicons-sun'
              "
              class="text-gray-600 dark:text-gray-400"
              :ui="{ rounded: 'rounded-full' }"
              variant="ghost"
              :aria-label="$tt('$.aria.mode')"
              @click="
                $colorMode.preference =
                  $colorMode.value === 'dark' ? 'light' : 'dark'
              "
            />

            <!-- hamburger icon -->
            <div v-if="menuItems?.length" class="flex lg:hidden">
              <UButton
                icon="i-heroicons-bars-3"
                color="white"
                square
                variant="solid"
                :aria-label="$tt('$.aria.hamburger')"
                @click="isOpen = true"
              />
            </div>
          </div>
        </client-only>
      </div>
    </header>

    <USlideover
      v-if="menuItems?.length"
      v-model="isOpen"
      side="left"
      :ui="{ width: 'max-w-sm' }"
    >
      <UCard
        class="flex flex-col flex-1"
        :ui="{
          header: {
            base: 'flex justify-end',
            padding: 'py-4',
          },
          body: { base: 'flex-1' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <UButton
            icon="i-heroicons-x-mark"
            color="white"
            square
            variant="solid"
            :aria-label="$tt('$.aria.close')"
            @click="isOpen = false"
          />
        </template>

        <aside aria-label="Sidebar">
          <div class="h-full overflow-y-auto">
            <ul class="space-y-2 font-medium">
              <li v-for="item of menuItems" :key="item.to">
                <ULink
                  :to="localePath(item.to)"
                  class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  @click="isOpen = false"
                >
                  <span class="ms-3">{{ $tt(item.label) }}</span>
                </ULink>
              </li>
            </ul>
          </div>
        </aside>

        <template v-if="!auth.loggedIn" #footer>
          <div class="flex items-center gap-4 w-full">
            <UButton
              :to="localePath(routes.login?.path)"
              variant="outline"
              size="lg"
              active-class="hidden"
              class="flex-grow flex-shrink text-center block text-secondary-500"
              @click="isOpen = false"
              >{{ $tt(routes.login?.meta?.title as string) }}</UButton
            >
            <UButton
              :to="localePath(routes.login?.path)"
              size="lg"
              active-class="hidden"
              class="flex-grow flex-shrink text-center block"
              @click="isOpen = false"
              >{{ $tt(routes.login?.meta?.title as string) }}</UButton
            >
          </div>
        </template>
      </UCard>
    </USlideover>
  </div>
</template>

<style>
.custom-popper {
  transform: translate(5px, 34px) !important;
}
</style>
