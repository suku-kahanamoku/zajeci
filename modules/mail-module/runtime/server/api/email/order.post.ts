export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const cashdeskUser = body._cashdeskUser ?? {};
  const recipientEmail = cashdeskUser.email ?? body.user?.email;
  const orderId = String(body.order_number ?? body.id ?? "");

  if (!recipientEmail) return { message: "No recipient email, skipped" };

  await sendOrderMail(event, recipientEmail, orderId);
  return { message: "Email sent" };
});
