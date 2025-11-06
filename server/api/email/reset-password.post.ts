import { defineEventHandler, H3Event, readBody } from "h3";

import ResetPasswordForm from "@/emails/ResetPasswordForm.vue";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const t = await useTranslation(event);
  const { template, send } = await useMailing(event);

  await send({
    subject: t("$.mailing.forgot_password.subject"),
    template: await template(ResetPasswordForm, {
      tt: t,
      url: process.env.FRONTEND_HOST,
      email: body.email,
      password: body.password,
    }),
    to: [
      {
        Email: body.email,
      },
    ],
  });

  return { message: "Email sent" };
});
