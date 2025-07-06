import type { User } from "#auth-utils";

import { CLONE } from "@suku-kahanamoku/common-module/utils";

export const useAuthStore = defineStore("Auth", () => {
  const { loggedIn, user: authUser, session, clear, fetch } = useUserSession();
  const localePath = useLocalePath();

  const emptyUser = {
    _id: "",
    email: "",
    phone: "",
    givenName: "",
    surname: "",
    address: {
      main: {
        _id: "",
        name: "",
        street: "",
        city: "",
        zip: "",
        state: "",
      },
      variants: [],
    },
    valid: false,
  };

  const user = computed<User | null>(() => {
    if (authUser.value) {
      authUser.value.address = authUser.value.address || {};
      // nastavi fakturacni adresu
      authUser.value.address.main =
        authUser.value.address.main || CLONE(emptyUser.address.main);
      authUser.value.address.main!.name =
        authUser.value.address.main!.name ||
        authUser.value.name ||
        `${authUser.value.givenName} ${authUser.value.surname}`;
      // pripravy dodaci adresy
      authUser.value.address.variants = authUser.value.address.variants || [];
    }
    return authUser.value;
  });

  const initials = computed(
    () =>
      `${
        (
          (user.value?.givenName && user.value?.givenName[0]) ||
          ""
        )?.toUpperCase() +
        ((user.value?.surname && user.value?.surname[0]) || "")?.toUpperCase()
      }`
  );

  const isAdmin = computed(() => user.value?.role === "admin");

  /**
   * Funkce pro prihlaseni
   *
   * @param {Record<string, any>} data
   * @return {*}  {Promise<void>}
   */
  const login = async (data: Record<string, any>): Promise<void> => {
    await $fetch("/api/login", { method: "POST", body: data });
    await fetch();
    await navigateTo(localePath("/admin"));
  };

  /**
   * Prihlaseni pomoci google
   */
  const loginByGoogle = () => {
    location.href = "/api/login/google";
  };

  /**
   * Prihlaseni pomoci linkedin
   *
   */
  const loginByLinkedin = () => {
    location.href = "/api/login/linkedin";
  };

  /**
   * Prihlaseni pomoci facebook
   *
   */
  const loginByFacebook = () => {
    location.href = "/api/login/facebook";
  };

  /**
   * Funkce pro odhlaseni
   *
   * @return {*}  {Promise<void>}
   */
  const logout = async (): Promise<void> => {
    await clear();
    await navigateTo(localePath("/login"));
  };

  /**
   * Registrace
   *
   * @param {Record<string, any>} data
   * @return {*}  {Promise<void>}
   */
  const signup = async (data: Record<string, any>): Promise<void> => {
    await $fetch("/api/auth/signup", { method: "POST", body: data });
    await fetch();
    await navigateTo(localePath("/admin"));
  };

  /**
   * Resetovani hesla
   *
   * @param {Record<string, any>} data
   * @return {*}  {Promise<void>}
   */
  const resetPassword = async (data: Record<string, any>): Promise<void> => {
    await $fetch("/api/auth/reset-password", { method: "POST", body: data });
  };

  return {
    fetch,
    login,
    loginByGoogle,
    loginByLinkedin,
    loginByFacebook,
    signup,
    logout,
    resetPassword,
    loggedIn,
    emptyUser,
    user,
    session,
    initials,
    isAdmin,
  };
});
