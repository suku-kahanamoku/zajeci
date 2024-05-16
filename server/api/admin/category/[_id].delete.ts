import { H3Event } from 'h3';

import { CategorySchema } from '@/server/models/category.schema';

export default defineEventHandler(async (event: H3Event) => {
	return await CategorySchema.findOneAndDelete({ _id: event.context.params?._id });
});
