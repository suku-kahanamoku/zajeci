import { H3Event } from 'h3';

import { CategorySchema } from '@/server/models/category.schema';

export default defineEventHandler(async (event: H3Event) => {
	const query = getQuery(event);
	const result = await CategorySchema.find(query);

	return result.map((i) => i.toObject());
});
