import type { H3Event } from "h3";
import { phpApiFetch, toLegacySingleResponse } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  const phpResponse = await phpApiFetch(event, "/orders", {
    method: "POST",
    body,
  });

  const result = phpResponse.data;

  // Send order confirmation email if order was created successfully
  if (phpResponse.success && result?.id) {
    await $fetch("/api/email/order", { method: "POST", body: result });
  }

  return toLegacySingleResponse(phpResponse);
});

