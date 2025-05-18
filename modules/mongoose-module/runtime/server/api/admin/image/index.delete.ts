import type { H3Event } from "h3";
import { defineEventHandler } from "#imports";

import { ImageModel } from "../../../../models/image.schema";

export default defineEventHandler(async (event: H3Event) => {
  return await ImageModel.findOneAndDelete({ _id: event.context.params?.id });
});
