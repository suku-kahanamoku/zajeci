import { H3Event } from "h3";

import { OrderModel } from "@/server/models/order.schema";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const result = await OrderModel.create(body);

  return result?.toObject();
});
