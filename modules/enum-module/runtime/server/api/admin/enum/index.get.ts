import type { H3Event } from "h3";
import { phpApiFetch } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const result = await phpApiFetch(event, "/enumerations", {
    query: getQuery(event),
  });

  // CmpTable uses row.original.name for the first column link label
  if (result.success && Array.isArray(result.data)) {
    result.data = (result.data as any[]).map((item: any) => ({
      ...item,
      name: item.syscode,
    }));
  }

  return result;
});
