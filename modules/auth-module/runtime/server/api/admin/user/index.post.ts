import type { H3Event } from "h3";
import { defineEventHandler, getQuery, readBody, createError } from "#imports";

import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@/modules/mongoose-module/runtime/utils/server.functions";

import { GENERATE_HASHED_PASSWORD } from "../../../../utils/password.functions";
import { RESOLVE_FACTORY } from "../../../../utils/server.functions";
import { UserModel } from "../../../../models/user.schema";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const body = await readBody(event);

  let dbUser;
  try {
    // Nejdrive zkontroluje, zda je pripojeni k databazi
    if (GET_STATUS() === 0) {
      await CONNECT_WITH_RETRY();
    }

    dbUser = await UserModel.findOne({ email: body.email });
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Database error.",
    });
  }

  // kontrola zda uzivatel jiz existuje
  if (dbUser?._id) {
    throw createError({
      statusCode: 400,
      message: "User already exists.",
    });
  }

  if (body.password) {
    body.password = await GENERATE_HASHED_PASSWORD(body.password?.toString());
  }

  const user = await new UserModel(body).save();
  RESOLVE_FACTORY(user, query.factory);

  return {
    data: user,
  };
});
