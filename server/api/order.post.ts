import { H3Event } from 'h3';
import { useMailing } from '@/server/composables/useMailing';

import { OrderSchema } from '../models/order.schema';

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody(event);
	const { template, send } = await useMailing(event);
	const t = await useTranslation(event);
	//
	const result = await OrderSchema.create(body);

	if (result?._id) {
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

	return result.toObject();
});
