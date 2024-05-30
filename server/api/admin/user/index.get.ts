import { H3Event } from 'h3';
import { UserModel } from '@/server/models/user.schema';

export default defineEventHandler(async (event: H3Event) => {
	const query = getQuery(event);
	const result = await UserModel.find(query);
	return result.map((i) => ({ ...i.toObject(), password: undefined }));
});
