import { H3Event } from 'h3';
import { UserModel } from '@/server/models/user.schema';

export default defineEventHandler(async (event: H3Event) => {
	return await UserModel.findOneAndDelete({ _id: event.context.params?._id });
});
