import { setUserSessionFromPhp } from "@/server/utils/session";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseUrl = config.phpApiBaseUrl as string;
  const body = await readBody(event);

  // Volame PHP login endpoint
  const response = await $fetch<any>(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { email: body.email, password: body.password },
  });

  if (!response?.success || !response?.data?.token) {
    throw createError({
      statusCode: 401,
      data: { message: response?.message || "Invalid credentials" },
    });
  }

  const { token, id } = response.data;
  await setUserSessionFromPhp(event, baseUrl, token, id);

  return { success: true };
});
