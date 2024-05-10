import { UserSchema } from '@/server/models/user.schema';

export default defineEventHandler(async (event) => {
	return await UserSchema.findOneAndDelete({ _id: event.context.params?._id });
});
