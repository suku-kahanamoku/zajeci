export default defineEventHandler(async (event) => {
  if (event.path !== "/api/admin" && !event.path.startsWith("/api/admin/")) return;

  const session = await getUserSession(event).catch(() => null);
  const user = (session as any)?.user;
  const role = user?.role?.name || user?.role;
  if (!(session as any)?.token) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }
  if (role !== "admin") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }
});
