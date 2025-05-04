import { H3Event } from "h3";

import { WineModel } from "@/server/models/wine.schema";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const result = await WineModel.create(body);

  return result?.toObject();
});
