import type { H3Event } from "h3";
import { phpApiFetch, normalizePhpQuery, toLegacySingleResponse } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const id = event.context.params?._id ?? event.context.params?.id;
  const query = normalizePhpQuery(getQuery(event));
  const phpResponse = await phpApiFetch(event, `/products/${id}`, { query });
  return toLegacySingleResponse(phpResponse);
});
