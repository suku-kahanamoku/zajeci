import { defineEventHandler, H3Event, readBody } from "h3";

import SignupForm from "@/emails/SignupForm.vue";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const t = await useTranslation(event);
  const { template, send } = await useMailing(event);

  await send({
    subject: t("$.mailing.signup.subject"),
    template: await template(SignupForm, {
      url: process.env.FRONTEND_HOST,
    }),
    to: [
      {
        Email: body.email,
      },
    ],
    bcc: [
      {
        Email: process.env.NUXT_MAILING_FROM!,
      },
    ],
  });

  return { message: "Email sent" };
});
