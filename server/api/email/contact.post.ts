import { defineEventHandler, H3Event, readBody } from "h3";
import {
  sendContactFormMail,
  sendContactFormAdminMail,
} from "@/server/utils/mailer";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const msg = body.message ?? body.msg ?? "";

  await sendContactFormMail(event, body.email, msg);
  await sendContactFormAdminMail(
    event,
    config.mailingFrom as string,
    body.email,
    msg,
  );

  return { message: "Email sent" };
});
