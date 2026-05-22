import type { H3Event } from "h3";
import { phpApiFetch } from "@/server/utils/phpApi";

/**
 * Proxy to php-core /mailer/ – sends a mail.
 * Expected query params:
 *   template, to, subject, fromEmail, fromName, fromPhone
 */
export default defineEventHandler(async (event: H3Event) => {
  return phpApiFetch(event, "/mailer/", { query: getQuery(event) as Record<string, any> });
});
