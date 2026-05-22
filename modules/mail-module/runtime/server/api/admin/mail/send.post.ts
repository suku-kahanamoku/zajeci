import type { H3Event } from "h3";
import { phpApiFetch } from "@/server/utils/phpApi";

/**
 * Proxy to php-core /mailer/ – sends a mail.
 * Expected body: template, to, subject
 * fromEmail, fromName, fromPhone are taken from runtime config.
 */
export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  return phpApiFetch(event, "/mailer/", {
    query: {
      template: body.template,
      to: body.to,
      subject: body.subject,
      fromEmail: config.mailingFrom,
      fromName: config.mailingFromName,
      fromPhone: config.mailingFromPhone,
    },
  });
});
