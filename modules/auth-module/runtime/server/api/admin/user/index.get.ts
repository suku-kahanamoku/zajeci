import type { H3Event } from "h3";
import { createError, defineEventHandler, getQuery } from "#imports";

import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@/modules/mongoose-module/runtime/utils/server.functions";

import { RESOLVE_FACTORY } from "../../../../utils/server.functions";
import { UserModel } from "../../../../models/user.schema";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);

  const where = JSON.parse((query.q || "{}") as string);
  const limit = Number.parseInt(query.limit as string, 10) || 100;
  const page = Number.parseInt(query.page as string, 10) || 1;
  const skip = (page - 1) * limit;

  let result;
  try {
    // Nejdrive zkontroluje, zda je pripojeni k databazi
    if (GET_STATUS() === 0) {
      await CONNECT_WITH_RETRY();
    }

    result = await UserModel.find(where).limit(limit).skip(skip);
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Database error.",
    });
  }

  let total;
  try {
    total = await UserModel.countDocuments(where);
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Database error.",
    });
  }

  const users = result?.map((i) => {
    const user = { ...i.toObject(), password: undefined };
    RESOLVE_FACTORY(user, query.factory);
    return user;
  });

  return {
    data: users,
    meta: { total, limit, skip },
  };
});
