import { H3Event } from 'h3';

import { WineSchema } from '@/server/models/wine.schema';

export default defineEventHandler(async (event: H3Event) => {
	const query = getQuery(event);
	const result = await WineSchema.find(query);
	
	return result.map((i) => i.toObject());
});
