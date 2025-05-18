import type { H3Event } from "h3";
import { defineEventHandler, getQuery, readBody, createError } from "#imports";

import { RESOLVE_FACTORY } from "@/modules/common-module/runtime/utils/server.functions";
import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@/modules/mongoose-module/runtime/utils/server.functions";
import { UserModel } from "@/modules/auth-module/runtime/models/user.schema";
import { GENERATE_HASHED_PASSWORD } from "@/modules/auth-module/runtime/utils/password.functions";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const body = await readBody(event);

  // Nejdrive zkontroluje, zda je pripojeni k databazi
  if (GET_STATUS() === 0) {
    await CONNECT_WITH_RETRY();
  }

  const dbUser = await UserModel.findOne({ email: body.email });

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
  const result = { ...user?.toObject(), password: undefined };
  RESOLVE_FACTORY(result, query.factory);

  return {
    data: result,
    meta: { total: result ? 1 : 0 },
  };
});
