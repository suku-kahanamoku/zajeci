import { H3Event } from 'h3';
import { useMailing } from '@/server/composables/useMailing';

import { UserModel } from '@/server/models/user.schema';
import { GENERATE_HASHED_PASSWORD } from '@/utils/server.functions';

export default defineEventHandler(async (event: H3Event) => {
	const t = await useTranslation(event);
	const body = await readBody(event);

	// kontrola, zda jsou zadane vsechny potrebne fieldy
	if (!body.email || !body.password || !body.terms) {
		throw createError({
			statusCode: 400,
			statusMessage: t('$.message.bad_request'),
			message: t('$.message.miss_fields'),
		});
	}

	// kontrola zda uzivatel jiz existuje
	let user = await UserModel.findOne({ email: body.email });
	if (user?._id) {
		throw createError({
			statusCode: 400,
			statusMessage: t('$.message.bad_request'),
			message: t('$.message.user_exist'),
		});
	}
	// pokud neexistuje vytvori noveho uzivatele v DB
	else {
		user = await new UserModel({ ...body, password: await GENERATE_HASHED_PASSWORD(body.password) }).save();

		// odesle registracni mail
		const { template, send } = await useMailing(event);
		if (user._id) {
			await send({
				subject: '$.mailing.signup.subject',
				template: await template({
					name: 'SignupForm.vue',
					props: {
						url: process.env.FRONTEND_HOST,
					},
				}),
				to: [
					{
						Email: body.email,
					},
				],
				bcc: [
					{
						Email: 'sukusovi@gmail.com',
					},
				],
			});
		}
	}

	const result = { ...user.toObject(), password: undefined };
	// nastavi session
	await setUserSession(event, {
		user: result,
		loggedInAt: new Date().toISOString(),
	});

	return result;
});
