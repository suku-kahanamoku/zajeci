import type { H3Event } from "h3";
import { phpApiFetch, normalizePhpQuery, toLegacyListResponse } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const rawQuery = getQuery(event);
  const factory = rawQuery.factory as string | undefined;
  const query = normalizePhpQuery(rawQuery);
  const phpResponse = await phpApiFetch(event, "/products", { query });
  return toLegacyListResponse(phpResponse, factory);
});
