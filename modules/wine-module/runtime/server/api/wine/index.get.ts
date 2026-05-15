import type { H3Event } from "h3";
import { phpApiFetch } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const q = getQuery(event) as Record<string, any>;
  const existing = q.q ? JSON.parse(q.q as string) : {};
  existing["kind"] = { value: "tasting", operator: "neq" };
  q.q = JSON.stringify(existing);
  return phpApiFetch(event, "/products", { query: q });
});
