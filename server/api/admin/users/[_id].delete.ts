import { H3Event } from 'h3';
import { UserSchema } from '@/server/models/user.schema';

export default defineEventHandler(async (event: H3Event) => {
	return await UserSchema.findOneAndDelete({ _id: event.context.params?._id });
});
