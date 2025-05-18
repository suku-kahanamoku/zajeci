import type { H3Event } from "h3";
import {
  defineEventHandler,
  readBody,
  setUserSession,
  useMailing,
  createError,
} from "#imports";

import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@/modules/mongoose-module/runtime/utils/server.functions";
import SignupForm from "@/emails/SignupForm.vue";

import { UserModel } from "../../../models/user.schema";
import { GENERATE_HASHED_PASSWORD } from "../../../utils/password.functions";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  // kontrola, zda jsou zadane vsechny potrebne fieldy
  if (!body.email || !body.password || !body.terms) {
    throw createError({
      statusCode: 400,
      message: "Missing required fields.",
    });
  }

  // Nejdrive zkontroluje, zda je pripojeni k databazi
  if (GET_STATUS() === 0) {
    await CONNECT_WITH_RETRY();
  }

  let user = await UserModel.findOne({ email: body.email });

  // kontrola zda uzivatel jiz existuje
  if (user?._id) {
    throw createError({
      statusCode: 400,
      message: "User already exists.",
    });
  }
  // pokud neexistuje vytvori noveho uzivatele v DB
  else {
    user = await new UserModel({
      ...body,
      password: await GENERATE_HASHED_PASSWORD(body.password),
    }).save();

    const t = await useTranslation(event);
    const { template, send } = await useMailing(event);
    await send({
      subject: t("$.mailing.signup.subject"),
      template: await template(SignupForm, {
        url: process.env.FRONTEND_HOST,
      }),
      to: [
        {
          Email: body.email,
        },
      ],
      bcc: [
        {
          Email: process.env.NUXT_MAILING_FROM!,
        },
      ],
    });
  }

  const result = { ...user.toObject(), password: undefined };

  // nastavi session
  await setUserSession(event, {
    user: result,
  });

  return result;
});
