import type { H3Event } from "h3";
import {
  defineEventHandler,
  readBody,
  setUserSession,
  useMailing,
  createError,
  useTranslate,
} from "#imports";

import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@/modules/mongoose-module/runtime/utils/server.functions";

import { GENERATE_HASHED_PASSWORD } from "../../../utils/password.functions";
import { UserModel } from "../../../models/user.schema";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  // kontrola, zda jsou zadane vsechny potrebne fieldy
  if (!body.email || !body.password || !body.terms) {
    throw createError({
      statusCode: 400,
      message: "Missing required fields.",
    });
  }

  let user;
  try {
    // Nejdrive zkontroluje, zda je pripojeni k databazi
    if (GET_STATUS() === 0) {
      await CONNECT_WITH_RETRY();
    }

    user = await UserModel.findOne({ email: body.email });
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Database error.",
    });
  }

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

    const strSubject = await useTranslate(event, "$.mailing.signup.subject");

    try {
      const mail = await useMailing(event);
      const { html } = await mail.template({
        name: "Signup.vue",
        props: {
          url: process.env.FRONTEND_HOST,
        },
      });
      // odesle registracni mail
      await mail.send({
        subject: strSubject,
        template: html,
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
    } catch (error) {
      console.error(error);
    }
  }

  const result = { ...user.toObject(), password: undefined };

  // nastavi session
  await setUserSession(event, {
    user: result,
  });

  return result;
});
