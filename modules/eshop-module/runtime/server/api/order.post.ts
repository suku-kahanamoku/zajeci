import type { H3Event } from "h3";

import { phpApiFetch } from "@/server/utils/phpApi";
import { SEND_ORDER_MAIL } from "@/modules/mail-module/runtime/server/utils/mailer";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  const phpResponse = await phpApiFetch(event, "/orders", {
    method: "POST",
    body: body,
  });

  // Send order confirmation email with PHP order data + original cashdesk user info
  if (phpResponse.success && phpResponse.data?.id) {
    const recipientEmail = body.user?.email;
    const orderId = String(
      phpResponse.data.order_number ?? phpResponse.data.id,
    );
    if (recipientEmail) {
      try {
        await SEND_ORDER_MAIL(event, recipientEmail, orderId);
      } catch (emailError) {
        console.error("Order email failed (order was created):", emailError);
      }
    }
  }

  return phpResponse;
});
