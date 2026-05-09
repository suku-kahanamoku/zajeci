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
 * Normalizes a Nuxt-style query object to PHP API format:
 * - `projection`: JSON array/object → comma-separated string
 * - `skip` + `limit` → `page` + `limit`
 * - Strips nuxt-internal params (`factory`)
 */
export function normalizePhpQuery(
  query: Record<string, any>,
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(query)) {
    if (key === "factory") continue;

    if (key === "projection") {
      let proj: any = value;
      if (typeof proj === "string") {
        try {
          proj = JSON.parse(proj);
        } catch {
          // already a plain string — pass through
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

    if (key === "skip") continue; // converted to page below

    result[key] = value;
  }

  // Convert skip → page
  if ("skip" in query && "limit" in query) {
    const skip = Number(query.skip) || 0;
    const limit = Number(query.limit) || 20;
    result.page = Math.floor(skip / limit) + 1;
  }

  return result;
}

/**
 * Fetches the Bearer token from the current user session.
 */
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
 * Proxy call to the PHP API. Forwards the session Bearer token automatically.
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

  return await $fetch<PhpApiResponse<T>>(baseUrl + path, {
    method: (options.method as any) || "GET",
    headers,
    ...(options.body !== undefined ? { body: options.body } : {}),
    ...(options.query ? { query: options.query } : {}),
  });
}

/**
 * Converts PHP API paginated response to the legacy Nuxt response format
 * expected by the existing frontend composables.
 */
export function toLegacyListResponse<T>(
  phpResponse: PhpApiResponse<PhpApiPaginatedData<T>>,
  factory?: string,
) {
  const d = phpResponse.data;
  const items = d?.items ?? [];
  if (factory) {
    items.forEach((item: any) => RESOLVE_FACTORY(item, factory));
  }
  return {
    data: items,
    meta: {
      total: d?.total ?? 0,
      limit: d?.limit ?? 20,
      skip: ((d?.page ?? 1) - 1) * (d?.limit ?? 20),
    },
  };
}

/**
 * Converts PHP API single-item response to the legacy Nuxt response format.
 */
export function toLegacySingleResponse<T>(phpResponse: PhpApiResponse<T>) {
  return {
    data: phpResponse.data ?? ({} as T),
    meta: { total: phpResponse.data ? 1 : 0 },
  };
}
