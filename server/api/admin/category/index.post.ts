import type { H3Event } from "h3";
import { phpApiFetch, toLegacySingleResponse } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const phpResponse = await phpApiFetch(event, "/categories", {
    method: "POST",
    body,
  });
  return toLegacySingleResponse(phpResponse);
});
