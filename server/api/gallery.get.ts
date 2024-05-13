import fs from 'fs';
import sizeOf from 'image-size';

export default defineEventHandler(async (event) => {
	const images = await fs.readdirSync(`${process.cwd()}`);
	return images
	return images
		?.filter((path) => path.includes('.jpg'))
		?.map((path) => {
			const result: any = { src: `/gallery/${path}` };
			const { height, width } = sizeOf(`${process.cwd()}/_nuxt/${path}`);
			result.height = height;
			result.width = width;
			return result;
		});
});
