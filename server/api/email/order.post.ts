import { defineEventHandler, H3Event, readBody } from "h3";
import { sendOrderMail } from "@/server/utils/mailer";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  const cashdeskUser = body._cashdeskUser ?? {};
  const recipientEmail = cashdeskUser.email ?? body.user?.email;
  const orderId = String(body.order_number ?? body.id ?? "");

  if (!recipientEmail) return { message: "No recipient email, skipped" };

  await sendOrderMail(event, recipientEmail, orderId);
  return { message: "Email sent" };
});
