import { defineEventHandler, H3Event, readBody } from "h3";

import OrderForm from "@/emails/OrderForm.vue";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const t = await useTranslation(event);
  const { template, send } = await useMailing(event);

  // body is PHP order response + _cashdeskUser from order.post.ts
  const cashdeskUser = body._cashdeskUser || {};
  const recipientEmail = cashdeskUser.email || body.user?.email;
  const orderId = body.order_number || body.id || body._id;

  if (!recipientEmail) return { message: "No recipient email, skipped" };

  await send({
    subject: t("$.mailing.order.confirmed.subject", { orderId }),
    template: await template(OrderForm, {
      ...body,
      user: cashdeskUser,
      email: process.env.NUXT_MAILING_FROM as string,
      orderId,
    }),
    to: [
      {
        Email: recipientEmail,
      },
    ],
    bcc: [
      {
        Email: process.env.NUXT_MAILING_FROM as string,
      },
    ],
  });

  return { message: "Email sent" };
});
