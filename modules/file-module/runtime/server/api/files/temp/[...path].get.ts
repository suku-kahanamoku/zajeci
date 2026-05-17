import type { H3Event } from "h3";
import { readFileSync, existsSync } from "node:fs";
import { extname } from "node:path";

const MIME_MAP: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".csv": "text/csv",
};

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();

  // FILE_ROOT is the php-core root directory (same server, configured via env)
  const fileRoot = (config.phpFileRoot as string | undefined)?.replace(
    /\/$/,
    "",
  );
  if (!fileRoot) {
    throw createError({
      statusCode: 500,
      statusMessage: "phpFileRoot not configured",
    });
  }

  // Nitro wildcard route "**" stores the catch-all segment under "_"
  const pathParam = event.context.params?._ ?? event.context.params?.path ?? "";
  // Only serve files from temp/ – never allow path traversal
  const safePath = pathParam.replace(/\.\./g, "").replace(/^\/+/, "");
  const absPath = `${fileRoot}/temp/${safePath}`;

  if (!absPath.startsWith(fileRoot) || !existsSync(absPath)) {
    throw createError({ statusCode: 404, statusMessage: "File not found" });
  }

  const ext = extname(absPath).toLowerCase();
  const mimeType = MIME_MAP[ext] ?? "application/octet-stream";

  const buffer = readFileSync(absPath);
  setResponseHeader(event, "Content-Type", mimeType);
  setResponseHeader(event, "Cache-Control", "private, max-age=300");
  return buffer;
});
