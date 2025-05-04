import mongoose from "mongoose";

export default defineNitroPlugin(async (nitroApp) => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_ADM_USER}:${process.env.MONGO_ADM_PASS}@${process.env.MONGO_HOST}/?retryWrites=true&w=majority&appName=Test`,
      { dbName: process.env.MONGO_DB }
    );
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.log("Can not connect to MongoDB!");
  }
});
