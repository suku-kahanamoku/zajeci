import type { H3Event } from "h3";
import { defineEventHandler, readBody } from "#imports";

import { ImageModel } from "../../../../models/image.schema";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  return await new ImageModel(body).save();
});
