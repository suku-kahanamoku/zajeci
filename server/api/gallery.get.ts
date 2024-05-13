import fs from 'fs';
import sizeOf from 'image-size';

export default defineEventHandler(async (event) => {
	const images = await fs.readdirSync('../dist/gallery');
	return images?.map((path) => {
		const result: any = { src: `/gallery/${path}` };
		const { height, width } = sizeOf(`../dist/gallery/${path}`);
		result.height = height;
		result.width = width;
		return result;
	});
});
