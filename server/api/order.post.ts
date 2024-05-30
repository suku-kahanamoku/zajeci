import { H3Event } from 'h3';
import { OrderSchema } from '../models/order.schema';
import { IS_OBJECT_ID } from '@/utils/check.functions';

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody(event);
	if (!IS_OBJECT_ID(body.user?._id)) delete body.user?._id;
	if (!IS_OBJECT_ID(body.user?.address?.main?._id)) delete body.user?.address?.main?._id;
	if (!IS_OBJECT_ID(body.delivery?.address?._id)) delete body.delivery?.address?._id;
	//
	const result = await OrderSchema.create(body);

	return result.toObject();
});
