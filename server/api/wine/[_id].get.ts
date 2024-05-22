import { H3Event } from 'h3';

import { WineModel, WineSchema } from '@/server/models/wine.schema';

export default defineEventHandler(async (event: H3Event): Promise<WineModel | undefined> => {
	const result = await WineSchema.findOne({ _id: event.context.params?._id });

	return result?.toObject();
});
