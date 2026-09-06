import { type H3Event } from "h3";
import {
  defineOAuthLinkedInEventHandler,
  sendRedirect,
  useRuntimeConfig,
} from "#imports";
import { setUserSessionFromPhp } from "@/server/utils/session";
import { phpApiFetch } from "@/server/utils/phpApi";

export default defineOAuthLinkedInEventHandler({
  async onSuccess(
    event: H3Event,
    { tokens, user }: { tokens: any; user: any },
  ) {
    const email = user?.email as string | undefined;
    const subject = (user?.sub || user?.id) as string | undefined;

    if (!email || !subject) {
      return await sendRedirect(event, "/login");
    }

    const config = useRuntimeConfig();
    const baseUrl = config.phpApiBaseUrl as string;
    const firstName: string = user?.firstName || user?.given_name || "";
    const lastName: string = user?.lastName || user?.family_name || "";

    let response: any;
    try {
      response = await phpApiFetch<any>(event, "/auth/oauth", {
        method: "POST",
        internal: true,
        body: { provider: "linkedin", subject, email, first_name: firstName, last_name: lastName },
      });
    } catch {
      return await sendRedirect(event, "/login");
    }

    if (!response?.success || !response?.data?.token) {
      return await sendRedirect(event, "/login");
    }

    const { token, id } = response.data;
    await setUserSessionFromPhp(event, baseUrl, token, id);

    return await sendRedirect(event, "/admin");
  },

  async onError(event: H3Event) {
    return await sendRedirect(event, "/login");
  },
});
