import type { H3Event } from "h3";

import { phpApiFetch } from "@/server/utils/phpApi";
import { SEND_ORDER_MAIL } from "@/modules/mail-module/runtime/server/utils/mailer";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  const orderRes = await phpApiFetch(event, "/orders", {
    method: "POST",
    body: body,
  });

  // Send order confirmation email with PHP order data + original cashdesk user info
  if (orderRes.success && orderRes.data?.id) {
    const orderId = orderRes.data.id;
    const recipientEmail = body.user?.email;
    const orderNumber = String(orderRes.data.order_number ?? orderId);

    // Send confirmation email
    if (recipientEmail) {
      // Generate invoice and collect PDF attachment paths
      let invoiceAttachments: string[] | undefined;
      let _invoiceDebug: any;
      try {
        const invoiceRes = await phpApiFetch(event, "/invoices", {
          method: "POST",
          body: { order_id: orderId, projection: ["files"] },
        });
        _invoiceDebug = {
          success: invoiceRes?.success,
          message: invoiceRes?.message,
          pdf_error: invoiceRes?.data?._pdf_error ?? null,
          files: invoiceRes?.data?.files ?? [],
        };
        const files = invoiceRes?.data?.files;
        if (files?.length > 0) {
          invoiceAttachments = (files as { path: string }[]).map((f) => f.path);
        }
      } catch (invoiceError) {
        _invoiceDebug = { exception: String(invoiceError) };
        console.error(
          "Invoice creation failed (order was created):",
          invoiceError,
        );
      }
      orderRes.data._invoiceDebug = _invoiceDebug;

      try {
        await SEND_ORDER_MAIL(
          event,
          recipientEmail,
          orderNumber,
          invoiceAttachments,
        );
      } catch (emailError) {
        console.error("Order email failed (order was created):", emailError);
      }
    }
  }

  return orderRes;
});
