import type { H3Event } from "h3";
import { phpApiFetch } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  return phpApiFetch(event, "/categories", { method: "POST", body });
});
