export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  await sendResetPasswordMail(event, body.email, body.email, body.password);
  return { message: "Email sent" };
});
