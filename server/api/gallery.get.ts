import fs from 'fs';
import sizeOf from 'image-size';

export default defineEventHandler(async (event) => {
	const images = await fs.readdirSync(`${process.env.FRONTEND_HOST}/_nuxt/public/gallery`);
	return images?.map((path) => {
		const result: any = { src: `/gallery/${path}` };
		const { height, width } = sizeOf(`${process.env.FRONTEND_HOST}/_nuxt/public/gallery/${path}`);
		result.height = height;
		result.width = width;
		return result;
	});
});
