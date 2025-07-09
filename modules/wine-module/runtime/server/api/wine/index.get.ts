import { H3Event } from "h3";

import { RESOLVE_FACTORY } from "@suku-kahanamoku/common-module/server-utils";
import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@suku-kahanamoku/mongoose-module/server-utils";

import { WineModel } from "../../../models/wine.schema";
import { IWinesResponse } from "../../../types";

export default defineEventHandler(
  async (event: H3Event): Promise<IWinesResponse> => {
    const query = getQuery(event);
    const where = JSON.parse((query.q || "{}") as string);
    const limit = parseInt(query.limit as string, 10) || 100;
    const page = parseInt(query.page as string, 10) || 1;
    const skip = (page - 1) * limit;

    // Nejdrive zkontroluje, zda je pripojeni k databazi
    if (GET_STATUS() === 0) {
      await CONNECT_WITH_RETRY();
    }

    const wines = await WineModel.find(where).limit(limit).skip(skip);

    const total = await WineModel.countDocuments(where);

    const result = wines?.map((i) => {
      const o = i.toObject();
      RESOLVE_FACTORY(o, query.factory);
      return o;
    });

    return {
      data: result,
      meta: { total, limit, skip },
    };
  }
);
