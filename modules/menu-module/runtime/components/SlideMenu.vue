<script setup lang="ts">
import { useLocalePath } from "#imports";

import { type ISlideMenu } from "../types/SlideMenu.interface";

/**
 * @component SlideMenu
 * @description
 * Komponenta pro boční menu (SlideMenu).
 *
 * @props {ISlideMenu} props - Konfigurace a data pro boční menu.
 *
 * @example
 * ```vue
 * <SlideMenu :menuItems="menuItems" :config="{ side: 'left' }" />
 * ```
 */
defineProps<ISlideMenu>();

const isOpen = defineModel<boolean>("isOpen");
const auth = useAuthStore();
const { routes } = useMenuItems();
const localePath = useLocalePath();
</script>

<template>
  <USlideover v-model:open="isOpen" :side="config?.side" :ui="config?.ui">
    <template #title>
      <slot name="logo" />
    </template>

    <template #body>
      <div class="h-full overflow-y-auto">
        <ul class="space-y-2 font-medium">
          <li v-for="item of menuItems" :key="item.to">
            <ULink
              :to="localePath(item.to!)"
              class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              @click="isOpen = false"
            >
              <span class="ms-3">{{ $tt(item.label!) }}</span>
            </ULink>
          </li>
        </ul>
      </div>
    </template>

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
          :to="localePath(routes.signup?.path)"
          size="lg"
          active-class="hidden"
          class="flex-grow flex-shrink text-center block"
          @click="isOpen = false"
          >{{ $tt(routes.signup?.meta?.title as string) }}</UButton
        >
      </div>
    </template>
  </USlideover>
</template>
