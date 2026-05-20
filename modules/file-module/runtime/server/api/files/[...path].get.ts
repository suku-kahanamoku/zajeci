import type { H3Event } from "h3";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import mime from "mime";

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const backendRoot =
    (config.phpFileRoot as string) || "https://www.charter-agency.com";
  const filePath = (event.context.params?._ ?? event.context.params?.path ?? "")
    .replace(/\.\./g, "")
    .replace(/^\/+/, "");

  const isTemp = event.path?.startsWith("/api/temp/");
  const subdir = isTemp ? "temp" : "files";
  const cacheControl = isTemp
    ? "private, max-age=300"
    : "public, max-age=31536000, immutable";

  setResponseHeader(event, "Cache-Control", cacheControl);

  if (backendRoot.startsWith("http://") || backendRoot.startsWith("https://")) {
    const response = await fetch(`${backendRoot}/${subdir}/${filePath}`);
    if (!response.ok) {
      throw createError({ statusCode: response.status, statusMessage: "File not found" });
    }
    setResponseHeader(event, "Content-Type", response.headers.get("content-type") || "application/octet-stream");
    return new Uint8Array(await response.arrayBuffer());
  }

  const absPath = join(backendRoot, subdir, filePath);
  if (!existsSync(absPath)) {
    throw createError({ statusCode: 404, statusMessage: "File not found" });
  }
  const mimeType = mime.getType(filePath) || "application/octet-stream";
  setResponseHeader(event, "Content-Type", mimeType);
  return new Uint8Array(await readFile(absPath));
});
