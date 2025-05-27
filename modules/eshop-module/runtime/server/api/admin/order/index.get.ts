import { H3Event } from "h3";

import { OrderModel } from "@/modules/eshop-module/runtime/models/order.schema";
import { IOrder, IOrderesResponse } from "@/modules/eshop-module/runtime/types/order.interface";
import { RESOLVE_FACTORY } from "@/modules/common-module/runtime/utils/server.functions";
import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@/modules/mongoose-module/runtime/utils";

export default defineEventHandler(
  async (event: H3Event): Promise<IOrderesResponse> => {
    const query = getQuery(event);
    const where = JSON.parse((query.q || "{}") as string);
    const limit = parseInt(query.limit as string, 10) || 100;
    const page = parseInt(query.page as string, 10) || 1;
    const skip = (page - 1) * limit;

    // Nejdrive zkontroluje, zda je pripojeni k databazi
    if (GET_STATUS() === 0) {
      await CONNECT_WITH_RETRY();
    }

    const orders = await OrderModel.find(where).limit(limit).skip(skip);

    const total = await OrderModel.countDocuments(where);

    const result = orders?.map((i) => {
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
