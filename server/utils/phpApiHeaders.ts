import type { H3Event } from "h3";

/** Server-only headers shared by JSON, login, session and file requests. */
export function phpApiHeaders(
  event: H3Event,
  token?: string | null,
): Record<string, string> {
  const config = useRuntimeConfig();
  const internalKey = String(config.internalApiKey || "").trim();
  if (!internalKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "INTERNAL_API_KEY is not configured",
    });
  }
  const frontendHost = String(
    config.frontendHost ||
      config.public?.frontendHost ||
      process.env.FRONTEND_HOST ||
      "",
  );
  const host = frontendHost
    ? new URL(frontendHost).hostname
    : event.headers.get("host")?.split(":")[0] || "";
  return {
    "X-Internal-Key": internalKey,
    ...(host ? { "X-Forwarded-Host": host } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
