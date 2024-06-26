import { H3Event } from 'h3';

import { UserModel } from '@/server/models/user.schema';
import { COMPARE_PASSWORD, GENERATE_HASHED_PASSWORD } from '@/utils/server.functions';

export default defineEventHandler(async (event: H3Event) => {
	const t = await useTranslation(event);
	const body = await readBody(event);
	delete body._id, body.email;
	// kontrola uzivatele
	const user = await UserModel.findById(event.context.params?._id);
	if (user?._id) {
		if (body.password) {
			// kontrola hesla
			const isValid =
				(await COMPARE_PASSWORD(body.password, user.password || '')) ||
				(await COMPARE_PASSWORD(body.password, user.tempPassword || ''));
			delete body.password;
			if (!isValid) {
				throw createError({
					statusCode: 400,
					statusMessage: t('$.message.incorrect_login'),
					message: t('$.message.password_not_match'),
				});
			}
			// zmena hesla
			if (body.newPassword) {
				body.password = await GENERATE_HASHED_PASSWORD(body.newPassword);
			}
		}
	}
	// pokud uzivatel neexistuje, zarve chybu
	else {
		throw createError({
			statusCode: 404,
			statusMessage: t('$.message.not_found'),
			message: t('$.message.user_not_exists'),
		});
	}
	const result = await UserModel.findByIdAndUpdate(event.context.params?._id, body, { new: true });

	return { ...result?.toObject(), password: undefined };
});
