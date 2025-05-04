import { H3Event } from "h3";

import { OrderModel } from "@/server/models/order.schema";

export default defineEventHandler(async (event: H3Event) => {
  return await OrderModel.findOneAndDelete({ _id: event.context.params?._id });
});
