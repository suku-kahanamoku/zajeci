import { H3Event } from "h3";

import { WineModel } from "@/server/models/wine.schema";
import { RESOLVE_FACTORY } from "@/modules/common-module/runtime/utils/server.functions";
import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@/modules/mongoose-module/runtime/utils";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const body = await readBody(event);

  // Nejdrive zkontroluje, zda je pripojeni k databazi
  if (GET_STATUS() === 0) {
    await CONNECT_WITH_RETRY();
  }

  const wine = await WineModel.findByIdAndUpdate(
    event.context.params?._id,
    body,
    { new: true }
  );
  const result = wine?.toObject() || {};
  RESOLVE_FACTORY(result, query.factory);

  return {
    data: result,
    meta: { total: result ? 1 : 0 },
  };
});
