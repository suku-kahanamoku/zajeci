import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	return event.node.req.socket.remoteAddress || event.node.req.headers['x-forwarded-for'];
});
