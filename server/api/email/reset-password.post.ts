import { defineEventHandler, H3Event, readBody } from "h3";

import ResetPasswordForm from "@/emails/ResetPasswordForm.vue";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const { template, send } = await useMailing(event);

  await send({
    subject: "$.mailing.forgot_password.subject",
    template: await template(ResetPasswordForm, {
      ...body,
      url: process.env.FRONTEND_HOST,
    }),
    to: [
      {
        Email: body.email,
      },
    ],
  });

  return { message: "Email sent" };
});
