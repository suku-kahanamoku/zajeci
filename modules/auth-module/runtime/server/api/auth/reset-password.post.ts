import type { H3Event } from "h3";
import {
  defineEventHandler,
  readBody,
  useMailing,
  useTranslate,
  createError,
} from "#imports";

import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@/modules/mongoose-module/runtime/utils/server.functions";

import {
  GENERATE_PASSWORD,
  GENERATE_HASHED_PASSWORD,
} from "../../../utils/password.functions";
import { UserModel } from "../../../models/user.schema";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const newPassword = GENERATE_PASSWORD();

  // Nejdrive zkontroluje, zda je pripojeni k databazi
  if (GET_STATUS() === 0) {
    await CONNECT_WITH_RETRY();
  }

  const user = await UserModel.findOne({ email: body.email });

  if (user?._id) {
    await UserModel.updateOne(
      { _id: user._id },
      { tempPassword: await GENERATE_HASHED_PASSWORD(newPassword) }
    );

    const strSubject = await useTranslate(
      event,
      "$.mailing.forgot_password.subject"
    );

    try {
      // odesle mail se zapomenutym heslem
      const mail = await useMailing(event);
      const { html } = await mail.template({
        name: "ResetPassword.vue",
        props: {
          url: process.env.FRONTEND_HOST,
          email: body.email,
          password: newPassword,
        },
      });
      await mail.send({
        subject: strSubject,
        template: html,
        to: [
          {
            Email: body.email,
          },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    throw createError({
      statusCode: 404,
      message: "User does not exist.",
    });
  }

  return { message: "Email successfully sent" };
});
