import { setUserSessionFromPhp } from "@/server/utils/session";
import { sendSignupMail } from "@/server/utils/mailer";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseUrl = config.phpApiBaseUrl as string;
  const body = await readBody(event);

  // Registrace uzivatele na PHP backendu
  const registerResponse = await $fetch<any>(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).catch((err: any) => err?.data ?? null);

  if (!registerResponse?.success) {
    throw createError({
      statusCode: registerResponse?.statusCode || 400,
      message: registerResponse?.message || "Registration failed",
      data: registerResponse?.debug ?? undefined,
    });
  }

  // Prihlaseni noveho uzivatele – ziskame token
  const loginResponse = await $fetch<any>(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { email: body.email, password: body.password },
  }).catch((err: any) => err?.data ?? null);

  if (loginResponse?.success && loginResponse?.data?.token) {
    const { token, id } = loginResponse.data;
    await setUserSessionFromPhp(event, baseUrl, token, id);
  }

  // Odesleme potvrzovaci email
  await sendSignupMail(event, body.email, body.password);

  return { success: true };
});
