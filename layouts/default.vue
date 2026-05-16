<script setup lang="ts">
const { loggedIn } = useUserSession();
const { totalItemsLength } = useCashdesk();
const { routes, route } = useMenuItems();

const colorMode = useColorMode();
const isDark = computed({
  get: () => colorMode.value === "dark",
  set: (val) => {
    colorMode.preference = val ? "dark" : "light";
  },
});

useSeoMeta({
  robots: "index, follow",
});

const menuItems = [
  {
    label: "$.navbar.about",
    to: "/#about",
  },
  {
    label: "$.navbar.wine",
    to: "/wine",
    class: "text-primary",
  },
  {
    label: "$.navbar.taste",
    to: "/#tasting",
  },
  {
    label: "$.navbar.contact",
    to: "/#contact",
  },
  {
    label: "$.navbar.gallery",
    to: "/gallery",
    class: "text-primary",
  },
];
</script>

<template>
  <UHeader mode="slideover" :toggle="{ size: 'xl' }">
    <template #title>
      <div class="w-24 -ms-4 sm:-ms-6 lg:-ms-8">
        <UiLogo />
      </div>
    </template>

    <UNavigationMenu :items="menuItems" variant="link" color="primary">
      <template #item-label="{ item }">
        {{ $tt(item.label) }}
      </template>
    </UNavigationMenu>

    <template #right>
      <div class="space-x-4">
        <UChip
          :show="!!totalItemsLength"
          :text="totalItemsLength"
          size="3xl"
          :inset="true"
          color="secondary"
        >
          <UButton
            :to="routes.cashdesk?.path"
            icon="i-heroicons-shopping-cart"
            variant="ghost"
            size="xl"
            chip
          />
        </UChip>

        <UButton
          :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
          color="neutral"
          variant="ghost"
          size="xl"
          @click="isDark = !isDark"
        />
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

  <UMain>
    <div
      v-if="route.meta?.syscode !== 'home'"
      class="max-w-7xl mx-auto px-5 pt-4"
    >
      <UiBreadcrumb />
    </div>
    <slot></slot>
  </UMain>

  <!-- Footer -->
  <footer
    class="border-t border-gray-200 dark:border-gray-800 bg-primary-900 dark:bg-gray-950 text-white mt-auto"
  >
    <div class="max-w-7xl mx-auto px-5 py-12">
      <div class="grid md:grid-cols-3 gap-8 items-start">
        <!-- Brand -->
        <div class="space-y-3">
          <div class="w-16 h-16">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 283.465 200"
              class="h-full w-full fill-white"
            >
              <polygon
                points="107.622,51.472 107.622,38.91 110.747,38.91 110.747,36.914 107.622,36.914 107.622,33.5 105.627,33.5 105.627,36.914 102.502,36.914 102.502,38.91 105.627,38.91 105.627,51.594 95.409,81.725 95.409,181.944 109.218,181.944 109.218,111.771 118.443,100.092 118.443,81.603"
              />
              <polygon
                points="149.93,72.711 118.444,109.269 118.444,109.249 114.6,113.711 114.645,181.944 120.066,181.944 120.066,144.792 127.661,135.971 127.661,117.017 155.154,85.157 182.629,117.017 182.629,181.944 188.056,181.944 188.056,117.017"
              />
              <polygon
                points="165.336,156.022 143.456,155.966 125.489,167.709 125.489,182.081 165.336,182.081"
              />
              <path
                d="M154.44,116.984l-10.896,12.659v22.698h5.44v-11.548c0-3.017,2.439-5.463,5.456-5.463s5.456,2.446,5.456,5.463v11.548h5.439v-22.698L154.44,116.984z"
              />
            </svg>
          </div>
          <p class="font-serif text-lg font-semibold text-white">
            Víno ze Zaječí
          </p>
          <p class="text-sm text-primary-300">Školní 156, 691 05 Zaječí</p>
        </div>

        <!-- Links -->
        <div class="space-y-3">
          <p
            class="text-xs font-semibold tracking-widest uppercase text-primary-400"
          >
            Navigace
          </p>
          <nav class="flex flex-col gap-2">
            <NuxtLink
              to="/#about"
              class="text-sm text-primary-200 hover:text-white transition-colors"
              >{{ $tt("$.navbar.about") }}</NuxtLink
            >
            <NuxtLink
              to="/wine"
              class="text-sm text-primary-200 hover:text-white transition-colors"
              >{{ $tt("$.navbar.wine") }}</NuxtLink
            >
            <NuxtLink
              to="/#tasting"
              class="text-sm text-primary-200 hover:text-white transition-colors"
              >{{ $tt("$.navbar.taste") }}</NuxtLink
            >
            <NuxtLink
              to="/#contact"
              class="text-sm text-primary-200 hover:text-white transition-colors"
              >{{ $tt("$.navbar.contact") }}</NuxtLink
            >
          </nav>
        </div>

        <!-- Contact -->
        <div class="space-y-3">
          <p
            class="text-xs font-semibold tracking-widest uppercase text-primary-400"
          >
            Kontakt
          </p>
          <div class="space-y-2">
            <a
              href="mailto:vyborne@vinozezajeci.cz"
              class="flex items-center gap-2 text-sm text-primary-200 hover:text-white transition-colors"
            >
              <UIcon name="uil:envelope" size="16" />
              vyborne@vinozezajeci.cz
            </a>
            <a
              href="tel:+420770199999"
              class="flex items-center gap-2 text-sm text-primary-200 hover:text-white transition-colors"
            >
              <UIcon name="uil:phone" size="16" />
              +420 770 199 999
            </a>
            <a
              href="tel:+420778711111"
              class="flex items-center gap-2 text-sm text-primary-200 hover:text-white transition-colors"
            >
              <UIcon name="mdi:phone-classic" size="16" />
              +420 778 711 111
            </a>
          </div>
        </div>
      </div>

      <div
        class="mt-10 pt-6 border-t border-primary-800 flex flex-col md:flex-row items-center justify-between gap-2"
      >
        <p class="text-xs text-primary-400">
          © {{ new Date().getFullYear() }} Víno ze Zaječí · IČ 19737491
        </p>
        <p class="text-xs text-primary-400">
          Pijte zodpovědně. Alkohol je určen pouze osobám starším 18 let.
        </p>
      </div>
    </div>
  </footer>
</template>
