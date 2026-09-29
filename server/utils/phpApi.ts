import { phpApiHeaders } from "@/server/utils/phpApiHeaders";
import type { H3Event } from "h3";

export interface PhpApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string> | null;
}

export interface PhpApiPaginatedData<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Wire contract shared by the Nuxt clients of php-core: q is a JSON object
 * with Mongo-style operators; sort is a JSON array. The form module may still
 * produce its older value/operator structure inside the browser. */
function normalizeQuery(query: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(query)) {
    if (key === "skip" || value === undefined || value === null || value === "") continue;
    if (key === "factory") {
      result[key] = typeof value === "string" ? value : JSON.stringify(value);
      continue;
    }
    if (key === "projection") {
      let projection = value;
      if (typeof projection === "string") {
        try { projection = JSON.parse(projection); } catch { /* already CSV */ }
      }
      result[key] = Array.isArray(projection)
        ? projection.join(",")
        : projection && typeof projection === "object"
          ? Object.keys(projection).join(",")
          : projection;
      continue;
    }
    if (key === "q") {
      let filter: unknown = value;
      if (typeof filter === "string") {
        try { filter = JSON.parse(filter); }
        catch { throw createError({ statusCode: 422, statusMessage: "Invalid q filter" }); }
      }
      if (!filter || typeof filter !== "object" || Array.isArray(filter))
        throw createError({ statusCode: 422, statusMessage: "Invalid q filter" });
      const normalized: Record<string, unknown> = {};
      for (const [column, condition] of Object.entries(filter)) {
        if (condition && typeof condition === "object" && !Array.isArray(condition)
            && "value" in condition) {
          const spec = condition as Record<string, any>;
          const raw = typeof spec.operator === "object" ? spec.operator?.value : spec.operator;
          const operator = String(raw || "eq").replace(/^\$/, "");
          const mongoOperators: Record<string, string> = {
            neq: "$ne", ne: "$ne", eq: "$eq", regex: "$regex",
            in: "$in", gt: "$gt", gte: "$gte", lt: "$lt", lte: "$lte",
          };
          const mongoOperator = mongoOperators[operator];
          if (!["$eq", "$ne", "$regex", "$in", "$gt", "$gte", "$lt", "$lte"].includes(mongoOperator))
            throw createError({ statusCode: 422, statusMessage: "Invalid q operator" });
          let fieldValue = spec.value;
          if (typeof fieldValue === "string") {
            try { fieldValue = decodeURIComponent(fieldValue); }
            catch { throw createError({ statusCode: 422, statusMessage: "Invalid q value" }); }
          }
          normalized[column] = { [mongoOperator]: fieldValue };
        } else {
          normalized[column] = condition;
        }
      }
      result.q = JSON.stringify(normalized);
      continue;
    }
    if (key === "sort") {
      let sort: unknown = value;
      if (typeof sort === "string") {
        const legacy = /^([a-zA-Z_][a-zA-Z0-9_]*)\s+(ASC|DESC)$/i.exec(sort.trim());
        if (legacy) sort = [{ [legacy[1]]: legacy[2].toUpperCase() === "ASC" ? 1 : -1 }];
        else {
          try { sort = JSON.parse(sort); }
          catch { throw createError({ statusCode: 422, statusMessage: "Invalid sort" }); }
        }
      }
      if (!Array.isArray(sort) || sort.some((item) => !item || typeof item !== "object" || Array.isArray(item)
          || Object.keys(item).length !== 1 || !Object.values(item).every((direction) => direction === 1 || direction === -1)))
        throw createError({ statusCode: 422, statusMessage: "Invalid sort" });
      result.sort = JSON.stringify(sort);
      continue;
    }
    result[key] = value;
  }

  if ("skip" in query && "limit" in query) {
    const skip = Number(query.skip) || 0;
    const limit = Number(query.limit) || 20;
    result.page = Math.floor(skip / limit) + 1;
  }

  return result;
}

async function getSessionToken(event: H3Event): Promise<string | null> {
  try {
    const session = await getUserSession(event);
    return (
      (session as any)?.token || (session as any)?.tokens?.access_token || null
    );
  } catch {
    return null;
  }
}

/**
 * Thin proxy call to the PHP API.
 * Injects session Bearer token and normalizes query params to PHP format.
 * Returns the raw PHP response; useApi() in the frontend normalizes the shape.
 */
export async function phpApiFetch<T = any>(
  event: H3Event,
  path: string,
  options: {
    method?: string;
    body?: any;
    query?: Record<string, any>;
  } = {},
): Promise<PhpApiResponse<T>> {
  const config = useRuntimeConfig();
  const baseUrl = config.phpApiBaseUrl as string;
  const token = await getSessionToken(event);
  const headers = {
    "Content-Type": "application/json",
    ...phpApiHeaders(event, token),
  };
  const query = options.query ? normalizeQuery(options.query) : undefined;

  return await $fetch<PhpApiResponse<T>>(baseUrl + path, {
    method: (options.method as any) || "GET",
    headers,
    ...(options.body !== undefined ? { body: options.body } : {}),
    ...(query ? { query } : {}),
  });
}
