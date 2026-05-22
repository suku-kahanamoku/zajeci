import { sendResetPasswordMail } from "@/server/utils/mailer";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseUrl = config.phpApiBaseUrl as string;
  const body = await readBody(event);

  if (!body?.email) {
    throw createError({
      statusCode: 400,
      message: "Email is required",
    });
  }

  // PHP vygeneruje nove nahodne heslo a ulozi ho
  let response: any = null;
  let responseStatusCode = 400;
  try {
    response = await $fetch<any>(`${baseUrl}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: { email: body.email },
    });
  } catch (err: any) {
    responseStatusCode = err.statusCode ?? err.response?.status ?? 400;
    response = err.data ?? null;
  }

  if (!response?.success) {
    throw createError({
      statusCode: responseStatusCode,
      message: response?.message || "Password reset failed",
    });
  }

  // Odesleme email s novym heslem (prazdne heslo = email neexistuje, tichy uspech)
  if (response.data?.password) {
    await sendResetPasswordMail(
      event,
      body.email,
      response.data.email,
      response.data.password,
    );
  }

  return { success: true };
});
