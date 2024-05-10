import { UserSchema } from '@/server/models/user.schema';

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const result = await UserSchema.find(query);
	return result.map((i) => ({ ...i.toObject(), password: undefined }));
});
