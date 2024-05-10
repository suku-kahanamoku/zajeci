import { H3Event } from 'h3';
import { useMailing } from '@/server/composables/useMailing';

export default defineEventHandler(async (event: H3Event) => {
	const body = await readBody(event);
	const { template, send } = await useMailing(event);

	await send({
		subject: '$.mailing.contact_form.subject',
		template: await template({
			name: 'ContactForm.vue',
			props: {
				url: process.env.FRONTEND_HOST,
				email: body.email,
				msg: body.message,
			},
		}),
		to: [
			{
				Email: body.email,
			},
		],
	});

	await send({
		subject: '$.mailing.contact_form.subject',
		template: await template({
			name: 'ContactFormAdmin.vue',
			props: {
				url: process.env.FRONTEND_HOST,
				email: body.email,
				msg: body.message,
			},
		}),
		to: [
			{
				Email: 'sukusovi@gmail.com',
			},
		],
	});

	return { message: 'Email sent' };
});
