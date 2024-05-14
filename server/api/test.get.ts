import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	return event.req.connection.remoteAddress || event.req.socket.remoteAddress;
});
