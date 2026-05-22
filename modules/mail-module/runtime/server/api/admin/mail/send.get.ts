import type { H3Event } from "h3";
import { phpApiFetch } from "@/server/utils/phpApi";

/**
 * Proxy to php-core /mailer/ – sends a mail.
 * Expected query params:
 *   template, to, subject
 * fromEmail, fromName, fromPhone are taken from runtime config.
 */
export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event) as Record<string, any>;

  return phpApiFetch(event, "/mailer/", {
    query: {
      ...query,
      fromEmail: config.mailingFrom,
      fromName: config.mailingFromName,
      fromPhone: config.mailingFromPhone,
    },
  });
});
