import { H3Event } from 'h3';

import { WineModel } from '@/server/models/wine.schema';

export default defineEventHandler(async (event: H3Event) => {
	return await WineModel.findOneAndDelete({ _id: event.context.params?._id });
});
