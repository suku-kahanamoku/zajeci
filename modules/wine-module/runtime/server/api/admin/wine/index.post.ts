import type { H3Event } from "h3";
import { phpApiFetch } from "@/server/utils/phpApi";

function fileNameFromTempPath(path: string): string {
  const part = path.split("/").pop() || "upload.bin";
  return part.trim() || "upload.bin";
}

async function commitPaths(
  event: H3Event,
  productId: number,
  paths: string[],
  visibility: "public" | "private",
): Promise<number[]> {
  const committedIds: number[] = [];

  for (const path of paths) {
    const commitRes = await phpApiFetch<{ id?: number }>(event, "/files/commit", {
      method: "POST",
      body: {
        path,
        name: fileNameFromTempPath(path),
        visibility,
        entity_type: "product",
        entity_id: productId,
      },
    });

    const fileId = Number((commitRes.data as any)?.id || 0);
    if (fileId) committedIds.push(fileId);
  }

  return committedIds;
}

export default defineEventHandler(async (event: H3Event) => {
  const body = (await readBody(event)) as Record<string, any>;
  const rawPaths = Array.isArray(body?.paths) ? body.paths : [];
  const paths = rawPaths.filter((p: unknown) => typeof p === "string" && p.trim().length > 0);

  const { paths: _paths, ...productBody } = body || {};
  const createRes = await phpApiFetch<{ id?: number }>(event, "/products", {
    method: "POST",
    body: productBody,
  });

  const productId = Number((createRes.data as any)?.id || 0);
  if (!productId || paths.length === 0) {
    return createRes;
  }

  const visibility: "public" | "private" = Number(productBody?.published) === 1 ? "public" : "private";
  const fileIds = await commitPaths(event, productId, paths, visibility);

  if (fileIds.length > 0) {
    await phpApiFetch(event, `/products/${productId}`, {
      method: "PATCH",
      body: { file_ids: fileIds },
    });
  }

  return phpApiFetch(event, `/products/${productId}`);
});
