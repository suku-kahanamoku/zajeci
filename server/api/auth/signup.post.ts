import SignupForm from "@/emails/SignupForm.vue";
import { setUserSessionFromPhp } from "@/server/utils/session";

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
      data: { message: registerResponse?.message || "Registration failed" },
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
  const { template, send } = await useMailing(event);
  await send({
    subject: "$.mailing.signup.subject",
    template: await template(SignupForm, body),
    to: [{ Email: body.email }],
    bcc: [{ Email: process.env.NUXT_MAILING_FROM! }],
  });

  return { success: true };
});
