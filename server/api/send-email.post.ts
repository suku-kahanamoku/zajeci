import { H3Event } from "h3";

import ContactForm from "@/emails/ContactForm.vue";
import ContactFormAdmin from "@/emails/ContactFormAdmin.vue";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const { template, send } = await useMailing(event);

  // odesle mail klientovi
  await send({
    subject: "$.mailing.contact_form.subject",
    template: await template(ContactForm, {
      url: process.env.FRONTEND_HOST,
      email: body.email,
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
    subject: "$.mailing.contact_form.subject",
    template: await template(ContactFormAdmin, {
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
