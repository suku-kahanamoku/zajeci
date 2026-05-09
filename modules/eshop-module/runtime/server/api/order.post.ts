import type { H3Event } from "h3";
import { phpApiFetch, toLegacySingleResponse } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  const phpResponse = await phpApiFetch(event, "/orders", {
    method: "POST",
    body: body,
  });

  const result = phpResponse.data;

  // Send order confirmation email with PHP order data + original cashdesk user info
  if (phpResponse.success && result?.id) {
    await $fetch("/api/email/order", {
      method: "POST",
      body: { ...result, _cashdeskUser: body.user },
    });
  }

  return toLegacySingleResponse(phpResponse);
});
