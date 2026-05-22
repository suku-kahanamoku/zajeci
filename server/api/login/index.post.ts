import { setUserSessionFromPhp } from "@/server/utils/session";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseUrl = config.phpApiBaseUrl as string;
  const body = await readBody(event);

  // Volame PHP login endpoint
  let response: any = null;
  let responseStatusCode = 401;
  try {
    response = await $fetch<any>(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email: body.email, password: body.password },
    });
  } catch (err: any) {
    responseStatusCode = err.statusCode ?? err.response?.status ?? 401;
    response = err.data ?? null;
  }

  if (!response?.success || !response?.data?.token) {
    throw createError({
      statusCode: responseStatusCode,
      message: response?.message || "Invalid credentials",
    });
  }

  const { token, id } = response.data;
  await setUserSessionFromPhp(event, baseUrl, token, id);

  return { success: true };
});
