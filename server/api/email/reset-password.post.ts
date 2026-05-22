import { defineEventHandler, H3Event, readBody } from "h3";
import { sendResetPasswordMail } from "@/server/utils/mailer";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  await sendResetPasswordMail(event, body.email, body.email, body.password);
  return { message: "Email sent" };
});
