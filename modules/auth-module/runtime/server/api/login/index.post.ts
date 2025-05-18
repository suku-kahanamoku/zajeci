import type { H3Event } from "h3";
import {
  defineEventHandler,
  readBody,
  createError,
  setUserSession,
} from "#imports";

import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@/modules/mongoose-module/runtime/utils/server.functions";

import { COMPARE_PASSWORD } from "../../../utils/password.functions";
import { UserModel } from "../../../models/user.schema";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  // kontrola, zda jsou zadane vsechny potrebne fieldy
  if (!body.email || !body.password) {
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

  // kontrola uzivatele a hesla
  if (user?._id) {
    const isValid =
      (await COMPARE_PASSWORD(body.password, user.password || "")) ||
      (await COMPARE_PASSWORD(body.password, user.tempPassword || ""));
    if (!isValid) {
      throw createError({
        statusCode: 401,
        message: "Incorrect login credentials.",
      });
    }
  }
  // pokud uzivatel neexistuje, zarve chybu
  else {
    throw createError({
      statusCode: 401,
      message: "Incorrect login credentials.",
    });
  }

  const result = { ...user?.toObject(), password: undefined };
  // nastavi session
  await setUserSession(event, {
    user: result,
    /* loggedInAt: new Date().toISOString(), */
  });

  return result;
});
