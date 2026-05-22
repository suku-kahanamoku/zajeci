import { defineEventHandler, H3Event, readBody } from "h3";
import { sendSignupMail } from "@/server/utils/mailer";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  await sendSignupMail(event, body.email);
  return { message: "Email sent" };
});
