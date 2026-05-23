import { setUserSessionFromPhp } from "@/server/utils/session";
import { sendSignupMail } from "@/modules/mail-module/runtime/server/utils/mailer";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseUrl = config.phpApiBaseUrl as string;
  const body = await readBody(event);

  // Registrace uzivatele na PHP backendu
  let registerResponse: any = null;
  let registerStatusCode = 400;
  try {
    registerResponse = await $fetch<any>(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  } catch (err: any) {
    registerStatusCode = err.statusCode ?? err.response?.status ?? 400;
    registerResponse = err.data ?? null;
  }

  if (!registerResponse?.success) {
    throw createError({
      statusCode: registerStatusCode,
      message: registerResponse?.message || "Registration failed",
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
