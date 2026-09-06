import { phpApiFetch } from "@/server/utils/phpApi";

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
    response = await phpApiFetch<any>(event, "/auth/reset-password", {
      method: "POST",
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

  return { success: true };
});
