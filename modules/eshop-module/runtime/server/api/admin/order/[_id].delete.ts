import { H3Event } from "h3";

import { OrderModel } from "@/modules/eshop-module/runtime/models/order.schema";
import { RESOLVE_FACTORY } from "@suku-kahanamoku/common-module/server-utils";
import {
  GET_STATUS,
  CONNECT_WITH_RETRY,
} from "@suku-kahanamoku/mongoose-module/server-utils";
import { IOrder, IOrderResponse } from "@/modules/eshop-module/runtime/types/order.interface";

export default defineEventHandler(
  async (event: H3Event): Promise<IOrderResponse> => {
    const query = getQuery(event);

    // Nejdrive zkontroluje, zda je pripojeni k databazi
    if (GET_STATUS() === 0) {
      await CONNECT_WITH_RETRY();
    }

    const order = await OrderModel.findOneAndDelete({
      _id: event.context.params?.id,
    });
    const result = order?.toObject() || ({} as IOrder);
    RESOLVE_FACTORY(result, query.factory);

    return {
      data: result,
      meta: { total: result ? 1 : 0 },
    };
  }
);
