import { H3Event } from "h3";

import { RESOLVE_FACTORY } from "@suku-kahanamoku/common-module/server-utils";
import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@suku-kahanamoku/mongoose-module/server-utils";

import { WineModel } from "../../../../models/wine.schema";
import { IWine, IWineResponse } from "../../../../types";

export default defineEventHandler(
  async (event: H3Event): Promise<IWineResponse> => {
    const query = getQuery(event);

    // Nejdrive zkontroluje, zda je pripojeni k databazi
    if (GET_STATUS() === 0) {
      await CONNECT_WITH_RETRY();
    }

    const wine = await WineModel.findOneAndDelete({
      _id: event.context.params?.id,
    });
    const result = wine?.toObject() || ({} as IWine);
    RESOLVE_FACTORY(result, query.factory);

    return {
      data: result,
      meta: { total: result ? 1 : 0 },
    };
  }
);
