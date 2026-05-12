import { type H3Event } from "h3";
import {
  defineOAuthGoogleEventHandler,
  setUserSession,
  sendRedirect,
  useRuntimeConfig,
} from "#imports";

export default defineOAuthGoogleEventHandler({
  async onSuccess(
    event: H3Event,
    { tokens, user }: { tokens: any; user: any },
  ) {
    const email = user?.email as string | undefined;

    if (!email) {
      return await sendRedirect(event, "/login");
    }

    const config = useRuntimeConfig();
    const baseUrl = config.phpApiBaseUrl as string;
    const firstName: string = user?.given_name || user?.givenName || "";
    const lastName: string = user?.family_name || user?.familyName || "";

    let response: any;
    try {
      response = await $fetch<any>(`${baseUrl}/auth/oauth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email, first_name: firstName, last_name: lastName },
      });
    } catch {
      return await sendRedirect(event, "/login");
    }

    if (!response?.success || !response?.data?.token) {
      return await sendRedirect(event, "/login");
    }

    const {
      token,
      id,
      email: userEmail,
      first_name,
      last_name,
      role,
    } = response.data;

    await setUserSession(event, {
      token,
      user: {
        id,
        email: userEmail,
        name: `${first_name} ${last_name}`.trim(),
        first_name,
        last_name,
        role,
      },
    });

    return await sendRedirect(event, "/admin");
  },

  async onError(event: H3Event) {
    return await sendRedirect(event, "/login");
  },
});
