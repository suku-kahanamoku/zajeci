import type { H3Event } from "h3";
import { defineEventHandler, getQuery } from "#imports";

import { ImageModel } from "../../../../models/image.schema";

export default defineEventHandler(async (event: H3Event) => {
  if (event.context.params?.id) {
    const result = await ImageModel.findOne({ _id: event.context.params?.id });
    return result?.toObject();
  } else {
    const query = getQuery(event);
    const where = JSON.parse((query.q || "{}") as string);
    const limit = Number.parseInt(query.limit as string, 10) || 100;
    const page = Number.parseInt(query.page as string, 10) || 1;
    const skip = (page - 1) * limit;

    const result = await ImageModel.find(where).limit(limit).skip(skip);
    return result.map((i) => i.toObject());
  }
});
