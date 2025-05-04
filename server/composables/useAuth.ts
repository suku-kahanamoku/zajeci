import { H3Event } from "h3";
import { User } from "#auth-utils";

export function useAuth() {
  const setSession = async (event: H3Event, user: User) => {
    // Fetch Fakturoid token
    const response = await $fetch("/api/fakturoid/token", {
      method: "POST",
    });

    const fakturoidToken = `${response.token_type} ${response.access_token}`;

    return await setUserSession(event, {
      user,
      loggedInAt: new Date().toISOString(),
      fakturoidToken,
    });
  };

  const getSession = async (event: H3Event) => {
    return await getUserSession(event);
  };

  return { setSession, getSession };
}
