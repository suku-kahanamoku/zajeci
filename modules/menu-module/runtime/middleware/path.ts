import type { RouteLocationNormalizedLoaded } from "vue-router";
import {
  usePath,
  navigateTo,
  useMenuItems,
  useLang,
  useLocalePath,
} from "#imports";
import {
  REMOVE_FIRST_STRING,
  REMOVE_LAST_STRING,
} from "@suku-kahanamoku/common-module/utils";

/**
 * @middleware path
 * @description
 * Middleware pro zpracování a úpravu cest v aplikaci.
 * Provádí následující:
 * - Nastavuje metadata na základě parametrů cesty.
 * - Přesměrovává na cílové stránky podle `redir` atributu.
 * - Odstraňuje nadbytečné lomítko na konci cesty.
 *
 * @param {RouteLocationNormalizedLoaded} to - Cílová cesta.
 * @param {RouteLocationNormalizedLoaded} from - Původní cesta.
 */
export default async function (
  to: RouteLocationNormalizedLoaded,
  from: RouteLocationNormalizedLoaded
) {
  const { routes, defaultRoutes } = useMenuItems(to);
  const { i18n } = useLang();

  // Nastavení metadat na základě parametrů cesty
  to.params = to.params || {};
  if (to.params.id) {
    const [label, id] = (to.params.id as string)?.split("--$");
    to.meta.label = label;
    to.meta.id = id;
  }

  // Najde defaultní route podle názvu
  const name = `${REMOVE_LAST_STRING(to.name as string, "___", true)}___${
    i18n.defaultLocale
  }`;
  const defaultTo = defaultRoutes.value.find((route) => route.name === name);
  const meta: Record<string, any> = defaultTo?.meta || to.meta;

  // Přesměrování na stránku podle `redir` atributu
  if (meta.redir) {
    const localePath = useLocalePath();
    const redirPath = routes[meta.redir]?.path || "/";
    return navigateTo(localePath(usePath(redirPath, to)), {
      redirectCode: 302,
    });
  }

  // Přesměrování na URL bez koncového lomítka
  if (to.path !== "/" && to.path.endsWith("/")) {
    return navigateTo(
      // odstrani posledni lomitko
      REMOVE_LAST_STRING(to.path, "/", true) +
        // pokud ma query params, prida query params
        (to.fullPath.includes("?") ? `?${to.fullPath.split("?", 2)[1]}` : "") +
        // prida hash
        to.hash,
      { redirectCode: 301 }
    );
  }
}
