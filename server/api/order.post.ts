import { H3Event } from 'h3';
import { OrderSchema } from '../models/order.schema';

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody(event);
	const result = await OrderSchema.create(body);

	return result.toObject();
});
