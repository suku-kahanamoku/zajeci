import type { H3Event } from "h3";
export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const filePath = (event.context.params?._ ?? event.context.params?.path ?? "")
    .replace(/\.\./g, "")
    .replace(/^\/+/, "");

  const isTemp = event.path?.startsWith("/api/temp/");
  const session = await getUserSession(event).catch(() => null);
  const token = (session as any)?.token || (session as any)?.tokens?.access_token;
  const frontendHost = String(config.frontendHost || "");
  const host = frontendHost ? new URL(frontendHost).hostname : "";
  const backendPath = `${isTemp ? "temp" : "files"}/${filePath}`;
  const response = await fetch(
    `${String(config.phpApiBaseUrl)}/files/${isTemp ? "temp" : "content"}?path=${encodeURIComponent(backendPath)}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(host ? { "X-Forwarded-Host": host } : {}),
      },
    },
  );
  if (!response.ok) {
    throw createError({ statusCode: response.status, statusMessage: "File not found" });
  }
  setResponseHeader(event, "Content-Type", response.headers.get("content-type") || "application/octet-stream");
  setResponseHeader(event, "Cache-Control", response.headers.get("cache-control") || "private, no-store");
  return new Uint8Array(await response.arrayBuffer());
});
