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

  const { token, id, email, first_name, last_name, role } = response.data;

  // Ulozime token a uzivatele do session (stejna struktura jako OAuth login)
  await setUserSession(event, {
    token,
    user: {
      id,
      email,
      name: `${first_name} ${last_name}`.trim(),
      first_name,
      last_name,
      role,
    },
  });

  return { success: true };
});
