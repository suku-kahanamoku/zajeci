export default defineEventHandler(async (event) => {
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
