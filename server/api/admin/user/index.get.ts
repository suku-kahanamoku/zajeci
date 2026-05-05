import type { H3Event } from "h3";
import { phpApiFetch, toLegacyListResponse } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const phpResponse = await phpApiFetch(event, "/users", { query });
  return toLegacyListResponse(phpResponse);
});
