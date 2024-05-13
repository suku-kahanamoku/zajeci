import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	let user;
	const { pathname } = getRequestURL(event);
	if (pathname.includes('/admin')) {
		user = (await requireUserSession(event)).user;
	}
});
