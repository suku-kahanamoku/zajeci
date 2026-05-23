import { phpApiFetch } from "@/server/utils/phpApi";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  await phpApiFetch(event, "/mailer/test", {
    query: { email: config.mailingFrom as string },
  });
  return { message: "Test email sent" };
});
