import { H3Event } from 'h3';

import { UserSchema } from '@/server/models/user.schema';
import { COMPARE_PASSWORD } from '@/utils/server.functions';

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody(event);

	// kontrola, zda jsou zadane vsechny potrebne fieldy
	if (!body.email || !body.password) {
		throw createError({
			statusCode: 400,
			statusMessage: '$.message.bad_request',
			message: '$.message.miss_fields',
		});
	}

	// kontrola uzivatele a hesla
	const user = await UserSchema.findOne({ email: body.email });
	if (user?._id) {
		const isValid =
			(await COMPARE_PASSWORD(body.password, user.password || '')) ||
			(await COMPARE_PASSWORD(body.password, user.temp_password || ''));
		if (!isValid) {
			throw createError({
				statusCode: 401,
				statusMessage: '$.message.unauthorized',
				message: '$.message.incorrect_login',
			});
		}
	}
	// pokud uzivatel neexistuje, zarve chybu
	else {
		throw createError({
			statusCode: 401,
			statusMessage: '$.message.unauthorized',
			message: '$.message.incorrect_login',
		});
	}

	const result = { ...user.toObject(), password: undefined };
	// nastavi session
	await setUserSession(event, {
		user: result,
		loggedInAt: new Date().toISOString(),
	});

	return result;
});
