import { H3Event } from "h3";

import { UserModel } from "@/server/models/user.schema";
import {
  GENERATE_PASSWORD,
  GENERATE_HASHED_PASSWORD,
} from "@/modules/common-module/runtime/utils/server.functions";
import ResetPasswordForm from "@/emails/ResetPasswordForm.vue";

export default defineEventHandler(async (event: H3Event) => {
  const t = await useTranslation(event);
  const body = await readBody(event);

  const user = await UserModel.findOne({ email: body.email });

  // odesle mail se zapomenutym heslem
  if (user?._id) {
    // vygeneruje nove heslo a upravi tempPassword v DB
    const newPassword = GENERATE_PASSWORD();
    await UserModel.updateOne(
      { _id: user._id },
      { tempPassword: await GENERATE_HASHED_PASSWORD(newPassword) }
    );

    // odesle mail s novym heslem klientovi
    const { template, send } = await useMailing(event);
    await send({
      subject: "$.mailing.forgot_password.subject",
      template: await template(ResetPasswordForm, {
        url: process.env.FRONTEND_HOST,
        email: user.email,
        password: newPassword,
      }),
      to: [
        {
          Email: body.email,
        },
      ],
    });
  } else {
    throw createError({
      statusCode: 404,
      statusMessage: t("$.message.not_found"),
      message: t("$.message.user_not_exists"),
    });
  }

  return { message: "Email sent" };
});
