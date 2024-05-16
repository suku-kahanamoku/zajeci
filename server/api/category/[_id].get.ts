import { H3Event } from 'h3';

import { CategorySchema } from '@/server/models/category.schema';

export default defineEventHandler(async (event: H3Event) => {
	const result = await CategorySchema.findOne({ _id: event.context.params?._id });

	return result?.toObject();
});
