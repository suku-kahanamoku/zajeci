import type { H3Event } from "h3";
import { phpApiFetch, toLegacySingleResponse } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const id = event.context.params?.id;
  const phpResponse = await phpApiFetch(event, `/products/${id}`);
  return toLegacySingleResponse(phpResponse);
});
