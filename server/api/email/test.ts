import { defineEventHandler, H3Event } from "h3";
import { phpApiFetch } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  await phpApiFetch(event, "/mailer/test", {
    query: { email: config.mailingFrom as string },
  });
  return { message: "Test email sent" };
});
