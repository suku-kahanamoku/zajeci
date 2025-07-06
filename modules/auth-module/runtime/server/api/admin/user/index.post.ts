import type { H3Event } from "h3";
import { defineEventHandler, getQuery, readBody, createError } from "#imports";

import { RESOLVE_FACTORY } from "@suku-kahanamoku/common-module/server-utils";
import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@/modules/mongoose-module/runtime/utils/server.functions";
import { GENERATE_HASHED_PASSWORD } from "@/modules/auth-module/runtime/utils/password.functions";

import { UserModel } from "@/modules/auth-module/runtime/models/user.schema";
import { IUserResponse } from "@/modules/auth-module/runtime/types";

export default defineEventHandler(
  async (event: H3Event): Promise<IUserResponse> => {
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

    const user = await UserModel.create(body);
    const result = { ...user?.toObject(), password: undefined };
    RESOLVE_FACTORY(result, query.factory);

    return {
      data: result,
      meta: { total: result ? 1 : 0 },
    };
  }
);
