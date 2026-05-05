import type { H3Event } from "h3";
import { phpApiFetch, toLegacyListResponse } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const factory = query.factory as string | undefined;
  const phpResponse = await phpApiFetch(event, "/products", { query });
  return toLegacyListResponse(phpResponse, factory);
});
