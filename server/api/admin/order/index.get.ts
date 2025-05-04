import { H3Event } from "h3";

import { OrderModel } from "@/server/models/order.schema";
import { OrderDocument } from "@/server/types/order.type";

export default defineEventHandler(
  async (event: H3Event): Promise<OrderDocument[] | undefined> => {
    const query = getQuery(event);
    const where = JSON.parse((query.q || "{}") as string);
    const limit = parseInt(query.limit as string, 10) || 100;
    const page = parseInt(query.page as string, 10) || 1;
    const skip = (page - 1) * limit;

    const result = await OrderModel.find(where).limit(limit).skip(skip);

    return result.map((i) => i.toObject());
  }
);
