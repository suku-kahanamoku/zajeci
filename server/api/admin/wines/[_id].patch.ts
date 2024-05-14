import { H3Event } from 'h3';

import { WineSchema } from '@/server/models/wine.schema';

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody(event);
	const result = await WineSchema.findByIdAndUpdate(event.context.params?._id, body);

	return result?.toObject();
});
