import { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
	return event.context.ip || event.node.res.socket?.remoteAddress || event.node.res.socket?.remoteAddress;
});
