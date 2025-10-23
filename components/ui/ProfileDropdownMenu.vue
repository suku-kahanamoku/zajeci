<script setup lang="ts">
import { CAPITALIZE } from "@suku-kahanamoku/common-module/utils";

const localePath = useLocalePath();
const { t } = useLang();
const { user, clear } = useUserSession();
const { routes } = useMenuItems();

const profileMenuItems = [
  {
    avatar: {
      src: user.value?.picture,
      size: "md",
      alt: user.value?.name ? CAPITALIZE(user.value.name) : undefined,
      icon: user.value?.name ? undefined : "i-heroicons-user",
    },
    children: [
      {
        label: t(routes.profile?.meta?.title as string),
        icon: "i-heroicons-pencil",
        to: localePath(routes.profile?.path!),
      },
      {
        label: t("$.navbar.logout"),
        icon: "i-heroicons-arrow-right-start-on-rectangle",
        onSelect: async () => {
          await clear();
          navigateTo(localePath(routes.login?.path!));
        },
      },
    ],
  },
];
</script>

<template>
  <UNavigationMenu
    :items="profileMenuItems"
    arrow
    content-orientation="vertical"
    variant="link"
    :ui="{
      viewportWrapper: 'w-40',
    }"
  />
</template>
