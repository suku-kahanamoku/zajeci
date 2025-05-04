import { H3Event } from "h3";

import { WineModel } from "@/server/models/wine.schema";

export default defineEventHandler(async (event: H3Event) => {
  const query = getQuery(event);
  const where = JSON.parse((query.q || "{}") as string);

  if (where?._id) {
    return await WineModel.deleteMany(where);
  }
});
