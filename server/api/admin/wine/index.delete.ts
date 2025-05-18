import { H3Event } from "h3";

import { WineModel } from "@/server/models/wine.schema";
import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@/modules/mongoose-module/runtime/utils";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const where = JSON.parse((query.q || "{}") as string);

  // Nejdrive zkontroluje, zda je pripojeni k databazi
  if (GET_STATUS() === 0) {
    await CONNECT_WITH_RETRY();
  }

  if (where?._id) {
    const wines = await WineModel.deleteMany(where);

    return {
      data: wines.deletedCount,
    };
  }
});
