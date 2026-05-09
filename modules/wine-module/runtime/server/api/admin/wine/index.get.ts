import type { H3Event } from "h3";
import { phpApiFetch, normalizePhpQuery, toLegacyListResponse } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const query = normalizePhpQuery(getQuery(event));
  const phpResponse = await phpApiFetch(event, "/products", { query });
  return toLegacyListResponse(phpResponse);
});
