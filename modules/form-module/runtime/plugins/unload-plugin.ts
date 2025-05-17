import { defineNuxtPlugin, useNuxtApp, useRouter } from "#app";
import type {
  NavigationGuardNext,
  RouteLocationNormalizedLoaded,
} from "vue-router";

/**
 * @plugin unload-plugin
 * @description
 * Plugin pro správu událostí při zavírání okna nebo přechodu mezi stránkami.
 * - Zobrazuje varování při neuložených změnách.
 * - Umožňuje potvrzení při navigaci pryč ze stránky.
 *
 * @example
 * ```typescript
 * // Automaticky se aktivuje při přítomnosti elementu s třídou `.field-warning`.
 * ```
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Funkce pro zavření okna nebo tabu, pokud jsou neuložené změny
  window.onbeforeunload = () =>
    document.querySelector(".field-warning") ? false : undefined;

  // Funkce pro navigaci mezi stránkami
  useRouter().beforeEach(
    (
      to: RouteLocationNormalizedLoaded,
      from: RouteLocationNormalizedLoaded,
      next: NavigationGuardNext
    ) => {
      if (document?.querySelector(".field-warning")) {
        const t = useNuxtApp().$tt;
        next(confirm(t("$.query.not_saved_changes")));
      } else {
        next();
      }
    }
  );
});
