import type { H3Event } from "h3";
import { phpApiFetch } from "@/server/utils/phpApi";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  const phpResponse = await phpApiFetch(event, "/orders", {
    method: "POST",
    body: body,
  });

  // Send order confirmation email with PHP order data + original cashdesk user info
  if (phpResponse.success && phpResponse.data?.id) {
    try {
      await $fetch("/api/email/order", {
        method: "POST",
        body: { ...phpResponse.data, _cashdeskUser: body.user },
      });
    } catch (emailError) {
      console.error("Order email failed (order was created):", emailError);
    }
  }

  return phpResponse;
});

