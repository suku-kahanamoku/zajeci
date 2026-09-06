import { phpApiFetch } from "@/server/utils/phpApi";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  return phpApiFetch(event, "/auth/complete-reset", {
    method: "POST",
    body: {
      token: body?.token,
      new_password: body?.new_password,
    },
  });
});
