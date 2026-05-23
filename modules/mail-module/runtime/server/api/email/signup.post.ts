export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  await sendSignupMail(event, body.email);
  return { message: "Email sent" };
});
