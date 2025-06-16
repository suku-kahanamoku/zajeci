import type { H3Event } from "h3";
import {
  defineEventHandler,
  getRequestURL,
  requireUserSession,
} from "#imports";

export default defineEventHandler(async (event: H3Event) => {
  const { pathname } = getRequestURL(event);
  if (
    pathname.includes("/api/") &&
    !pathname.includes("/auth") &&
    !pathname.includes("/login")
  ) {
    await requireUserSession(event);
  }
});
