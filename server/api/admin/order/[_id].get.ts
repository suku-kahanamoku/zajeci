import { H3Event } from "h3";

import { OrderModel } from "@/server/models/order.schema";
import { OrderDocument } from "@/server/types/order.type";

export default defineEventHandler(
  async (event: H3Event): Promise<OrderDocument | undefined> => {
    const result = await OrderModel.findOne({ _id: event.context.params?._id });

    return result?.toObject();
  }
);
