import mongoose from 'mongoose';

export default defineNitroPlugin(async (nitroApp) => {
	try {
		await mongoose.connect(
			`mongodb://${process.env.MONGO_ADM_USER}:${process.env.MONGO_ADM_PASS}@${process.env.MONGO_HOST}`,
			{ dbName: process.env.MONGO_DB }
		);
		console.log('Connected to MongoDB.');
	} catch (error) {
		console.log('Can not connect to MongoDB!');
	}
});
