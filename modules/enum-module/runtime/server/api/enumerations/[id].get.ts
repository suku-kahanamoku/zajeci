import type { H3Event } from "h3";
import { phpApiFetch } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const id = event.context.params?.id;
  return phpApiFetch(event, `/enumerations/${id}`, { query: getQuery(event) });
});
