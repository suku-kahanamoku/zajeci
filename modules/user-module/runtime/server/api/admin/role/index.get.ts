import type { H3Event } from "h3";
import { phpApiFetch } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  return phpApiFetch(event, "/roles", { query: getQuery(event) });
});
