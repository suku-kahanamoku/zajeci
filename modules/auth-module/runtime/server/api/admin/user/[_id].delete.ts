import { H3Event } from "h3";

import { RESOLVE_FACTORY } from "@/modules/common-module/runtime/utils/server.functions";
import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@/modules/mongoose-module/runtime/utils";

import { UserModel } from "../../../../models/user.schema";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);

  // Nejdrive zkontroluje, zda je pripojeni k databazi
  if (GET_STATUS() === 0) {
    await CONNECT_WITH_RETRY();
  }

  const user = await UserModel.findOneAndDelete({
    _id: event.context.params?._id,
  });
  const result = { ...user?.toObject(), password: undefined };
  RESOLVE_FACTORY(result, query.factory);

  return {
    data: result,
    meta: { total: result ? 1 : 0 },
  };
});
