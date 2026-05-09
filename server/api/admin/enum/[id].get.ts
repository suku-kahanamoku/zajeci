import type { H3Event } from "h3";
import { phpApiFetch, normalizePhpQuery, toLegacySingleResponse } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const id = event.context.params?.id;
  const query = normalizePhpQuery(getQuery(event));
  const phpResponse = await phpApiFetch(event, `/enumerations/${id}`, { query });
  return toLegacySingleResponse(phpResponse);
});
