import {
  SEND_CONTACT_FORM_MAIL,
  SEND_CONTACT_FORM_ADMIN_MAIL,
} from "@/modules/mail-module/runtime/server/utils/mailer";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  const msg = body.message ?? body.msg ?? "";

  await SEND_CONTACT_FORM_MAIL(event, body.email, msg);
  await SEND_CONTACT_FORM_ADMIN_MAIL(
    event,
    config.mailingFrom as string,
    body.email,
    msg,
  );

  return { message: "Email sent" };
});
