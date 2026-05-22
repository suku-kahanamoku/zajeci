import { sendResetPasswordMail } from "@/server/utils/mailer";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const baseUrl = config.phpApiBaseUrl as string;
  const body = await readBody(event);

  if (!body?.email) {
    throw createError({
      statusCode: 400,
      data: { message: "Email is required" },
    });
  }

  // PHP vygeneruje nove nahodne heslo a ulozi ho
  const response = await $fetch<any>(`${baseUrl}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: { email: body.email },
  });

  if (!response?.success) {
    throw createError({
      statusCode: 400,
      data: { message: response?.message || "Password reset failed" },
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
