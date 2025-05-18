import type { H3Event } from "h3";
import { defineEventHandler, readBody, createError } from "#imports";

import { ImageModel } from "../../../../models/image.schema";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  delete body._id, body.email;
  // kontrola uzivatele
  const image = await ImageModel.findById(event.context.params?.id);
  if (!image?._id) {
    throw createError({
      statusCode: 404,
    });
  }
  const result = await ImageModel.findByIdAndUpdate(
    event.context.params?.id,
    body,
    { new: true }
  );

  return result?.toObject();
});
