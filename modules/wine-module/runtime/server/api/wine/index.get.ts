import type { H3Event } from "h3";
import { phpApiFetch, RESOLVE_FACTORY } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const rawQuery = getQuery(event);
  const factory = rawQuery.factory as string | undefined;
  const phpResponse = await phpApiFetch(event, "/products", { query: rawQuery });
  if (factory && phpResponse.data?.items) {
    (phpResponse.data.items as any[]).forEach((item) => RESOLVE_FACTORY(item, factory));
  }
  return phpResponse;
});
