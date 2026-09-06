import type { H3Event } from "h3";

/**
 * Nacte plny user objekt z PHP GET /users/:id a ulozi ho do session.
 * Struktura session je stejna jako odpoved PHP /users/:id.
 */
export async function setUserSessionFromPhp(
  event: H3Event,
  baseUrl: string,
  token: string,
  userId: number,
): Promise<void> {
  const frontendHost = String(useRuntimeConfig().frontendHost || "");
  const host = frontendHost ? new URL(frontendHost).hostname : "";
  const userResponse = await $fetch<any>(`${baseUrl}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(host ? { "X-Forwarded-Host": host } : {}),
    },
  }).catch(() => null);

  const user = userResponse?.data ?? { id: userId };

  await setUserSession(event, { token, user });
}
