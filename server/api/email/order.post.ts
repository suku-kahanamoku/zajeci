import { defineEventHandler, H3Event, readBody } from "h3";

import OrderForm from "@/emails/OrderForm.vue";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const t = await useTranslation(event);
  const { template, send } = await useMailing(event);

  await send({
    subject: t("$.mailing.order.confirmed.subject", { orderId: body._id }),
    template: await template(OrderForm, {
      ...body,
      email: process.env.NUXT_MAILING_FROM as string,
      orderId: body._id,
    }),
    to: [
      {
        Email: body.user.email,
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
