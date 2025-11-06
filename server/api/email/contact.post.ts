import { defineEventHandler, H3Event, readBody } from "h3";

import ContactForm from "@/emails/ContactForm.vue";
import ContactFormAdmin from "@/emails/ContactForm.vue";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const t = await useTranslation(event);
  const { template, send } = await useMailing(event);

  // odesle mail klientovi
  await send({
    subject: t("$.mailing.contact_form.subject"),
    template: await template(ContactForm, {
      tt: t,
      url: process.env.FRONTEND_HOST,
      msg: body.message,
    }),
    to: [
      {
        Email: body.email,
      },
    ],
  });

  // odesle mail adminovi
  await send({
    subject: t("$.mailing.contact_form.subject"),
    template: await template(ContactFormAdmin, {
      tt: t,
      url: process.env.FRONTEND_HOST,
      email: body.email,
      msg: body.message,
    }),
    to: [
      {
        Email: process.env.NUXT_MAILING_FROM as string,
      },
    ],
  });

  return { message: "Email sent" };
});
