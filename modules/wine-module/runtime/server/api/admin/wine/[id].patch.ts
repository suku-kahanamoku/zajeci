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
    const commitRes = await phpApiFetch<{ id?: number }>(
      event,
      "/files/commit",
      {
        method: "POST",
        body: {
          path,
          name: fileNameFromTempPath(path),
          visibility,
          entity_type: "product",
          entity_id: productId,
        },
      },
    );

    const fileId = Number((commitRes.data as any)?.id || 0);
    if (fileId) committedIds.push(fileId);
  }

  return committedIds;
}

export default defineEventHandler(async (event: H3Event) => {
  const id = Number(event.context.params?.id || 0);
  const body = (await readBody(event)) as Record<string, any>;
  const rawPaths = Array.isArray(body?.paths) ? body.paths : [];
  const paths = rawPaths.filter(
    (p: unknown) => typeof p === "string" && p.trim().length > 0,
  );

  const { paths: _paths, ...productBody } = body || {};
  const patchRes = await phpApiFetch(event, `/products/${id}`, {
    method: "PATCH",
    body: productBody,
  });

  if (!id || paths.length === 0) {
    return patchRes;
  }

  const visibility: "public" | "private" =
    Number(productBody?.published) === 1 ? "public" : "private";
  const committedIds = await commitPaths(event, id, paths, visibility);

  if (committedIds.length > 0) {
    const current = await phpApiFetch<{ file_ids?: number[] }>(
      event,
      `/products/${id}`,
    );
    const existingIds = Array.isArray((current.data as any)?.file_ids)
      ? ((current.data as any).file_ids as number[])
      : [];

    const merged = Array.from(new Set([...existingIds, ...committedIds]));
    await phpApiFetch(event, `/products/${id}`, {
      method: "PATCH",
      body: { file_ids: merged },
    });
  }

  return phpApiFetch(event, `/products/${id}`);
});
