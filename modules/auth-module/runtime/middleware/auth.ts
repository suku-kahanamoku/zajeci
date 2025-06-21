import {
  useLocalePath,
  abortNavigation,
  navigateTo,
  useMenuItems,
  useUserSession,
} from "#imports";
import type { RouteLocationNormalizedLoaded } from "vue-router";

export default async function (
  to: RouteLocationNormalizedLoaded,
  from: RouteLocationNormalizedLoaded
) {
  const localePath = useLocalePath();
  const { routes, getDefaultRoute } = useMenuItems(to);
  const { loggedIn } = useUserSession();
  const fromSyscode = getDefaultRoute(from.name as string)?.meta?.syscode;
  const toSyscode = getDefaultRoute(to.name as string)?.meta?.syscode;

  // je prihlaseny
  if (loggedIn.value) {
    // pokud jde z dashboardu, zrusi navigaci, pac se snazi jako prihlaseny na login nebo signup
    if (fromSyscode === "pz") {
      switch (toSyscode) {
        case "login":
        case "signup":
        case "forgot-password":
          return await abortNavigation();
      }
    }
    // jinak presmeruje na dashboard, pac uz je prihlaseny a snazi se na login nebo signup
    else {
      switch (toSyscode) {
        case "login":
        case "signup":
        case "forgot-password":
          return await navigateTo(localePath(routes?.pz?.path), {
            redirectCode: 302,
          });
      }
    }
  }
  // neni prihlaseny, ale chce jit na zabezpecenou stranku
  else if (to.path.includes("/pz") || to.path.includes("/admin")) {
    switch (fromSyscode) {
      // pokud jde z login, signup nebo password, zrusi navigaci
      case "login":
      case "signup":
      case "forgot-password":
        return await abortNavigation();
      // jinak presmeruje na login
      default:
        return await navigateTo(localePath(routes?.login?.path), {
          redirectCode: 302,
        });
    }
  }
}
