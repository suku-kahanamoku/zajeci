import { H3Event } from 'h3';

import { WineModel } from '@/server/models/wine.schema';
import { WineDocument } from '@/server/types/wine.type';

export default defineEventHandler(async (event: H3Event): Promise<WineDocument | undefined> => {
	const result = await WineModel.findOne({ _id: event.context.params?._id });

	return result?.toObject();
});
