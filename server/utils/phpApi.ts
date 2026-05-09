import type { H3Event } from "h3";
import { RESOLVE_FACTORY } from "@suku-kahanamoku/common-module/server-utils";

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

/**
 * Normalizes a Nuxt-style query object to PHP API format.
 * Called automatically inside phpApiFetch.
 * - projection: JSON array/object or array → comma-separated string (PHP format)
 * - skip + limit → page + limit
 * - Strips nuxt-internal params (factory)
 */
function normalizeQuery(query: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(query)) {
    if (key === "factory") continue;

    if (key === "projection") {
      let proj: any = value;
      if (typeof proj === "string") {
        try {
          proj = JSON.parse(proj);
        } catch {
          result[key] = proj;
          continue;
        }
      }
      if (Array.isArray(proj)) {
        result[key] = proj.join(",");
      } else if (proj !== null && typeof proj === "object") {
        result[key] = Object.keys(proj).join(",");
      }
      continue;
    }

    if (key === "skip") continue;

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
    return (session as any)?.token || (session as any)?.tokens?.access_token || null;
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

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const query = options.query ? normalizeQuery(options.query) : undefined;

  return await $fetch<PhpApiResponse<T>>(baseUrl + path, {
    method: (options.method as any) || "GET",
    headers,
    ...(options.body !== undefined ? { body: options.body } : {}),
    ...(query ? { query } : {}),
  });
}

export { RESOLVE_FACTORY };
