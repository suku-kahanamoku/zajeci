import type { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const baseUrl = config.phpApiBaseUrl as string;

  const parts = await readMultipartFormData(event);
  const filePart = parts?.find((part) => part.name === "file" && part.data);

  if (!filePart || !filePart.data) {
    throw createError({ statusCode: 422, statusMessage: "Missing file field" });
  }

  const session = await getUserSession(event).catch(() => null);
  const token = (session as any)?.token || (session as any)?.tokens?.access_token;

  const form = new FormData();
  const blob = new Blob([filePart.data], {
    type: filePart.type || "application/octet-stream",
  });
  form.append("file", blob, filePart.filename || "upload.bin");

  const headers: Record<string, string> = {};
  const frontendHost = String(config.frontendHost || "");
  const host = frontendHost ? new URL(frontendHost).hostname : "";
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (host) headers["X-Forwarded-Host"] = host;

  return await $fetch(`${baseUrl}/files/upload`, {
    method: "POST",
    headers,
    body: form,
  });
});
