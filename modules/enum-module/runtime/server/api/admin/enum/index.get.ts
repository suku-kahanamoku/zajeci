import type { H3Event } from "h3";
import { phpApiFetch } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const result = await phpApiFetch(event, "/enumerations", {
    query: getQuery(event),
  });

  return result;
});
