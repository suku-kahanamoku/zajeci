import ResetPasswordForm from "@/emails/ResetPasswordForm.vue";

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

  // Odesleme email s novym heslem
  const { template, send } = await useMailing(event);
  await send({
    subject: "$.mailing.forgot_password.subject",
    template: await template(ResetPasswordForm, {
      email: response.data.email,
      password: response.data.password,
      url: process.env.FRONTEND_HOST,
    }),
    to: [{ Email: body.email }],
  });

  return { success: true };
});
