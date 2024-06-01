import { H3Event } from 'h3';
import { useMailing } from '@/server/composables/useMailing';

import { OrderModel } from '../models/order.schema';

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody(event);
	const result = (await OrderModel.create(body)).toObject();

	// pokud se podari ulozit objednavku do DB, odesle se mail klientovi i adminovi
	if (result?._id) {
		const { template, send } = await useMailing(event);
		const t = await useTranslation(event);
		const orderId = result._id.toString();
		await send({
			subject: t('$.mailing.order.confirmed.subject', { orderId }),
			template: await template({
				name: 'OrderForm.vue',
				props: {
					url: process.env.FRONTEND_HOST,
					email: process.env.NUXT_MAILING_FROM as string,
					orderId,
				},
			}),
			to: [
				{
					Email: result.user.email,
				},
			],
			bcc: [
				{
					Email: process.env.NUXT_MAILING_FROM as string,
				},
			],
		});
	}

	// aktualizuje user session
	const session = await getUserSession(event);
	if (session?.user && result.user && body.user) {
		await setUserSession(event, {
			user: result.user,
			loggedInAt: session.loggedInAt,
		});
	}

	return result;
});
