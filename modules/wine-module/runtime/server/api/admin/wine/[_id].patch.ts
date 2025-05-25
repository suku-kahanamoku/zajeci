import { H3Event } from "h3";

import { RESOLVE_FACTORY } from "@/modules/common-module/runtime/utils/server.functions";
import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@/modules/mongoose-module/runtime/utils";

import { WineModel } from "../../../../models/wine.schema";
import { IWine, IWineResponse } from "@/modules/wine-module/runtime/types";

export default defineEventHandler(
  async (event: H3Event): Promise<IWineResponse> => {
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
    const result = wine?.toObject() || ({} as IWine);
    RESOLVE_FACTORY(result, query.factory);

    return {
      data: result,
      meta: { total: result ? 1 : 0 },
    };
  }
);
