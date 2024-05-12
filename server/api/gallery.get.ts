import fs from 'fs';

export default defineEventHandler(async (event) => {
	return await fs.readdirSync('./public/gallery');
});
