import { H3Event } from 'h3';

import { CategorySchema } from '@/server/models/category.schema';

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody(event);
	const result = await CategorySchema.create(body);

	return result?.toObject();
});
