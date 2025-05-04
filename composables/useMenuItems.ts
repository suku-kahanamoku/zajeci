import type { RouteRecordNormalized } from "vue-router";

export function useMenuItems() {
  const router = useRouter();
  const { locale, defaultLocale } = useI18n();

  const defaultRoutes = computed(() =>
    router
      .getRoutes()
      .filter((i) => i!.name?.toString().includes("___" + defaultLocale))
  );

  const currentRoutes = computed(() =>
    router
      .getRoutes()
      .filter((i) => i!.name?.toString().includes("___" + locale.value))
  );

  const routes: Record<string, RouteRecordNormalized & { label?: string }> = {};
  defaultRoutes.value.forEach(
    (route) =>
      (routes[(route.meta?.syscode || route.name?.toString()) as string] =
        route)
  );

  const menuItem = (syscode: string): { label: string; to: string } => {
    return {
      label: routes[syscode]?.meta?.title as string,
      to: routes[syscode]?.path,
    };
  };

  return { defaultRoutes, currentRoutes, routes, menuItem };
}
