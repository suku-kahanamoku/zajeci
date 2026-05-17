import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const baseUrl = config.phpApiBaseUrl as string;
  const id = event.context.params?.id;

  const session = await getUserSession(event).catch(() => null);
  const token =
    (session as any)?.token || (session as any)?.tokens?.access_token;

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await $fetch.raw(`${baseUrl}/files/${id}/preview`, {
    headers,
  });

  const contentType =
    response.headers.get("content-type") ?? "application/octet-stream";
  setResponseHeader(event, "Content-Type", contentType);
  setResponseHeader(event, "Cache-Control", "private, max-age=300");

  return response._data;
});
