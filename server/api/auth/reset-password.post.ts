import { H3Event } from 'h3';
import { useMailing } from '@/server/composables/useMailing';

import { UserSchema } from '@/server/models/user.schema';
import { GENERATE_PASSWORD, GENERATE_HASHED_PASSWORD } from '@/utils/server.functions';

export default defineEventHandler(async (event: H3Event) => {
	const t = await useTranslation(event);
	const { template, send } = await useMailing(event);
	const body = await readBody(event);

	// kontrola uzivatele a hesla
	const user = await UserSchema.findOne({ email: body.email });

	// odesle mail se zapomenutym heslem
	if (user?._id) {
		const newPassword = GENERATE_PASSWORD();
		await UserSchema.updateOne({ _id: user._id }, { temp_password: await GENERATE_HASHED_PASSWORD(newPassword) });

		await send({
			subject: '$.mailing.forgot_password.subject',
			template: await template({
				name: 'ResetPasswordForm.vue',
				props: {
					url: process.env.FRONTEND_HOST,
					email: user.email,
					password: newPassword,
				},
			}),
			to: [
				{
					Email: body.email,
				},
			],
		});
	} else {
		throw createError({
			statusCode: 404,
			statusMessage: t('$.message.not_found'),
			message: t('$.message.user_not_exists'),
		});
	}

	return { message: 'Email sent' };
});
