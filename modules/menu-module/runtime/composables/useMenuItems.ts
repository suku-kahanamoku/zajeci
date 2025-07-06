import type { RouteRecord, RouteLocationNormalizedLoaded } from "vue-router";
import { match, pathToRegexp, type Key } from "path-to-regexp";
import { computed, useLang, useRoute, useRouter } from "#imports";

import { REMOVE_LAST_STRING } from "@suku-kahanamoku/common-module/utils";

import type { IMenuItem } from "../types/MenuItem.interface";

/**
 * @composable useMenuItems
 * @description
 * Poskytuje funkce a data pro práci s menu a routami v aplikaci.
 *
 * @param {RouteLocationNormalizedLoaded} [to] - Volitelná cílová route. Pokud není zadána, použije se aktuální route.
 * @return {*} Objekt obsahující funkce a data pro práci s menu.
 *
 * @example
 * ```typescript
 * const { menuItem, getBackPath } = useMenuItems();
 * const item = menuItem("dashboard");
 * const backPath = getBackPath("/home");
 * ```
 */
export function useMenuItems(to?: RouteLocationNormalizedLoaded) {
  const route = to || useRoute();
  const router = useRouter();
  const { i18n } = useLang();

  /**
   * @computed defaultRoutes
   * @description
   * Vrací seznam rout pro výchozí jazykovou mutaci (např. `en`).
   *
   * @example
   * ```typescript
   * const { defaultRoutes } = useMenuItems();
   * console.log(defaultRoutes.value); // [ { name: 'home___en', path: '/home', ... }, ... ]
   * ```
   */
  const defaultRoutes = computed<RouteRecord[]>(() =>
    router
      .getRoutes()
      .filter((i) => i.name?.toString()?.includes("___" + i18n.defaultLocale))
      .map((i) => ({ ...i, path: i.path.replaceAll("()", "") }))
  );

  /**
   * @function getDefaultRoute
   * @description
   * Vrací výchozí route podle názvu.
   *
   * @param {string} name - Název route.
   * @return {*}  {(RouteRecord | undefined)} Výchozí route nebo `undefined`, pokud není nalezena.
   *
   * @example
   * ```typescript
   * const { getDefaultRoute } = useMenuItems();
   * const route = getDefaultRoute("dashboard");
   * console.log(route); // { name: 'dashboard___en', path: '/dashboard', ... }
   * ```
   */
  const getDefaultRoute = (name: string): RouteRecord | undefined => {
    // Vytvori defaultni nazev, podle ktereho se bude vyhledavat defaultni route
    const defName = `${REMOVE_LAST_STRING(name as string, "___", true)}___${
      i18n.defaultLocale
    }`;

    // Najde defaultni route, napr. ...__en
    return defaultRoutes.value.find((route) => route.name === defName);
  };

  /**
   * @computed currentRoutes
   * @description
   * Vrací seznam rout pro aktuální jazykovou mutaci (např. `cs`).
   *
   * @example
   * ```typescript
   * const { currentRoutes } = useMenuItems();
   * console.log(currentRoutes.value); // [ { name: 'home___cs', path: '/domu', ... }, ... ]
   * ```
   */
  const currentRoutes = computed<RouteRecord[]>(() =>
    router
      .getRoutes()
      .filter((i) => i.name?.toString()?.includes("___" + i18n.locale.value))
      .map((i) => ({ ...i, path: i.path.replaceAll("()", "") }))
  );

  /**
   * @function getCurrentRoute
   * @description
   * Vrací aktuální route podle názvu.
   *
   * @param {string} name - Název route.
   * @return {*}  {(RouteRecord | undefined)} Aktuální route nebo `undefined`, pokud není nalezena.
   *
   * @example
   * ```typescript
   * const { getCurrentRoute } = useMenuItems();
   * const route = getCurrentRoute("dashboard");
   * console.log(route); // { name: 'dashboard___cs', path: '/nastenka', ... }
   * ```
   */
  const getCurrentRoute = (name: string): RouteRecord | undefined => {
    // Vytvori current nazev, podle ktereho se bude vyhledavat current route
    const curName = `${REMOVE_LAST_STRING(name as string, "___", true)}___${
      i18n.locale.value
    }`;

    // Najde current route, napr. ...__en
    return currentRoutes.value.find((route) => route.name === curName);
  };

  /**
   * @computed routes
   * @description
   * Vrací objekt, kde klíčem je syscode nebo název route a hodnotou je route.
   *
   * @example
   * ```typescript
   * const { routes } = useMenuItems();
   * console.log(routes); // { 'home': { name: 'home___en', path: '/home', ... }, ... }
   * ```
   */
  const routes: Record<string, RouteRecord> = Object.fromEntries(
    defaultRoutes.value.map((i) => [i.meta?.syscode || i.name?.toString(), i])
  );

  /**
   * @function menuItem
   * @description
   * Vrací položku menu podle syscode.
   *
   * @param {string} syscode - Syscode položky menu.
   * @return {*}  {(IMenuItem | undefined)} Položka menu nebo `undefined`, pokud není nalezena.
   *
   * @example
   * ```typescript
   * const { menuItem } = useMenuItems();
   * const item = menuItem("dashboard");
   * console.log(item); // { syscode: 'dashboard', label: 'Dashboard', to: '/dashboard', ... }
   * ```
   */
  const menuItem = (syscode: string): IMenuItem | undefined => {
    let tmpRoute = routes[syscode];
    if (tmpRoute) {
      // Pokud neexistuje syscode, ocekava se ze je to route z jazyk. mutace (nema meta atd.)
      // Tzn. musi se najit defaultni route, ktera ma v sobe meta
      if (!tmpRoute.meta?.syscode) {
        // Pokud defaultni route existuje, dosadi ho do tmpRoute
        tmpRoute = getDefaultRoute(tmpRoute.name as string) || tmpRoute;
      }

      const meta: Record<string, any> = tmpRoute.meta || {};
      return {
        syscode,
        label: meta.title,
        to: tmpRoute.path,
        icon: meta.icon,
        active: getParentRoutes(route.path)
          ?.map(
            (parent) => getDefaultRoute(parent.name as string)?.meta?.syscode
          )
          ?.includes(syscode),
      };
    }
  };

  /**
   * @function _getRouteByPath
   * @description
   * Vrací route podle cesty.
   *
   * @param {string} path - Cesta (např. `/products/titulek--$1234/subtitule--$9876`).
   * @return {*}  {(RouteRecord | undefined)} Route nebo `undefined`, pokud není nalezena.
   *
   * @example
   * ```typescript
   * const { _getRouteByPath } = useMenuItems();
   * const route = _getRouteByPath("/products/titulek--$1234/subtitule--$9876");
   * console.log(route); // { name: 'productDetail___cs', path: '/products/:page/:subpage', ... }
   * ```
   */
  const _getRouteByPath = (path: string): RouteRecord | undefined => {
    for (const tmpRoute of currentRoutes.value) {
      // transformuje /products/:page/:subpage na regex, ktery zvladne pak v routerMatcher(/products/titulek--$1234/subtitule--$9876)
      const routeMatcher = match(tmpRoute.path);
      if (routeMatcher(path)) {
        return tmpRoute;
      }
    }
  };

  /**
   * @function _getParentOrRedirRoute
   * @description
   * Vrací rodičovskou route aktuální stránky nebo redirect route, na kterou ukazuje rodič.
   *
   * @return {*}  {(RouteRecord | undefined)} Rodičovská nebo redirect route nebo `undefined`, pokud není nalezena.
   *
   * @example
   * ```typescript
   * const { _getParentOrRedirRoute } = useMenuItems();
   * const parentRoute = _getParentOrRedirRoute();
   * console.log(parentRoute); // { name: 'category___cs', path: '/category', ... }
   * ```
   */
  const _getParentOrRedirRoute = (): RouteRecord | undefined => {
    // Rodic route, hleda se dle path, samozrejme bez posledniho lomitka
    let result = _getRouteByPath(
      REMOVE_LAST_STRING(route.path, "/", true) || "/"
    );

    // Pokud se nasla route dle path,
    if (result) {
      // Najde defaultni route
      const defaultRoute = getDefaultRoute(result.name as string);

      // Pokud default route ma meta.redir, tak se vyhleda stranka, na kterou se ma presmerovat
      if (defaultRoute?.meta?.redir) {
        const defaultRedirRoute = defaultRoutes.value.find(
          (route) => route.meta?.syscode === defaultRoute.meta.redir
        );

        if (defaultRedirRoute) {
          // Najde current stranku, na kterou se ma presmerovat
          const redirRoute = getCurrentRoute(defaultRedirRoute.name as string);
          if (redirRoute) {
            result = redirRoute;
          }
        }
      }
    }

    return result;
  };

  /**
   * @function getBackPath
   * @description
   * Vrací cestu pro tlačítko zpět (souhrn modelu nebo rodičovskou route cestu).
   *
   * @param {string} path - Cesta.
   * @param {boolean} [required] - Pokud je `true`, nezjišťuje se historie.
   * @return {*}  {string} Cesta pro tlačítko zpět.
   *
   * @example
   * ```typescript
   * const { getBackPath } = useMenuItems();
   * const backPath = getBackPath("/home");
   * console.log(backPath); // "/home"
   * ```
   */
  const getBackPath = (path: string, required?: boolean): string => {
    let result = path;

    // pokud je required, tak se nezjistuje history, tzn. preskoci se viz nize blok
    if (!required) {
      const backPath = router.options.history.state.back?.toString()!;
      // Najde predchozi route z historie prohlizece
      const backRoute = _getRouteByPath(
        REMOVE_LAST_STRING(backPath, "?", true)
      );
      if (backRoute) {
        // Najde rodic route z aktualniho route bez posledni "/"
        const parentRoute = _getParentOrRedirRoute();

        // Pokud predchozi route a parent route jsou stejne
        if (parentRoute?.name === backRoute.name) {
          result = backPath;
        }
      }
    }

    result = usePath(result, route);

    return result || "/";
  };

  /**
   * @function getParentRoutes
   * @description
   * Vrací pole všech rodičů pro aktuální route nebo zadanou cestu.
   *
   * @param {string} path - Cesta.
   * @return {*}  {RouteRecord[]} Pole rodičovských rout.
   *
   * @example
   * ```typescript
   * const { getParentRoutes } = useMenuItems();
   * const parentRoutes = getParentRoutes("/products/titulek--$1234/subtitule--$9876");
   * console.log(parentRoutes); // [ { name: 'products___cs', path: '/products', ... }, ... ]
   * ```
   */
  function getParentRoutes(path: string): RouteRecord[] {
    const parentRoutes: RouteRecord[] = [];

    let currentPath = path;

    while (currentPath) {
      const parentRoute = _getRouteByPath(currentPath);
      if (parentRoute) {
        parentRoutes.push(parentRoute);
        currentPath = REMOVE_LAST_STRING(currentPath, "/", true);
      } else {
        break;
      }
    }

    // Serazeni od rootu po aktualni stranku
    return parentRoutes.reverse();
  }

  return {
    defaultRoutes,
    currentRoutes,
    routes,
    route,
    router,
    menuItem,
    getBackPath,
    getParentRoutes,
    getDefaultRoute,
    getCurrentRoute,
  };
}

/**
 * @function usePath
 * @description
 * Transformuje výchozí cestu (např. `/product/:page/evaluation/:subpage`) na regulérní cestu (např. `/product/eldis--$12345/evaluation/rl2000--$12345`).
 *
 * @param {string} path - Výchozí cesta.
 * @param {RouteLocationNormalizedLoaded} route - Aktuální route.
 * @return {*}  {string} Regulérní cesta.
 *
 * @example
 * ```typescript
 * const path = usePath("/product/:page/evaluation/:subpage", route);
 * console.log(path); // "/product/eldis--$12345/evaluation/rl2000--$12345"
 * ```
 */
export function usePath(
  path: string,
  route: RouteLocationNormalizedLoaded
): string {
  const keys: Key[] = [];
  try {
    pathToRegexp(path, keys);
  } catch (error) {}

  let result = path;

  keys.forEach((key) => {
    const paramName = key.name.toString();
    const paramValue = route.params[paramName] as string;
    if (paramValue) {
      result = result.replace(`:${paramName}`, paramValue);
    }
  });

  return result;
}
