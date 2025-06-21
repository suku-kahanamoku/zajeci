import type { H3Event } from "h3";
import {
  defineEventHandler,
  getRequestURL,
  requireUserSession,
  /* getUserSession, */
} from "#imports";

export default defineEventHandler(async (event: H3Event) => {
  const { pathname } = getRequestURL(event);
  if (pathname.includes("/pz") || pathname.includes("/admin")) {
    await requireUserSession(event);
  }
});
