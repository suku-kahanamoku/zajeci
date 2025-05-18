import { type H3Event } from "h3";
import {
  oauth,
  setUserSession,
  sendRedirect,
  useRuntimeConfig,
} from "#imports";
import { tryCookieLocale } from "@intlify/utils/h3";

import type { ITokens } from "../../../types/auth.interface";

export default oauth.auth0EventHandler({
  /**
   * todo - udelat propojeni se service https://workspace.dev.tendera.ai/docs
   *
   * @param {H3Event} event
   * @param {{ tokens: ITokens; user: any }} { tokens, user }
   * @returns {*}
   */
  async onSuccess(
    event: H3Event,
    { tokens, user }: { tokens: ITokens; user: any }
  ) {
    const i18n = useRuntimeConfig(event).public?.i18n;
    // nastavi user session
    await setUserSession(event, {
      user,
      tokens,
    });
    const locale =
      tryCookieLocale(event, {
        lang: "",
        name: i18n?.detectBrowserLanguage?.cookieKey,
      })?.toString() || i18n?.defaultLocale;
    //
    return await sendRedirect(event, locale === "en" ? "/pz" : `/${locale}/pz`);
  },

  /**
   *
   *
   * @param {H3Event} event
   * @returns {*}
   */
  async onError(event: H3Event) {
    const i18n = useRuntimeConfig(event).public?.i18n;
    const locale =
      tryCookieLocale(event, {
        lang: "",
        name: i18n?.detectBrowserLanguage?.cookieKey,
      })?.toString() || i18n?.defaultLocale;
    //
    return await sendRedirect(
      event,
      locale === "en" ? "/login" : `/${locale}/login`
    );
  },
});
