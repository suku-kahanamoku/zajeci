import { H3Event } from 'h3';

import { WineSchema } from '@/server/models/wine.schema';
import { WineDocument } from '@/server/types/wine.type';

export default defineEventHandler(async (event: H3Event): Promise<WineDocument | undefined> => {
	const result = await WineSchema.findOne({ _id: event.context.params?._id });

	return result?.toObject();
});
