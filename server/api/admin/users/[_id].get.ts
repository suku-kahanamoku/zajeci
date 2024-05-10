import { UserSchema } from '@/server/models/user.schema';

export default defineEventHandler(async (event) => {
	const result = await UserSchema.findOne({ _id: event.context.params?._id });
	return { ...result?.toObject(), password: undefined };
});
