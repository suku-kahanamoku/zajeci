import { phpApiHeaders } from "@/server/utils/phpApiHeaders";
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
  const userResponse = await $fetch<any>(`${baseUrl}/users/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      ...phpApiHeaders(event, token),
    },
  }).catch(() => null);

  const user = userResponse?.data ?? { id: userId };

  await setUserSession(event, { token, user });
}
